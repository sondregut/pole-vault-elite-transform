
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section 
      className="hero-section w-full min-h-[85vh] pt-12 relative bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hero%20section%20image.jpg')` 
      }}
    >
      <div className="w-full min-h-[75vh] flex items-start md:items-center justify-center pt-16 md:pt-4">
        <div className="hero-content w-full md:w-4/5 lg:w-3/5 p-6 md:p-8 lg:p-10 mt-4 md:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-center break-words">
            Ready to Take Your Pole Vaulting to the Next Level?
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mt-6 max-w-2xl mx-auto text-center">
            If you're serious about jumping higher, getting faster, and building real confidence in your vault — you're in the right place.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSdcVhfxGSURY6myn9TsDFcfndfbg2hcivdYtsnKmjHsXzwmsw/viewform" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-primary text-white hover:bg-primary-dark rounded-button w-full">
                Apply for Coaching
              </Button>
            </a>
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
