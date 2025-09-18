import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Download,
  CheckCircle,
  Instagram,
  Youtube,
  Facebook
} from 'lucide-react';

const VaultCTA = () => {
  const benefits = [
    "Track every jump with detailed session logs",
    "Analyze your performance with comprehensive analytics",
    "Manage your equipment and find what works best",
    "Store training videos and build a technique library",
    "Understand your patterns and improve consistently",
    "Free 14-day trial with no commitments"
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to take your pole vault to the next level?
          </h2>

          {/* Subheading */}
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of pole vaulters who are already using Vault to track their progress
            and improve their performance.
          </p>

          {/* Benefits grid */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <span className="text-white font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Download buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
              <Smartphone className="mr-2 h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              <Download className="mr-2 h-5 w-5" />
              Download for Android
            </Button>
          </div>

          {/* Risk-free message */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto mb-12">
            <Badge variant="secondary" className="mb-2 bg-green-500 text-white">
              Risk-Free
            </Badge>
            <p className="text-white font-semibold text-lg">
              Try Vault risk-free for 14 days
            </p>
            <p className="text-blue-100 text-sm mt-1">
              No credit card required. Cancel anytime.
            </p>
          </div>

          {/* Social links */}
          <div className="border-t border-white/20 pt-8">
            <p className="text-blue-100 mb-6">
              Follow our journey and get training tips:
            </p>
            <div className="flex justify-center gap-6">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Youtube className="h-5 w-5 mr-2" />
                YouTube
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </Button>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-12 text-center">
            <p className="text-blue-200 text-sm">
              © 2024 Vault: Track Every Rep. Created by Sondre & Simen Guttormsen.
            </p>
            <div className="flex justify-center gap-6 mt-4 text-blue-200 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultCTA;