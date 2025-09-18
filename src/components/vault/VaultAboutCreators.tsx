import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Medal, Target, Users, Heart } from 'lucide-react';

const VaultAboutCreators = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built by Olympic athletes who understand your journey
            </h2>
          </div>

          {/* Main content card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-8 md:p-12">
              {/* Creators info */}
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
                  <Medal className="h-4 w-4 mr-2" />
                  Olympic Athletes
                </Badge>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Sondre & Simen Guttormsen
                </h3>

                <p className="text-xl text-blue-600 font-semibold mb-6">
                  Olympic Pole Vaulters & App Creators
                </p>

                {/* Photo placeholder */}
                <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center border-4 border-white shadow-lg">
                  <div className="text-center">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Photo Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
                <p className="mb-6">
                  As brothers who have competed at the highest levels of pole vault, including the Olympics,
                  we've always been obsessed with the details that make the difference between a good jump and a great one.
                </p>

                <p className="mb-6">
                  Throughout our careers, we kept detailed training logs, analyzed video footage, and tracked
                  every variable we could think of. But we were doing it all manually - notebooks, spreadsheets,
                  scattered video files.
                </p>

                <p className="mb-6">
                  We realized that our fellow pole vaulters were facing the same challenges. There wasn't a
                  single app designed specifically for our sport. Everything was either too generic or missing
                  the features that actually matter for pole vault.
                </p>

                <p className="mb-8">
                  So we decided to build it ourselves.
                </p>

                {/* Highlighted message */}
                <div className="bg-blue-600 text-white rounded-lg p-6 mb-8">
                  <p className="text-xl font-semibold text-center">
                    "Vault represents everything we wish we had as developing athletes."
                  </p>
                  <p className="text-blue-100 text-center mt-2">
                    It's the tool we use for our own training, and we're excited to share it with the global pole vault community.
                  </p>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Medal className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Olympic Experience</h4>
                  <p className="text-gray-600 text-sm">Built by athletes who compete at the highest level</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Athlete-Focused</h4>
                  <p className="text-gray-600 text-sm">Every feature designed with real training needs in mind</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Driven</h4>
                  <p className="text-gray-600 text-sm">Built for the pole vault community, by the pole vault community</p>
                </div>
              </div>

              {/* Community message */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 mt-12">
                <blockquote className="text-center">
                  <p className="text-xl text-gray-800 italic mb-4">
                    "We've always believed that better tools make better athletes. Vault is our gift to the
                    pole vault community - a sport that has given us so much. We hope it helps you reach new heights,
                    just like it's helping us."
                  </p>
                  <footer className="text-gray-600 font-medium">
                    — Sondre & Simen Guttormsen
                  </footer>
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VaultAboutCreators;