
import React from "react";

interface CareerHighlightProps {
  highlights: string[];
}

const CareerHighlight = ({ highlights }: CareerHighlightProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4">Career Highlights</h3>
      <ul className="space-y-2">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CareerHighlight;
