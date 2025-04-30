
import { Button } from "@/components/ui/button";

const CoachProfile = () => {
  const achievements = [
    {
      icon: "ri-medal-line",
      title: "Olympic Finalist",
      description: "8th place finish at the Olympic Games"
    },
    {
      icon: "ri-trophy-line",
      title: "Collegiate Record Holder",
      description: "6.00m personal best and 3x NCAA Champion"
    },
    {
      icon: "ri-graduation-cap-line",
      title: "Academic Excellence",
      description: "Princeton University graduate with Masters in Sports Management"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img
              src="/coach.jpg"
              alt="Coach Sondre"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Your Coach: Sondre
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Two-time Olympian and collegiate record holder with extensive coaching experience 
              helping athletes reach their full potential.
            </p>
            <div className="space-y-4 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-1">
                    <i className={`${achievement.icon} text-primary`}></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-lg text-gray-600 mb-8">
              "My coaching philosophy is about developing complete athletes. We focus on building 
              explosive speed, raw strength, and dynamic power, while perfecting technical execution. 
              Every training session is designed to transform you into a more powerful, faster, 
              and technically sound athlete."
            </p>
            <Button>Learn More About Sondre</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachProfile;
