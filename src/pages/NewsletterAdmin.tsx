
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getNewsletterSubscribers, syncSubscriberToBeehiiv, syncAllSubscribersToBeehiiv } from "@/utils/beehiivAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Send } from "lucide-react";
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
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
  synced_to_beehiiv?: boolean | null;
}

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncStatusOpen, setSyncStatusOpen] = useState(false);
  const [syncResults, setSyncResults] = useState<{email: string, success: boolean, message?: string}[]>([]);
  
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    const result = await getNewsletterSubscribers();
    if (result.success) {
      setSubscribers(result.subscribers);
    } else {
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSyncSubscriber = async (email: string, id: string) => {
    setSyncingId(id);
    
    try {
      const result = await syncSubscriberToBeehiiv(email);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Synced ${email} to Beehiiv`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to sync subscriber",
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

  const formatDate = (dateString: string) => {
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
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600">
              {subscribers.length} total subscribers
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={fetchSubscribers}
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
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>List of newsletter subscribers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subscribed On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No subscribers found
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>{subscriber.source || "Unknown"}</TableCell>
                    <TableCell>{formatDate(subscriber.created_at)}</TableCell>
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
