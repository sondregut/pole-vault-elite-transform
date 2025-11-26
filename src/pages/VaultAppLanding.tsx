import React from 'react';
import VaultAppNavbar from '@/components/vault-app-landing/VaultAppNavbar';
import VaultAppHero from '@/components/vault-app-landing/VaultAppHero';
import VaultAppSessionFlow from '@/components/vault-app-landing/VaultAppSessionFlow';
import VaultAppJumpLogger from '@/components/vault-app-landing/VaultAppJumpLogger';
import VaultAppAnalytics from '@/components/vault-app-landing/VaultAppAnalytics';
import VaultAppFeatureGrid from '@/components/vault-app-landing/VaultAppFeatureGrid';
import VaultAppPricing from '@/components/vault-app-landing/VaultAppPricing';
import VaultAppFAQ from '@/components/vault-app-landing/VaultAppFAQ';
import VaultAppFooter from '@/components/vault-app-landing/VaultAppFooter';

const VaultAppLanding = () => {
  return (
    <div className="min-h-screen bg-white font-roboto">
      <VaultAppNavbar />
      <main>
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
