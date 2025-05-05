
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

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <CoachProfile />
      <Testimonials />
      <Programs />
      <AppFeatures />
      <VideoAnalysis />
      <BeforeAfter />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
