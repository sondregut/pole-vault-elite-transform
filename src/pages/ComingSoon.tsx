
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success!",
        description: "You've been added to the waitlist. We'll notify you when we launch.",
      });
      setEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0F1116] text-white flex flex-col justify-center">
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="relative z-10">
          {/* App under development stamp */}
          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 0.15, rotate: -10 }}
            transition={{ duration: 1 }}
            className="absolute -top-10 right-0 text-6xl md:text-8xl font-bold text-red-600 border-8 border-red-600 px-4 py-2 rounded-lg transform -rotate-12 md:block"
          >
            APP UNDER DEVELOPMENT
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <div className="inline-block py-1 px-3 bg-primary/20 rounded-full text-primary text-sm font-medium mb-4">
                Coming Soon
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white">
                A game-changing mobile app<br className="hidden md:block" /> 
                by Olympic pole vaulters<br className="hidden md:block" />
                Sondre & Simen Guttormsen
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
                Designed to change the game!
              </p>
            </div>

            <div className="relative max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="mt-12 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="bg-[#1A1D25] border-[#2A2D35] h-12 text-white"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="h-12 px-6 bg-primary hover:bg-primary/90 text-white"
                  >
                    {isLoading ? "Adding..." : "Join the Waitlist"}
                  </Button>
                </div>
                <p className="text-gray-500 text-sm mt-3">
                  You'll be first in line when it drops.
                </p>
              </form>
            </div>
          </motion.div>

          {/* App Icon Image - positioned higher */}
          <div className="mt-8 relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1116] to-transparent z-10"></div>
            <div className="relative z-20 flex flex-col items-center">
              <div className="w-32 h-32">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2A2D35]/30 w-full h-full">
                  <img 
                    src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Screenshot%202025-05-03%20at%202.46.16%20PM.png" 
                    alt="G Force Training App Icon" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">Launching soon on iOS and Android</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 mt-auto">
        <div className="container mx-auto text-center">
          <a 
            href="https://www.instagram.com/g_forcetraining/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-6 h-6 text-white" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ComingSoon;
