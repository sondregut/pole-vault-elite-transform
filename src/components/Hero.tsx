
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ 
          backgroundImage: "url('/hero-bg.jpg')", 
          opacity: 0.5,
          backgroundPosition: "center 30%"
        }}>
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
            Ready to Take Your Pole Vaulting to the Next Level?
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            Join our elite coaching program designed by professional athletes for athletes of all levels. Transform your technique, increase your height, and achieve your personal best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base">
              Apply for Coaching
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              Explore Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
