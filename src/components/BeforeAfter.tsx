
import { Check, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const BeforeAfter = () => {
  const isMobile = useIsMobile();
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
    <section className={`py-10 md:py-20 bg-white`}>
      <div className="container mx-auto">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold text-center text-gray-900 mb-8 md:mb-16`}>
          Real Athlete Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Before Column */}
          <div className={`bg-white rounded-lg p-4 md:p-8`}>
            <h3 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-red-500 mb-4 md:mb-8`}>Before joining us</h3>
            <div className="mb-4 md:mb-8 rounded-lg overflow-hidden">
              <img 
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//owen%20before.jpg" 
                alt="Before Training" 
                className="w-full h-auto"
              />
            </div>
            <ul className="space-y-2 md:space-y-4">
              {beforeItems.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <X className="text-red-500 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
                  <span className={isMobile ? 'text-sm' : ''}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* After Column */}
          <div className={`bg-white rounded-lg p-4 md:p-8`}>
            <h3 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-green-600 mb-4 md:mb-8`}>After joining us</h3>
            <div className="mb-4 md:mb-8 rounded-lg overflow-hidden">
              <img 
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//owen%20after.jpg" 
                alt="After Training" 
                className="w-full h-auto"
              />
            </div>
            <ul className="space-y-2 md:space-y-4">
              {afterItems.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Check className="text-green-600 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
                  <span className={isMobile ? 'text-sm' : ''}>{item}</span>
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
