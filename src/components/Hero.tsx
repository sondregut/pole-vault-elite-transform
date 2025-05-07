
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GoogleFormEmbed from "./GoogleFormEmbed";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section 
      className={`hero-section w-full ${isMobile ? 'h-[80vh]' : 'min-h-[85vh]'} relative bg-cover bg-center bg-no-repeat`}
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hero%20section%20image.jpg')` 
      }}
    >
      <div className={`w-full h-full flex items-center justify-center ${isMobile ? 'pt-16' : 'pt-4'}`}>
        <div className="hero-content w-full md:w-4/5 lg:w-3/5 p-4 md:p-8 lg:p-10">
          {isMobile && (
            <div className="flex justify-center mb-3">
              <div className="flex items-center">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
                <span className="ml-1 text-white text-xs">4.8/5</span>
                <span className="ml-1 text-white text-xs">(300+ reviews)</span>
              </div>
            </div>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-center mb-3 md:mb-4">
            {isMobile ? 'Get Better At Pole Vaulting With Sondre' : 'Ready to Take Your Pole Vaulting to the Next Level?'}
          </h1>
          
          <p className="text-sm md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto text-center">
            {isMobile 
              ? 'Build strength and achieve advanced skills with personalized programs and a supportive community.'
              : 'If you're serious about jumping higher, getting faster, and building real confidence in your vault — you're in the right place.'
            }
          </p>
          
          <div className="flex flex-col gap-3 justify-center">
            <GoogleFormEmbed />
            <Link to="/shop" className="w-full">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-[#D19B37] hover:bg-[#BE8B2F] text-white w-full border-none"
              >
                START FREE TRIAL NOW
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
