import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const OnboardingLayout = ({
  children,
  title,
  subtitle,
  onBack,
  showBackButton = true,
}: OnboardingLayoutProps) => {
  const { currentStep, totalSteps } = useOnboarding();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex flex-col">
      {/* Header with back button and progress */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-vault-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-vault-primary/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-vault-text" />
              </button>
            )}
            <span className="text-sm text-vault-text-muted">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-vault-border/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-vault-primary to-vault-primary-dark rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-vault-text mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-vault-text-secondary">{subtitle}</p>
            )}
          </div>

          {/* Step content */}
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
