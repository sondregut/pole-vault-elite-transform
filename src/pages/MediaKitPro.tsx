import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Trophy,
  Medal,
  Award,
  GraduationCap,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  ExternalLink,
  Download,
  ChevronDown,
  Play,
  Camera,
  Handshake,
  Target,
  Zap,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

// TikTok icon component (not in lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// YouTube icon component
const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Instagram Embed Component
const InstagramEmbed = ({ url, compact = false }: { url: string; compact?: boolean }) => {
  useEffect(() => {
    // Load Instagram embed script
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  // Extract post ID from URL
  const getEmbedUrl = (postUrl: string) => {
    return `${postUrl}embed/`;
  };

  return (
    <div className="instagram-embed-container" style={{ transform: compact ? 'scale(0.85)' : 'scale(1)', transformOrigin: 'top left', width: compact ? '118%' : '100%' }}>
      <iframe
        src={getEmbedUrl(url)}
        className="w-full rounded-lg"
        style={{ minHeight: compact ? '350px' : '450px', border: 'none' }}
        allowFullScreen
        scrolling="no"
        allow="encrypted-media"
      />
    </div>
  );
};

// TikTok Embed Component
const TikTokEmbed = ({ url, compact = false }: { url: string; compact?: boolean }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  // Extract video ID from URL
  const getVideoId = (tiktokUrl: string) => {
    const match = tiktokUrl.match(/video\/(\d+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(url);

  return (
    <div className="tiktok-embed-container" style={{ transform: compact ? 'scale(0.75)' : 'scale(1)', transformOrigin: 'top left', width: compact ? '133%' : '100%' }}>
      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}`}
        className="w-full rounded-lg"
        style={{ minHeight: compact ? '500px' : '740px', border: 'none' }}
        allowFullScreen
        scrolling="no"
        allow="encrypted-media"
      />
    </div>
  );
};

// Declare Instagram global
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

// Sponsor data structure
interface SponsorData {
  name: string;
  logo?: string;
  period: string;
  status: "current" | "previous";
  description: string;
  deliverables: string[];
  instagramPosts: string[]; // URLs to embed
  tiktokPosts?: string[]; // TikTok URLs to embed
  color: string;
}

const MediaKitPro = () => {
  const [activeSection, setActiveSection] = useState<string>("about");

  // Placeholder sponsor data - user will provide actual logos and Instagram URLs
  const sponsors: SponsorData[] = [
    {
      name: "adidas x Norway x Sondre",
      logo: "/sponsors/Adidas_Logo.svg",
      period: "2023 - Present",
      status: "current",
      description: "Official athletic apparel and footwear partner. Featured in global campaigns including the Norway x adidas World Championships collection.",
      deliverables: [
        "Social media content creation",
        "Product showcases & launches",
        "Competition appearances",
        "Brand ambassador activities",
        "World Championships collection feature"
      ],
      instagramPosts: [
        "https://www.instagram.com/p/CuuK1p8IXVa/",
        "https://www.instagram.com/p/DN2Z8zV0IlZ/"
      ],
      color: "#000000"
    },
    {
      name: "Powerade",
      logo: "/sponsors/powerade.png",
      period: "2024 - Present",
      status: "current",
      description: "Official hydration partner supporting peak athletic performance through competition and training.",
      deliverables: [
        "Social media content creation",
        "Competition hydration features",
        "Training day content",
        "TikTok campaigns",
        "Brand ambassador activities"
      ],
      instagramPosts: [
        "https://www.instagram.com/reel/DJ4mZTVxRQU/",
        "https://www.instagram.com/reel/DRKhvJRERmc/",
        "https://www.instagram.com/reel/DHs8DC-xXPP/",
        "https://www.instagram.com/reel/DLFWTWJoHwR/"
      ],
      tiktokPosts: [
        "https://www.tiktok.com/@sondre_pv/video/7496604192916770091"
      ],
      color: "#004B93"
    },
    {
      name: "Recharge Health (FlexBeam)",
      logo: "/sponsors/rechargehealth.jpeg",
      period: "2024",
      status: "previous",
      description: "Infrared therapy device partnership promoting athlete recovery and wellness through innovative technology.",
      deliverables: [
        "Product review content",
        "Recovery routine features",
        "TikTok campaign",
        "Story takeovers"
      ],
      instagramPosts: [],
      tiktokPosts: [
        "https://www.tiktok.com/@sondre_pv/video/7330661927208717610",
        "https://www.tiktok.com/@sondre_pv/video/7342900618022997290"
      ],
      color: "#4CAF50"
    },
    {
      name: "ReAthlete",
      logo: "/sponsors/reathlete.png",
      period: "2021",
      status: "previous",
      description: "Recovery equipment partnership showcasing massage and recovery tools for athletes.",
      deliverables: [
        "Product demonstrations",
        "Training recovery content",
        "Testimonial videos"
      ],
      instagramPosts: [
        "https://www.instagram.com/reel/C7C0wX2yBHy/"
      ],
      color: "#FF5722"
    },
    {
      name: "Bassengutstyr Norway",
      logo: "/sponsors/bassengutstyr.jpeg",
      period: "2022",
      status: "previous",
      description: "Norwegian sauna and wellness equipment partnership promoting recovery through heat therapy.",
      deliverables: [
        "Lifestyle content",
        "Recovery routine features",
        "Norwegian market reach"
      ],
      instagramPosts: [
        "https://www.instagram.com/reel/C_aJA29IPqI/",
        "https://www.instagram.com/p/DAtVz8dRVIi/"
      ],
      color: "#2196F3"
    }
  ];

  const achievements = [
    { category: "Olympics", items: [
      { title: "Paris 2024 Olympics", result: "8th Place", icon: Medal },
      { title: "Tokyo 2020 Olympics", result: "Participant", icon: Medal }
    ]},
    { category: "European Championships", items: [
      { title: "European Indoor Champion", result: "Gold Medal", year: "2023", icon: Trophy }
    ]},
    { category: "World Championships", items: [
      { title: "World Championships Outdoor", result: "10th Place", year: "2022", icon: Award },
      { title: "World Championships Indoor", result: "8th Place", year: "2022", icon: Award }
    ]},
    { category: "Records", items: [
      { title: "Norwegian Indoor Record", result: "6.00m (19'8.25\")", icon: Zap },
      { title: "Norwegian Outdoor Record", result: "5.90m", year: "2023", icon: Zap }
    ]},
    { category: "NCAA", items: [
      { title: "NCAA Champion", result: "3x Champion", icon: Trophy },
      { title: "Collegiate Record Holder", result: "6.00m", icon: Star }
    ]},
    { category: "Diamond League", items: [
      { title: "Diamond League Final", result: "2nd Place", year: "2022", icon: Medal },
      { title: "World Ranking", result: "#5 in World", year: "2022", icon: TrendingUp }
    ]}
  ];

  const socialPlatforms = [
    {
      name: "Instagram",
      handle: "@sondre_pv",
      followers: "101K",
      icon: Instagram,
      url: "https://instagram.com/sondre_pv",
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"
    },
    {
      name: "TikTok",
      handle: "@sondre_pv",
      followers: "274K",
      icon: TikTokIcon,
      url: "https://tiktok.com/@sondre_pv",
      color: "bg-black"
    },
    {
      name: "Twitter / X",
      handle: "@sondre_pv",
      followers: "582",
      icon: Twitter,
      url: "https://twitter.com/sondre_pv",
      color: "bg-black"
    },
    {
      name: "YouTube",
      handle: "@Sondre_pv",
      followers: "23.5K",
      icon: YouTubeIcon,
      url: "https://www.youtube.com/channel/UCVOPLZvdN1wSG0whMjJ6mXA",
      color: "bg-red-600"
    },
    {
      name: "LinkedIn",
      handle: "Sondre Guttormsen",
      followers: "Professional Network",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/sondre-guttormsen-803b8619b",
      color: "bg-[#0A66C2]"
    }
  ];

  const galleryImages = [
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20adidas.jpg", caption: "Adidas Partnership", category: "Sponsor" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre23%20jubel.jpeg", caption: "European Championship Victory", category: "Competition" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20norway%20get%20ready%20pic.png", caption: "Competition Ready", category: "Competition" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//flight%20mode.jpeg", caption: "Mid-Vault Flight", category: "Action" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//weights.jpeg", caption: "Strength Training", category: "Training" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg", caption: "Coaching Session", category: "Lifestyle" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//training.jpg", caption: "Training Session", category: "Training" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20and%20simen.jpg", caption: "Team Guttormsen", category: "Lifestyle" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Screenshot%202025-05-03%20at%202.46.16%20PM.png", caption: "Professional Headshot", category: "Headshot" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//dad%20simen%20sondre.JPG", caption: "Guttormsen Family", category: "Lifestyle" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//tempo%202.PNG", caption: "Technique Analysis", category: "Training" },
    { src: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//zoom%20.jpg", caption: "Media Interview", category: "Media" }
  ];

  const partnershipTypes = [
    {
      title: "Brand Ambassador",
      description: "Long-term partnership representing your brand across competitions, social media, and events",
      icon: Handshake
    },
    {
      title: "Social Media Campaigns",
      description: "Authentic content creation across Instagram, TikTok, Twitter reaching 400K+ followers",
      icon: Share2
    },
    {
      title: "Product Endorsements",
      description: "Genuine product showcases integrated into training and competition content",
      icon: Star
    },
    {
      title: "Event Appearances",
      description: "Speaking engagements, meet & greets, and promotional appearances",
      icon: Users
    },
    {
      title: "Content Creation",
      description: "Professional video and photo content for brand use",
      icon: Camera
    },
    {
      title: "Athlete Consultation",
      description: "Product development feedback and athlete insights",
      icon: Target
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <span className="font-bold text-xl text-primary-dark">SG Media Kit</span>
            <div className="hidden md:flex items-center gap-6">
              {["about", "social", "sponsors", "press", "media", "achievements", "gallery", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium capitalize transition-colors ${
                    activeSection === section ? "text-primary" : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="w-full relative py-24 md:py-32 text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.85)), url('https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hero%20section%20image.jpg')`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
            {/* Profile Image */}
            <div className="relative">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20adidas.jpg"
                alt="Sondre Guttormsen"
                className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover border-4 border-white shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                6.00m PR
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-left flex-1">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                Available for Partnerships
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-3">Sondre Guttormsen</h1>
              <h2 className="text-xl md:text-2xl font-medium mb-4 text-white/90">Olympic Pole Vaulter</h2>
              <p className="text-lg md:text-xl mb-6 text-white/80">
                2x Olympian | European Champion | Norwegian Record Holder
              </p>

              {/* Social Icons */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <a href="https://instagram.com/sondre_pv" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://tiktok.com/@sondre_pv" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/sondre_pv" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/sondre-guttormsen-803b8619b" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  onClick={() => scrollToSection('contact')}
                  className="bg-white text-black hover:bg-gray-100 font-semibold px-8"
                >
                  Partner With Me
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-black bg-white hover:bg-gray-100 px-8"
                  onClick={() => scrollToSection('sponsors')}
                >
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </header>

      {/* Quick Stats Banner */}
      <section className="bg-primary-dark text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold">6.00m</div>
              <div className="text-sm text-white/70">Personal Best</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">2x</div>
              <div className="text-sm text-white/70">Olympian</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">European</div>
              <div className="text-sm text-white/70">Champion</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">400K+</div>
              <div className="text-sm text-white/70">Social Following</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">3x</div>
              <div className="text-sm text-white/70">NCAA Champion</div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* About Section */}
        <section id="about" className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">About Sondre</h2>
            <p className="text-gray-500 text-center mb-8">The story behind the athlete</p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-4 text-primary-dark">The Athlete</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    I am a two-time Olympian proudly representing Norway in the pole vault. As a dual citizen of Norway and the United States, I bring a unique global perspective to everything I do.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    My greatest achievements include an 8th place finish at the Paris Olympics, winning the European Championship in 2023, and becoming the Norwegian record holder with a height of 6 meters.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-4 text-primary-dark">The Creator</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Beyond competition, I am an active content creator sharing training tips, competition insights, and behind-the-scenes moments with my 400K+ followers across platforms.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    I graduated from Princeton University and earned a Master's in Sport Management from UT Austin, bringing professionalism and strategic thinking to every partnership.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Key Differentiators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Globe, label: "Dual Citizen", sublabel: "Norway & USA" },
                { icon: GraduationCap, label: "Ivy League", sublabel: "Princeton Grad" },
                { icon: Users, label: "400K+", sublabel: "Social Reach" },
                { icon: Trophy, label: "Elite Athlete", sublabel: "World Top 10" }
              ].map((item, idx) => (
                <Card key={idx} className="border border-gray-100 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 text-center">
                    <item.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.sublabel}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section id="social" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Social Media Presence</h2>
          <p className="text-gray-500 text-center mb-8">Authentic engagement across platforms</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {socialPlatforms.map((platform, idx) => (
              <a
                key={idx}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                  <div className={`${platform.color} p-4 text-white`}>
                    <platform.icon className="w-8 h-8" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{platform.name}</h3>
                    <p className="text-gray-600 text-sm">{platform.handle}</p>
                    <p className="text-primary font-bold text-xl mt-2">{platform.followers}</p>
                    <p className="text-xs text-gray-400">followers</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

        </section>

        {/* Sponsorship Portfolio Section */}
        <section id="sponsors" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Sponsorship Portfolio</h2>
          <p className="text-gray-500 text-center mb-8">Trusted by leading brands in sports and wellness</p>

          {sponsors.map((sponsor, idx) => (
            <Card key={idx} className={`mb-8 border-0 shadow-lg overflow-hidden ${sponsor.status === 'current' ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex flex-col lg:flex-row">
                {/* Sponsor Info */}
                <div className="lg:w-1/3 p-8 bg-gray-50">
                  <div className="flex items-center gap-4 mb-4">
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="h-12 object-contain" />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: sponsor.color }}
                      >
                        {sponsor.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-xl">{sponsor.name}</h3>
                      <p className="text-gray-500 text-sm">{sponsor.period}</p>
                    </div>
                  </div>

                  {sponsor.status === 'current' && (
                    <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
                      Current Partner
                    </Badge>
                  )}

                  <p className="text-gray-600 mb-4">{sponsor.description}</p>

                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Deliverables:</h4>
                  <ul className="space-y-1">
                    {sponsor.deliverables.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Content Examples */}
                <div className="lg:w-2/3 p-8">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Content Examples
                  </h4>

                  {(sponsor.instagramPosts.length > 0 || (sponsor.tiktokPosts && sponsor.tiktokPosts.length > 0)) ? (
                    <div className="space-y-4">
                      {/* Instagram Posts - Carousel for 4+ posts, grid for fewer */}
                      {sponsor.instagramPosts.length > 0 && (
                        sponsor.instagramPosts.length >= 4 ? (
                          // Carousel for 4 or more posts
                          <div className="px-12">
                            <Carousel
                              opts={{
                                align: "start",
                                loop: true,
                              }}
                              className="w-full"
                            >
                              <CarouselContent className="-ml-2">
                                {sponsor.instagramPosts.map((postUrl, i) => (
                                  <CarouselItem key={i} className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                    <div className="rounded-lg overflow-hidden h-[320px]">
                                      <InstagramEmbed url={postUrl} compact />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="-left-10" />
                              <CarouselNext className="-right-10" />
                            </Carousel>
                          </div>
                        ) : (
                          // Grid for fewer than 4 posts
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {sponsor.instagramPosts.map((postUrl, i) => (
                              <div key={i} className="rounded-lg overflow-hidden h-[320px]">
                                <InstagramEmbed url={postUrl} compact />
                              </div>
                            ))}
                          </div>
                        )
                      )}
                      {/* TikTok Posts */}
                      {sponsor.tiktokPosts && sponsor.tiktokPosts.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <TikTokIcon className="w-5 h-5" />
                            <span className="text-sm font-medium text-gray-600">TikTok Content</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {sponsor.tiktokPosts.map((postUrl, i) => (
                              <div key={i} className="rounded-lg overflow-hidden h-[400px]">
                                <TikTokEmbed url={postUrl} compact />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Instagram className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 text-sm">
                        Content examples coming soon
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* Press & Articles Section */}
        <section id="press" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Press & Articles</h2>
          <p className="text-gray-500 text-center mb-8">Featured in major publications worldwide</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[
              {
                title: "Guttormsen Takes Sixth in Pole Vault at World Athletics Championships",
                source: "Princeton Tigers",
                url: "https://goprincetontigers.com/news/2025/9/16/mens-track-and-field-sondre-guttormsen-23-takes-sixth-in-pole-vault-at-world-athletics-championships",
                color: "bg-orange-500"
              },
              {
                title: "Sondre Guttormsen: Norway's Six-Metre Pole Vaulter",
                source: "World Athletics",
                url: "https://worldathletics.org/news/feature/sondre-guttormsen-norway-pole-vault-six-metres",
                color: "bg-blue-600"
              },
              {
                title: "Coronavirus Delays UCLA Pole Vaulter's Olympic Dream",
                source: "Daily News",
                url: "https://www.dailynews.com/2020/04/04/coronavirus-delays-ucla-pole-vaulter-sondre-guttormsens-olympic-dream/",
                color: "bg-red-600"
              },
              {
                title: "Norwegian Pole Vault Duo Could Lead Historic Season",
                source: "Princeton Alumni Weekly",
                url: "https://paw.princeton.edu/article/norwegian-pole-vault-duo-could-lead-historic-season",
                color: "bg-orange-600"
              },
              {
                title: "The Guttormsen Brothers: Track and Field Feature",
                source: "Daily Princetonian",
                url: "https://www.dailyprincetonian.com/article/2023/02/princeton-tigers-track-and-field-guttormsen-brothers",
                color: "bg-black"
              },
              {
                title: "The Guttormsen Brothers and the Crazy Event They've Mastered",
                source: "Princeton Tigers",
                url: "https://goprincetontigers.com/news/2023/3/9/mens-track-and-field-feature-story-the-guttormsen-brothers-and-the-crazy-event-they-ve-mastered",
                color: "bg-orange-500"
              },
              {
                title: "Guttormsen Brøt Magisk Stavsprang-Grense",
                source: "TV2 Norway",
                url: "https://www.tv2.no/sport/guttormsen-brot-magisk-stavsprang-grense/15572984/",
                color: "bg-red-700"
              }
            ].map((article, idx) => (
              <a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`${article.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{article.source}</p>
                        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-2 text-primary text-xs">
                          <span>Read article</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* Media & Documentaries Section */}
        <section id="media" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Media & Documentaries</h2>
          <p className="text-gray-500 text-center mb-8">Featured in podcasts, interviews, and documentary films</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Glimpse Film Documentary */}
            <Card className="border-0 shadow-lg overflow-hidden group">
              <a
                href="https://www.youtube.com/watch?v=OLgyPpLoIDA"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={`https://img.youtube.com/vi/OLgyPpLoIDA/maxresdefault.jpg`}
                    alt="Glimpse Film Mini Documentary"
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge className="mb-2 bg-red-100 text-red-700">Documentary</Badge>
                  <h3 className="font-bold text-lg">Glimpse Film Mini Documentary</h3>
                  <p className="text-gray-500 text-sm mt-1">Behind the scenes look at Sondre's journey</p>
                </CardContent>
              </a>
            </Card>

            {/* Princeton Documentary */}
            <Card className="border-0 shadow-lg overflow-hidden group">
              <a
                href="https://www.youtube.com/watch?v=3JwW1Re6Dek"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={`https://img.youtube.com/vi/3JwW1Re6Dek/maxresdefault.jpg`}
                    alt="Princeton Documentary"
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge className="mb-2 bg-orange-100 text-orange-700">Princeton Athletics</Badge>
                  <h3 className="font-bold text-lg">Princeton Documentary</h3>
                  <p className="text-gray-500 text-sm mt-1">Sondre's collegiate career at Princeton University</p>
                </CardContent>
              </a>
            </Card>

            {/* Podcast / Media Feature */}
            <Card className="border-0 shadow-lg overflow-hidden group">
              <a
                href="https://www.youtube.com/watch?v=LyTUOgh5FsM"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={`https://img.youtube.com/vi/LyTUOgh5FsM/maxresdefault.jpg`}
                    alt="Podcast Interview"
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge className="mb-2 bg-purple-100 text-purple-700">Podcast</Badge>
                  <h3 className="font-bold text-lg">Podcast Interview</h3>
                  <p className="text-gray-500 text-sm mt-1">In-depth conversation about training and competition</p>
                </CardContent>
              </a>
            </Card>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Athletic Achievements</h2>
          <p className="text-gray-500 text-center mb-8">A track record of excellence</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {achievements.map((category, idx) => (
              <Card key={idx} className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-primary font-bold">{item.result}</p>
                          {'year' in item && <p className="text-xs text-gray-400">{item.year}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Audience Demographics */}
        <section className="mb-20 bg-gray-50 -mx-4 px-4 py-16 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Audience Insights</h2>
            <p className="text-gray-500 text-center mb-8">Understanding who follows Sondre</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">Geographic Reach</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">United States</span>
                      <span className="font-medium">30.6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">India</span>
                      <span className="font-medium">8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brazil</span>
                      <span className="font-medium">6.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Norway</span>
                      <span className="font-medium">4.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">United Kingdom</span>
                      <span className="font-medium">2.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">Demographics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age 18-24</span>
                      <span className="font-medium">31.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age 13-17</span>
                      <span className="font-medium">29.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age 25-34</span>
                      <span className="font-medium">24.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Men</span>
                      <span className="font-medium">67.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Women</span>
                      <span className="font-medium">32.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">Engagement</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Activity</span>
                      <span className="font-medium text-green-600">+22.6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Visits</span>
                      <span className="font-medium">11.5K/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Reel Views</span>
                      <span className="font-medium">903K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Video Views</span>
                      <span className="font-medium">300K+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section id="gallery" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Photo Gallery</h2>
          <p className="text-gray-500 text-center mb-8">High-resolution images available for media use</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {galleryImages.map((image, idx) => (
              <Card key={idx} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all group cursor-pointer">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Badge className="mb-2 bg-white/20 text-white text-xs">{image.category}</Badge>
                      <p className="text-white text-sm font-medium">{image.caption}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Request High-Res Downloads
            </Button>
          </div>
        </section>

        {/* Partnership Opportunities */}
        <section id="partnership" className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark text-center">Partnership Opportunities</h2>
          <p className="text-gray-500 text-center mb-8">Let's create something amazing together</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {partnershipTypes.map((type, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <type.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-12">
          <Card className="max-w-3xl mx-auto border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-dark to-primary p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Let's Work Together</h2>
              <p className="text-white/80">Ready to partner with an Olympic athlete?</p>
            </div>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-primary-dark">Contact Information</h3>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href="mailto:sondre@stavhopp.no" className="font-medium hover:text-primary transition-colors">
                        sondre@stavhopp.no
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href="tel:+14245358644" className="font-medium hover:text-primary transition-colors">
                        +1 424-535-8644
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a href="https://www.stavhopp.no" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">
                        www.stavhopp.no
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-primary-dark">Social Media</h3>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://instagram.com/sondre_pv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                    <a
                      href="https://tiktok.com/@sondre_pv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      <TikTokIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">TikTok</span>
                    </a>
                    <a
                      href="https://twitter.com/sondre_pv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="text-sm font-medium">Twitter</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sondre-guttormsen-803b8619b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => window.location.href = 'mailto:sondre@stavhopp.no?subject=Partnership Inquiry'}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Partnership Inquiry
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Sondre Guttormsen. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Media Kit | For partnership inquiries contact sondre@stavhopp.no
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MediaKitPro;
