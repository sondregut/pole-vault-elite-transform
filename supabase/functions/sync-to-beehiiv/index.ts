
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const beehiivApiKey = Deno.env.get("BEEHIIV_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Initialize Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function syncToBeehiiv(waitlistEntry: any) {
  try {
    // Get your publication ID from the Beehiiv API
    // This is a necessary first step as we need the publication ID for the subscribers endpoint
    const publicationsResponse = await fetch("https://api.beehiiv.com/v2/publications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${beehiivApiKey}`,
      }
    });

    if (!publicationsResponse.ok) {
      // Special handling for rate limiting
      if (publicationsResponse.status === 429) {
        throw new Error(`Failed to fetch Beehiiv publications: ${await publicationsResponse.text()}`);
      }
      const error = await publicationsResponse.text();
      console.error("Failed to fetch Beehiiv publications:", error);
      throw new Error(`Failed to fetch Beehiiv publications: ${error}`);
    }

    const publications = await publicationsResponse.json();
    
    if (!publications.data || publications.data.length === 0) {
      throw new Error("No publications found in Beehiiv account");
    }

    const publicationId = publications.data[0].id;
    console.log(`Using Beehiiv publication ID: ${publicationId}`);

    // Now subscribe the user to the publication
    const subscriberData = {
      email: waitlistEntry.email,
      publication_id: publicationId,
      send_welcome_email: false, // Don't send welcome email as they're already on waitlist
      utm_source: "g-force-waitlist",
      referring_site: "g-force-app.com",
      custom_fields: {
        first_name: waitlistEntry.first_name || "",
        last_name: waitlistEntry.last_name || ""
      }
    };

    // Add the subscriber to Beehiiv
    const subscribeResponse = await fetch("https://api.beehiiv.com/v2/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${beehiivApiKey}`
      },
      body: JSON.stringify(subscriberData)
    });

    // Read response even on error for logging purposes
    const responseData = await subscribeResponse.json();

    if (!subscribeResponse.ok) {
      // If the error is that the subscriber already exists, we'll treat that as success
      if (responseData.error?.includes("already exists")) {
        console.log(`Subscriber ${waitlistEntry.email} already exists in Beehiiv`);
        
        // Mark as synced in Supabase even though it already exists
        await supabase
          .from("waitlist")
          .update({ synced_to_beehiiv: true })
          .eq("id", waitlistEntry.id);
          
        return { success: true, message: "Subscriber already exists in Beehiiv", data: responseData };
      } else {
        console.error(`Failed to add subscriber to Beehiiv: ${JSON.stringify(responseData)}`);
        throw new Error(`Failed to add subscriber to Beehiiv: ${JSON.stringify(responseData)}`);
      }
    }

    console.log(`Successfully added ${waitlistEntry.email} to Beehiiv`);
    
    // Mark as synced in Supabase
    const { error: updateError } = await supabase
      .from("waitlist")
      .update({ synced_to_beehiiv: true })
      .eq("id", waitlistEntry.id);
    
    if (updateError) {
      console.error(`Failed to mark subscriber as synced in Supabase: ${updateError.message}`);
    }
    
    return { success: true, data: responseData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const { record, type } = await req.json();
    
    // Handle different request types
    if (type === "SYNC_ALL") {
      // Fetch all unsynced waitlist entries
      const { data: unsyncedEntries, error } = await supabase
        .from("waitlist")
        .select("*")
        .eq("synced_to_beehiiv", false);
      
      if (error) {
        throw error;
      }
      
      console.log(`Found ${unsyncedEntries?.length || 0} unsynced waitlist entries`);
      
      // Sync each unsynced entry with delays between requests
      const results = [];
      
      // Process in smaller batches with delays to avoid rate limiting
      const batchSize = 5; // Process 5 at a time
      
      for (let i = 0; i < (unsyncedEntries?.length || 0); i += batchSize) {
        const batch = unsyncedEntries!.slice(i, i + batchSize);
        
        for (const entry of batch) {
          try {
            const result = await syncToBeehiiv(entry);
            if (result.success) {
              results.push({ id: entry.id, email: entry.email, success: true });
            } else {
              results.push({ id: entry.id, email: entry.email, success: false, error: result.error });
            }
          } catch (err: any) {
            results.push({ id: entry.id, email: entry.email, success: false, error: err.message });
          }
          
          // Add a delay between each request to avoid rate limits
          if (i < unsyncedEntries!.length - 1) {
            await delay(1000); // 1 second delay between requests
          }
        }
        
        // Larger delay between batches
        if (i + batchSize < unsyncedEntries!.length) {
          await delay(3000); // 3 seconds delay between batches
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Processed ${results.length} waitlist entries`,
        results 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      // Default case: sync a single record
      if (!record) {
        throw new Error("No record provided");
      }
      
      const result = await syncToBeehiiv(record);
      
      if (!result.success) {
        return new Response(JSON.stringify({ 
          success: false,
          error: result.error
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        message: `Successfully synced ${record.email} to Beehiiv`
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error: any) {
    console.error(`Error in sync-to-beehiiv function: ${error.message}`);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
