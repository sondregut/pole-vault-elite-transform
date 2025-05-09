
import React from "react";
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
import { CheckCircle, Download, Play, Shield, Trophy, BarChart3 } from "lucide-react";

const PVT = () => {
  // App screenshots for carousel
  const appScreenshots = [
    {
      src: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200",
      alt: "Pole Vault Tracker - Jump tracking interface"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200",
      alt: "Pole Vault Tracker - Analytics dashboard"
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
      alt: "Pole Vault Tracker - Session logging"
    }
  ];

  const features = [
    {
      title: "Log Every Jump",
      description: "Track all key details of your training and competition jumps including pole used, approach steps, grip height, bar height, and more.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Manage Your Poles",
      description: "Store your full inventory with brand, length, flex number, weight rating, custom labels & notes.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Log Training Sessions",
      description: "Track full vault practices with session type, weather & location, session goal, energy/mood sliders, and more.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Media Uploads",
      description: "Upload video per jump for detailed analysis, attach photos or clips to full sessions, and review form visually over time.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Analytics",
      description: "Track PR progress, visualize grip height trends, see jump-quality distribution, monitor bar heights and jump volume.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Training Library",
      description: "Browse your full archive of training and meet sessions, filter by location, type, or date.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    }
  ];

  const plans = [
    {
      name: "Athlete",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      borderColor: "border-gray-300",
      price: "€8.99/month",
      yearPrice: "€75.99/year (save 30%)",
      description: "Best for vaulters who want to log everything and stay consistent.",
      features: [
        "Unlimited jump & session logging",
        "Pole inventory management",
        "Session summaries & goal tracking",
        "1 highlight video upload per session",
        "Basic PR tracker and session count",
        "Single-device sync"
      ]
    },
    {
      name: "Athlete+",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
      borderColor: "border-amber-300",
      popular: true,
      price: "€14.99/month",
      yearPrice: "€125.99/year (save 30%)",
      description: "Best for vaulters who want deep insights and full video tracking.",
      features: [
        "Everything in Athlete, plus:",
        "Upload video to each jump (30 GB/month storage)",
        "Grip height and jump-quality trend analytics",
        "Pole usage heatmaps",
        "Session comparison tools",
        "CSV export for custom tracking",
        "Multi-device sync and cloud backup",
        "Priority in-app support",
        "Feed sharing with friends (coming soon)"
      ]
    },
    {
      name: "Coach Plan",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-red-300",
      comingSoon: true,
      description: "For vault coaches managing athletes or teams.",
      features: [
        "Multi-athlete dashboards",
        "Team analytics",
        "Drill assignment",
        "Competition planning tools"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section - Changed from blue gradient to neutral dark gradient */}
        <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block bg-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                New App Release
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Pole Vault Tracker
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-200">
                Track Every Jump. Level Up Your Vault.
              </h2>
              <p className="text-lg text-gray-200">
                A powerful app for pole vaulters to log sessions, track poles, analyze performance, 
                and keep improving—built by vaulters, for vaulters.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  <Download size={20} />
                  Download Now
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 gap-2">
                  <Play size={20} />
                  Watch Demo
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

        {/* Built For Section - Already white */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Built for Every Vaulter
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Competitive pole vaulters (high school, college, pro)",
                "Pole vault coaches (individuals, schools, clubs)",
                "Parents of developing athletes",
                "Vault clubs and training centers",
                "Track & field teams with vault groups",
                "Anyone serious about improving their vault"
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
            
            <p className="text-xl text-center mt-10 max-w-3xl mx-auto text-gray-700">
              Whether you're chasing a new PR, coaching a squad, or logging reps through the season, 
              this app helps you stay on track.
            </p>
          </div>
        </section>
        
        {/* Features Section - Already gray-50 */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              What You Can Do
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Powerful features designed specifically for pole vault training and performance tracking
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="mb-4 inline-block bg-gray-100 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{index + 1}. {feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-gray-100 to-gray-200 p-6 md:p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">Coming Soon: Vault Feed & Coach Dashboard</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Share highlight videos from your session</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Post PRs, big breakthroughs, and cool moments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Coach Dashboard with team management for up to 15 athletes</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800" 
                    alt="Coach dashboard preview" 
                    className="rounded-lg shadow-lg" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Built for Performance - Changed from blue to dark gray */}
        <section className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Built for Performance
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-5 rounded-xl">
                  <h3 className="font-semibold mb-2">Platform</h3>
                  <p>Native iOS & Android app (built in React Native)</p>
                </div>
                <div className="bg-gray-700/50 p-5 rounded-xl">
                  <h3 className="font-semibold mb-2">Secure Backend</h3>
                  <p>Supabase (PostgreSQL + Auth + Storage)</p>
                </div>
                <div className="bg-gray-700/50 p-5 rounded-xl">
                  <h3 className="font-semibold mb-2">Design</h3>
                  <p>Clean, dark-mode interface with gold/blue/purple accents</p>
                </div>
                <div className="bg-gray-700/50 p-5 rounded-xl">
                  <h3 className="font-semibold mb-2">Storage</h3>
                  <p>Supabase cloud storage (video-ready)</p>
                </div>
                <div className="bg-gray-700/50 p-5 rounded-xl sm:col-span-2">
                  <h3 className="font-semibold mb-2">Privacy</h3>
                  <p>Full row-level security — only you (or your coach) can access your data</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section - Already white */}
        <section className="py-16 bg-white" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pricing — Start Free for 30 Days
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                All plans start with a 30-day free trial.
                No commitment. Cancel any time before day 30.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl border-2 ${plan.borderColor} overflow-hidden shadow-sm hover:shadow-md transition-shadow relative ${plan.popular ? 'transform md:-translate-y-4' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className={`${plan.bgColor} ${plan.textColor} p-6 text-center`}>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {!plan.comingSoon ? (
                      <>
                        <div className="mt-3">
                          <span className="text-3xl font-bold">{plan.price}</span>
                        </div>
                        <div className="text-sm mt-1">{plan.yearPrice}</div>
                      </>
                    ) : (
                      <div className="mt-3 inline-block bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        Coming Soon
                      </div>
                    )}
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
                    
                    {!plan.comingSoon ? (
                      <Button className="w-full" size="lg">
                        Start Free Trial
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" size="lg">
                        Join Waitlist
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Achievements Section - Already changing from gray-100 to white gradient */}
        <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Motivation That Builds Over Time
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Pole Vault Tracker includes Achievement Milestones to keep you engaged:
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Session Streaks",
                  desc: "Bronze, Silver, Gold achievements for consistent training",
                  icon: <Trophy className="h-10 w-10 text-amber-500" />
                },
                {
                  title: "Jump Volume",
                  desc: "Goals for 100 / 1000 logged jumps",
                  icon: <BarChart3 className="h-10 w-10 text-blue-500" />
                },
                {
                  title: "Quality Jumps",
                  desc: '"Trifecta" = 3 Great jumps in a day',
                  icon: <Trophy className="h-10 w-10 text-purple-500" />
                },
                {
                  title: "Pole Achievements",
                  desc: '"Pole Conquered" for mastering specific poles',
                  icon: <Trophy className="h-10 w-10 text-green-500" />
                },
                {
                  title: "Form & Consistency",
                  desc: '"Full Send," "Over the Top" badges for technique',
                  icon: <Trophy className="h-10 w-10 text-red-500" />
                },
                {
                  title: "Technical Milestones",
                  desc: "Grip height milestones, logging detail achievements",
                  icon: <Trophy className="h-10 w-10 text-indigo-500" />
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex gap-4 items-start">
                  <div className="rounded-full bg-gray-100 p-3">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center mt-8 text-gray-700">
              All milestones include in-app icons and encouragement to gamify your grind.
            </p>
          </div>
        </section>
        
        {/* Security Section - Changed from blue-50 to gray-50 */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-16 h-16 text-primary" />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold mb-6">
                    Safe, Secure & Athlete-First
                  </h2>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Your logs, poles, and sessions are private and encrypted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Only you and your assigned coach can access your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>All video/media is backed up and secured in the cloud</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Built with privacy-first policies in mind</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Summary Section - Changed from blue gradient to dark gray gradient */}
        <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Ready to Transform Your Vault?
              </h2>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-10">
                <h3 className="text-2xl font-semibold mb-6">Pole Vault Tracker helps you:</h3>
                
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">Log every jump and vault session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">Track pole use and performance over time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">Upload video and analyze form</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">See progress with clear, clean stats</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">Stay motivated with achievements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">Share highlights with friends and coaches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">Keep improving consistently, with purpose</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-xl mb-8">
                Start your free trial today and take control of your training.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Download size={20} />
                  Download Now
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 gap-2">
                  <Play size={20} />
                  Watch Demo
                </Button>
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PVT;
