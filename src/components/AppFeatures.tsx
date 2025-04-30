
import { Video, LineChart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppFeatures = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Access Your Training Through TrainHeroic
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Get instant access to your personalized training program through TrainHeroic - the premier training platform used by elite athletes worldwide.
            </p>
            
            <div className="space-y-8 mb-10">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">
                    HD Exercise Demonstrations
                  </h4>
                  <p className="text-gray-600">
                    Watch detailed exercise demos from Sondre and Simen showing perfect technique for every movement.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">
                    Progress Tracking
                  </h4>
                  <p className="text-gray-600">
                    Log your weights, sets, reps, and PRs. Track your improvement with detailed analytics and progress charts.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">
                    Direct Coach Communication
                  </h4>
                  <p className="text-gray-600">
                    Message Sondre directly through the app for form checks, questions, or training adjustments.
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg">Apply for Coaching</Button>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="relative w-full h-[600px] bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              
              {/* Device mockups */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background devices */}
                <div className="absolute transform -translate-x-[40%] translate-y-[5%] w-[250px]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-[38px] blur-sm"></div>
                    <img
                      src="/app-screen-1.jpg"
                      alt="TrainHeroic Exercise Library"
                      className="relative w-full h-auto rounded-[32px] border-[8px] border-gray-900 shadow-2xl transform -rotate-12"
                    />
                  </div>
                </div>
                
                <div className="absolute transform translate-x-[40%] translate-y-[5%] w-[250px]">
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
                <div className="relative w-[280px] z-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-[42px] blur-sm"></div>
                  <img
                    src="/app-screen-3.jpg"
                    alt="TrainHeroic Workout Tracking"
                    className="relative w-full h-auto rounded-[32px] border-[12px] border-gray-900 shadow-2xl"
                  />
                  
                  {/* Status bar */}
                  <div className="absolute top-[12px] left-[12px] right-[12px] h-6 flex items-center justify-between px-4 text-white text-xs">
                    <span>9:41</span>
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
