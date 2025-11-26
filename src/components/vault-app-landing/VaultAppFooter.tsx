import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Apple, Mail } from 'lucide-react';

const VaultAppFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
    setIsSubmitted(true);
    setEmail('');
  };

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

            {/* Email Signup Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-muted" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="pl-12 h-12 bg-white border-0 text-vault-text placeholder:text-vault-text-muted rounded-xl focus-visible:ring-2 focus-visible:ring-white/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 px-6 bg-white text-vault-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
                  >
                    Join Early Access
                  </Button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur rounded-xl p-6 max-w-md mx-auto mb-8"
              >
                <p className="text-white font-semibold text-lg mb-2">You're on the list!</p>
                <p className="text-white/80 text-sm">
                  We'll send you launch updates and early access invites.
                </p>
              </motion.div>
            )}

            <p className="text-sm text-white/60 mb-8">
              No spam. Just launch updates, behind-the-scenes progress, and early invites.
            </p>

            {/* App Store Button */}
            <Button
              size="lg"
              className="bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-8 py-6 rounded-xl hover:bg-white/20 transition-all"
            >
              <Apple className="w-5 h-5 mr-2" />
              Download on App Store
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="bg-vault-primary-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
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
