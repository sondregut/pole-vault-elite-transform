
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Check if user is authenticated
    let user = null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    const { lineItems, successUrl, cancelUrl } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Determine if this is a subscription or one-time payment
    const isSubscription = lineItems && lineItems.some((item: any) => 
      item.productName === "Video Library Access"
    );

    // For subscriptions, require authentication
    if (isSubscription && !user?.email) {
      throw new Error("Authentication required for subscription products");
    }

    // Check if customer exists (for authenticated users)
    let customerId;
    let customerEmail;
    
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
      customerEmail = user.email;
    } else {
      // For guest checkout, use a default email or require email input
      customerEmail = "guest@example.com";
    }

    let sessionConfig;

    if (isSubscription) {
      // Subscription checkout
      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : customerEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: "Video Library Access",
                description: "Monthly access to G-Force Training video library"
              },
              unit_amount: 999, // $9.99
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription" as const,
        success_url: `${req.headers.get("origin")}/video-library?subscription=success`,
        cancel_url: `${req.headers.get("origin")}/video-library?subscription=cancelled`,
      };
    } else {
      // One-time payment checkout
      const stripeLineItems = lineItems.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName,
          },
          unit_amount: Math.round(parseFloat(item.price.replace('$', '')) * 100),
        },
        quantity: item.quantity,
      }));

      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : customerEmail,
        line_items: stripeLineItems,
        mode: "payment" as const,
        success_url: successUrl || `${req.headers.get("origin")}/checkout/success`,
        cancel_url: cancelUrl || `${req.headers.get("origin")}/checkout/cancel`,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
