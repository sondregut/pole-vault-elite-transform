
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileVideo, Clock, Search, MessageCircle, Play } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const VideoAnalysis = () => {
  const features = [
    {
      icon: <FileVideo className="text-[#3176FF]" />,
      title: "Easy Video Uploads",
      description: "Upload your jumps directly through TrainHeroic or send them via email - whatever works best for you."
    },
    {
      icon: <Search className="text-[#3176FF]" />,
      title: "Detailed Analysis",
      description: "Receive comprehensive feedback with drawn annotations, slow-motion breakdown, and specific cues for improvement."
    },
    {
      icon: <Clock className="text-[#3176FF]" />,
      title: "Quick Turnaround",
      description: "Get expert feedback within 24-48 hours so you can immediately implement technique corrections."
    },
    {
      icon: <MessageCircle className="text-[#3176FF]" />,
      title: "Follow-up Consultation",
      description: "Schedule a video call to discuss the analysis and get clarity on implementation strategies."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/4 md:w-1/3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="relative cursor-pointer group">
                  <img
                    src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//pv%20review%20.png"
                    alt="Video Analysis Demo"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="w-8 h-8 text-[#3176FF]" />
                    </div>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="p-0 w-[560px] border-none shadow-xl">
                <iframe 
                  width="560" 
                  height="315" 
                  src="https://www.youtube.com/embed/vWH7UsJTQgE?si=_hj2bq5aQ4Afk7MJ&autoplay=1" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen>
                </iframe>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="lg:w-3/4 md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Professional Video Analysis
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get detailed technique feedback through our comprehensive video analysis system. 
              Upload your jumps and receive frame-by-frame breakdown with actionable improvements.
            </p>
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-[#EBF1FF] rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button>Try Video Analysis</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAnalysis;
