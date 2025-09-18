import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardList,
  Wrench,
  BarChart3,
  Search,
  Video,
  CheckCircle
} from 'lucide-react';

const VaultFeatures = () => {
  const features = [
    {
      icon: ClipboardList,
      title: "Smart Session Tracking",
      subtitle: "Capture every detail that matters",
      items: [
        "Log jump height, result (make/miss), and conditions",
        "Select your pole from your equipment library",
        "Track grip height, approach steps, and run-up speed",
        "Rate your vault technique and confidence (1-10 scale)",
        "Add photos and videos to each jump",
        "Record weather conditions, wind speed, and direction",
        "Track multiple sessions per day with session notes"
      ]
    },
    {
      icon: Wrench,
      title: "Equipment Management",
      subtitle: "Know your gear inside and out",
      items: [
        "Track unlimited poles with detailed specifications",
        "See which equipment works best for you",
        "Monitor pole usage and performance patterns",
        "Get insights on optimal pole selection"
      ]
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      subtitle: "Turn data into personal records",
      items: [
        "Visualize your progress with beautiful charts",
        "Identify patterns in successful jumps",
        "Track improvement over time"
      ]
    },
    {
      icon: Search,
      title: "Instant Search & Filter",
      subtitle: "Find any jump in seconds",
      items: [
        "Search by pole used, grip height, or approach type",
        "Filter by height achieved, result, or rating",
        "Find jumps by weather conditions or session date",
        "View complete details and videos for each jump instantly",
        "No more scrolling through hundreds of photos",
        "Create custom filters for specific analysis"
      ]
    },
    {
      icon: Video,
      title: "Video Analysis",
      subtitle: "Perfect your technique",
      items: [
        "Store high-quality videos with each jump",
        "Compare techniques across different sessions",
        "Share videos with coaches instantly (coming soon)",
        "Build a visual library of your progress"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to master your pole vault journey
            </h2>
          </div>

          {/* Features grid */}
          <div className="space-y-12">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">
                        {feature.title}
                      </CardTitle>
                      <p className="text-lg font-medium text-blue-600">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {feature.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="h-12 w-12 text-blue-600" />
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          Screenshot Coming Soon
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultFeatures;