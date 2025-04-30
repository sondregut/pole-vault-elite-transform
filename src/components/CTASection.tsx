
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Pole Vaulting?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join our community of athletes who are breaking personal records and reaching new heights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Apply for Coaching
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              Explore Programs
            </Button>
          </div>
          <p className="text-sm mt-8 opacity-90">
            Not sure which program is right for you? Try our free 7-day demo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
