import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, BarChart3 } from 'lucide-react';

const VaultHero = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            Created by Olympic Pole Vaulters Sondre & Simen Guttormsen
          </Badge>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Track Every Jump.
            <br />
            <span className="text-blue-600">Master Your Progress.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The first mobile app designed specifically for pole vault tracking and performance analysis.
          </p>

          {/* Secondary description */}
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Created by Olympic pole vaulters for athletes who want to track every detail,
            analyze their performance, and reach new heights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              <Smartphone className="mr-2 h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-blue-600 text-blue-600 hover:bg-blue-50">
              <Download className="mr-2 h-5 w-5" />
              Download for Android
            </Button>
          </div>

          {/* Dashboard Login CTA */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-blue-200 max-w-md mx-auto mb-6">
            <p className="text-blue-700 font-semibold text-lg mb-3">
              Already have the app?
            </p>
            <Button asChild variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link to="/vault/login">
                <BarChart3 className="mr-2 h-4 w-4" />
                Sign in to Dashboard
              </Link>
            </Button>
          </div>

          {/* Free Trial Callout */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-blue-200 max-w-md mx-auto">
            <p className="text-blue-700 font-semibold text-lg">
              Start your 14-day free trial
            </p>
            <p className="text-blue-600 text-sm mt-1">
              No credit card required
            </p>
          </div>

          {/* Hero Visual Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 mx-auto max-w-2xl">
              <div className="aspect-video bg-white/50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <Smartphone className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-600 font-medium">App Screenshots</p>
                  <p className="text-blue-500 text-sm">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultHero;