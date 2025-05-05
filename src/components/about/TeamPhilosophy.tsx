
import React from "react";

interface TeamPhilosophyProps {
  imageSrc: string;
}

const TeamPhilosophy = ({ imageSrc }: TeamPhilosophyProps) => {
  return (
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
              src={imageSrc} 
              alt="Team Guttormsen Coaching" 
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamPhilosophy;
