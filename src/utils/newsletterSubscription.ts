
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionSource = "blog_post" | "footer";

export async function subscribeToNewsletter(email: string, source: SubscriptionSource) {
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email, source, email_sent: false }]);
    
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

    // Trigger the edge function to send welcome email
    try {
      const response = await fetch("https://qmasltemgjtbwrwscxtj.supabase.co/functions/v1/resend-welcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXNsdGVtZ2p0Yndyd3NjeHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NjE4MTMsImV4cCI6MjA2MDMzNzgxM30.JYkoZPQE_7zPbpkqiyym2tIbsWfYjxXsnSayAIG82FQ"}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        console.error("Error sending welcome email:", await response.text());
      }
    } catch (err) {
      console.error("Error calling welcome email function:", err);
      // We don't return an error here as the subscription was successful
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
