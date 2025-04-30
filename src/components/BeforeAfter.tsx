
import { Check, X } from "lucide-react";

const BeforeAfter = () => {
  const beforeItems = [
    "Hips Sinking",
    "No left arm engagement",
    "Bent left leg",
    "Right arm too far back"
  ];

  const afterItems = [
    "Great body tension",
    "Strong left arm",
    "Engaged right arm",
    "Connected take off position"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          Real Athlete Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before Column */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-3xl font-bold text-red-500 mb-8">Before joining us</h3>
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//owen%20before.jpg" 
                alt="Before Training" 
                className="w-full h-auto"
              />
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <X className="text-red-500 mr-3 h-5 w-5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* After Column */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-3xl font-bold text-green-600 mb-8">After joining us</h3>
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//owen%20after.jpg" 
                alt="After Training" 
                className="w-full h-auto"
              />
            </div>
            <ul className="space-y-4">
              {afterItems.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Check className="text-green-600 mr-3 h-5 w-5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
