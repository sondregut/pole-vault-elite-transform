
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
    
    return response.data;
  } catch (err) {
    console.error("Error syncing subscriber to Beehiiv:", err);
    return { success: false, error: err.message };
  }
}

/**
 * This would be enhanced with proper admin auth in a future phase
 */
export async function syncAllSubscribersToBeehiiv() {
  try {
    const response = await supabase.functions.invoke("beehiiv", {
      body: {
        action: "syncAllSubscribers"
      }
    });
    
    return response.data;
  } catch (err) {
    console.error("Error syncing all subscribers to Beehiiv:", err);
    return { success: false, error: err.message };
  }
}
