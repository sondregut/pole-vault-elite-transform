
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block bg-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                New App Release
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Pole Vault Tracker
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-100">
                Track. Analyze. Improve.
              </h2>
              <p className="text-lg text-gray-100">
                The #1 app for pole vaulters to log every jump, review videos, and unlock performance insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  <Download size={20} />
                  Download Now
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 gap-2">
                  Join Waitlist
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 blur-xl opacity-50 rounded-3xl transform rotate-3"></div>
                <div className="relative p-2 bg-gray-900 rounded-3xl shadow-2xl border border-gray-700">
                  <img 
                    src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hero-section-image.jpg" 
                    alt="Pole Vault Tracker App" 
                    className="rounded-2xl w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              What You Can Do With PVT
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Powerful features designed specifically for pole vault training and performance tracking
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="mb-4 inline-block bg-white p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* See It In Action Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              See It In Action
            </h2>
            <div className="text-center mb-12">
              <Button size="lg" variant="outline" className="gap-2">
                <Play size={20} />
                Watch Demo Video
              </Button>
              <p className="text-gray-600 mt-4">Log a jump. Upload a clip. Analyze the result. It's that easy.</p>
            </div>
          </div>
        </section>

        {/* App Screenshots Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              App Screenshots
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {appScreenshots.map((screenshot, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-4">
                        <img 
                          src={screenshot.src} 
                          alt={screenshot.alt}
                          className="rounded-xl shadow-lg w-full h-auto"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Try the Demo
            </h1>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Experience how the app helps vaulters log and analyze their jumps
            </p>
            
            <div className="max-w-md mx-auto">
              {/* iPhone frame */}
              <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                {/* iPhone notch */}
                <div className="absolute top-0 inset-x-0">
                  <div className="mx-auto bg-black w-[40%] h-[25px] rounded-b-3xl"></div>
                </div>
                
                {/* iPhone screen */}
                <div className="w-full h-full bg-white overflow-y-auto p-4">
                  {/* App header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-500">9:41 AM</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-2">
                    {/* Jump form */}
                    <h2 className="text-2xl font-bold mb-1">Jump Details</h2>
                    <p className="text-sm text-gray-500 mb-4">Record the details of your jump</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">Pole</label>
                        <Select defaultValue={poles[0]}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a pole" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Your Poles</SelectLabel>
                              {poles.map((pole) => (
                                <SelectItem key={pole} value={pole}>{pole}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-1">Number of Steps</label>
                        <div className="flex items-center">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="h-10 w-10 p-0"
                            onClick={() => handleStepChange(-1)}
                          >
                            -
                          </Button>
                          <div className="h-10 w-20 flex items-center justify-center border-y border-input">
                            {steps}
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="h-10 w-10 p-0"
                            onClick={() => handleStepChange(1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium">Bar Height</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">Units:</span>
                            <span className="text-xs">m</span>
                            <Switch 
                              checked={unitType === "ft"} 
                              onCheckedChange={() => setUnitType(unitType === "m" ? "ft" : "m")}
                            />
                            <span className="text-xs">ft</span>
                          </div>
                        </div>
                        <Input 
                          type="text"
                          placeholder={`Height in ${unitType === "m" ? "meters (e.g., 4.75)" : "feet (e.g., 15.5)"}`}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-1">Jump Rating</label>
                        <RadioGroup 
                          value={jumpRating} 
                          onValueChange={setJumpRating} 
                          className="flex justify-between"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="run_thru" id="run_thru" />
                            <Label htmlFor="run_thru" className="text-sm text-red-500">Miss</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="ok" id="ok" />
                            <Label htmlFor="ok" className="text-sm text-amber-500">OK</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="good" id="good" />
                            <Label htmlFor="good" className="text-sm text-green-500">Good</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="great" id="great" />
                            <Label htmlFor="great" className="text-sm text-blue-500">Great</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-1">Jump Notes</label>
                        <Textarea placeholder="Add any notes about this jump" />
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <Button variant="outline">Cancel</Button>
                        <Button className="px-6">Add Jump</Button>
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
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What Athletes Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <p className="text-lg italic mb-4">
                  "I finally understand why I jump better from 14 than 16. This app is a game changer."
                </p>
                <div className="text-sm text-gray-600">
                  — Emma Rose, U20 National Medalist
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <p className="text-lg italic mb-4">
                  "I've used it for every jump this season. Simple, smart, essential."
                </p>
                <div className="text-sm text-gray-600">
                  — James M., College Vaulter
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-16 bg-gray-50" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
                  className={`rounded-2xl border-2 ${plan.borderColor} overflow-hidden shadow-sm hover:shadow-md transition-shadow relative ${plan.popular ? 'transform md:-translate-y-4' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className={`${plan.bgColor} ${plan.textColor} p-6 text-center`}>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-3">
                      {plan.monthlyPrice === 0 ? (
                        <span className="text-3xl font-bold">Free</span>
                      ) : (
                        <span className="text-3xl font-bold">${plan.monthlyPrice}/month</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full" size="lg">
                      {plan.monthlyPrice === 0 ? "Start Free" : "Upgrade to Pro"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              FAQ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Is this only for elites?</h3>
                  <p className="text-gray-600">No — if you vault, you'll benefit.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Can coaches use this?</h3>
                  <p className="text-gray-600">Yes. Coach mode is coming soon.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How much video can I upload?</h3>
                  <p className="text-gray-600">Pro gives you generous cloud storage — and we compress efficiently.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Does it work offline?</h3>
                  <p className="text-gray-600">Yes, and syncs when you're back online.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Early Access Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Early Access
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Drop your email to get exclusive launch updates and one free month of PVT Pro
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Your name" className="flex-1" />
                <Input placeholder="Your email" className="flex-1" />
                <Button>Join Waitlist</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Download PVT
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="gap-2">
                <Smartphone className="w-5 h-5" />
                App Store
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Smartphone className="w-5 h-5" />
                Google Play
              </Button>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-lg">
                <div className="w-32 h-32 bg-gray-300 rounded flex items-center justify-center">
                  <span className="text-gray-600">QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-8 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm mb-2">Stay Connected: Instagram | TikTok | YouTube</p>
            <p className="text-sm mb-2">Questions? Email us at support@polevaulttracker.com</p>
            <p className="text-xs text-gray-400">© 2025 Pole Vault Tracker · Made by Vaulters, for Vaulters.</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PVT;
