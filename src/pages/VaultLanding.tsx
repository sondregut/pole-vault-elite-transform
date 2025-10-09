import React from 'react';
import VaultHero from '@/components/vault/VaultHero';
import VaultProblem from '@/components/vault/VaultProblem';
import VaultFeatures from '@/components/vault/VaultFeatures';
import VaultHowItWorks from '@/components/vault/VaultHowItWorks';
import VaultPricing from '@/components/vault/VaultPricing';
import VaultTestimonials from '@/components/vault/VaultTestimonials';
import VaultAboutCreators from '@/components/vault/VaultAboutCreators';
import VaultFAQ from '@/components/vault/VaultFAQ';
import VaultCTA from '@/components/vault/VaultCTA';
import VaultShareSection from '@/components/vault/VaultShareSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VaultLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <VaultHero />
      <VaultProblem />
      <VaultFeatures />
      <VaultHowItWorks />
      <VaultTestimonials />
      <VaultPricing />
      <VaultShareSection />
      <VaultAboutCreators />
      <VaultFAQ />
      <VaultCTA />
      <Footer />
    </div>
  );
};

export default VaultLanding;