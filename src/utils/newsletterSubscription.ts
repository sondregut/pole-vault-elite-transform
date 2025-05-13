
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionSource = "blog_post" | "footer";

export async function subscribeToNewsletter(email: string, source: SubscriptionSource) {
  try {
    // First, add the subscriber to our Supabase database
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email, source }]);
    
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

    // Now, sync the subscriber to Beehiiv
    try {
      const response = await supabase.functions.invoke("beehiiv", {
        body: {
          action: "syncSubscriber",
          data: { email, source }
        }
      });

      // Even if Beehiiv sync fails, we'll consider this a success since we saved to our DB
      if (!response.data?.success) {
        console.warn("Failed to sync subscriber to Beehiiv:", response.error);
      } else {
        console.log("Successfully synced subscriber to Beehiiv:", response.data);
      }
    } catch (beehiivError) {
      console.error("Error syncing to Beehiiv:", beehiivError);
      // We don't fail the overall request for Beehiiv errors
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
