import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Apple, ArrowDown } from 'lucide-react';
import PhoneMockup from './mockups/PhoneMockup';
import SessionHistoryMock from './mockups/SessionHistoryMock';

const VaultAppHero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-20 pb-16 overflow-hidden font-roboto">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-vault-bg-warm-start via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)]">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <Badge className="mb-6 bg-vault-primary-muted text-vault-primary-dark border-0 px-4 py-1.5 text-sm font-medium">
              Launching soon on iOS
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-vault-text leading-tight mb-6">
              For Athletes,
              <br />
              <span className="text-vault-primary">By Athletes</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-vault-text-secondary leading-relaxed mb-4 max-w-xl mx-auto lg:mx-0">
              Vault isn't just a training diary – it's your training partner.
            </p>

            {/* Description */}
            <p className="text-base text-vault-text-muted leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              A tool designed specifically for pole vaulters, built by athletes who understand
              exactly what you need. Track your jumps, analyze your training, and connect with
              the global community.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold px-8 py-6 rounded-lg hover:shadow-vault-md transition-all text-base"
              >
                <Apple className="w-5 h-5 mr-2" />
                Download for iOS
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('how-it-works')}
                className="border-vault-primary text-vault-primary font-semibold px-8 py-6 rounded-lg hover:bg-vault-primary-muted transition-all text-base"
              >
                See how it works
              </Button>
            </div>

            {/* Trust Signal */}
            <p className="text-sm text-vault-text-muted">
              Created by Olympic pole vaulters Sondre & Simen Guttormsen
            </p>
          </motion.div>

          {/* Right Column - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup>
              <SessionHistoryMock />
            </PhoneMockup>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        >
          <button
            onClick={() => scrollToSection('value-prop')}
            className="flex flex-col items-center text-vault-text-muted hover:text-vault-primary transition-colors"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default VaultAppHero;
