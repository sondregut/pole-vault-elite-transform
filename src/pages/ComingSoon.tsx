
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
          {/* Classified stamp */}
          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 0.15, rotate: -10 }}
            transition={{ duration: 1 }}
            className="absolute -top-10 right-0 text-6xl md:text-8xl font-bold text-red-600 border-8 border-red-600 px-4 py-2 rounded-lg transform -rotate-12 hidden md:block"
          >
            CLASSIFIED
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
                Something Big Is Coming <br className="hidden md:block" />
                to Pole Vault
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
                Built by an Olympic vaulter.
                <br />
                Tested by elites.
                <br />
                Designed to change the game.
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

          {/* Background elements */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1116] to-transparent z-10"></div>
            <div className="bg-[#1A1D25] rounded-xl p-8 flex justify-center items-center max-w-3xl mx-auto aspect-video relative overflow-hidden">
              {/* Blurred UI mockup */}
              <div className="absolute inset-0 filter blur-xl opacity-30">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-12 bg-primary/50 rounded-lg"></div>
                <div className="absolute top-1/3 left-1/3 w-1/3 h-24 bg-white/30 rounded-lg"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1/4 h-16 bg-primary/40 rounded-lg"></div>
                <div className="absolute bottom-1/4 left-1/5 w-3/5 h-10 bg-white/20 rounded-lg"></div>
              </div>
              
              {/* Redacted content */}
              <div className="relative z-20 text-center">
                <div className="w-48 h-12 bg-[#2A2D35] rounded-lg mb-6 mx-auto"></div>
                <div className="w-64 h-8 bg-[#2A2D35] rounded-lg mb-4 mx-auto"></div>
                <div className="w-32 h-8 bg-[#2A2D35] rounded-lg mb-8 mx-auto"></div>
                <div className="flex justify-center gap-4">
                  <div className="w-16 h-16 bg-[#2A2D35] rounded-lg"></div>
                  <div className="w-16 h-16 bg-[#2A2D35] rounded-lg"></div>
                  <div className="w-16 h-16 bg-[#2A2D35] rounded-lg"></div>
                </div>
              </div>
              
              {/* Classified overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <p className="text-white/10 text-[120px] md:text-[200px] font-bold rotate-12 select-none">
                  REDACTED
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 mt-auto">
        <div className="container mx-auto text-center text-xs text-gray-600">
          © 2025 Pole Vault Tracker
        </div>
      </footer>
    </div>
  );
};

export default ComingSoon;
