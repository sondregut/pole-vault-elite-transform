
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const BEEHIIV_API_KEY = Deno.env.get("BEEHIIV_API_KEY");
const BEEHIIV_API_URL = "https://api.beehiiv.com/v2";
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BeehiivSubscriber {
  id: string;
  email: string;
  status: string;
  created: string;
  referrer_id?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  custom_fields?: Record<string, any> | null;
}

/**
 * Fetch subscribers from Beehiiv API with pagination
 */
async function fetchBeehiivSubscribers(page = 1, limit = 100) {
  console.log(`Fetching Beehiiv subscribers page ${page} with limit ${limit}`);
  
  try {
    // Log the API URL and key existence (not the actual key)
    console.log(`BEEHIIV_API_URL: ${BEEHIIV_API_URL}`);
    console.log(`BEEHIIV_API_KEY exists: ${Boolean(BEEHIIV_API_KEY)}`);
    
    const response = await fetch(`${BEEHIIV_API_URL}/subscribers?limit=${limit}&page=${page}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${BEEHIIV_API_KEY}`
      }
    });

    // Log the response status
    console.log(`Beehiiv API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      console.error("Error fetching subscribers from Beehiiv:", {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      return { 
        success: false, 
        error: { 
          status: response.status, 
          message: errorData.message || response.statusText 
        }, 
        data: [], 
        pagination: null 
      };
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.data?.length || 0} subscribers from Beehiiv`);
    console.log(`Pagination info:`, data.pagination);
    
    return { 
      success: true, 
      data: data.data || [],
      pagination: data.pagination 
    };
  } catch (error) {
    console.error("Exception fetching Beehiiv subscribers:", error);
    return { 
      success: false, 
      error: { message: error.message }, 
      data: [], 
      pagination: null 
    };
  }
}

/**
 * Import subscribers from Beehiiv into Supabase
 */
async function importBeehiivSubscribers() {
  try {
    // Log Supabase credentials existence (not the actual credentials)
    console.log(`SUPABASE_URL exists: ${Boolean(SUPABASE_URL)}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY exists: ${Boolean(SUPABASE_SERVICE_ROLE_KEY)}`);
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials are not configured");
    }
    
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    
    let currentPage = 1;
    let hasMorePages = true;
    const stats = {
      total: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
      details: []
    };
    
    // Process all pages of subscribers
    while (hasMorePages) {
      const result = await fetchBeehiivSubscribers(currentPage);
      
      if (!result.success) {
        console.error(`Failed to fetch page ${currentPage}:`, result.error);
        stats.details.push({
          page: currentPage,
          error: result.error
        });
        break;
      }
      
      const subscribers = result.data;
      
      if (!subscribers || subscribers.length === 0) {
        console.log("No subscribers returned from the API. Ending pagination.");
        break;
      }
      
      stats.total += subscribers.length;
      
      console.log(`Processing ${subscribers.length} subscribers from page ${currentPage}`);
      
      // Process each subscriber
      for (const subscriber of subscribers) {
        try {
          console.log(`Processing subscriber: ${subscriber.email}, status: ${subscriber.status}`);
          
          // Skip inactive subscribers
          if (subscriber.status !== 'active') {
            console.log(`Skipping inactive subscriber: ${subscriber.email}`);
            stats.skipped++;
            continue;
          }
          
          // Check if subscriber already exists
          const { data: existingSubscriber, error: checkError } = await supabase
            .from("newsletter_subscribers")
            .select("id, email")
            .eq("email", subscriber.email)
            .maybeSingle();
            
          if (checkError) {
            console.error(`Error checking subscriber ${subscriber.email}:`, checkError);
            stats.failed++;
            stats.details.push({
              email: subscriber.email,
              error: checkError.message
            });
            continue;
          }
          
          if (existingSubscriber) {
            console.log(`Updating existing subscriber: ${subscriber.email}`);
            // Update existing subscriber
            const { error: updateError } = await supabase
              .from("newsletter_subscribers")
              .update({ 
                synced_to_beehiiv: true,
                last_synced_at: new Date().toISOString(),
                beehiiv_id: subscriber.id,
                source: subscriber.utm_source || 'beehiiv_import'
              })
              .eq("email", subscriber.email);
              
            if (updateError) {
              console.error(`Error updating subscriber ${subscriber.email}:`, updateError);
              stats.failed++;
              stats.details.push({
                email: subscriber.email,
                error: updateError.message
              });
            } else {
              stats.imported++;
              console.log(`Updated subscriber: ${subscriber.email}`);
            }
          } else {
            console.log(`Inserting new subscriber: ${subscriber.email}`);
            // Insert new subscriber
            const { error: insertError } = await supabase
              .from("newsletter_subscribers")
              .insert({ 
                email: subscriber.email,
                synced_to_beehiiv: true,
                last_synced_at: new Date().toISOString(),
                beehiiv_id: subscriber.id,
                source: subscriber.utm_source || 'beehiiv_import',
                created_at: subscriber.created
              });
              
            if (insertError) {
              console.error(`Error inserting subscriber ${subscriber.email}:`, insertError);
              stats.failed++;
              stats.details.push({
                email: subscriber.email,
                error: insertError.message
              });
            } else {
              stats.imported++;
              console.log(`Inserted new subscriber: ${subscriber.email}`);
            }
          }
        } catch (error) {
          console.error(`Error processing subscriber ${subscriber.email}:`, error);
          stats.failed++;
          stats.details.push({
            email: subscriber.email,
            error: error.message
          });
        }
      }
      
      // Check if there are more pages
      if (result.pagination && result.pagination.has_more) {
        console.log(`More pages available. Moving to page ${currentPage + 1}`);
        currentPage++;
      } else {
        console.log("No more pages available. Ending pagination.");
        hasMorePages = false;
      }
    }
    
    console.log("Import complete. Stats:", stats);
    return { success: true, stats };
  } catch (error) {
    console.error("Error importing subscribers:", error);
    return { success: false, error: error.message };
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
      JSON.stringify({ success: false, error: "Beehiiv API key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    console.log("Starting Beehiiv import process");
    const result = await importBeehiivSubscribers();
    
    console.log("Import process finished with result:", {
      success: result.success,
      total: result.stats?.total,
      imported: result.stats?.imported,
      skipped: result.stats?.skipped,
      failed: result.stats?.failed
    });
    
    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in beehiiv-import function:", error);
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
