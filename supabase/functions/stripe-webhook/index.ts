
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new (await import('https://esm.sh/stripe@12.0.0')).default(
  Deno.env.get('STRIPE_SECRET_KEY') ?? '',
  { apiVersion: '2022-11-15' }
)

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const customerId = session.customer
        const userId = session.metadata?.userId
        
        if (userId) {
          await supabase.from('subscribers').upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            subscribed: true,
            subscription_tier: 'monthly',
            updated_at: new Date().toISOString(),
          })
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const customerId = subscription.customer
        
        // Get user by customer ID
        const { data: subscriber } = await supabase
          .from('subscribers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()
        
        if (subscriber) {
          await supabase.from('subscribers').update({
            subscribed: subscription.status === 'active',
            subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('user_id', subscriber.user_id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const customerId = subscription.customer
        
        // Get user by customer ID
        const { data: subscriber } = await supabase
          .from('subscribers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()
        
        if (subscriber) {
          await supabase.from('subscribers').update({
            subscribed: false,
            subscription_end: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('user_id', subscriber.user_id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('Webhook handled successfully', { status: 200 })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response('Error handling webhook', { status: 500 })
  }
})
