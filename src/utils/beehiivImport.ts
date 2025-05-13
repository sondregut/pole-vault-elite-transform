
import { supabase } from "@/integrations/supabase/client";

/**
 * Import subscribers from Beehiiv to Supabase
 */
export async function importBeehiivSubscribers() {
  try {
    console.log("Invoking beehiiv-import function...");
    const response = await supabase.functions.invoke("beehiiv-import");
    
    console.log("Import function response:", response);
    
    if (!response.data?.success) {
      console.error("Error importing subscribers from Beehiiv:", response.error || response.data?.error);
      return { 
        success: false, 
        error: response.error || response.data?.error || "Unknown error" 
      };
    }
    
    return response.data;
  } catch (err) {
    console.error("Error importing subscribers from Beehiiv:", err);
    return { success: false, error: err.message };
  }
}
