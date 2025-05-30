
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
        const { data, error } = await supabaseAdmin
          .from('orders')
          .update({ 
            status: 'paid',
            fulfilled: true,
            customer_email: customerEmail
          })
          .eq('id', orderId)
          .select();

        if (error) {
          console.error('Error updating order:', error);
          throw error;
        }

        console.log(`Order ${orderId} marked as paid and fulfilled with email: ${customerEmail}`);
        console.log('Updated order data:', data);
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
