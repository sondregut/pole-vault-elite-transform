import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, RefreshCw, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SyncResult {
  email: string;
  success: boolean;
  error?: string;
}

interface SyncResponse {
  results: SyncResult[];
}

const AdminSyncWaitlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SyncResponse | null>(null);
  const [stats, setStats] = useState<{ total: number; synced: number; unsynced: number }>({
    total: 0,
    synced: 0,
    unsynced: 0,
  });
  const { toast } = useToast();

  // Fetch waitlist stats on load
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: total } = await supabase
        .from("waitlist")
        .select("id", { count: "exact" });

      const { data: synced } = await supabase
        .from("waitlist")
        .select("id", { count: "exact" })
        .eq("synced_to_beehiiv", true);

      const { data: unsynced } = await supabase
        .from("waitlist")
        .select("id", { count: "exact" })
        .eq("synced_to_beehiiv", false);

      setStats({
        total: total?.length || 0,
        synced: synced?.length || 0,
        unsynced: unsynced?.length || 0,
      });
    } catch (error: any) {
      console.error("Error fetching waitlist stats:", error);
    }
  };

  const syncAllToBeehiiv = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-to-beehiiv', {
        body: { type: 'SYNC_ALL' }
      });
      
      if (error) throw error;
      
      setResults(data as SyncResponse);
      fetchStats(); // Refresh stats after sync
      
      // Count successful and failed syncs
      const successful = data?.results?.filter((r: SyncResult) => r.success).length || 0;
      const failed = (data?.results?.length || 0) - successful;
      
      toast({
        title: "Sync Complete",
        description: `Processed ${data?.results?.length || 0} entries (${successful} successful, ${failed} failed)`,
      });
    } catch (error: unknown) {
      console.error("Error syncing waitlist to Beehiiv:", error);
      
      let errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Check if it's a rate limit error
      if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Try again after a few minutes or sync in smaller batches.";
      }
      
      toast({
        title: "Sync Failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isRateLimitError = (error: string) => {
    return error.includes("429") || 
           error.toLowerCase().includes("rate limit") || 
           error.toLowerCase().includes("too many requests");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin: Sync Waitlist to Beehiiv</h1>
            
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Subscribers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Synced to Beehiiv</p>
                  <p className="text-2xl font-bold text-green-700">{stats.synced}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Not Yet Synced</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.unsynced}</p>
                </div>
              </div>
              
              <div>
                <p className="mb-4 text-gray-700">
                  This will sync all waitlist entries that have not yet been synced to your Beehiiv email list.
                  New subscribers are automatically synced when they sign up.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Note about rate limits:</strong> Beehiiv has API rate limits. If you have many waitlist 
                        entries, the sync will process them in small batches with delays to avoid hitting rate limits.
                        If you see rate limit errors, wait a few minutes and try again.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={syncAllToBeehiiv} 
                  disabled={isLoading || stats.unsynced === 0}
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
                      Sync {stats.unsynced} Unsynced {stats.unsynced === 1 ? 'Entry' : 'Entries'} to Beehiiv
                    </>
                  )}
                </Button>
              </div>
              
              {results && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3">Sync Results</h2>
                  
                  <Table>
                    <TableCaption>
                      Completed: {results.results?.length || 0} entries
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.results?.map((result: SyncResult, index: number) => (
                        <TableRow key={index} className={isRateLimitError(result.error || '') ? "bg-yellow-50" : ""}>
                          <TableCell className="font-medium">{result.email}</TableCell>
                          <TableCell>
                            {result.success ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" /> Success
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <AlertCircle className="h-4 w-4 mr-1" /> 
                                {isRateLimitError(result.error || '') ? (
                                  <span>Rate Limited - Try Again Later</span>
                                ) : (
                                  <span>Failed: {result.error}</span>
                                )}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {results.results?.some((r: SyncResult) => isRateLimitError(r.error || '')) && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            <strong>Rate limit detected.</strong> Some entries couldn't be synced due to Beehiiv's API 
                            rate limits. Wait 5-10 minutes and try again with the remaining unsynced entries.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
