
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LineItem {
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  option?: string;
  image: string;
  printfulId?: number; // New field for Printful products
}

interface CheckoutBody {
  lineItems: LineItem[];
  successUrl: string;
  cancelUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { lineItems, successUrl, cancelUrl } = await req.json() as CheckoutBody;
    
    if (!lineItems || !lineItems.length) {
      return new Response(
        JSON.stringify({ error: 'No line items provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Initialize Supabase client with SERVICE ROLE KEY for bypassing RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Create a service role client that can bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize regular client for user auth checks
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get user info if authenticated
    let user = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
    }

    // Format line items for Stripe
    const stripeLineItems = lineItems.map(item => {
      // Remove currency symbol and convert to cents for Stripe
      const priceInCents = Math.round(parseFloat(item.price.replace(/[^0-9.]/g, '')) * 100);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productName,
            description: item.option ? `Option: ${item.option}` : undefined,
            images: [item.image],
            metadata: item.printfulId ? { printfulId: item.printfulId.toString() } : undefined,
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      };
    });

    // Calculate total amount
    const amount = stripeLineItems.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount * item.quantity);
    }, 0);

    // Create a new order in the database using service role client to bypass RLS
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user?.id || null,
        amount,
        status: 'pending',
        currency: 'usd'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert order items using service role client to bypass RLS
    const orderItems = lineItems.map(item => ({
      order_id: orderData.id,
      product_id: item.productId,
      product_name: item.productName,
      product_option: item.option || null,
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Continue with checkout even if order items fail to be inserted
    }

    // Check if any of the products are digital products
    const productIds = lineItems.map(item => item.productId);
    const { data: digitalProducts, error: digitalProductsError } = await supabaseAdmin
      .from('product_files')
      .select('*')
      .in('product_id', productIds);

    if (digitalProductsError) {
      console.error('Error checking for digital products:', digitalProductsError);
    }

    // If digital products exist, create user_downloads entries
    if (digitalProducts && digitalProducts.length > 0 && user?.id) {
      const userDownloads = digitalProducts.map(product => ({
        user_id: user.id,
        order_id: orderData.id,
        product_file_id: product.id,
        download_count: 0
      }));

      const { error: downloadsError } = await supabaseAdmin
        .from('user_downloads')
        .insert(userDownloads);

      if (downloadsError) {
        console.error('Error creating user downloads:', downloadsError);
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        order_id: orderData.id,
        has_printful_items: lineItems.some(item => !!item.printfulId) ? 'true' : 'false',
      },
    });

    // Update order with Stripe session ID using service role client to bypass RLS
    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', orderData.id);

    // Return checkout URL
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
