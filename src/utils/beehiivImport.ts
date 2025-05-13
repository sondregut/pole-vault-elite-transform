
import { supabase } from "@/integrations/supabase/client";

/**
 * Import subscribers from Beehiiv to Supabase
 */
export async function importBeehiivSubscribers() {
  try {
    const response = await supabase.functions.invoke("beehiiv-import");
    
    if (!response.data?.success) {
      console.error("Error importing subscribers from Beehiiv:", response.error);
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
