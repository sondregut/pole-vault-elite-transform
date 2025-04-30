
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type TestimonialProps = {
  quote: string;
  author: string;
  title: string;
  image: string;
  rating: number;
};

const testimonials: TestimonialProps[] = [
  {
    quote: "I've been working with Team Guttormsen for almost 10 years, and it's been a truly rewarding experience. As Sondre and Simen's younger sister, I've seen incredible improvements in my pole vaulting thanks to their personalized remote training programs.",
    author: "Sara Guttormsen",
    title: "Norwegian U20 Champion",
    image: "/testimonial-1.jpg",
    rating: 5,
  },
  {
    quote: "As a high school athlete, I was struggling to break 4 meters. After 6 months with this program, I'm consistently clearing 4.5m and improving with every meet.",
    author: "Emily Parker",
    title: "High School Athlete • +0.7m improvement",
    image: "/testimonial-2.jpg",
    rating: 5,
  },
  {
    quote: "The strength program was exactly what I needed. I've gained explosive power while maintaining flexibility, and my jumps have never felt better.",
    author: "David Reynolds",
    title: "Masters Athlete • +0.5m improvement",
    image: "/testimonial-3.jpg",
    rating: 5,
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-primary">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-primary" />
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">What Our Athletes Say</h2>
          <p className="section-subheading">
            Hear from the athletes who have transformed their performance through our coaching programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <RatingStars rating={testimonial.rating} />
                
                <blockquote className="mt-6 mb-6 text-gray-600 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center mt-auto">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
