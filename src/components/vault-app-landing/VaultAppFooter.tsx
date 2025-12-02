import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const VaultAppFooter = () => {
  return (
    <footer className="font-roboto">
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-vault-primary-dark to-vault-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start vaulting smarter today
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of athletes who have ditched the paper notebook for professional data
              tracking.
            </p>

            {/* Main CTA Button */}
            <Button
              size="lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-vault-primary font-bold px-10 py-7 rounded-xl hover:bg-white/90 transition-all shadow-lg text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Sign Up – 50% Off
            </Button>

            <p className="text-sm text-white/60 mt-6">
              Limited time offer for the first 100 subscribers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="bg-vault-primary-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-2">
              <img
                src="/images/vault-logo.png"
                alt="VAULT Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-white/80 text-sm">
                © 2025 VAULT. Built by Sondre & Simen Guttormsen.
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="/vault/privacy"
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/vault/terms"
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/contact"
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VaultAppFooter;
