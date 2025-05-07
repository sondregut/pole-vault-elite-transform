
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import TeamPhilosophy from "@/components/about/TeamPhilosophy";
import TeamMembers from "@/components/about/TeamMembers";
import SondreProfile from "@/components/about/SondreProfile";
import { useIsMobile } from "@/hooks/use-mobile";

const About = () => {
  const isMobile = useIsMobile();
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
        <AboutHero 
          title="About Us"
          subtitle={isMobile ? "" : "Team Guttormsen's journey from beginners to elite pole vaulters"}
          backgroundImage="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Screenshot%202025-04-14%20at%202.10.32%20PM.png"
        />
        
        <OurStory 
          imageSrc="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20and%20simen.jpg"
        />
        
        <TeamPhilosophy 
          imageSrc="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg"
        />
        
        <div className="pt-0 md:pt-6">
          <TeamMembers 
            teamImageSrc="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//dad%20simen%20sondre.JPG"
          />
        </div>
        
        <div className="pt-0 md:pt-8">
          <SondreProfile 
            profileImageSrc="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20adidas.jpg"
            careerHighlights={careerHighlights}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
