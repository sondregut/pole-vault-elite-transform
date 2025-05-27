
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { CheckCircle, Download, Play, Shield, Trophy, BarChart3, Smartphone, Calendar, Video, FileText, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PVT = () => {
  // App screenshots for carousel
  const appScreenshots = [
    {
      src: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200",
      alt: "Pole Vault Tracker - Jump logging interface"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200",
      alt: "Pole Vault Tracker - Analytics dashboard"
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
      alt: "Pole Vault Tracker - Session calendar"
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200",
      alt: "Pole Vault Tracker - Pole library"
    },
    {
      src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200",
      alt: "Pole Vault Tracker - Video upload"
    }
  ];

  const features = [
    {
      title: "Log Every Jump",
      description: "Grip height, pole used, run-up, height cleared, jump rating, notes — all in seconds.",
      icon: <FileText className="h-6 w-6 text-primary" />
    },
    {
      title: "See Your Progress",
      description: "Smart analytics show trends, consistency, and PRs over time.",
      icon: <BarChart3 className="h-6 w-6 text-primary" />
    },
    {
      title: "Upload & Review Video",
      description: "Attach slow-mo clips to each jump and review sessions anytime.",
      icon: <Video className="h-6 w-6 text-primary" />
    },
    {
      title: "Track Sessions",
      description: "Vault calendar keeps your training organized — no more guessing when you last jumped.",
      icon: <Calendar className="h-6 w-6 text-primary" />
    },
    {
      title: "Manage Your Poles",
      description: "Keep track of your pole collection: flex numbers, stiffness, lengths, and usage history.",
      icon: <Trophy className="h-6 w-6 text-primary" />
    },
    {
      title: "Your Data = Your Vault",
      description: "Private, secure, and made only for vaulters.",
      icon: <Shield className="h-6 w-6 text-primary" />
    }
  ];
  
  // Add pricing plans with monthly and yearly options
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  
  const pricingPlans = [
    {
      name: "Free Forever",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      borderColor: "border-gray-300",
      monthlyPrice: 0,
      description: "Perfect for getting started with pole vault tracking.",
      features: [
        "Log unlimited sessions",
        "Use the pole vault calendar",
        "Add notes, ratings, and tags"
      ]
    },
    {
      name: "PVT Pro",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-300",
      popular: true,
      monthlyPrice: 4.99,
      description: "Everything you need to take your vaulting to the next level.",
      features: [
        "Everything in Free, plus:",
        "Upload videos",
        "Unlock analytics & trends",
        "Track pole usage",
        "Export your vault history"
      ]
    }
  ];

  // Demo component state
  const [steps, setSteps] = useState(16);
  const [unitType, setUnitType] = useState("m");
  const [jumpRating, setJumpRating] = useState("ok");
  
  // Sample poles data
  const poles = [
    "UCS Spirit 14'", 
    "Spirit 13'6\"", 
    "Pacer FX 14'",
    "Carbon FX 15'", 
    "Essx 13'6\""
  ];

  const handleStepChange = (change: number) => {
    setSteps(prev => Math.max(1, prev + change));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section - Clean layout like Cal AI */}
        <section className="bg-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                    Pole Vault Tracker
                  </h1>
                  <h2 className="text-2xl md:text-3xl text-black font-normal">
                    Track. Analyze. Improve.
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    The #1 app for pole vaulters to log every jump, review videos, and unlock performance insights.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg">
                    <Download size={24} className="mr-2" />
                    Download Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-black text-black hover:bg-gray-50 px-8 py-4 text-lg">
                    Join Waitlist
                  </Button>
                </div>
                
                {/* App Store badges */}
                <div className="flex gap-4 pt-4">
                  <div className="bg-black rounded-lg px-6 py-3">
                    <div className="text-white text-sm">Download on the</div>
                    <div className="text-white text-lg font-semibold">App Store</div>
                  </div>
                  <div className="bg-black rounded-lg px-6 py-3">
                    <div className="text-white text-sm">GET IT ON</div>
                    <div className="text-white text-lg font-semibold">Google Play</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative">
                  {/* Phone mockup */}
                  <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
                    {/* iPhone notch */}
                    <div className="absolute top-0 inset-x-0">
                      <div className="mx-auto bg-black w-[40%] h-[25px] rounded-b-3xl"></div>
                    </div>
                    
                    {/* iPhone screen */}
                    <div className="w-full h-full bg-white overflow-hidden rounded-[1.5rem]">
                      <img 
                        src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hero-section-image.jpg" 
                        alt="Pole Vault Tracker App" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* iPhone home indicator */}
                    <div className="absolute bottom-0 inset-x-0 h-[5px]">
                      <div className="mx-auto bg-black w-[30%] h-[5px] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* What PVT includes - Similar to Cal AI's features section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                What does PVT include?
              </h2>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Phone mockup */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
                  {/* iPhone notch */}
                  <div className="absolute top-0 inset-x-0">
                    <div className="mx-auto bg-black w-[40%] h-[25px] rounded-b-3xl"></div>
                  </div>
                  
                  {/* iPhone screen */}
                  <div className="w-full h-full bg-white overflow-y-auto p-4 rounded-[1.5rem]">
                    {/* App header */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-xs text-gray-500">9:41</div>
                      <div className="text-lg font-semibold">Jump Database</div>
                      <div className="w-6"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Height Cleared</span>
                          <span className="text-sm text-gray-500">4.75m</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Pole Used</span>
                          <span className="text-sm text-gray-500">UCS Spirit 14'</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Steps</span>
                          <span className="text-sm text-gray-500">16</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Height Cleared</span>
                          <span className="text-sm text-gray-500">4.50m</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Pole Used</span>
                          <span className="text-sm text-gray-500">Spirit 13'6"</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Steps</span>
                          <span className="text-sm text-gray-500">14</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* iPhone home indicator */}
                  <div className="absolute bottom-0 inset-x-0 h-[5px]">
                    <div className="mx-auto bg-black w-[30%] h-[5px] rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="lg:w-1/2 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-black">Log Every Jump With Just a Few Taps</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Grip height, pole used, run-up, height cleared, jump rating, notes — all in seconds. 
                    Our intuitive interface makes tracking effortless.
                  </p>
                </div>
                
                <div className="bg-gray-100 rounded-2xl p-8">
                  <h4 className="text-xl font-semibold text-black mb-4">Track Your Sessions Like Never Before</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Vault calendar keeps your training organized — no more guessing when you last jumped. 
                    See patterns, plan better, jump higher.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-black">Complete Progress Tracking and Analytics</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Smart analytics show trends, consistency, and PRs over time. Get personalized insights 
                    to optimize your training and performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet PVT Section - Similar to Cal AI's main hero */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-gray-600">Loved by 5M users with ⭐ 4.9 rating</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                  Meet PVT
                  <br />
                  Track your jumps
                  <br />
                  with just a few taps
                </h2>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Meet PVT, the AI-powered app for easy pole vault tracking. Log a jump, 
                  upload a video, or review your session and get instant performance insights.
                </p>
                
                <div className="flex gap-4">
                  <div className="bg-black rounded-lg px-6 py-3">
                    <div className="text-white text-sm">Download on the</div>
                    <div className="text-white text-lg font-semibold">App Store</div>
                  </div>
                  <div className="bg-black rounded-lg px-6 py-3">
                    <div className="text-white text-sm">GET IT ON</div>
                    <div className="text-white text-lg font-semibold">Google Play</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center gap-8">
                {/* Two phone mockups side by side */}
                <div className="relative">
                  <div className="relative mx-auto border-gray-800 bg-gray-800 border-[12px] rounded-[2rem] h-[500px] w-[250px] shadow-2xl">
                    <div className="w-full h-full bg-white overflow-hidden rounded-[1rem] p-4">
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-500 mb-2">9:41</div>
                        <div className="text-lg font-semibold">Video Analysis</div>
                      </div>
                      <div className="bg-black rounded-lg h-40 mb-4 flex items-center justify-center">
                        <Play className="text-white w-12 h-12" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Jump Analysis</div>
                        <div className="text-xs text-gray-500">Height: 4.75m</div>
                        <div className="text-xs text-gray-500">Form: Excellent takeoff</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative mt-8">
                  <div className="relative mx-auto border-gray-800 bg-gray-800 border-[12px] rounded-[2rem] h-[500px] w-[250px] shadow-2xl">
                    <div className="w-full h-full bg-white overflow-hidden rounded-[1rem] p-4">
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-500 mb-2">9:41</div>
                        <div className="text-lg font-semibold">Progress Stats</div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-xs text-blue-600 mb-1">Personal Best</div>
                          <div className="text-2xl font-bold text-blue-600">5.15m</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xs text-green-600 mb-1">This Season</div>
                          <div className="text-lg font-semibold text-green-600">127 jumps</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="text-xs text-purple-600 mb-1">Consistency</div>
                          <div className="text-lg font-semibold text-purple-600">89%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Simplified */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-6 inline-block bg-gray-100 p-4 rounded-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-black">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Clean design */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
                What Athletes Say
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-xl italic mb-6 text-gray-800 leading-relaxed">
                  "I finally understand why I jump better from 14 than 16. This app is a game changer."
                </p>
                <div className="text-gray-600 font-medium">
                  — Emma Rose, U20 National Medalist
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-xl italic mb-6 text-gray-800 leading-relaxed">
                  "I've used it for every jump this season. Simple, smart, essential."
                </p>
                <div className="text-gray-600 font-medium">
                  — James M., College Vaulter
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section - Clean design */}
        <section className="py-20 bg-gray-50" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that works for you. Start free and upgrade when you're ready.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl border-2 ${plan.borderColor} bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow relative ${plan.popular ? 'transform md:-translate-y-4 border-black' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-black text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className={`p-8 text-center ${plan.popular ? 'pt-12' : ''}`}>
                    <h3 className="text-2xl font-bold text-black mb-4">{plan.name}</h3>
                    <div className="mb-4">
                      {plan.monthlyPrice === 0 ? (
                        <span className="text-4xl font-bold text-black">Free</span>
                      ) : (
                        <span className="text-4xl font-bold text-black">${plan.monthlyPrice}/month</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-8">{plan.description}</p>
                    
                    <ul className="space-y-4 mb-8 text-left">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full bg-black text-white hover:bg-gray-800" size="lg">
                      {plan.monthlyPrice === 0 ? "Start Free" : "Upgrade to Pro"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Simple */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
              FAQ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-black">Is this only for elites?</h3>
                  <p className="text-gray-600">No — if you vault, you'll benefit.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-black">Can coaches use this?</h3>
                  <p className="text-gray-600">Yes. Coach mode is coming soon.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-black">How much video can I upload?</h3>
                  <p className="text-gray-600">Pro gives you generous cloud storage — and we compress efficiently.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-black">Does it work offline?</h3>
                  <p className="text-gray-600">Yes, and syncs when you're back online.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Early Access Section - Clean design */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Get Early Access
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Drop your email to get exclusive launch updates and one free month of PVT Pro
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Your name" className="flex-1 h-12 text-lg border-2" />
                <Input placeholder="Your email" className="flex-1 h-12 text-lg border-2" />
                <Button className="bg-black text-white hover:bg-gray-800 h-12 px-8 text-lg">Join Waitlist</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section - Clean */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">
              Download PVT
            </h2>
            
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="bg-black rounded-lg px-8 py-4 text-white cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="text-sm">Download on the</div>
                <div className="text-xl font-semibold">App Store</div>
              </div>
              <div className="bg-black rounded-lg px-8 py-4 text-white cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="text-sm">GET IT ON</div>
                <div className="text-xl font-semibold">Google Play</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-6 bg-gray-100 rounded-2xl">
                <div className="w-32 h-32 bg-gray-300 rounded-xl flex items-center justify-center">
                  <span className="text-gray-600 font-medium">QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA - Clean */}
        <section className="py-12 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm mb-3">Stay Connected: Instagram | TikTok | YouTube</p>
            <p className="text-sm mb-3">Questions? Email us at support@polevaulttracker.com</p>
            <p className="text-xs text-gray-400">© 2025 Pole Vault Tracker · Made by Vaulters, for Vaulters.</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PVT;
