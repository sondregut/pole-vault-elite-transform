
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Login } from "lucide-react";

const PVT = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="font-bold text-xl text-brand-violet-700">PVT</div>
              <div className="hidden md:flex space-x-6">
                <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-brand-violet-700 transition-colors">Features</button>
                <button onClick={() => scrollToSection('screenshots')} className="text-gray-600 hover:text-brand-violet-700 transition-colors">Screenshots</button>
                <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-brand-violet-700 transition-colors">Pricing</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => scrollToSection('waitlist')}
                className="bg-brand-violet-700 hover:bg-brand-violet-400 text-white"
              >
                Waitlist <ArrowUp className="ml-1 w-4 h-4" />
              </Button>
              <Button variant="outline" className="text-brand-violet-700 border-brand-violet-700">
                <Login className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-brand-violet-700 to-brand-violet-400">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Pole Vault Tracker
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white/90">
                The fastest way to log every jump, organize your poles, and unlock data-driven breakthroughs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg"
                  onClick={() => scrollToSection('waitlist')}
                  className="bg-white text-brand-violet-700 hover:bg-gray-100"
                >
                  Join the Waitlist
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('demo')}
                  className="border-white text-white hover:bg-white/10"
                >
                  See PVT in Action
                </Button>
              </div>
              <div className="flex items-center text-white/80">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Built by Olympic finalist Sondre Guttormsen
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="w-64 h-[500px] mx-auto bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-brand-violet-700 rounded-lg"></div>
                    App Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem & Promise */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h2>
              <p className="text-xl text-gray-600 mb-8">
                Messy notes, scattered videos, forgotten pole details, no clear trends.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The PVT Solution</h2>
              <p className="text-xl text-gray-600 mb-8">
                All your jumps, poles, videos, and analytics—instantly searchable in one app.
              </p>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-brand-violet-700 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  Log a jump in under 15 seconds
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-brand-violet-700 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  Attach 1080p slow-mo video right on the runway
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-brand-violet-700 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  See PR trends, consistency heatmaps, pole-to-bar stats
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-brand-violet-700 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  Share sessions with coaches in one tap
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => scrollToSection('waitlist')}
              className="bg-brand-violet-700 hover:bg-brand-violet-400"
            >
              Get Early Access
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Features That Matter</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-brand-violet-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-brand-violet-700 rounded"></div>
                </div>
                <CardTitle>Jump Logger</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track pole, grip, approach, standards, rating, and notes for every attempt.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-brand-violet-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-brand-violet-700 rounded"></div>
                </div>
                <CardTitle>Pole Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize by flex, length, usage history, and best bar height achieved.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-brand-violet-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-brand-violet-700 rounded"></div>
                </div>
                <CardTitle>Video + Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Attach clips, auto-sync to attempts, and visualize progress over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">What Athletes Say</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-8">
                <p className="text-lg mb-6 italic">
                  "It's like having a data coach in my pocket. I finally know which pole actually works at each bar height."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">Emma Rose</p>
                    <p className="text-gray-600">U20 National Medalist</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <p className="text-lg mb-6 italic">
                  "Logged 400+ attempts this season; saw a 15 cm PR after spotting trend gaps."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">James M.</p>
                    <p className="text-gray-600">NCAA D1 Vaulter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Pricing Teaser */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <Badge variant="secondary" className="bg-brand-violet-100 text-brand-violet-700">
              Coming Soon
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li>• Unlimited jump logging</li>
                  <li>• Pole library</li>
                  <li>• Vault calendar</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-brand-violet-700">
              <CardHeader>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <p className="text-3xl font-bold text-brand-violet-700">$4.99/mo</p>
                <p className="text-gray-600">or $39.99/yr</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li>• Unlimited video storage</li>
                  <li>• Advanced charts</li>
                  <li>• PDF/CSV export</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => scrollToSection('waitlist')}
              className="bg-brand-violet-700 hover:bg-brand-violet-400"
            >
              Reserve Pro Trial
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Demo Video & Screenshots */}
      <section id="screenshots" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">See It In Action</h2>
          <div className="flex justify-center space-x-8 mb-12">
            <div className="w-48 h-96 bg-gray-900 rounded-3xl p-2">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded"></div>
                  New Jump → Save
                </div>
              </div>
            </div>
            <div className="w-48 h-96 bg-gray-900 rounded-3xl p-2">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-8 h-8 mx-auto mb-2 bg-blue-500 rounded"></div>
                  Session Timeline
                </div>
              </div>
            </div>
            <div className="w-48 h-96 bg-gray-900 rounded-3xl p-2">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-8 h-8 mx-auto mb-2 bg-purple-500 rounded"></div>
                  Video Analytics
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button 
              size="lg"
              disabled
              className="bg-gray-400 cursor-not-allowed"
            >
              Download App (Coming Soon)
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Early Access Form */}
      <section id="waitlist" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Be first on the runway.</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our waitlist and get 1 month Pro free at launch.
            </p>
            <Card>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Your name" />
                    <Input type="email" placeholder="Your email" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>I'm a Vaulter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>I'm a Coach</span>
                    </label>
                  </div>
                  <Button 
                    size="lg"
                    className="w-full bg-brand-violet-700 hover:bg-brand-violet-400"
                  >
                    Join Waitlist
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 9. The Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">The Story</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>How It Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Notebook chaos, YouTube scrolls, lost PR details. Sondre realized there had to be a better way.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Building It</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  He roped in his brother Simen—operations-research engineer turned coder. Months of late-night debugging, AI tools, and stubborn curiosity led to Pole Vault Tracker.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Make high-performance tools accessible to every vaulter, from youth club to Olympic final.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 10. About the Founders */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">About the Founders</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold mb-2">Sondre Guttormsen</h3>
                <p className="text-gray-600 mb-4">
                  Olympic finalist, European champion, Princeton & Duke grad.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold mb-2">Simen Guttormsen</h3>
                <p className="text-gray-600 mb-4">
                  Princeton ORFE, Duke MS in Econ & Computation, data engineer.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xl italic text-gray-600 mt-8">
            "We build what we wish existed when we started vaulting."
          </p>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Download</h3>
              <div className="space-y-2">
                <Button disabled className="w-full bg-gray-600 cursor-not-allowed">
                  App Store (Coming Soon)
                </Button>
                <Button disabled className="w-full bg-gray-600 cursor-not-allowed">
                  Google Play (Coming Soon)
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Connect</h3>
              <div className="space-y-2">
                <p>Instagram: @polevaulttracker</p>
                <p>Email: support@polevaulttracker.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <div className="space-y-2">
                <p><a href="#" className="hover:text-brand-violet-400">Privacy Policy</a></p>
                <p><a href="#" className="hover:text-brand-violet-400">Terms of Service</a></p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 PVT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PVT;
