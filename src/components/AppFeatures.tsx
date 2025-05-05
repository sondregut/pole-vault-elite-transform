
import React from 'react';
import { Button } from "@/components/ui/button";
import { Video, LineChart, MessageCircle, Calendar, FileText, ListCheck } from "lucide-react";

const AppFeatures = () => {
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

  return (
    <section className="py-20 bg-[#101827] text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Access Your Training Through Our Coaching App
            </h2>
            <p className="text-lg text-white mb-8">
              Get instant access to your personalized training program through our premium coaching app 
              designed for serious pole vaulters and athletes.
            </p>
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {feature.icon}
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
            <div className="relative w-full min-h-[650px] flex justify-center items-start p-8">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppFeatures;
