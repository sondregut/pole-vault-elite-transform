
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AthleteResults from '@/components/AthleteResults';
import Features from '@/components/Features';
import CoachProfile from '@/components/CoachProfile';
import Testimonials from '@/components/Testimonials';
import Programs from '@/components/Programs';
import AppFeatures from '@/components/AppFeatures';
import VideoAnalysis from '@/components/VideoAnalysis';
import BeforeAfter from '@/components/BeforeAfter';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { isVisible } from '@/utils/featureFlags';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      {isVisible('AthleteResults') && <AthleteResults />}
      {isVisible('Features') && <Features />}
      {isVisible('CoachProfile') && <CoachProfile />}
      {isVisible('Testimonials') && <Testimonials />}
      {isVisible('Programs') && <Programs />}
      {isVisible('AppFeatures') && <AppFeatures />}
      {isVisible('VideoAnalysis') && <VideoAnalysis />}
      {isVisible('BeforeAfter') && <BeforeAfter />}
      {isVisible('CTASection') && <CTASection />}
      <Footer />
    </div>
  );
};

export default Index;
