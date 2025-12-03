import React, { useState } from 'react';
import VaultAppNavbar from '@/components/vault-app-landing/VaultAppNavbar';
import VaultPromoBanner from '@/components/vault-app-landing/VaultPromoBanner';
import VaultAppHero from '@/components/vault-app-landing/VaultAppHero';
import VaultAppSessionFlow from '@/components/vault-app-landing/VaultAppSessionFlow';
import VaultAppJumpLogger from '@/components/vault-app-landing/VaultAppJumpLogger';
import VaultAppAnalytics from '@/components/vault-app-landing/VaultAppAnalytics';
import VaultAppFeatureGrid from '@/components/vault-app-landing/VaultAppFeatureGrid';
import VaultAppPricing from '@/components/vault-app-landing/VaultAppPricing';
import VaultAppFAQ from '@/components/vault-app-landing/VaultAppFAQ';
import VaultAppFooter from '@/components/vault-app-landing/VaultAppFooter';

const VaultAppLanding = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-white font-roboto">
      {/* Promo Banner - fixed at top */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <VaultPromoBanner
            discount="50% off"
            text="Launch Special"
            ctaText="Claim offer"
            onDismiss={() => setShowBanner(false)}
          />
        </div>
      )}

      {/* Navbar - positioned below banner when banner is visible */}
      <VaultAppNavbar hasBanner={showBanner} />

      {/* Add padding when banner is showing to account for fixed banner + navbar */}
      <main className={showBanner ? 'pt-[44px] sm:pt-[48px]' : ''}>
        <VaultAppHero />
        <div id="value-prop">
          <VaultAppSessionFlow />
        </div>
        <VaultAppJumpLogger />
        <VaultAppAnalytics />
        <VaultAppFeatureGrid />
        <VaultAppPricing />
        <VaultAppFAQ />
      </main>
      <VaultAppFooter />
    </div>
  );
};

export default VaultAppLanding;
