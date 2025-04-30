
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Clock, MessageCircle, Video } from "lucide-react";

const OneOnOneCoaching = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transform Your Vaulting with Personalized Coaching from an Olympian
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Elevate your technique, achieve new heights, and train with world-class guidance from an Olympic pole vault champion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                Start Training Today
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 1:1 Coaching Experience */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                1:1 Coaching Experience
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our personalized coaching program combines expert guidance with cutting-edge technology to help you reach your full potential.
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Personalized Coaching for Every Vaulter
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Whether you're just starting out or competing at an elite level, our 1:1 coaching program adapts to your specific needs, goals, and circumstances.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Weekly communication with Coach Sondre</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Regular Zoom calls for in-depth technique review</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Custom training programs delivered through our app</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Detailed video analysis and feedback</span>
                </li>
              </ul>
              
              <p className="text-lg text-gray-700 mb-6">
                Perfect for athletes of all levels who want to take their performance to the next level, whether you have a team coach or need fully written programming.
              </p>
              
              <Button variant="link" className="text-primary text-lg p-0">
                Learn more about our coaching process
              </Button>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" 
                alt="1:1 Coaching Session" 
                className="rounded-lg w-full h-auto object-cover shadow-md" 
              />
              <div className="mt-8 bg-primary rounded-lg p-6 text-center text-white">
                <div className="text-5xl font-bold mb-2">97%</div>
                <div className="text-xl">Performance Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Coaching Process Overview
            </h2>
            <p className="text-lg text-gray-700">
              Our structured approach ensures you receive comprehensive support from initial assessment to goal achievement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: 1,
                title: "Apply for Coaching",
                description: "Fill out our application form detailing your goals, experience, and what you hope to achieve.",
                details: [
                  "Brief overview of your goals",
                  "Select preferred coaching package"
                ]
              },
              {
                step: 2,
                title: "Initial Zoom Consultation",
                description: "Connect with Coach Sondre to discuss your goals and establish expectations.",
                details: [
                  "One-on-one call with Sondre",
                  "Review coaching process"
                ]
              },
              {
                step: 3,
                title: "Assessment Form",
                description: "Complete a detailed assessment to help us understand your current situation.",
                details: [
                  "Training history",
                  "Equipment access"
                ]
              },
              {
                step: 4,
                title: "Digital Setup",
                description: "Get set up with our training and video review apps for seamless coaching.",
                details: [
                  "Download training app",
                  "Download video review app"
                ]
              },
              {
                step: 5,
                title: "First Week Program",
                description: "Receive your first customized training program and begin your journey.",
                details: [
                  "Customized training plan",
                  "Exercise demonstrations"
                ]
              }
            ].map((step, index) => (
              <Card key={index} className="border border-gray-200 overflow-hidden">
                <CardHeader className="bg-primary text-white p-4">
                  <div className="text-2xl font-bold mb-1">{step.step}</div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Flexible Integration Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Flexible Integration Options
            </h2>
            <p className="text-lg text-gray-700 mb-10 text-center">
              Our coaching program is designed to work with your current situation, whether you:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Already have a coach or team",
                  description: "We'll complement your existing training with specialized pole vault expertise."
                },
                {
                  title: "Need complete programming",
                  description: "We'll create a comprehensive training plan tailored to your specific needs."
                },
                {
                  title: "Have other training commitments",
                  description: "We'll integrate our program with your existing schedule and commitments."
                }
              ].map((option, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {option.title}
                  </h3>
                  <p className="text-gray-700">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Communication Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Communication Highlights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Weekly Check-ins
                </h3>
                <p className="text-gray-700">
                  Regular communication with Coach Sondre to discuss progress and adjustments.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <Video className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Zoom Coaching Calls
                </h3>
                <p className="text-gray-700">
                  In-depth video sessions to review technique and address specific challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching App Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Coaching App Features
            </h2>
            <p className="text-lg text-gray-700">
              Our comprehensive mobile and web application puts powerful training tools at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Program Tracking",
                description: "Access your personalized training program, track completed workouts, and monitor your progress over time.",
                details: ["Daily workout schedules", "Exercise completion tracking", "Progress visualization"]
              },
              {
                title: "Video Analysis",
                description: "Upload videos of your vaults for detailed analysis and receive expert feedback from your coach.",
                details: ["Easy video uploads", "Frame-by-frame analysis", "Coach annotations and feedback"]
              },
              {
                title: "Workout Logging",
                description: "Record your training metrics, including vault heights, sprint times, and strength numbers.",
                details: ["Performance metrics tracking", "Training load monitoring", "Personal records tracking"]
              },
              {
                title: "Technique Library",
                description: "Access a comprehensive library of technique videos, drills, and educational content.",
                details: ["Drill demonstration videos", "Technique breakdowns", "Educational articles"]
              },
              {
                title: "Coach Messaging",
                description: "Direct communication with your coach for questions, feedback, and guidance.",
                details: ["Real-time messaging", "Photo and video sharing", "Quick response times"]
              },
              {
                title: "Progress Tracking",
                description: "Visualize your improvement over time with detailed progress charts and analytics.",
                details: ["Performance graphs", "Goal achievement tracking", "Long-term development metrics"]
              }
            ].map((feature, index) => (
              <Card key={index} className="border border-gray-200">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-gray-700">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Interface */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              App Interface
            </h2>
            <p className="text-lg text-gray-700">
              Explore our intuitive and powerful coaching application designed for pole vaulters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <img 
                src="/app-screen-1.jpg" 
                alt="Training Program Calendar" 
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-gray-900">Training Calendar</h3>
                <p className="text-gray-700">View your weekly training schedule</p>
              </div>
            </div>
            <div>
              <img 
                src="/video-analysis.jpg" 
                alt="Video Analysis Screen" 
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-gray-900">Video Analysis</h3>
                <p className="text-gray-700">Frame-by-frame technique review</p>
              </div>
            </div>
            <div>
              <img 
                src="/app-screen-2.jpg" 
                alt="Performance Metrics" 
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-gray-900">Performance Dashboard</h3>
                <p className="text-gray-700">Track your progress metrics</p>
              </div>
            </div>
            <div>
              <img 
                src="/app-screen-3.jpg" 
                alt="Coach Messaging" 
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-gray-900">Coach Messaging</h3>
                <p className="text-gray-700">Direct communication with your coach</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button variant="link">View more screenshots</Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Athletes Say
            </h2>
            <p className="text-lg text-gray-700">
              Hear from vaulters who have transformed their performance with our coaching app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The video analysis feature completely transformed my technique. Being able to get frame-by-frame feedback from my coach and see the progress in my vaults over time has been invaluable.",
                name: "Rebecca Anderson",
                role: "College Athlete • Using app for 8 months"
              },
              {
                quote: "Having my training program right on my phone has made it so much easier to stay consistent. I love being able to log my workouts and see my progress charts improving week after week.",
                name: "Michael Trevino",
                role: "High School Athlete • Using app for 6 months"
              },
              {
                quote: "The direct messaging with Coach Sondre has been a game-changer. Being able to get quick answers to my questions and share videos between our scheduled calls keeps me on track.",
                name: "Sophia Martinez",
                role: "Masters Athlete • Using app for 12 months"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="mb-4 text-gray-700">
                    "{testimonial.quote}"
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        Athlete
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Download Our App Today
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Take your pole vault coaching experience to the next level with our comprehensive training app.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Available for iOS and Android devices</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Also accessible via web browser</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Free to download, premium features with coaching subscription</span>
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Download for iOS
                </Button>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Download for Android
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&q=80"
                  alt="App on Smartphone" 
                  className="rounded-xl shadow-xl max-w-xs mx-auto"
                />
                <div className="absolute -top-4 -right-4 -bottom-4 -left-4 bg-primary/10 rounded-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700">
              Get answers to common questions about our coaching app and 1:1 coaching process.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid gap-6">
            {[
              {
                question: "Do I need to be an elite vaulter to benefit from the app?",
                answer: "Not at all! Our coaching app is designed for vaulters of all levels, from beginners just starting out to elite athletes looking to refine their technique. The coaching and features adapt to your specific level and goals."
              },
              {
                question: "How often will I receive feedback on my technique?",
                answer: "With our 1:1 coaching program, you'll receive weekly video analysis feedback, plus bi-weekly Zoom calls for more in-depth review. You can also message your coach directly through the app with questions at any time."
              },
              {
                question: "Can I use the app without signing up for coaching?",
                answer: "Yes! The app has a free version that includes basic workout tracking and access to some technique resources. Premium features like video analysis and personalized programming require a coaching subscription."
              },
              {
                question: "How does the video analysis feature work?",
                answer: "Simply record your vaults and upload them through the app. Your coach will analyze the video with professional tools, providing frame-by-frame feedback with voice commentary and visual annotations, usually within 48 hours."
              },
              {
                question: "Can I integrate this with my school or club training?",
                answer: "Absolutely! Many of our athletes use our coaching as a supplement to their school or club training. We'll work with you to ensure our program complements your existing training schedule and other commitments."
              },
              {
                question: "What kind of results can I expect?",
                answer: "Results vary based on your starting point, commitment, and physical attributes. On average, our athletes see improvements of 0.3-0.7m within 3-6 months of consistent training and technique implementation."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Pole Vault Journey?
            </h2>
            <p className="text-xl mb-8">
              Join our community of athletes who are breaking personal records and achieving their goals with personalized coaching and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Apply for 1:1 Coaching
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Download the App
              </Button>
            </div>
            <p>
              Not sure which option is right for you? <a href="#" className="underline font-medium">Schedule a free consultation</a>.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default OneOnOneCoaching;
