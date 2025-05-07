
import { Button } from "@/components/ui/button";
import { Award, Trophy, GraduationCap, Instagram } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const CoachProfile = () => {
  const isMobile = useIsMobile();
  
  const achievements = [
    {
      icon: <Award className="text-[#3176FF]" />,
      title: "Olympic Finalist",
      description: "8th place finish at the Olympic Games"
    },
    {
      icon: <Trophy className="text-[#3176FF]" />,
      title: "Collegiate Record Holder",
      description: "6.00m personal best and 3x NCAA Champion"
    },
    {
      icon: <GraduationCap className="text-[#3176FF]" />,
      title: "Academic Excellence",
      description: "Princeton University graduate with Masters in Sports Management"
    }
  ];

  return (
    <section className={`py-8 md:py-16 bg-gray-50`}>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10">
          <div className={`${isMobile ? 'w-2/3' : 'lg:w-1/2'}`}>
            <img
              src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre23%20jubel.jpeg"
              alt="Coach Sondre"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="mt-2 md:mt-4 flex justify-center">
              <a 
                href="https://www.instagram.com/sondre_pv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 md:gap-2 text-gray-700 hover:text-[#3176FF] transition-colors"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>@sondre_pv</span>
              </a>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-5`}>
              Meet Your Coach: Sondre
            </h2>
            <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-600 mb-3 md:mb-5`}>
              Two-time Olympian and collegiate record holder with extensive coaching experience 
              helping athletes reach their full potential.
            </p>
            <div className="space-y-2 md:space-y-4 mb-4 md:mb-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <div className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} bg-[#EBF1FF] rounded-full flex items-center justify-center`}>
                    {achievement.icon}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h4 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>{achievement.title}</h4>
                    <p className={`text-gray-600 ${isMobile ? 'text-xs' : ''}`}>{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-600 mb-4 md:mb-6`}>
              "My coaching philosophy is about developing complete athletes. We focus on building 
              explosive speed, raw strength, and dynamic power, while perfecting technical execution. 
              Every training session is designed to transform you into a more powerful, faster, 
              and technically sound athlete."
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button className={isMobile ? 'text-xs py-1' : ''} asChild>
                <Link to="/about#sondre">Learn More About Sondre</Link>
              </Button>
              <Button variant="outline" className={isMobile ? 'text-xs py-1' : ''} asChild>
                <a 
                  href="https://www.instagram.com/sondre_pv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 md:gap-2"
                >
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                  Follow on Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Instagram Embed Section */}
        {!isMobile && (
          <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t border-gray-200">
            <h3 className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-8`}>Follow Sondre on Instagram</h3>
            <div className="flex justify-center">
              <iframe
                src="https://www.instagram.com/sondre_pv/embed"
                width={isMobile ? "100%" : "500"}
                height={isMobile ? "400" : "600"}
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoachProfile;
