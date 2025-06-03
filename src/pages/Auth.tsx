
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/video-library");
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/video-library");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user has an active subscription
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_end')
        .eq('email', email)
        .single();

      if (!subscriber?.subscribed || (subscriber.subscription_end && new Date(subscriber.subscription_end) < new Date())) {
        // Redirect to subscription page
        navigate("/subscribe");
        toast.info("Please subscribe to access the video library");
      } else {
        toast.success("Logged in successfully");
        navigate("/video-library");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/video-library`
        }
      });
      
      if (error) throw error;
      
      toast.success("Account created! Please check your email for verification, then subscribe to access the video library.");
      // Redirect to subscription page after signup
      navigate("/subscribe");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Account Access</h1>
            
            <Card className="shadow-2xl border-0">
              <CardHeader>
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Log In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <CardTitle className="text-2xl text-primary">Welcome back</CardTitle>
                    <CardDescription>
                      Sign in to access your video library
                    </CardDescription>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <CardTitle className="text-2xl text-primary">Create an account</CardTitle>
                    <CardDescription>
                      Sign up to access premium pole vault training videos
                    </CardDescription>
                  </TabsContent>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Log In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Password must be at least 6 characters
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>

              <CardFooter>
                <p className="text-sm text-center w-full text-gray-500">
                  {activeTab === "login" ? (
                    "Don't have an account? Click 'Sign Up' above"
                  ) : (
                    "Already have an account? Click 'Log In' above"
                  )}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
