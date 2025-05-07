
import React from 'react';
import { Button } from "@/components/ui/button";
import { Video, LineChart, MessageCircle, Calendar, FileText, ListCheck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const AppFeatures = () => {
  const isMobile = useIsMobile();
  const features = [
    {
      icon: <Video className="text-primary text-xl" />,
      title: "HD Exercise Demonstrations",
      description: "Watch detailed exercise demos from Sondre and Simen showing perfect technique for every movement."
    },
    {
      icon: <ListCheck className="text-primary text-xl" />,
      title: "Program Tracker",
      description: "Follow your personalized program with an easy-to-use tracker that guides you through each workout session."
    },
    {
      icon: <LineChart className="text-primary text-xl" />,
      title: "Progress Tracking",
      description: "Log your weights, sets, reps, and PRs. Track your improvement with detailed analytics and progress charts."
    },
    {
      icon: <Calendar className="text-primary text-xl" />,
      title: "Workout Logging",
      description: "Record all your training sessions with detailed notes, performance metrics, and recovery feedback."
    },
    {
      icon: <MessageCircle className="text-primary text-xl" />,
      title: "Direct Coach Communication",
      description: "Message Sondre directly through the app for form checks, questions, or training adjustments."
    }
  ];

  const appImages = [
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7584-left.png",
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7585-left.png",
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7587-left.png",
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7588-left.png",
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7589-left.png",
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7590-left.png",
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7591-left.png",
    "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/trainheroic/IMG_7592-left.png",
  ];

  return (
    <section className={`py-6 md:py-20 bg-[#101827] text-white`}>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1 pt-2 lg:pt-0">
            <h2 className={`${isMobile ? 'text-lg' : 'text-3xl md:text-4xl'} font-bold text-white mb-2 lg:mb-6`}>
              Access Your Training Through Our Coaching App
            </h2>
            <p className={`${isMobile ? 'text-xs' : 'text-lg'} text-white mb-3 lg:mb-8`}>
              Get instant access to your personalized training program through our premium coaching app 
              designed for serious pole vaulters and athletes.
            </p>
            <div className={`space-y-2 lg:space-y-6 mb-3 lg:mb-8`}>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-12 h-12'} bg-blue-100 rounded-full flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <div className="ml-2 md:ml-4">
                    <h4 className={`${isMobile ? 'text-sm' : 'text-xl'} font-semibold text-white`}>{feature.title}</h4>
                    <p className={`text-white ${isMobile ? 'text-xs' : ''}`}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button className={isMobile ? 'text-xs py-1 px-2' : ''}>Apply for Coaching</Button>
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2 mb-2 lg:mb-0">
            <div className={`relative w-full ${isMobile ? 'min-h-[250px]' : 'min-h-[550px] lg:min-h-[650px]'} flex justify-center items-start`}>
              {/* App carousel */}
              <Carousel className={`w-full ${isMobile ? 'max-w-[180px]' : 'max-w-[340px]'} mx-auto`}>
                <CarouselContent>
                  {appImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-xl border border-white/10 shadow-xl">
                          <img 
                            src={image} 
                            alt={`App screenshot ${index + 1}`}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className={`left-0 text-white border-white ${isMobile ? 'w-4 h-4' : ''}`} />
                <CarouselNext className={`right-0 text-white border-white ${isMobile ? 'w-4 h-4' : ''}`} />
              </Carousel>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-blue-100/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 md:w-40 md:h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppFeatures;
