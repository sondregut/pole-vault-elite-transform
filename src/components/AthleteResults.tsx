
import { Card, CardContent } from "@/components/ui/card";

type AthleteResult = {
  name: string;
  improvement: string;
  testimonial: string;
  status: string;
  duration: string;
  image: string;
};

const results: AthleteResult[] = [
  {
    name: "Michael Thompson",
    improvement: "+1.2m",
    testimonial: "After just 8 weeks of coaching, I improved my PR by over a meter. The technical adjustments made all the difference.",
    status: "College Athlete",
    duration: "3 months with us",
    image: "/athlete-1.jpg"
  },
  {
    name: "Sarah Johnson",
    improvement: "+0.8m",
    testimonial: "The personalized feedback on my technique videos helped me identify issues I never knew existed. Game changer!",
    status: "High School Athlete",
    duration: "6 months with us",
    image: "/athlete-2.jpg"
  },
  {
    name: "Robert Miller",
    improvement: "+0.6m",
    testimonial: "Even as a masters athlete, I was able to improve significantly. The strength program was perfectly tailored to my needs.",
    status: "Masters Athlete",
    duration: "4 months with us",
    image: "/athlete-3.jpg"
  },
];

const AthleteResults = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Athlete Results That Speak for Themselves</h2>
          <p className="section-subheading">
            Our athletes consistently improve their personal records and technique through our specialized coaching programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 overflow-hidden">
                <img
                  src={result.image}
                  alt={`${result.name} before and after`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{result.name}</h3>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {result.improvement} Improvement
                  </span>
                </div>
                <p className="text-gray-600 mb-4">"{result.testimonial}"</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{result.status} • {result.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AthleteResults;
