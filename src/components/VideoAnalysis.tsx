
import React from 'react';
import { Button } from "@/components/ui/button";
import { Video, FileVideo, Clock, Search, MessageCircle } from "lucide-react";

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
          <div className="lg:w-1/3">
            <img
              src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//pv%20review%20.png"
              alt="Video Analysis Demo"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:w-2/3">
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
