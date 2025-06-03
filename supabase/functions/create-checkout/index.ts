
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { priceId, email, userId } = await req.json()

    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@12.0.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY') ?? '',
      { apiVersion: '2022-11-15' }
    )

    // Create or get Stripe customer
    let customer
    const existingCustomers = await stripe.customers.list({ email })
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({ email })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pole Vault Training Library',
              description: 'Monthly access to premium pole vault training videos',
            },
            unit_amount: 999, // $9.99 in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/video-library?success=true`,
      cancel_url: `${req.headers.get('origin')}/subscribe?canceled=true`,
      metadata: {
        userId: userId,
      },
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
      },
    })

    // Store customer info in our database
    await supabaseClient.from('subscribers').upsert({
      user_id: userId,
      email: email,
      stripe_customer_id: customer.id,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
