import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, Star, Users, TrendingUp, Target, CheckCircle } from 'lucide-react';

const VaultTestimonials = () => {
  const testimonials = [
    {
      quote: "The search function is a game-changer! I can instantly find all my jumps with my 14'6\" pole at 4.20m grip and see what worked. No more digging through thousands of photos to find that one perfect jump from last month.",
      name: "Sarah M.",
      role: "College Pole Vaulter",
      rating: 5
    },
    {
      quote: "As a coach, Vault has revolutionized how I work with my athletes. The video storage and analytics help me give much more targeted feedback. It's like having a digital assistant for pole vault coaching.",
      name: "Coach David L.",
      role: "High School Track & Field",
      rating: 5
    },
    {
      quote: "I used to lose track of which poles worked best for me. Now I have all my equipment data in one place, and I can see exactly which setup gives me the best results. My consistency has improved dramatically.",
      name: "Marcus R.",
      role: "Professional Pole Vaulter",
      rating: 5
    }
  ];

  const stats = [
    {
      icon: Target,
      value: "500+",
      label: "jumps tracked in first month"
    },
    {
      icon: Users,
      value: "50+",
      label: "athletes using Vault"
    },
    {
      icon: TrendingUp,
      value: "12%",
      label: "average improvement in consistency"
    },
    {
      icon: CheckCircle,
      value: "95%",
      label: "say Vault helps them understand performance better"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join athletes who are already improving with Vault
            </h2>
          </div>

          {/* Testimonials grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-8">
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-blue-600 mb-4" />

                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-gray-700 italic leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>

                  {/* Author info */}
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-blue-600 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="text-sm mb-4">
                Early Results
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900">
                Real impact from real athletes
              </h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 text-sm leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                *Statistics based on early user feedback and usage data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultTestimonials;