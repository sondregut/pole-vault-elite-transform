
import React from "react";

interface OurStoryProps {
  imageSrc: string;
}

const OurStory = ({ imageSrc }: OurStoryProps) => {
  return (
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
              src={imageSrc} 
              alt="Sondre and Simen Guttormsen" 
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
