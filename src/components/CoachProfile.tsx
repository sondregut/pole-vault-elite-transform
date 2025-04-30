
import { Award, Trophy, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const CoachProfile = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <img
              src="/coach.jpg"
              alt="Coach Sondre"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Your Coach: Sondre
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Two-time Olympian and collegiate record holder with extensive coaching experience helping athletes reach their full potential.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Olympic Finalist</h4>
                  <p className="text-gray-600">8th place finish at the Olympic Games</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Collegiate Record Holder</h4>
                  <p className="text-gray-600">6.00m personal best and 3x NCAA Champion</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Academic Excellence</h4>
                  <p className="text-gray-600">Princeton University graduate with Masters in Sports Management</p>
                </div>
              </div>
            </div>
            
            <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 mb-8">
              "My coaching philosophy is about developing complete athletes. We focus on building explosive speed, raw strength, and dynamic power, while perfecting technical execution. Every training session is designed to transform you into a more powerful, faster, and technically sound athlete."
            </blockquote>
            
            <Button>Learn More About Sondre</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachProfile;
