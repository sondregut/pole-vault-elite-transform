
import React from "react";
import { Award, Trophy, GraduationCap } from "lucide-react";
import CareerHighlight from "./CareerHighlight";
import SectionWithIcon from "./SectionWithIcon";

interface SondreProfileProps {
  profileImageSrc: string;
  careerHighlights: string[];
}

const SondreProfile = ({ profileImageSrc, careerHighlights }: SondreProfileProps) => {
  return (
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
              src={profileImageSrc} 
              alt="Sondre Guttormsen" 
              className="w-full h-auto rounded-xl shadow-lg mb-8"
            />
            <CareerHighlight highlights={careerHighlights} />
          </div>

          <div className="lg:w-2/3">
            <h3 className="text-2xl font-bold mb-4">Hi, I'm Sondre Guttormsen 👋</h3>
            
            <SectionWithIcon icon={GraduationCap} title="My Roots">
              <p>
                I grew up in a family where athletics wasn't just a hobby—it was a way of life. My father 
                Atle was a 110m hurdler and passed his love of the sport on to me and my brother Simen. 
                We started track and field in 2008, exploring everything from javelin to hurdles, but it 
                was pole vault that really drew me in. It's the most technical event in track & field—and 
                mastering it has become my lifelong pursuit.
              </p>
            </SectionWithIcon>

            <SectionWithIcon icon={Award} title="My Educational Journey">
              <p>
                After finishing high school in Norway, I pursued my athletic dreams in the U.S., first at 
                UCLA, then transferring to Princeton—a decision that shaped both my career and identity. 
                Competing alongside Simen, I earned a degree in Psychology from Princeton in 2023, then 
                continued my studies with a Master's in Sport Management at the University of Texas.
              </p>
            </SectionWithIcon>

            <SectionWithIcon icon={Trophy} title="My Approach to Pole Vaulting">
              <p>
                For the past 15 years, I've trained under the guidance of my father and alongside my 
                siblings. We've built our philosophy on continuous learning, biomechanics, and technical 
                mastery. From analyzing film to traveling globally to learn from other athletes and 
                coaches, this journey has been about more than sport—it's been about growth.
              </p>
            </SectionWithIcon>

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
  );
};

export default SondreProfile;
