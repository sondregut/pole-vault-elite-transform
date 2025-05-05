
import React from "react";
import TeamMemberCard from "./TeamMemberCard";

interface TeamMembersProps {
  teamImageSrc: string;
}

const TeamMembers = ({ teamImageSrc }: TeamMembersProps) => {
  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-center">Meet The Team</h2>
        
        {/* Team photo - significantly reduced size */}
        <div className="mb-6 md:mb-12 flex justify-center">
          <div className="w-full max-w-md">
            <img 
              src={teamImageSrc}
              alt="Team Guttormsen" 
              className="w-full h-auto rounded-xl shadow-lg"
            />
            <p className="text-center text-gray-600 mt-3 italic">Team Guttormsen - Atle, Simen and Sondre</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Sondre's Card */}
          <TeamMemberCard 
            name="SONDRE GUTTORMSEN, OLY"
            title="OLYMPIC POLE VAULTER & COACH"
            description={"I am a Princeton University alum and professional pole vaulter for Adidas and Norway. I currently split my time between Durham, North Carolina and my home town Ski, Norway. My proudest accomplishments are 2023 European Champion, three-time NCAA champion, and being the Collegiate record holder with 6 meters / 19'8.25\"."}
          />

          {/* Simen's Card */}
          <TeamMemberCard 
            name="SIMEN GUTTORMSEN"
            title="COLLEGIATE ATHLETE & COACH"
            description={"I am a current Duke University Graduate student and Princeton University Operational Research & Financial Engineering alum. My personal best is 5.72 meters / 18'9\", and I am a 15th place finisher at the 2022 World Championships in Eugene and a two-time NCAA all-American (4th place)."}
          />

          {/* Atle's Card */}
          <TeamMemberCard 
            name="ATLE GUTTORMSEN, PHD"
            title="COACH, AGENT & ECONOMIC PROFESSOR"
            description="I'm a professor in economics, head coach for Team Guttormsen, and a certified Athlete Representative. In addition, I am a former track and field athlete."
          />
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
