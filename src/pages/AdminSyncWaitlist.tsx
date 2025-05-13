
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

const AdminSyncWaitlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const syncAllToBeehiiv = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-to-beehiiv', {
        body: { type: 'SYNC_ALL' }
      });
      
      if (error) throw error;
      
      setResults(data);
      
      toast({
        title: "Sync Complete",
        description: `Successfully processed ${data.results?.length || 0} waitlist entries.`,
      });
    } catch (error: any) {
      console.error("Error syncing waitlist to Beehiiv:", error);
      toast({
        title: "Sync Failed",
        description: `Error: ${error.message || "Unknown error occurred"}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin: Sync Waitlist to Beehiiv</h1>
            
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-4 text-gray-700">
                  This will sync all waitlist entries that have not yet been synced to your Beehiiv email list.
                  New subscribers are automatically synced when they sign up.
                </p>
                
                <Button 
                  onClick={syncAllToBeehiiv} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Sync All Waitlist Entries to Beehiiv
                    </>
                  )}
                </Button>
              </div>
              
              {results && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3">Sync Results</h2>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.results?.map((result: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {result.success ? (
                                <span className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Success
                                </span>
                              ) : (
                                <span className="flex items-center text-red-600">
                                  <AlertCircle className="h-4 w-4 mr-1" /> Failed: {result.error}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-500">
                    Total processed: {results.results?.length || 0} entries
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSyncWaitlist;
