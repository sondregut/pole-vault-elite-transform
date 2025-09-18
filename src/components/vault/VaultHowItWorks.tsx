import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ClipboardList, BarChart3, ArrowRight } from 'lucide-react';

const VaultHowItWorks = () => {
  const steps = [
    {
      step: 1,
      icon: Calendar,
      title: "Log Your Session",
      description: "Set up your training session with location, weather, and goals. Ready to jump in under 30 seconds.",
      details: "Quick session setup with smart defaults"
    },
    {
      step: 2,
      icon: ClipboardList,
      title: "Track Every Jump",
      description: "Log each attempt with detailed information: height, result, pole selection, grip height, approach details, and your technique rating. Add photos or videos with one tap.",
      details: "Comprehensive jump logging made simple"
    },
    {
      step: 3,
      icon: BarChart3,
      title: "Analyze & Improve",
      description: "Review your data, search for specific jumps, and spot patterns in your performance. Use powerful filters to find exactly what you're looking for and plan your next session based on real insights.",
      details: "Turn data into actionable insights"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start tracking in 3 simple steps
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-2 hover:shadow-lg transition-shadow bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    {/* Step number */}
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <step.icon className="h-10 w-10 text-blue-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Details badge */}
                    <Badge variant="secondary" className="text-sm">
                      {step.details}
                    </Badge>

                    {/* Screenshot placeholder */}
                    <div className="mt-8 bg-gray-100 rounded-lg p-6 aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <step.icon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Screenshot</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultHowItWorks;