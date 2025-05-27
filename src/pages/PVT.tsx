
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, LogIn } from "lucide-react";

const PVT = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: `var(--neutral-0)`,
      '--blue-600': '#2563EB',
      '--blue-700': '#1E4ED8',
      '--blue-50': '#EFF6FF',
      '--neutral-0': '#FFFFFF',
      '--neutral-50': '#F9FAFB',
      '--neutral-100': '#F5F5F5',
      '--neutral-200': '#E5E7EB',
      '--neutral-600': '#4B5563',
      '--neutral-800': '#1F2937',
      '--red-600': '#EF4444',
      '--red-700': '#DC2626',
      '--dark-brand': '#1B3A4B',
      '--grad-start': '#F5ECE5',
      '--grad-end': '#EBECF1'
    } as React.CSSProperties}>
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b" style={{ 
        backgroundColor: 'var(--dark-brand)', 
        borderColor: 'var(--neutral-200)' 
      }}>
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="font-bold text-xl text-white">PVT</div>
              <div className="hidden md:flex space-x-6">
                <button onClick={() => scrollToSection('features')} className="text-white/80 hover:text-white transition-colors">Features</button>
                <button onClick={() => scrollToSection('screenshots')} className="text-white/80 hover:text-white transition-colors">Screenshots</button>
                <button onClick={() => scrollToSection('pricing')} className="text-white/80 hover:text-white transition-colors">Pricing</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => scrollToSection('waitlist')}
                className="text-white border-white hover:bg-white/10"
                variant="outline"
              >
                Waitlist <ArrowUp className="ml-1 w-4 h-4" />
              </Button>
              <Button 
                className="text-white"
                style={{ 
                  backgroundColor: 'var(--blue-600)',
                  ':hover': { backgroundColor: 'var(--blue-700)' }
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section 
        className="py-20 lg:py-32 min-h-screen flex items-center"
        style={{
          background: `linear-gradient(180deg, var(--grad-start) 0%, var(--grad-end) 100%)`
        }}
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div style={{ color: 'var(--neutral-800)' }}>
              <div className="flex items-center mb-6">
                <div className="flex -space-x-2 mr-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--neutral-200)' }}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--neutral-600)' }}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--neutral-800)' }}></div>
                </div>
                <span style={{ color: 'var(--neutral-600)' }}>Used by 1000+ vaulters with ⭐ 4.9 rating</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: 'var(--neutral-800)' }}>
                Meet PVT
              </h1>
              
              <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight" style={{ color: 'var(--neutral-800)' }}>
                Track your jumps with just a tap
              </h2>
              
              <p className="text-xl lg:text-2xl mb-8" style={{ color: 'var(--neutral-600)' }}>
                Meet PVT, the AI-powered app for easy pole vault tracking. Log attempts, organize poles, and get instant analytics to jump higher.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg"
                  onClick={() => scrollToSection('waitlist')}
                  className="text-white"
                  style={{ backgroundColor: 'var(--blue-600)' }}
                >
                  Join the Waitlist
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('demo')}
                  className="border-2"
                  style={{ 
                    borderColor: 'var(--blue-600)', 
                    color: 'var(--blue-600)',
                    backgroundColor: 'transparent'
                  }}
                >
                  See PVT in Action
                </Button>
              </div>
              
              <div className="flex items-center">
                <Badge variant="secondary" style={{ 
                  backgroundColor: 'var(--blue-50)', 
                  color: 'var(--neutral-800)' 
                }}>
                  Built by Olympic finalist Sondre Guttormsen
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="w-64 h-[500px] mx-auto rounded-3xl p-2 shadow-2xl" style={{ backgroundColor: 'var(--neutral-800)' }}>
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <div className="text-center" style={{ color: 'var(--neutral-600)' }}>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                    App Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem & Promise */}
      <section className="py-20" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--neutral-800)' }}>The Problem</h2>
              <p className="text-xl mb-8" style={{ color: 'var(--neutral-600)' }}>
                Messy notes, scattered videos, forgotten pole details, no clear trends.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--neutral-800)' }}>The PVT Solution</h2>
              <p className="text-xl mb-8" style={{ color: 'var(--neutral-600)' }}>
                All your jumps, poles, videos, and analytics—instantly searchable in one app.
              </p>
              <ul className="space-y-4 text-lg" style={{ color: 'var(--neutral-600)' }}>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-3 mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                  Log a jump in under 15 seconds
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-3 mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                  Attach 1080p slow-mo video right on the runway
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-3 mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                  See PR trends, consistency heatmaps, pole-to-bar stats
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-3 mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                  Share sessions with coaches in one tap
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => scrollToSection('waitlist')}
              className="text-white"
              style={{ backgroundColor: 'var(--blue-600)' }}
            >
              Get Early Access
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights */}
      <section id="features" className="py-20" style={{ backgroundColor: 'var(--neutral-0)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: 'var(--neutral-800)' }}>Features That Matter</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center" style={{ borderColor: 'var(--neutral-200)' }}>
              <CardHeader>
                <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                </div>
                <CardTitle style={{ color: 'var(--neutral-800)' }}>Jump Logger</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: 'var(--neutral-600)' }}>
                  Track pole, grip, approach, standards, rating, and notes for every attempt.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center" style={{ borderColor: 'var(--neutral-200)' }}>
              <CardHeader>
                <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                </div>
                <CardTitle style={{ color: 'var(--neutral-800)' }}>Pole Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: 'var(--neutral-600)' }}>
                  Organize by flex, length, usage history, and best bar height achieved.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center" style={{ borderColor: 'var(--neutral-200)' }}>
              <CardHeader>
                <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                </div>
                <CardTitle style={{ color: 'var(--neutral-800)' }}>Video + Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: 'var(--neutral-600)' }}>
                  Attach clips, auto-sync to attempts, and visualize progress over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Social Proof */}
      <section className="py-20" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: 'var(--neutral-800)' }}>What Athletes Say</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardContent className="p-8">
                <p className="text-lg mb-6 italic" style={{ color: 'var(--neutral-600)' }}>
                  "It's like having a data coach in my pocket. I finally know which pole actually works at each bar height."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4" style={{ backgroundColor: 'var(--neutral-200)' }}></div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--neutral-800)' }}>Emma Rose</p>
                    <p style={{ color: 'var(--neutral-600)' }}>U20 National Medalist</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardContent className="p-8">
                <p className="text-lg mb-6 italic" style={{ color: 'var(--neutral-600)' }}>
                  "Logged 400+ attempts this season; saw a 15 cm PR after spotting trend gaps."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4" style={{ backgroundColor: 'var(--neutral-200)' }}></div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--neutral-800)' }}>James M.</p>
                    <p style={{ color: 'var(--neutral-600)' }}>NCAA D1 Vaulter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Pricing Teaser */}
      <section id="pricing" className="py-20" style={{ backgroundColor: 'var(--neutral-0)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--neutral-800)' }}>Simple Pricing</h2>
            <Badge variant="secondary" style={{ 
              backgroundColor: 'var(--blue-50)', 
              color: 'var(--neutral-800)' 
            }}>
              Coming Soon
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardHeader>
                <CardTitle className="text-2xl" style={{ color: 'var(--neutral-800)' }}>Free Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3" style={{ color: 'var(--neutral-600)' }}>
                  <li>• Unlimited jump logging</li>
                  <li>• Pole library</li>
                  <li>• Vault calendar</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card style={{ borderColor: 'var(--blue-600)' }}>
              <CardHeader>
                <CardTitle className="text-2xl" style={{ color: 'var(--neutral-800)' }}>Pro Plan</CardTitle>
                <p className="text-3xl font-bold" style={{ color: 'var(--neutral-800)' }}>$4.99/mo</p>
                <p style={{ color: 'var(--neutral-600)' }}>or $39.99/yr</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3" style={{ color: 'var(--neutral-600)' }}>
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
              className="text-white"
              style={{ backgroundColor: 'var(--blue-600)' }}
            >
              Reserve Pro Trial
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Demo Video & Screenshots */}
      <section id="screenshots" className="py-20" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: 'var(--neutral-800)' }}>See It In Action</h2>
          <div className="flex justify-center space-x-8 mb-12">
            <div className="w-48 h-96 rounded-3xl p-2" style={{ backgroundColor: 'var(--neutral-800)' }}>
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <div className="text-center" style={{ color: 'var(--neutral-600)' }}>
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded"></div>
                  New Jump → Save
                </div>
              </div>
            </div>
            <div className="w-48 h-96 rounded-3xl p-2" style={{ backgroundColor: 'var(--neutral-800)' }}>
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <div className="text-center" style={{ color: 'var(--neutral-600)' }}>
                  <div className="w-8 h-8 mx-auto mb-2 rounded" style={{ backgroundColor: 'var(--blue-600)' }}></div>
                  Session Timeline
                </div>
              </div>
            </div>
            <div className="w-48 h-96 rounded-3xl p-2" style={{ backgroundColor: 'var(--neutral-800)' }}>
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <div className="text-center" style={{ color: 'var(--neutral-600)' }}>
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
              style={{ backgroundColor: 'var(--neutral-200)', color: 'var(--neutral-600)' }}
              className="cursor-not-allowed"
            >
              Download App (Coming Soon)
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Early Access Form */}
      <section id="waitlist" className="py-20" style={{ backgroundColor: 'var(--neutral-0)' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--neutral-800)' }}>Be first on the runway.</h2>
            <p className="text-xl mb-8" style={{ color: 'var(--neutral-600)' }}>
              Join our waitlist and get 1 month Pro free at launch.
            </p>
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Your name" style={{ borderColor: 'var(--neutral-200)' }} />
                    <Input type="email" placeholder="Your email" style={{ borderColor: 'var(--neutral-200)' }} />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span style={{ color: 'var(--neutral-600)' }}>I'm a Vaulter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span style={{ color: 'var(--neutral-600)' }}>I'm a Coach</span>
                    </label>
                  </div>
                  <Button 
                    size="lg"
                    className="w-full text-white"
                    style={{ backgroundColor: 'var(--blue-600)' }}
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
      <section className="py-20" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: 'var(--neutral-800)' }}>The Story</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--neutral-800)' }}>How It Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: 'var(--neutral-600)' }}>
                  Notebook chaos, YouTube scrolls, lost PR details. Sondre realized there had to be a better way.
                </p>
              </CardContent>
            </Card>
            
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--neutral-800)' }}>Building It</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: 'var(--neutral-600)' }}>
                  He roped in his brother Simen—operations-research engineer turned coder. Months of late-night debugging, AI tools, and stubborn curiosity led to Pole Vault Tracker.
                </p>
              </CardContent>
            </Card>
            
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--neutral-800)' }}>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: 'var(--neutral-600)' }}>
                  Make high-performance tools accessible to every vaulter, from youth club to Olympic final.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 10. About the Founders */}
      <section className="py-20" style={{ backgroundColor: 'var(--neutral-0)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: 'var(--neutral-800)' }}>About the Founders</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-6" style={{ backgroundColor: 'var(--neutral-200)' }}></div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--neutral-800)' }}>Sondre Guttormsen</h3>
                <p className="mb-4" style={{ color: 'var(--neutral-600)' }}>
                  Olympic finalist, European champion, Princeton & Duke grad.
                </p>
              </CardContent>
            </Card>
            
            <Card style={{ borderColor: 'var(--neutral-200)' }}>
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-6" style={{ backgroundColor: 'var(--neutral-200)' }}></div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--neutral-800)' }}>Simen Guttormsen</h3>
                <p className="mb-4" style={{ color: 'var(--neutral-600)' }}>
                  Princeton ORFE, Duke MS in Econ & Computation, data engineer.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xl italic mt-8" style={{ color: 'var(--neutral-600)' }}>
            "We build what we wish existed when we started vaulting."
          </p>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-12 text-white" style={{ backgroundColor: 'var(--dark-brand)' }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Download</h3>
              <div className="space-y-2">
                <Button disabled className="w-full cursor-not-allowed" style={{ backgroundColor: 'var(--neutral-600)' }}>
                  App Store (Coming Soon)
                </Button>
                <Button disabled className="w-full cursor-not-allowed" style={{ backgroundColor: 'var(--neutral-600)' }}>
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
                <p><a href="#" className="hover:text-gray-300">Privacy Policy</a></p>
                <p><a href="#" className="hover:text-gray-300">Terms of Service</a></p>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'var(--neutral-600)' }}>
            <p className="text-white/80">© 2025 PVT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PVT;
