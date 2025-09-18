import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const VaultPricing = () => {
  const tiers = [
    {
      name: "Lite",
      price: "Free",
      period: "forever",
      description: "Perfect for casual jumpers",
      icon: Zap,
      features: [
        "1 session per week",
        "5 jumps per session",
        "10 poles maximum",
        "Basic analytics",
        "Offline capability"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Athlete",
      price: "$7.49",
      period: "month",
      yearlyPrice: "$59.88/year (save 33%)",
      description: "For serious competitors",
      icon: Star,
      features: [
        "Unlimited sessions & jumps",
        "Unlimited pole tracking",
        "10 videos per session",
        "Advanced analytics",
        "Weather data integration",
        "Data export"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Athlete+",
      price: "$11.99",
      period: "month",
      yearlyPrice: "$99/year (save 31%)",
      description: "For elite performers",
      icon: Crown,
      features: [
        "Everything in Athlete",
        "Unlimited videos",
        "Priority support",
        "Advanced performance insights",
        "Early access to new features",
        "Coach sharing tools"
      ],
      popular: false,
      cta: "Start Free Trial"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose the plan that fits your goals
            </h2>

            {/* Free trial callout */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 max-w-2xl mx-auto mb-12">
              <h3 className="text-xl font-bold mb-2">
                Start with 14 days of Athlete+ features
              </h3>
              <p className="text-blue-100">
                Completely free, no credit card required
              </p>
            </div>
          </div>

          {/* Pricing tiers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative border-2 hover:shadow-lg transition-shadow ${
                  tier.popular ? 'border-blue-600 shadow-lg' : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-2">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <tier.icon className="h-8 w-8 text-blue-600" />
                  </div>

                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </CardTitle>

                  <p className="text-gray-600 mb-4">
                    {tier.description}
                  </p>

                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {tier.price}
                      {tier.period !== "forever" && (
                        <span className="text-lg font-normal text-gray-500">
                          /{tier.period}
                        </span>
                      )}
                    </div>
                    {tier.yearlyPrice && (
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {tier.yearlyPrice}
                      </p>
                    )}
                  </div>

                  <Button
                    className={`w-full ${
                      tier.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Start Free Trial - No Credit Card Required
            </Button>
            <p className="text-gray-500 text-sm mt-4">
              Cancel anytime. No commitments.
            </p>
          </div>

          {/* System requirements */}
          <div className="mt-16 bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              System Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-900 rounded text-white text-xs flex items-center justify-center">iOS</span>
                  iPhone & iPad
                </h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• iOS 13.0 or later</li>
                  <li>• iPhone 6s or newer</li>
                  <li>• 100 MB storage space</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center">A</span>
                  Android
                </h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Android 8.0 (API level 26) or later</li>
                  <li>• 100 MB storage space</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultPricing;