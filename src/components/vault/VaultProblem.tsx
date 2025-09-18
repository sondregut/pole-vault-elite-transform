import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Settings, TrendingDown, Search } from 'lucide-react';

const VaultProblem = () => {
  const problems = [
    {
      icon: Camera,
      title: "Scrolling endlessly",
      description: "through your camera roll to find that perfect jump from last month?"
    },
    {
      icon: Settings,
      title: "Forgetting which pole",
      description: "you used for your personal best?"
    },
    {
      icon: TrendingDown,
      title: "Missing patterns",
      description: "in your performance because you can't see the bigger picture?"
    },
    {
      icon: Search,
      title: "Wishing you could analyze",
      description: "your training data like the pros do?"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            Tired of losing track of your jumps?
          </h2>

          {/* Problem points grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {problems.map((problem, index) => (
              <Card key={index} className="border-none shadow-sm bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <problem.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transition text */}
          <div className="bg-blue-600 text-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">
              We felt the same frustration.
            </h3>
            <p className="text-xl text-blue-100">
              That's why we built Vault.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultProblem;