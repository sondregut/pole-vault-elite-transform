
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Users } from "lucide-react";

interface Stats {
  total: number;
  synced: number;
  unsynced: number;
  sync_percentage: number;
}

const NewsletterAdmin = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-operations', {
        body: { operation: 'get_stats' }
      });

      if (error) {
        throw error;
      }

      setStats(data.stats[0]);
    } catch (error) {
      console.error('Error fetching newsletter stats:', error);
      toast({
        title: "Error",
        description: "Failed to load newsletter statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail || !emailSubject || !emailContent) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields to send a test email.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAction(true);
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-operations', {
        body: {
          operation: 'send_test',
          testEmail,
          emailSubject,
          emailContent
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Test email sent successfully!",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const prepareBatchEmail = () => {
    if (!emailSubject || !emailContent) {
      toast({
        title: "Missing fields",
        description: "Please fill in subject and content to prepare a batch email.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Coming Soon",
      description: "Batch email sending functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Newsletter Management</h1>
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Subscriber Statistics
                </CardTitle>
                <CardDescription>
                  Overview of your newsletter subscriber data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-sm text-muted-foreground">Total Subscribers</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.synced}</div>
                        <p className="text-sm text-muted-foreground">Emails Sent</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.unsynced}</div>
                        <p className="text-sm text-muted-foreground">Pending Emails</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.sync_percentage}%</div>
                        <p className="text-sm text-muted-foreground">Email Delivery Rate</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p>No statistics available</p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={fetchStats} variant="outline" disabled={loading}>
                  Refresh Statistics
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="compose" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Compose Newsletter
                </CardTitle>
                <CardDescription>
                  Create and send your newsletter to subscribers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Email Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Enter newsletter subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Email Content (HTML)
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Enter newsletter HTML content"
                    className="min-h-[200px]"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="testEmail" className="block text-sm font-medium mb-1">
                    Test Email Address
                  </label>
                  <Input
                    id="testEmail"
                    placeholder="Enter email for testing"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button 
                  onClick={sendTestEmail} 
                  disabled={loadingAction || !testEmail || !emailSubject || !emailContent}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
                <Button 
                  onClick={prepareBatchEmail} 
                  variant="outline" 
                  disabled={loadingAction || !emailSubject || !emailContent}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Prepare Batch Email
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscribers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscriber List</CardTitle>
                <CardDescription>
                  View and manage your newsletter subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriberList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

// Subscriber list component
const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscribers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : subscribers.length > 0 ? (
        <Table>
          <TableCaption>A list of your newsletter subscribers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Email Sent</TableHead>
              <TableHead>Subscribed On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell className="capitalize">{subscriber.source}</TableCell>
                <TableCell>{subscriber.email_sent ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center py-8">No subscribers found</p>
      )}
      <div className="mt-4">
        <Button onClick={fetchSubscribers} variant="outline" disabled={loading}>
          Refresh List
        </Button>
      </div>
    </div>
  );
};

export default NewsletterAdmin;
