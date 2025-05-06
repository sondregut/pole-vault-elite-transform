import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Star } from "lucide-react";

const Programs = () => {
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  
  const featuredPrograms = [
    {
      id: "elite",
      title: "Elite Coaching Program",
      tag: "MOST POPULAR",
      rating: 4.9,
      reviews: 128,
      subtitle: "Elite 1-on-1 Coaching",
      description: "Personalized coaching with direct access to your dedicated coach. Our most comprehensive program for serious athletes.",
      features: [
        "Custom weekly training plans",
        "Unlimited video technique analysis",
        "Bi-weekly Zoom coaching calls",
      ],
      duration: "Ongoing",
      level: "All levels",
      timeCommitment: "5-7 hrs/week",
      price: "$249/month",
      priceDetail: "Starting at",
      applyNowLink: "https://docs.google.com/forms/d/e/1FAIpQLSdcVhfxGSURY6myn9TsDFcfndfbg2hcivdYtsnKmjHsXzwmsw/viewform",
      image: "/program-3.jpg",
      hasLearnMore: false,
    },
    {
      id: "flight",
      title: "Flight Mode Program",
      tag: "BEST VALUE",
      rating: 4.7,
      reviews: 93,
      subtitle: "Flight Mode: 10-Week Program",
      description: "Complete 10-week program to transform your technique and performance with structured progression.",
      features: [
        "10-week, 6-day/week training plan",
        "Pole vault drills, sprint work, and lifting",
        "Video library with demos for every movement",
      ],
      duration: "10 weeks",
      level: "Beginner-Intermediate",
      timeCommitment: "6 days/week",
      price: "$59",
      priceDetail: "One-time purchase",
      buyNowLink: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1733159932",
      learnMoreLink: "https://marketplace.trainheroic.com/workout-plan/program/guttormsen-program-1733159932?attrib=591046-web",
      image: "/program-1.jpg",
      hasLearnMore: true,
    },
    {
      id: "power",
      title: "Power Strength Program",
      tag: "SPECIALIZED",
      rating: 4.2,
      reviews: 76,
      subtitle: "Power Strength Program",
      description: "Specialized strength training to develop explosive power for vaulters of all levels.",
      features: [
        "8-week strength progression",
        "Exercise video demonstrations",
        "Equipment alternatives",
      ],
      duration: "8 weeks",
      level: "All levels",
      timeCommitment: "2-3 hrs/week",
      price: "$39",
      priceDetail: "One-time purchase",
      buyNowLink: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1735674214",
      learnMoreLink: "https://marketplace.trainheroic.com/workout-plan/program/guttormsen-program-1735674214?attrib=591046-web",
      image: "/program-2.jpg",
      hasLearnMore: true,
    },
  ];

  const allPrograms = [
    {
      id: "high-school",
      title: "High School Program",
      tag: "",
      rating: 4.6,
      reviews: 52,
      subtitle: "High School Athlete Program",
      description: "Designed specifically for high school athletes looking to improve their performance and college recruiting potential.",
      features: [
        "12-week seasonal program",
        "College recruitment guidance",
        "Meet preparation strategies",
      ],
      duration: "12 weeks",
      level: "High School",
      timeCommitment: "4-6 hrs/week",
      price: "$299",
      priceDetail: "One-time purchase",
      image: "/program-2.jpg",
    },
    {
      id: "technical",
      title: "Technical Analysis Program",
      tag: "",
      rating: 4.9,
      reviews: 38,
      subtitle: "Technical Analysis Package",
      description: "In-depth video analysis of your technique with detailed feedback and correction strategies.",
      features: [
        "3 video analyses with frame-by-frame breakdown",
        "Personalized correction drills",
        "One follow-up Zoom session",
      ],
      duration: "4 weeks",
      level: "All levels",
      timeCommitment: "1-2 hrs/week",
      price: "$199",
      priceDetail: "One-time purchase",
      image: "/program-1.jpg",
    },
    {
      id: "jumpers-knee",
      title: "Jumper's Knee Program",
      tag: "",
      rating: 4.5,
      reviews: 42,
      subtitle: "Jumper's Knee Rehab Protocol",
      description: "Specialized program for athletes dealing with or preventing patellar tendinopathy (jumper's knee).",
      features: [
        "6-week progressive rehab protocol",
        "Pain management strategies",
        "Return-to-vaulting timeline",
      ],
      duration: "6 weeks",
      level: "All levels",
      timeCommitment: "3-4 hrs/week",
      price: "$129",
      priceDetail: "One-time purchase",
      image: "/program-3.jpg",
    },
    {
      id: "group-coaching",
      title: "Group Coaching Program",
      tag: "",
      rating: 4.1,
      reviews: 35,
      subtitle: "Group Coaching Program",
      description: "Cost-effective coaching option with weekly group sessions and shared feedback in a community setting.",
      features: [
        "Weekly group Zoom sessions",
        "Shared training plans",
        "Community support",
      ],
      duration: "Monthly",
      level: "All levels",
      timeCommitment: "3-5 hrs/week",
      price: "$99/month",
      priceDetail: "Monthly subscription",
      image: "/program-2.jpg",
    },
    {
      id: "competition",
      title: "Competition Prep Program",
      tag: "",
      rating: 4.7,
      reviews: 29,
      subtitle: "Competition Preparation",
      description: "Specialized 4-week program to prepare for important competitions with peak performance strategies.",
      features: [
        "4-week competition peaking plan",
        "Mental preparation strategies",
        "Competition day routines",
      ],
      duration: "4 weeks",
      level: "Intermediate-Advanced",
      timeCommitment: "4-6 hrs/week",
      price: "$179",
      priceDetail: "One-time purchase",
      image: "/program-1.jpg",
    },
    {
      id: "beginner",
      title: "Beginner Program",
      tag: "BEGINNER FRIENDLY",
      rating: 4.8,
      reviews: 41,
      subtitle: "Beginner's Foundation Program",
      description: "Perfect for new vaulters or those returning after a long break. Focus on fundamentals and safe progression.",
      features: [
        "6-week fundamental skill building",
        "Safety-focused progression",
        "Basic equipment guidance",
      ],
      duration: "6 weeks",
      level: "Beginner",
      timeCommitment: "2-4 hrs/week",
      price: "$199",
      priceDetail: "One-time purchase",
      image: "/program-3.jpg",
    },
  ];

  const testimonials = [
    {
      program: "Elite 1-on-1 Coaching",
      quote: "The personalized coaching completely transformed my technique. After struggling to break 5 meters for years, I cleared 5.40m within 6 months of starting the program. The video analysis was incredibly detailed.",
      author: "Thomas Richardson",
      title: "College Athlete • +0.65m improvement",
      image: "/testimonial-1.jpg",
    },
    {
      program: "Flight Mode: 10-Week Program",
      quote: "The 10-week structure was perfect for me. Each week built on the previous one, and I could feel myself improving with every session. The technique drills completely changed my approach and takeoff.",
      author: "Samantha Hughes",
      title: "High School Athlete • +0.45m improvement",
      image: "/testimonial-2.jpg",
    },
    {
      program: "Power Strength Program",
      quote: "I've always struggled with generating enough power on the runway. This program gave me exactly what I needed - explosive strength that translated directly to higher jumps. The gym alternatives were very helpful.",
      author: "Jennifer Martinez",
      title: "Masters Athlete • +0.30m improvement",
      image: "/testimonial-3.jpg",
    },
  ];

  const faqs = [
    {
      question: "How do I know which program is right for me?",
      answer: "We recommend selecting a program based on your experience level, specific goals, and time commitment. Our Elite 1-on-1 Coaching offers a free consultation to help determine the best fit. You can also use our program filter tool above to narrow down options."
    },
    {
      question: "What equipment do I need for these programs?",
      answer: "Equipment requirements vary by program. Most programs require basic training equipment (running shoes, workout clothes), while some require access to a pole vault pit. Each program page details specific equipment needs, and many offer alternatives for those with limited access."
    },
    {
      question: "How are video analyses conducted?",
      answer: "You'll upload videos through our app or website. Our coaches will analyze your technique using professional software, providing frame-by-frame feedback with voice-over explanations and visual annotations. You'll receive the analysis within 48 hours."
    },
    {
      question: "What is your refund policy?",
      answer: "One-time purchase programs offer a 7-day satisfaction guarantee. If you're not satisfied, contact us within 7 days for a full refund. Monthly subscriptions can be canceled anytime but are non-refundable for the current billing period."
    },
    {
      question: "How much improvement can I expect?",
      answer: "Results vary based on your starting point, commitment, and physical attributes. On average, our athletes see improvements of 0.3-0.7m within 3-6 months. The most important factor is consistent application of the training principles and technique corrections."
    },
    {
      question: "Can I upgrade or switch programs?",
      answer: "Yes! You can upgrade from any program to a more comprehensive one at any time. We'll apply the prorated value of your current program toward the new one. Contact our support team to arrange a program switch or upgrade."
    }
  ];

  // Render stars based on rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-primary text-primary h-4 w-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="text-gray-300 h-4 w-4" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="fill-primary text-primary h-4 w-4" />
          </div>
        </div>
      );
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300 h-4 w-4" />);
    }
    
    return stars;
  };

  // Program card component
  const ProgramCard = ({ program }: { program: any }) => (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover object-center"
        />
        {program.tag && (
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            {program.tag}
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-1 mb-2">
          {renderRating(program.rating)}
          <span className="ml-2 text-sm text-gray-600">{program.rating} ({program.reviews} reviews)</span>
        </div>
        <CardTitle className="text-xl font-semibold">{program.subtitle}</CardTitle>
        <CardDescription className="text-gray-600 mt-1">{program.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2 mb-6">
          {program.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 text-primary">
                <i className="ri-check-line"></i>
              </div>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="font-medium text-gray-900">{program.duration}</p>
            <p className="text-gray-500 text-xs">Duration</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="font-medium text-gray-900">{program.level}</p>
            <p className="text-gray-500 text-xs">Level</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="font-medium text-gray-900">{program.timeCommitment}</p>
            <p className="text-gray-500 text-xs">Time</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-4 mt-auto">
        <div className="flex justify-between w-full mb-3">
          <span className="text-sm text-gray-500">{program.priceDetail}</span>
          <span className="text-xl font-bold text-primary">{program.price}</span>
        </div>
        <div className="flex gap-2 w-full">
          {program.priceDetail.includes("Starting") ? (
            <Button className="flex-1 bg-primary hover:bg-primary-dark" asChild>
              <a href={program.applyNowLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
            </Button>
          ) : (
            <Button className="flex-1 bg-primary hover:bg-primary-dark" asChild>
              <a href={program.buyNowLink} target="_blank" rel="noopener noreferrer">Buy Now</a>
            </Button>
          )}
          
          {program.hasLearnMore && (
            <Button variant="outline" className="flex-1" asChild>
              <a href={program.learnMoreLink} target="_blank" rel="noopener noreferrer">Learn More</a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Training Programs for Every Vaulter</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect coaching program to match your experience level, goals, and schedule. 
            From beginners to elite competitors, we have a program designed for your success.
          </p>
        </div>
      </div>

      {/* Featured Programs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Featured Programs</h2>
          <p className="text-gray-600 text-center mb-12">Our most popular coaching options with proven results</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* All Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">All Training Programs</h2>
          <p className="text-gray-600 text-center mb-12">Explore our complete range of coaching options</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(showAllPrograms ? allPrograms : allPrograms.slice(0, 6)).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
          
          {!showAllPrograms && allPrograms.length > 6 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                onClick={() => setShowAllPrograms(true)}
                className="px-6"
              >
                Load More Programs
                <i className="ri-arrow-down-line ml-2"></i>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Athlete Testimonials</h2>
          <p className="text-gray-600 text-center mb-12">
            Hear from athletes who have transformed their performance through our programs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <p className="font-medium text-primary mb-4">{testimonial.program}</p>
                <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-medium">Athlete</p>
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-center mb-12">
            Get answers to common questions about our training programs
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Your Vaulting to New Heights?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join our community of athletes who are breaking personal records and achieving their goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-white hover:bg-primary-dark rounded-button">
              Apply for Coaching
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-button"
            >
              Schedule a Consultation
            </Button>
          </div>
          <p className="text-white/80 mt-8 font-medium">
            Not sure which program is right for you? Try our <a href="#" className="underline">free 7-day demo</a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;
