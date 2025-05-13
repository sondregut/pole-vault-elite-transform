
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface DigitalProduct {
  id: string;
  product_files: {
    id: string;
    product_id: number;
    file_name: string;
    file_type: string;
  };
  download_count: number;
  downloaded_at: string | null;
}

export const useDigitalDownloads = () => {
  const [downloads, setDownloads] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user authentication
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        fetchDownloads(data.session.user.id);
      } else {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchDownloads(session.user.id);
        } else {
          setUser(null);
          setDownloads([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDownloads = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_downloads')
        .select(`
          id,
          download_count,
          downloaded_at,
          product_files (
            id,
            product_id,
            file_name,
            file_type
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      toast.error("Failed to load your downloads");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      // Get the session for the Authorization header
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to download files");
        return;
      }

      const token = sessionData.session.access_token;

      // Call the edge function to get the file
      const response = await fetch(
        `https://qmasltemgjtbwrwscxtj.supabase.co/functions/v1/get-digital-product?fileId=${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download file");
      }

      // Create a download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh the downloads list
      if (user) {
        fetchDownloads(user.id);
      }
      
      toast.success("File downloaded successfully");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download file");
    }
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return {
    user,
    downloads,
    loading,
    handleDownload,
    handleSignOut
  };
};
