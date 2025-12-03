import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight, Mail } from 'lucide-react';
import VaultAppNavbar from '@/components/vault-app-landing/VaultAppNavbar';

const VaultSubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planType = searchParams.get('plan'); // 'yearly' or 'monthly'
  const isYearly = planType === 'yearly';

  return (
    <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex flex-col">
      <VaultAppNavbar />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-vault-success to-green-400 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-vault-text mb-4"
            >
              Welcome to VAULT Pro!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-vault-text-secondary mb-8"
            >
              Your subscription is now active. You have full access to all Pro features.
            </motion.p>

            {/* Important Email Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-vault-primary/5 rounded-xl p-4 mb-8 border border-vault-primary/10"
            >
              <div className="flex items-center justify-center gap-2 text-vault-primary mb-2">
                <Mail className="w-5 h-5" />
                <p className="text-sm font-semibold">Important</p>
              </div>
              <p className="text-sm text-vault-text-secondary">
                Use the same email address you entered during checkout to create your account and activate your Pro subscription.
              </p>
            </motion.div>

            {/* What's Next Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-vault border border-vault-border p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-vault-text mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-vault-primary" />
                Next Step
              </h2>

              <p className="text-vault-text-secondary mb-4">
                Create your VAULT account to unlock all your Pro features and start tracking your pole vault progress.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => navigate('/vault/onboarding')}
                className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all text-base"
              >
                Create Your Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Simple Footer - No CTA */}
      <div className="bg-vault-primary-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
    </div>
  );
};

export default VaultSubscriptionSuccess;
