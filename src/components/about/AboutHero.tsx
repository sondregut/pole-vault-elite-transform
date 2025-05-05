
import React from "react";

interface AboutHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const AboutHero = ({ title, subtitle, backgroundImage }: AboutHeroProps) => {
  return (
    <div className="relative bg-gray-800 py-16 md:py-24 flex items-center min-h-[400px]">
      {/* Hero image background with dark overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={backgroundImage}
          alt="About Us Hero"
          className="w-full h-full object-cover opacity-50 object-center object-bottom"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>
      
      <div className="container mx-auto relative z-10 flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">{title}</h1>
        <p className="text-lg text-gray-100 text-center max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AboutHero;
