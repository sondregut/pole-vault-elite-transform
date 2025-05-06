
import { Button } from "@/components/ui/button";
import GoogleFormEmbed from "./GoogleFormEmbed";

const CTASection = () => {
  return (
    <section className="py-20 bg-[#101827]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Pole Vaulting?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
          Join our community of athletes who are breaking personal records and reaching new heights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GoogleFormEmbed />
          <a href="/shop">
            <Button variant="ghost" className="bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-button">
              Explore Programs
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
