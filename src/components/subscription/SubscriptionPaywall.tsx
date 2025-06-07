
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Video, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const SubscriptionPaywall = () => {
  const { createCheckout } = useSubscription();

  const features = [
    'Access to complete video library',
    'Professional training techniques',
    'Step-by-step instructions',
    'Equipment recommendations',
    'Target muscle guidance',
    'Regular new content updates'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Unlock Video Library</CardTitle>
          <p className="text-gray-600">
            Get unlimited access to our comprehensive pole vault training videos
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pricing */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Cancel anytime</p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              What's included:
            </h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={createCheckout}
            className="w-full text-lg py-6"
            size="lg"
          >
            Subscribe Now
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment processed by Stripe. You can cancel your subscription at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPaywall;
