
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BeehiivSubscriber {
  email: string;
  reactivate?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
  custom_fields?: Record<string, string>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create a Supabase client with the Auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const beehiivApiKey = Deno.env.get('BEEHIIV_API_KEY')
    if (!beehiivApiKey) {
      return new Response(JSON.stringify({ error: 'Missing Beehiiv API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get unsynced subscribers
    const { data: unsyncedSubscribers, error: fetchError } = await supabaseClient
      .from('newsletter_subscribers')
      .select('*')
      .eq('synced_to_beehiiv', false)
      .limit(100)

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!unsyncedSubscribers || unsyncedSubscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'No unsynced subscribers found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Track success and failures
    const results = {
      total: unsyncedSubscribers.length,
      success: 0,
      failed: 0,
      errors: [] as string[]
    }
    
    // Process each unsynced subscriber
    for (const subscriber of unsyncedSubscribers) {
      try {
        // Create payload for Beehiiv API
        const beehiivPayload: BeehiivSubscriber = {
          email: subscriber.email,
          reactivate: true,
          utm_source: subscriber.source || 'website'
        }

        // Call Beehiiv API to add subscriber
        const beehiivResponse = await fetch('https://api.beehiiv.com/v2/publications/pub_XXXXX/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ApiKey': beehiivApiKey
          },
          body: JSON.stringify(beehiivPayload)
        })

        const beehiivData = await beehiivResponse.json()
        
        if (beehiivResponse.ok) {
          // Update the subscriber as synced
          const { error: updateError } = await supabaseClient
            .from('newsletter_subscribers')
            .update({ synced_to_beehiiv: true })
            .eq('id', subscriber.id)
            
          if (updateError) {
            results.failed++
            results.errors.push(`Failed to update subscriber ${subscriber.email}: ${updateError.message}`)
          } else {
            results.success++
          }
        } else {
          results.failed++
          results.errors.push(`Failed to sync ${subscriber.email} to Beehiiv: ${beehiivData.message || 'Unknown error'}`)
        }
      } catch (err) {
        results.failed++
        results.errors.push(`Error processing ${subscriber.email}: ${err.message}`)
      }
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
