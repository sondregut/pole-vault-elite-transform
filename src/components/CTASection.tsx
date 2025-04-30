
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-[#3176FF]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Pole Vaulting?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
          Join our community of athletes who are breaking personal records and reaching new heights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="bg-white text-[#3176FF] hover:bg-gray-100 rounded-button">
            Apply for Coaching
          </Button>
          <Button variant="ghost" className="bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-button">
            Explore Programs
          </Button>
        </div>
        <p className="text-white/80 mt-8 font-medium">
          Not sure which program is right for you? Try our <a href="#" className="underline font-medium">free 7-day demo</a>.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
