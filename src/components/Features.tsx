
import { Video, Calendar, Users, Smartphone } from "lucide-react";

type FeatureProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const featuresList: FeatureProps[] = [
  {
    title: "Video Analysis",
    description: "Detailed breakdown of your technique with frame-by-frame analysis and personalized feedback.",
    icon: <Video className="h-6 w-6" />,
  },
  {
    title: "Custom Training Plans",
    description: "Personalized weekly training schedules based on your current level, goals, and available equipment.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "1-on-1 Coaching",
    description: "Regular Zoom sessions with your coach to discuss progress, answer questions, and adjust your training.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Mobile App Access",
    description: "Track your progress, access your training plans, and communicate with your coach on the go.",
    icon: <Smartphone className="h-6 w-6" />,
  },
];

const Feature = ({ title, description, icon }: FeatureProps) => {
  return (
    <div className="feature-card">
      <div className="icon-box">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">What You'll Get</h2>
          <p className="section-subheading">
            Our comprehensive coaching approach addresses every aspect of pole vaulting success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
