
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Trophy, GraduationCap } from "lucide-react";

const About = () => {
  const careerHighlights = [
    "Personal Best: 6.00 meters (19'8.25\")",
    "2x Olympian – Tokyo 2020 & Paris 2024 (8th Place)",
    "European Champion (2023), European Bronze Medalist",
    "3x NCAA Champion",
    "Collegiate Indoor Record Holder",
    "Norwegian Champion & National Record Holder",
    "B.A. in Psychology – Princeton University",
    "M.S. in Sport Management – University of Texas"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">About Us</h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Team Guttormsen's journey from beginners to elite pole vaulters
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our pole vaulting story began in 2008 when Simen and I (Sondre) first took up the sport. 
                    Dad, Atle, was a competitive hurdler in his younger years and always had an interest in 
                    pole vaulting, though he never had a coach to teach him. With the track located just a 
                    stone's throw from our house, it was only natural for us to join track and field. But it 
                    was dad who introduced us specifically to pole vaulting.
                  </p>
                  <p>
                    The three of us started learning about the event together - buying books, watching films, 
                    reaching out to coaches, and visiting those willing to share their knowledge. We quickly 
                    improved, and with that increased our passion for the sport. Eventually, our sister Sara 
                    joined in as well, while our youngest brother Sebastian pursued handball, a popular sport 
                    in Norway and Europe.
                  </p>
                  <p>
                    By 2022, after over a decade of experience, we had developed into elite vaulters, earning 
                    medals in international competitions. Having trained under some of the top coaches around 
                    the world, we felt it was time to pay our knowledge forward. This sparked the idea for 
                    stavhopp.no - as a way to help aspiring vaulters improve their technique and performance.
                  </p>
                  <p>
                    We have always generously shared our own training routines and pole vault-specific drills 
                    on social media, and have attracted much curiosity from our followers and fans. With this 
                    enthusiastic reception, a website with more in-depth resources seemed the natural next step.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//simen.jpeg" 
                  alt="Team Guttormsen" 
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Team Training Philosophy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Sondre, Simen, and Sara have trained together for the last 15 years with father Atle in 
                    the Head Coach position. Atle was a track and field athlete himself, specializing in the 
                    110m hurdles but always with an admiration for the pole vault.
                  </p>
                  <p>
                    When Sondre and Simen started track and field back in 2008, they wanted to do all events. 
                    Everything from the 60m dash to the javelin throw. What was common for all events they 
                    loved was the curiosity and challenge of learning the technique. Every event has a unique 
                    challenge and skill requirement, whether it is combining strength and flexibility or speed 
                    and coordination. This love for technique obviously led to a passion for pole vault - the 
                    most technical event of them all.
                  </p>
                  <p>
                    During the 15 years of training with Atle, we traveled the world to train and learn from 
                    different coaches and athletes, read books, analyzed film, and were ALWAYS searching for 
                    ways to improve our training, our technique, and our overall philosophy of the event.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sara%20simen%20sondre.jpeg" 
                  alt="Team Training" 
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" id="sondre">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Sondre Guttormsen</h2>
              <p className="text-xl text-primary font-medium">
                Olympian • European Champion • Coach & Founder of G-Force Training
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="lg:w-1/3">
                <img 
                  src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre23%20jump.jpeg" 
                  alt="Sondre Guttormsen" 
                  className="w-full h-auto rounded-xl shadow-lg mb-8"
                />
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-4">Career Highlights</h3>
                  <ul className="space-y-2">
                    {careerHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:w-2/3">
                <h3 className="text-2xl font-bold mb-4">Hi, I'm Sondre Guttormsen 👋</h3>
                
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <div className="w-12 h-12 bg-[#EBF1FF] rounded-full flex items-center justify-center mr-3">
                      <GraduationCap className="text-[#3176FF]" />
                    </div>
                    My Roots
                  </h4>
                  <p className="text-gray-700 ml-15">
                    I grew up in a family where athletics wasn't just a hobby—it was a way of life. My father 
                    Atle was a 110m hurdler and passed his love of the sport on to me and my brother Simen. 
                    We started track and field in 2008, exploring everything from javelin to hurdles, but it 
                    was pole vault that really drew me in. It's the most technical event in track & field—and 
                    mastering it has become my lifelong pursuit.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <div className="w-12 h-12 bg-[#EBF1FF] rounded-full flex items-center justify-center mr-3">
                      <Award className="text-[#3176FF]" />
                    </div>
                    My Educational Journey
                  </h4>
                  <p className="text-gray-700">
                    After finishing high school in Norway, I pursued my athletic dreams in the U.S., first at 
                    UCLA, then transferring to Princeton—a decision that shaped both my career and identity. 
                    Competing alongside Simen, I earned a degree in Psychology from Princeton in 2023, then 
                    continued my studies with a Master's in Sport Management at the University of Texas.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <div className="w-12 h-12 bg-[#EBF1FF] rounded-full flex items-center justify-center mr-3">
                      <Trophy className="text-[#3176FF]" />
                    </div>
                    My Approach to Pole Vaulting
                  </h4>
                  <p className="text-gray-700">
                    For the past 15 years, I've trained under the guidance of my father and alongside my 
                    siblings. We've built our philosophy on continuous learning, biomechanics, and technical 
                    mastery. From analyzing film to traveling globally to learn from other athletes and 
                    coaches, this journey has been about more than sport—it's been about growth.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3">Looking Ahead</h4>
                  <p className="text-gray-700">
                    Now I split my time between competing professionally and helping athletes through G-Force 
                    Training. My goal is to inspire the next generation with the lessons I've learned through 
                    years of dedication, adversity, and success. If you're passionate about track and field, 
                    you're in the right place.
                  </p>
                </div>
                
                <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-gray-700">
                  "My coaching philosophy is about developing complete athletes. We focus on building 
                  explosive speed, raw strength, and dynamic power, while perfecting technical execution. 
                  Every training session is designed to transform you into a more powerful, faster, 
                  and technically sound athlete."
                </blockquote>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
