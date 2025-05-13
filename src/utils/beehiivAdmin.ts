
import { supabase } from "@/integrations/supabase/client";

/**
 * Get all newsletter subscribers from Supabase
 */
export async function getNewsletterSubscribers() {
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching subscribers:", error);
      return { success: false, error };
    }
    
    return { success: true, subscribers: data };
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sync a specific subscriber to Beehiiv
 */
export async function syncSubscriberToBeehiiv(email: string) {
  try {
    const response = await supabase.functions.invoke("beehiiv", {
      body: {
        action: "syncSubscriber",
        data: { email }
      }
    });
    
    if (response.data?.success) {
      // Update the local database to mark this subscriber as synced
      await supabase
        .from("newsletter_subscribers")
        .update({ 
          synced_to_beehiiv: true,
          last_synced_at: new Date().toISOString(),
          beehiiv_id: response.data?.beehiiv_id || null
        })
        .eq("email", email);
    }
    
    return response.data;
  } catch (err) {
    console.error("Error syncing subscriber to Beehiiv:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sync all subscribers to Beehiiv
 */
export async function syncAllSubscribersToBeehiiv() {
  try {
    const response = await supabase.functions.invoke("beehiiv", {
      body: {
        action: "syncAllSubscribers"
      }
    });
    
    // If successful, update sync status in bulk for all successful syncs
    if (response.data?.success && response.data?.data) {
      const successfulEmails = response.data.data
        .filter(item => item.result.success)
        .map(item => item.email);
      
      if (successfulEmails.length > 0) {
        await supabase
          .from("newsletter_subscribers")
          .update({ 
            synced_to_beehiiv: true,
            last_synced_at: new Date().toISOString()
          })
          .in("email", successfulEmails);
      }
    }
    
    return response.data;
  } catch (err) {
    console.error("Error syncing all subscribers to Beehiiv:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Get sync statistics for the newsletter
 */
export async function getNewsletterSyncStats() {
  try {
    const { data, error } = await supabase
      .rpc('get_newsletter_sync_stats');
      
    if (error) {
      console.error("Error fetching sync stats:", error);
      return { success: false, error };
    }
    
    return { 
      success: true, 
      stats: data || { 
        total: 0, 
        synced: 0, 
        unsynced: 0,
        sync_percentage: 0
      } 
    };
  } catch (err) {
    console.error("Error fetching sync stats:", err);
    return { success: false, error: err.message };
  }
}
