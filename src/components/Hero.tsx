
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="hero-section w-full min-h-screen pt-20 relative">
      <div className="w-full min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="hero-content w-full md:w-3/5 p-8 md:p-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-center line-clamp-2 max-h-[2.5em]">
            Ready to Take Your Pole Vaulting to the Next Level?
          </h1>
          <p className="text-lg md:text-xl text-white/90 mt-6 max-w-2xl mx-auto text-center">
            Join our elite coaching program designed by professional athletes for athletes of all levels. 
            Transform your technique, increase your height, and achieve your personal best.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-white hover:bg-primary-dark rounded-button">
              Apply for Coaching
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 text-white border-2 border-white hover:bg-white/20 rounded-button"
            >
              Explore Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
