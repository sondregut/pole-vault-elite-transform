
import React from 'react';
import { Button } from "@/components/ui/button";

const AppFeatures = () => {
  const features = [
    {
      icon: "ri-video-line",
      title: "HD Exercise Demonstrations",
      description: "Watch detailed exercise demos from Sondre and Simen showing perfect technique for every movement."
    },
    {
      icon: "ri-line-chart-line",
      title: "Progress Tracking",
      description: "Log your weights, sets, reps, and PRs. Track your improvement with detailed analytics and progress charts."
    },
    {
      icon: "ri-message-3-line",
      title: "Direct Coach Communication",
      description: "Message Sondre directly through the app for form checks, questions, or training adjustments."
    }
  ];

  return (
    <section className="py-20 bg-[#101827] text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Access Your Training Through TrainHeroic
            </h2>
            <p className="text-lg text-white mb-8">
              Get instant access to your personalized training program through TrainHeroic - 
              the premier training platform used by elite athletes worldwide.
            </p>
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className={`${feature.icon} text-primary text-xl`}></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                    <p className="text-white">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button>Apply for Coaching</Button>
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="relative w-full min-h-[700px] bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              
              {/* Device mockups */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background devices */}
                <div className="absolute transform -translate-x-[45%] translate-y-[5%] w-[260px]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-[38px] blur-sm"></div>
                    <img
                      src="/app-screen-1.jpg"
                      alt="TrainHeroic Exercise Library"
                      className="relative w-full h-auto rounded-[32px] border-[8px] border-gray-900 shadow-2xl transform -rotate-12"
                    />
                  </div>
                </div>
                <div className="absolute transform translate-x-[45%] translate-y-[5%] w-[260px]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-[38px] blur-sm"></div>
                    <img
                      src="/app-screen-2.jpg"
                      alt="TrainHeroic Progress Tracking"
                      className="relative w-full h-auto rounded-[32px] border-[8px] border-gray-900 shadow-2xl transform rotate-12"
                    />
                  </div>
                </div>
                
                {/* Main device */}
                <div className="relative w-[300px] z-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-[42px] blur-sm"></div>
                  <img
                    src="/app-screen-3.jpg"
                    alt="TrainHeroic Workout Tracking"
                    className="relative w-full h-auto rounded-[32px] border-[12px] border-gray-900 shadow-2xl"
                  />
                  {/* Status bar */}
                  <div className="absolute top-[12px] left-[12px] right-[12px] h-6 flex items-center justify-between px-4">
                    <span className="text-white text-xs">9:41</span>
                    <div className="flex items-center space-x-1">
                      <i className="ri-signal-wifi-line text-white text-xs"></i>
                      <i className="ri-battery-line text-white text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppFeatures;
