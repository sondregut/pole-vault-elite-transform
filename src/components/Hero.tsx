
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import GoogleFormEmbed from "./GoogleFormEmbed";

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
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-center mb-3 md:mb-4">
            Ready to Take Your Pole Vaulting to the Next Level?
          </h1>
          
          <p className="text-sm md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto text-center">
            If you're serious about jumping higher, getting faster, and building real confidence in your vault — you're in the right place.
          </p>
          
          <div className="flex flex-col gap-3 justify-center">
            <GoogleFormEmbed />
            <Link to="/shop" className="w-full">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-primary hover:bg-secondary text-white w-full"
              >
                EXPLORE ALL PROGRAMS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
