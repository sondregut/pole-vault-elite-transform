
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

type ProgramFeature = {
  text: string;
};

type ProgramProps = {
  title: string;
  subtitle: string;
  features: ProgramFeature[];
  price: string;
  priceDetail: string;
  image: string;
  icon: React.ReactNode;
};

const programs: ProgramProps[] = [
  {
    title: "Flight Mode: 10-Week Program",
    subtitle: "Complete 10-week program to transform your technique and performance.",
    features: [
      { text: "Structured 10-week progression" },
      { text: "Video technique library" },
      { text: "Two video analysis reviews" },
      { text: "One Zoom coaching session" },
      { text: "Standard app access" },
    ],
    price: "$59",
    priceDetail: "One-time purchase",
    image: "/program-1.jpg",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8"></path>
        <path d="M12 17V2"></path>
        <path d="M17 7 12 2 7 7"></path>
      </svg>
    ),
  },
  {
    title: "Power Strength Program",
    subtitle: "Specialized strength training to develop explosive power for vaulters.",
    features: [
      { text: "8-week strength progression" },
      { text: "Exercise video demonstrations" },
      { text: "Equipment alternatives" },
      { text: "Progress tracking tools" },
      { text: "Basic app access" },
    ],
    price: "$39",
    priceDetail: "One-time purchase",
    image: "/program-2.jpg",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.6 5.2A10.6 10.6 0 0 0 11 2a10.6 10.6 0 0 0-7.6 3.2M11 21.9a1 1 0 1 0 2 0v-.3a1 1 0 0 1 2 0v.3a1 1 0 1 0 2 0v-.3a1 1 0 0 1 2 0v.3a1 1 0 1 0 2 0V19a4 4 0 0 0-4-4h-6a4 4 0 0 0-4 4v2.9a1 1 0 1 0 2 0v-.3a1 1 0 0 1 2 0v.3Z"></path>
        <path d="M5 14.3v-2.4a6.6 6.6 0 0 1 12 0v2.4"></path>
      </svg>
    ),
  },
  {
    title: "1-on-1 Online Coaching",
    subtitle: "Personalized coaching with direct access to your dedicated coach.",
    features: [
      { text: "Custom weekly training plans" },
      { text: "Unlimited video technique analysis" },
      { text: "Bi-weekly Zoom coaching calls" },
      { text: "Daily messaging support" },
      { text: "Premium app access" },
    ],
    price: "$249/month",
    priceDetail: "Starting at",
    image: "/program-3.jpg",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
];

const Programs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Coaching Programs</h2>
          <p className="section-subheading">
            Choose the program that best fits your goals, schedule, and experience level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="overflow-hidden flex flex-col h-full">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="pb-0">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-4">
                  <div className="text-primary">{program.icon}</div>
                </div>
                <h3 className="text-2xl font-bold">{program.title}</h3>
                <p className="text-gray-600 mt-2">{program.subtitle}</p>
              </CardHeader>
              
              <CardContent className="pt-4 flex-grow">
                <ul className="space-y-3">
                  {program.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <div className="mr-3 text-primary">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-gray-600">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="flex flex-col border-t pt-6 bg-gray-50 mt-auto">
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="text-gray-600">{program.priceDetail}</span>
                  <span className="text-2xl font-bold">{program.price}</span>
                </div>
                
                <div className="flex gap-3 w-full">
                  <Button className="flex-1">
                    {index === 2 ? "Apply Now" : "Buy Now"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Learn More
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="link" className="text-primary flex items-center mx-auto">
            View all programs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Programs;
