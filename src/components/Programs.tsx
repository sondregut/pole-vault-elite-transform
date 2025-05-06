import { Button } from "@/components/ui/button";
import { Check, Plane, Dumbbell, UserRound, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Programs = () => {
  const programs = [
    {
      title: "Flight Mode: 10-Week Program",
      subtitle: "Complete 10-week program to transform your technique and performance.",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//flight%20mode.jpeg",
      icon: <Plane className="text-primary text-xl" />,
      features: [
        "Structured 10-week progression",
        "Video technique library",
        "Two video analysis reviews",
        "One Zoom coaching session",
        "Standard app access"
      ],
      price: "$59",
      priceDetail: "One-time purchase",
      buyNowLink: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1733159932",
      learnMoreLink: "https://marketplace.trainheroic.com/workout-plan/program/guttormsen-program-1733159932?attrib=591046-web"
    },
    {
      title: "Power Strength Program",
      subtitle: "Specialized strength training to develop explosive power for vaulters.",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//weights.jpeg",
      icon: <Dumbbell className="text-primary text-xl" />,
      features: [
        "8-week strength progression",
        "Exercise video demonstrations",
        "Equipment alternatives",
        "Progress tracking tools",
        "Basic app access"
      ],
      price: "$39",
      priceDetail: "One-time purchase",
      buyNowLink: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1735674214",
      learnMoreLink: "https://marketplace.trainheroic.com/workout-plan/program/guttormsen-program-1735674214?attrib=591046-web"
    },
    {
      title: "1-on-1 Online Coaching",
      subtitle: "Personalized coaching with direct access to your dedicated coach.",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg",
      icon: <UserRound className="text-primary text-xl" />,
      features: [
        "Custom weekly training plans",
        "Unlimited video technique analysis",
        "Bi-weekly Zoom coaching calls",
        "Daily messaging support",
        "Premium app access"
      ],
      price: "$249/month",
      priceDetail: "Starting at",
      applyNowLink: "https://docs.google.com/forms/d/e/1FAIpQLSdcVhfxGSURY6myn9TsDFcfndfbg2hcivdYtsnKmjHsXzwmsw/viewform"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Coaching Programs
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Starting at $299/month
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-white rounded shadow-md overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {program.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{program.title}</h3>
                <p className="text-gray-600 mt-2">{program.subtitle}</p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  {program.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">{program.priceDetail}</span>
                  <span className="text-2xl font-bold text-gray-900">{program.price}</span>
                </div>
                <div className="flex gap-2">
                  {index === 2 ? (
                    <Button className="flex-1" asChild>
                      <a href={program.applyNowLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
                    </Button>
                  ) : (
                    <Button className="flex-1" asChild>
                      <a href={program.buyNowLink} target="_blank" rel="noopener noreferrer">Buy Now</a>
                    </Button>
                  )}
                  
                  {index !== 2 && (
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={program.learnMoreLink} target="_blank" rel="noopener noreferrer">Learn More</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/shop" className="text-primary font-medium hover:text-blue-700 flex items-center justify-center gap-2">
            View all programs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;
