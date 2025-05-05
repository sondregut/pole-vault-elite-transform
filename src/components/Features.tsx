
import { Video, Calendar, Users, Smartphone } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Video className="text-primary text-2xl" />,
      title: "Video Analysis",
      description: "Detailed breakdown of your technique with frame-by-frame analysis and personalized feedback."
    },
    {
      icon: <Calendar className="text-primary text-2xl" />,
      title: "Custom Training Plans",
      description: "Personalized weekly training schedules based on your current level, goals, and available equipment."
    },
    {
      icon: <Users className="text-primary text-2xl" />,
      title: "1-on-1 Coaching",
      description: "Regular Zoom sessions with your coach to discuss progress, answer questions, and adjust your training."
    },
    {
      icon: <Smartphone className="text-primary text-2xl" />,
      title: "Mobile App Access",
      description: "Track your progress, access your training plans, and communicate with your coach on the go."
    }
  ];

  return null; // Returning null to effectively remove the component's rendered output
};

export default Features;
