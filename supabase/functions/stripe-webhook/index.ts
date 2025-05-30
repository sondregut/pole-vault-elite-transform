
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'No signature provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the raw body as text
    const body = await req.text();
    
    // Verify webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      const customerEmail = session.customer_details?.email || session.customer_email;

      console.log(`Processing checkout.session.completed for session: ${session.id}`);
      console.log(`Order ID: ${orderId}, Customer Email: ${customerEmail}`);

      if (orderId) {
        // Update the order with payment status, fulfillment, and customer email
        const { data: orderData, error } = await supabaseAdmin
          .from('orders')
          .update({ 
            status: 'paid',
            fulfilled: true,
            customer_email: customerEmail
          })
          .eq('id', orderId)
          .select()
          .single();

        if (error) {
          console.error('Error updating order:', error);
          throw error;
        }

        console.log(`Order ${orderId} marked as paid and fulfilled with email: ${customerEmail}`);

        // For digital products, create download records
        const { data: orderItems, error: itemsError } = await supabaseAdmin
          .from('order_items')
          .select('product_id')
          .eq('order_id', orderId);

        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
        } else if (orderItems && orderItems.length > 0) {
          // Check if any of these products have digital files
          const productIds = orderItems.map(item => item.product_id);
          
          const { data: productFiles, error: filesError } = await supabaseAdmin
            .from('product_files')
            .select('*')
            .in('product_id', productIds);

          if (filesError) {
            console.error('Error fetching product files:', filesError);
          } else if (productFiles && productFiles.length > 0) {
            // Create user download records for each digital file
            const downloadRecords = productFiles.map(file => ({
              product_file_id: file.id,
              order_id: orderId,
              user_id: null, // Guest checkout, no user ID
              download_count: 0,
              downloaded_at: null
            }));

            const { error: downloadError } = await supabaseAdmin
              .from('user_downloads')
              .insert(downloadRecords);

            if (downloadError) {
              console.error('Error creating download records:', downloadError);
            } else {
              console.log(`Created ${downloadRecords.length} download records for order ${orderId}`);
            }
          }
        }
      } else {
        console.log('No order_id found in session metadata, but still capturing email if available');
        
        // If no order_id but we have customer email, we could still log this for tracking
        if (customerEmail) {
          console.log(`Checkout completed without order_id but captured email: ${customerEmail}`);
          console.log(`Session ID: ${session.id}, Amount: ${session.amount_total}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
