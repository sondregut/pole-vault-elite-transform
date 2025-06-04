
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Subscribe = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Development mode check
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      // Check if user already has an active subscription
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_end')
        .eq('user_id', session.user.id)
        .single();

      if (subscriber?.subscribed && subscriber.subscription_end && new Date(subscriber.subscription_end) > new Date()) {
        navigate("/video-library");
        toast.info("You already have an active subscription");
      }
    };

    getUser();
  }, [navigate]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      // Call Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_monthly_999', // You'll need to create this in Stripe
          email: user.email,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Failed to start subscription process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    toast.success("Development bypass activated!");
    navigate("/video-library");
  };

  const features = [
    "Access to complete exercise library",
    "HD video quality with detailed instructions",
    "Progressive training programs",
    "Technique analysis and tips",
    "Equipment recommendations",
    "New videos added monthly",
    "Mobile-friendly platform",
    "Cancel anytime"
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Access
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get unlimited access to our comprehensive pole vault training library
            </p>
          </div>

          {isDevelopment && (
            <div className="text-center mb-8">
              <Button 
                onClick={handleDevBypass}
                variant="outline"
                className="bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300"
              >
                I'm the dev
              </Button>
            </div>
          )}

          <div className="max-w-lg mx-auto">
            <Card className="shadow-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary to-primary"></div>
              
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-secondary mr-2" />
                  <CardTitle className="text-2xl text-primary">Monthly Subscription</CardTitle>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-primary">$9.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="text-base">
                  Complete access to all premium content
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full text-lg py-6 bg-secondary hover:bg-secondary/90"
                >
                  {loading ? "Processing..." : "Start Subscription"}
                </Button>

                <div className="text-center text-sm text-gray-500 space-y-1">
                  <p>Cancel anytime • Secure payment with Stripe</p>
                  <p>7-day free trial included</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Subscribe;
