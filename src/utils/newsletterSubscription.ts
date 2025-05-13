
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionSource = "blog_post" | "footer";

export async function subscribeToNewsletter(email: string, source: SubscriptionSource) {
  try {
    // We need to change this to use the waitlist table since newsletter_subscribers doesn't exist
    const { error } = await supabase
      .from("waitlist")
      .insert([{ email, first_name: "", last_name: "" }]);
    
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
