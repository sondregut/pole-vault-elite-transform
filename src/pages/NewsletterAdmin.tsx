
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getNewsletterSubscribers, syncSubscriberToBeehiiv, syncAllSubscribersToBeehiiv, getNewsletterSyncStats } from "@/utils/beehiivAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Send, CheckCircle, XCircle, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
  synced_to_beehiiv?: boolean | null;
  last_synced_at?: string | null;
  beehiiv_id?: string | null;
}

interface SyncStats {
  total: number;
  synced: number;
  unsynced: number;
  sync_percentage: number;
}

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncStatusOpen, setSyncStatusOpen] = useState(false);
  const [syncResults, setSyncResults] = useState<{email: string, success: boolean, message?: string}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [syncStats, setSyncStats] = useState<SyncStats>({
    total: 0,
    synced: 0,
    unsynced: 0,
    sync_percentage: 0
  });
  
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    const result = await getNewsletterSubscribers();
    if (result.success) {
      setSubscribers(result.subscribers);
      applyFilters(result.subscribers, searchTerm, activeTab);
    } else {
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const fetchSyncStats = async () => {
    const result = await getNewsletterSyncStats();
    if (result.success) {
      setSyncStats(result.stats);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchSyncStats();
  }, []);

  const applyFilters = (subs: Subscriber[], search: string, tab: string) => {
    let filtered = [...subs];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(search.toLowerCase()) ||
        (sub.source && sub.source.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply tab filter
    if (tab === "synced") {
      filtered = filtered.filter(sub => sub.synced_to_beehiiv === true);
    } else if (tab === "unsynced") {
      filtered = filtered.filter(sub => sub.synced_to_beehiiv !== true);
    }
    
    setFilteredSubscribers(filtered);
  };

  useEffect(() => {
    applyFilters(subscribers, searchTerm, activeTab);
  }, [searchTerm, activeTab, subscribers]);

  const handleSyncSubscriber = async (email: string, id: string) => {
    setSyncingId(id);
    
    try {
      const result = await syncSubscriberToBeehiiv(email);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Synced ${email} to Beehiiv`,
        });
        
        // Update the subscriber's sync status in local state
        setSubscribers(prev => prev.map(sub => 
          sub.id === id ? { 
            ...sub, 
            synced_to_beehiiv: true,
            last_synced_at: new Date().toISOString()
          } : sub
        ));
        
        // Refresh sync stats
        fetchSyncStats();
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to sync subscriber",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    setSyncingId(null);
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    setSyncResults([]);
    
    try {
      const result = await syncAllSubscribersToBeehiiv();
      
      if (result.success) {
        setSyncResults(result.data.map((item: any) => ({
          email: item.email,
          success: item.result.success,
          message: item.result.error?.message || undefined
        })));
        
        setSyncStatusOpen(true);
        
        toast({
          title: "Success",
          description: "Sync process completed",
        });
        
        // Refresh data to get updated sync statuses
        fetchSubscribers();
        fetchSyncStats();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to sync subscribers",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    setSyncingAll(false);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold mb-8">Newsletter Subscribers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{syncStats.total}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Synced to Beehiiv</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-500">{syncStats.synced}</p>
              <p className="text-sm text-muted-foreground">
                {syncStats.sync_percentage}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Not Synced</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-amber-500">{syncStats.unsynced}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="w-full md:w-auto">
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                fetchSubscribers();
                fetchSyncStats();
              }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button 
              onClick={handleSyncAll}
              disabled={syncingAll || loading}
            >
              {syncingAll ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Sync All to Beehiiv
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Subscribers</TabsTrigger>
            <TabsTrigger value="synced">Synced</TabsTrigger>
            <TabsTrigger value="unsynced">Not Synced</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>List of newsletter subscribers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subscribed On</TableHead>
                <TableHead>Sync Status</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchTerm ? "No matching subscribers found" : "No subscribers found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>{subscriber.source || "Unknown"}</TableCell>
                    <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                    <TableCell>
                      {subscriber.synced_to_beehiiv ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" /> Synced
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <XCircle className="h-3 w-3 mr-1" /> Not Synced
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(subscriber.last_synced_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncSubscriber(subscriber.email, subscriber.id)}
                        disabled={syncingId === subscriber.id}
                      >
                        {syncingId === subscriber.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Sync to Beehiiv
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Sheet open={syncStatusOpen} onOpenChange={setSyncStatusOpen}>
        <SheetContent className="sm:max-w-lg w-full">
          <SheetHeader>
            <SheetTitle>Sync Results</SheetTitle>
            <SheetDescription>
              Results of syncing subscribers to Beehiiv
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No results to display
                    </TableCell>
                  </TableRow>
                ) : (
                  syncResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.email}</TableCell>
                      <TableCell>
                        <span className={result.success ? "text-green-600" : "text-red-600"}>
                          {result.success ? "Success" : "Failed"}
                        </span>
                        {result.message && (
                          <p className="text-xs text-gray-500">{result.message}</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={() => setSyncStatusOpen(false)} 
              className="w-full"
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Footer />
    </>
  );
};

export default NewsletterAdmin;
