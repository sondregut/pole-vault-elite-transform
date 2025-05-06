
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CoachProfile from '@/components/CoachProfile';
import Testimonials from '@/components/Testimonials';
import Programs from '@/components/Programs';
import AppFeatures from '@/components/AppFeatures';
import VideoAnalysis from '@/components/VideoAnalysis';
import BeforeAfter from '@/components/BeforeAfter';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import GoogleFormEmbed from '@/components/GoogleFormEmbed';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Programs />
      <Features />
      <CoachProfile />
      <Testimonials />
      <AppFeatures />
      <VideoAnalysis />
      <BeforeAfter />
      <CTASection />
      <GoogleFormEmbed />
      <Footer />
    </div>
  );
};

export default Index;
