
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BEEHIIV_API_KEY = Deno.env.get("BEEHIIV_API_KEY");
const BEEHIIV_API_URL = "https://api.beehiiv.com/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncSubscriberRequest {
  email: string;
  source?: string;
  name?: string;
}

interface BeehiivErrorResponse {
  status: number;
  error: string;
  message: string;
}

interface BeehiivSubscriberResponse {
  data: {
    id: string;
    email: string;
    status: string;
    created: string;
  };
}

async function createBeehiivSubscriber(email: string, name?: string) {
  console.log(`Creating Beehiiv subscriber for: ${email}`);

  try {
    const response = await fetch(`${BEEHIIV_API_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email,
        name,
        utm_source: "website",
        reactivate_existing: true,
        send_welcome_email: true,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error creating Beehiiv subscriber:", data);
      return { success: false, error: data };
    }

    console.log("Successfully created Beehiiv subscriber:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception creating Beehiiv subscriber:", error);
    return { success: false, error };
  }
}

async function syncSubscriberToBeehiiv(subscriber: SyncSubscriberRequest) {
  return await createBeehiivSubscriber(subscriber.email, subscriber.name);
}

async function syncAllSubscribersToBeehiiv(supabase: any) {
  try {
    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("*");

    if (error) {
      console.error("Error fetching subscribers from Supabase:", error);
      return { success: false, error };
    }

    console.log(`Found ${subscribers.length} subscribers to sync`);
    
    const results = [];
    
    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i];
      const result = await createBeehiivSubscriber(subscriber.email);
      results.push({ email: subscriber.email, result });
      
      // Small delay to respect API limits
      if (i < subscribers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return { success: true, data: results };
  } catch (error) {
    console.error("Error syncing all subscribers:", error);
    return { success: false, error };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if API key is configured
  if (!BEEHIIV_API_KEY) {
    console.error("BEEHIIV_API_KEY is not configured");
    return new Response(
      JSON.stringify({ success: false, error: "API key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { action, data } = await req.json();

    switch (action) {
      case "syncSubscriber": {
        const result = await syncSubscriberToBeehiiv(data);
        
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      case "syncAllSubscribers": {
        // This would require the service role key to access all subscribers
        // Only for admin use, would need proper authentication
        return new Response(
          JSON.stringify({ success: false, error: "Not implemented - requires admin auth" }),
          {
            status: 501,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid action" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }
  } catch (error) {
    console.error("Error in beehiiv function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
