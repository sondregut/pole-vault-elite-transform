import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight, Smartphone } from 'lucide-react';
import VaultAppNavbar from '@/components/vault-app-landing/VaultAppNavbar';
import VaultAppFooter from '@/components/vault-app-landing/VaultAppFooter';

const VaultSubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planType = searchParams.get('plan'); // 'yearly' or 'monthly'
  const isYearly = planType === 'yearly';
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect to dashboard after countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/vault/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

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
              {isYearly
                ? 'Your 14-day free trial has started. You now have full access to all Pro features.'
                : 'Your subscription is now active. You have full access to all Pro features.'}
            </motion.p>

            {/* What's Next Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-vault border border-vault-border p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-vault-text mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-vault-primary" />
                What's Next?
              </h2>

              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-vault-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-vault-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-vault-text">Download the iOS app</p>
                    <p className="text-sm text-vault-text-secondary">
                      Sign in with the same email to sync your subscription
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-vault-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-vault-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-vault-text">Start logging your jumps</p>
                    <p className="text-sm text-vault-text-secondary">
                      Track every session with unlimited jumps and video analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-vault-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-vault-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-vault-text">Explore your analytics</p>
                    <p className="text-sm text-vault-text-secondary">
                      View detailed insights on the web dashboard
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* iOS App Reminder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-vault-primary/5 rounded-xl p-4 mb-8 border border-vault-primary/10"
            >
              <div className="flex items-center justify-center gap-2 text-vault-primary">
                <Smartphone className="w-5 h-5" />
                <p className="text-sm font-medium">
                  The iOS app is coming soon to the App Store!
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Button
                onClick={() => navigate('/vault/dashboard')}
                className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all text-base"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-sm text-vault-text-muted">
                Redirecting in {countdown} seconds...
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <VaultAppFooter />
    </div>
  );
};

export default VaultSubscriptionSuccess;
