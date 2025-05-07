
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GoogleFormEmbed from "./GoogleFormEmbed";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section 
      className={`hero-section w-full ${isMobile ? 'min-h-[35vh]' : 'min-h-[85vh]'} pt-4 md:pt-12 relative bg-cover bg-center bg-no-repeat`}
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hero%20section%20image.jpg')` 
      }}
    >
      <div className={`w-full ${isMobile ? 'min-h-[30vh]' : 'min-h-[75vh]'} flex items-start md:items-center justify-center pt-8 md:pt-4`}>
        <div className="hero-content w-full md:w-4/5 lg:w-3/5 p-3 md:p-8 lg:p-10 mt-2 md:mt-0">
          <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-center break-words">
            Ready to Take Your Pole Vaulting to the Next Level?
          </h1>
          <p className="text-xs sm:text-sm md:text-xl text-white/90 mt-2 md:mt-6 max-w-2xl mx-auto text-center">
            If you're serious about jumping higher, getting faster, and building real confidence in your vault — you're in the right place.
          </p>
          <div className="mt-3 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <GoogleFormEmbed />
            <Link to="/shop">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 text-white border-2 border-white hover:bg-white/20 rounded-button w-full"
              >
                Explore Programs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
