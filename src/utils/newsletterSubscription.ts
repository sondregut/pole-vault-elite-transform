
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionSource = "blog_post" | "footer";

export async function subscribeToNewsletter(email: string, source: SubscriptionSource) {
  try {
    // Add to waitlist table and track that it hasn't been synced to Beehiiv yet
    const { error } = await supabase
      .from("waitlist")
      .insert([{ 
        email, 
        first_name: "", 
        last_name: "",
        synced_to_beehiiv: false
      }]);
    
    if (error) {
      // Check if it's a duplicate email error
      if (error.code === "23505") {
        return {
          success: false,
          message: "This email is already subscribed to our newsletter."
        };
      }
      
      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        message: "An error occurred. Please try again later."
      };
    }
    
    // Sync to Beehiiv in the background
    try {
      // Get the newly inserted record
      const { data } = await supabase
        .from("waitlist")
        .select("*")
        .eq("email", email)
        .single();
        
      if (data) {
        await supabase.functions.invoke('sync-to-beehiiv', {
          body: { record: data, type: 'SINGLE' }
        });
      }
    } catch (syncError) {
      console.error("Error syncing to Beehiiv:", syncError);
      // We don't show this error to the user since they're already on our waitlist
    }
    
    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!"
    };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return {
      success: false,
      message: "An error occurred. Please try again later."
    };
  }
}
