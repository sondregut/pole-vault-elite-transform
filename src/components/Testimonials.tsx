
import { Star, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    skipSnaps: false
  });

  const testimonials = [
    {
      quote: "I've been working with Team Guttormsen for almost 10 years, and it's been a truly rewarding experience. As Sondre and Simen's younger sister, I've seen incredible improvements in my pole vaulting thanks to their personalized remote training programs. Even after moving to the US for college, they've tailored everything to fit my needs. Their ongoing support, combined with the technique coaching from our father, Atle, has been key to my progress. I'm proud to be part of this team and highly recommend their coaching to anyone looking to take their pole vaulting to the next level.",
      author: "Sara Guttormsen",
      title: "Norwegian U20 Champion",
      subtitle: "A key to my progress",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Sara.png",
    },
    {
      quote: "Back in early 2023, I broke my back hyperextending it and didn't know if I would ever pole vault again. Once I found Team Guttormsen they were at my side, step by step, educating me on how to work through a fractured back. This gave me the confidence I needed to see myself back on the runway. They taught me how to stop my injury from happening again. They gave me specific workout programs, drills, and stretches tailored to my body's movement, taking into account my current and past injuries. One of my biggest issues was taking off with poor posture. This was a three-year problem, and with video analysis from Sondre and the Team Guttormsen, I have significantly improved my technique. Team Guttormsen took me from an all-time low to achieving a new personal best! Thanks to the experiences and wisdom of Team Guttormsen, I am a safer vaulter and better athlete.",
      author: "Owen Anderson",
      title: "Collegiate D1 Athlete",
      subtitle: "From all-time low to PR",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Owen.png",
    },
    {
      quote: "As a master's vaulter, working with Sondre on a program that fit my training schedule was incredibly valuable. Sondre was open to all of my feedback on training regarding volume, intensity, and navigating training around an always-changing work schedule, which was so helpful. Additionally, the video reviews were detailed and really helped me make technical changes. With 1:1 training I was also able to get recommendations on all types of drills both on and off the runway to work on the pole vault.",
      author: "Andy Jung",
      title: "Masters Vaulter, Coach at UNCW",
      subtitle: "Incredibly valuable",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Andy.png",
    },
    {
      quote: "I purchased the 3-month training program over the summer of 2024, which also happened to be an Olympic year for Sondre, but that did not affect the training provided. He was always available for questions and concerns on training or technique. The training was tailored to me specifically and had me feeling strong and fast while recovering from injuries! The video reviews were in depth and had great suggestions that elevated my technique. Overall, Sondre provided far more value than I paid for, and it was a great experience!",
      author: "Garrett Lynch",
      title: "Collegiate Pole Vaulter",
      subtitle: "Sondre provided far more value than I paid for",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Garrett%20(1).png",
    },
    {
      quote: "Sondre's coaching has been so helpful in my journey as a pole vaulter. In the two months I worked with Sondre over the summer, I added over a foot to my jump. With every video review, Sondre gave me 1-2 helpful cues to focus on for the next session, which greatly helped refine my jumps. I would recommend his coaching to any athlete who wants to take their training seriously and get to the next level.",
      author: "Gabriel Thai",
      title: "Brown Track & Field",
      subtitle: "Added over a foot to my jump in 2 months",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Gabriel.png",
    },
    {
      quote: "As a freshman at a small college trying to maximize my potential with no coach or consistent training program, I had to find a way to get better. I took a risk and reached out to Sondre for help. He responded with excitement and enthusiasm to help me get on the right path. As a coach, Sondre immediately gave me queues to fix my technique, helpful running and vaulting drills, and even a training program to get faster and stronger off the runway. Sondre's coaching was exactly what I needed to greatly improve my vault and hit higher PRs. With Sondre's help, I was able to improve enough to transfer out and find great success in a reputable Big Ten pole vault program.",
      author: "Noah",
      title: "Rutgers Track & Field Pole Vaulter",
      subtitle: "Exactly what I needed to PR",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Noah%20(1).png",
    },
    {
      quote: "As a decathlete at Princeton University, I was fortunate enough to be coached by Sondre Guttormsen. As a dual-sport athlete balancing football and track, I didn't have much time to prepare for the indoor season after coming off the football season. Despite the limited training time, Sondre helped me improve my pole vault from 4.60m (15ft) to 4.90m (16ft), which played a key role in my overall victory at the Ivy League Championship. Sondre also guided me through the indoor NCAA finals, where I placed 4th overall in the decathlon. His expertise and dedication were instrumental in my success, and I couldn't have achieved these results without his support.",
      author: "Andrei Iosivas",
      title: "Former D1 All-American Decathlete, NFL Wide Receiver",
      subtitle: "Improved from 15 to 16 feet",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Andrei.png",
    },
    {
      quote: "Sondre's knowledge of pole vault technique, biomechanics, and cutting edge training methods to increase sprint speed and reduce injury risk has benefitted me significantly the past few years training not only for pole vault but for sprints and hurdles as well. Sondre is super receptive to each athlete's needs and extremely empathetic to the challenges they face. You will not find better for online coaching in track and field!",
      author: "August Kiles",
      title: "Princeton Alum, PR: 5.42m",
      subtitle: "Sondre is super receptive to each athlete's needs",
      image: "https://images.sidearmdev.com/resize?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fprinceton.sidearmsports.com%2Fimages%2F2017%2F1%2F29%2FKiles_HEPS_Sat128.jpg&height=1100&type=webp",
    },
  ];

  const [expandedTestimonials, setExpandedTestimonials] = useState<number[]>([]);

  // Toggle expanded state for a testimonial
  const toggleExpand = (index: number) => {
    setExpandedTestimonials(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Check if a testimonial is expanded
  const isExpanded = (index: number) => expandedTestimonials.includes(index);

  const SLIDE_COUNT = testimonials.length;
  
  // Auto scroll the carousel
  useEffect(() => {
    if (!emblaApi) return;
    
    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    
    return () => {
      clearInterval(autoplayInterval);
    };
  }, [emblaApi]);

  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Athletes Say
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Hear from the athletes who have transformed their performance through our coaching programs.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4">
                  <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg h-full">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {testimonial.subtitle}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <p className={`text-gray-700 mb-6 ${isExpanded(index) ? "" : "line-clamp-4"}`}>
                        "{testimonial.quote}"
                      </p>
                      
                      {testimonial.quote.length > 200 && !isExpanded(index) && (
                        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      )}
                      
                      {testimonial.quote.length > 200 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleExpand(index)}
                          className="mt-1 text-primary hover:text-primary/80 hover:bg-primary/5 px-0 h-auto font-medium flex items-center gap-1"
                        >
                          {isExpanded(index) ? (
                            <>
                              Read less
                              <ChevronLeft className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Read more
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                      />
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
            onClick={() => emblaApi?.scrollNext()}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
