
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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

const DigitalDownloads = () => {
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

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Your Digital Downloads</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-lg mb-6">Please sign in to access your digital products</p>
              <Button onClick={() => navigate("/login")}>Sign In</Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Digital Downloads</h1>
            <Button variant="outline" onClick={handleSignOut} className="flex gap-2 items-center">
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <p className="font-medium">Signed in as: <span className="text-primary">{user.email}</span></p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : downloads.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-lg mb-6">You don't have any digital products yet</p>
              <Button asChild>
                <a href="/shop">Shop Now</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloads.map((download) => (
                <Card key={download.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="text-primary" />
                    </div>
                    <CardTitle>{download.product_files.file_name}</CardTitle>
                    <CardDescription>
                      {download.product_files.file_type.toUpperCase()} File
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Downloaded {download.download_count || 0} times
                    </p>
                    {download.downloaded_at && (
                      <p className="text-sm text-gray-500">
                        Last downloaded: {new Date(download.downloaded_at).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleDownload(
                        download.product_files.id, 
                        download.product_files.file_name
                      )}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DigitalDownloads;
