import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

interface VaultPromoBannerProps {
  discount?: string;
  text?: string;
  ctaText?: string;
  onDismiss?: () => void;
}

const VaultPromoBanner = ({
  discount = "50% off",
  text = "Launch Special",
  ctaText = "Claim offer",
  onDismiss
}: VaultPromoBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleClick = () => {
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/vault#pricing');
    }
  };

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2.5 sm:py-3">
          <button
            onClick={handleClick}
            className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium hover:opacity-90 transition-opacity"
          >
            <span className="font-bold">{discount}:</span>
            <span>{text}</span>
            <span className="flex items-center gap-1 underline underline-offset-2">
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute right-3 sm:right-4 p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultPromoBanner;
