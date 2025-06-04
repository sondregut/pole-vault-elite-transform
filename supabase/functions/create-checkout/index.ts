
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
    const { lineItems, successUrl, cancelUrl } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Initialize Supabase admin client to create order records
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate total amount
    const totalAmount = lineItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + (price * item.quantity * 100); // Convert to cents
    }, 0);

    // Create order record in Supabase first
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        amount: totalAmount,
        currency: 'usd',
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Created order:', orderData);

    // Create order items
    const orderItems = lineItems.map(item => ({
      order_id: orderData.id,
      product_id: item.productId,
      product_name: item.productName,
      product_option: item.option || null,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    // Prepare line items for Stripe
    const stripeLineItems = lineItems.map(item => {
      const price = parseFloat(item.price.replace('$', ''));
      const unitAmount = Math.max(Math.round(price * 100), 1); // Minimum 1 cent for Stripe
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productName,
            description: item.option ? `Option: ${item.option}` : undefined,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session with order ID in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        order_id: orderData.id,
      },
      customer_creation: 'always',
      billing_address_collection: 'required',
    });

    console.log(`Created Stripe session ${session.id} for order ${orderData.id}`);

    return new Response(
      JSON.stringify({ url: session.url }),
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
