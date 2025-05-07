
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileVideo, Clock, Search, MessageCircle, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const VideoAnalysis = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: <FileVideo className="text-primary text-xl" />,
      title: "Easy Video Uploads",
      description: "Upload your jumps directly through the Onform app or send them via text - whatever works best for you."
    },
    {
      icon: <Search className="text-primary text-xl" />,
      title: "Detailed Analysis",
      description: "Receive comprehensive feedback with drawn annotations, slow-motion breakdown, and specific cues for improvement."
    },
    {
      icon: <Clock className="text-primary text-xl" />,
      title: "Quick Turnaround",
      description: "Get expert feedback that helps you immediately implement technique corrections."
    },
    {
      icon: <MessageCircle className="text-primary text-xl" />,
      title: "Follow-up Consultation",
      description: "Schedule a video call to discuss technique or the overall training program."
    }
  ];

  return (
    <section className="py-6 md:py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-12">
          <div className="lg:w-1/4 md:w-1/3 order-2 lg:order-1">
            <div className="relative cursor-pointer rounded-lg shadow-lg w-full overflow-hidden">
              <HoverCard openDelay={0} closeDelay={300}>
                <HoverCardTrigger asChild>
                  <div className="relative group">
                    <img
                      src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//pv%20review%20.png"
                      alt="Video Analysis Demo"
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="p-0 border-none shadow-xl w-auto" side="right">
                  <div className="w-full h-full rounded-lg overflow-hidden" style={{ width: "100%", minWidth: "300px" }}>
                    <iframe 
                      width="100%" 
                      height="auto"
                      style={{ aspectRatio: "16/9" }}
                      src="https://www.youtube.com/embed/vWH7UsJTQgE?si=_hj2bq5aQ4Afk7MJ&autoplay=1" 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen>
                    </iframe>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          <div className="lg:w-3/4 md:w-2/3 order-1 lg:order-2">
            <h2 className={`${isMobile ? 'text-lg' : 'text-3xl md:text-4xl'} font-bold mb-2 lg:mb-6`}>
              Professional Video Analysis
            </h2>
            <p className={`${isMobile ? 'text-xs' : 'text-lg'} mb-3 lg:mb-8`}>
              Get detailed technique feedback through our comprehensive video analysis system. 
              Upload your jumps and receive frame-by-frame breakdown with actionable improvements.
            </p>
            <div className={`space-y-2 lg:space-y-6 mb-3 lg:mb-8`}>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-12 h-12'} bg-blue-100 rounded-full flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <div className="ml-2 md:ml-4">
                    <h4 className={`${isMobile ? 'text-sm' : 'text-xl'} font-semibold`}>{feature.title}</h4>
                    <p className={`${isMobile ? 'text-xs' : ''}`}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild className={isMobile ? 'text-xs py-1 px-2' : ''}>
              <Link to="/shop/product/5">Try Video Analysis</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAnalysis;
