import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Check,
  Shield,
  Lock,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/utils/firebase';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutData {
  subscriptionId: string;
  clientSecret: string;
  customerId: string;
  isTrialPeriod: boolean;
  trialDays: number;
  couponApplied: boolean;
  originalPrice: number;
  discountedPrice: number;
  priceId: string;
}

// Payment Form Component
const CheckoutForm = ({
  checkoutData,
  onSuccess
}: {
  checkoutData: CheckoutData;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = checkoutData.isTrialPeriod
        ? await stripe.confirmSetup({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/vault/onboarding?subscription=success`,
            },
            redirect: 'if_required',
          })
        : await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/vault/onboarding?subscription=success`,
            },
            redirect: 'if_required',
          });

      if (error) {
        setErrorMessage(error.message || 'An error occurred during payment.');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-vault-primary hover:bg-vault-primary-dark text-white font-bold py-6 rounded-full transition-all text-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : checkoutData.isTrialPeriod ? (
          'Start 7-Day Free Trial'
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Subscribe Now
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Lock className="w-4 h-4" />
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4" />
          <span>Cancel anytime</span>
        </div>
      </div>
    </form>
  );
};

// Main Checkout Page
const VaultCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useFirebaseAuth();

  const priceId = (searchParams.get('plan') as 'monthly' | 'yearly') || 'yearly';

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/vault/signup?plan=${priceId}`);
    }
  }, [user, authLoading, navigate, priceId]);

  useEffect(() => {
    const createCheckout = async () => {
      if (!user) return;

      try {
        const functions = getFunctions(app);
        const createEmbeddedCheckout = httpsCallable<
          { priceId: string; applyCoupon: boolean },
          CheckoutData
        >(functions, 'createEmbeddedCheckout');

        const result = await createEmbeddedCheckout({
          priceId,
          applyCoupon: true,
        });

        setCheckoutData(result.data);
      } catch (err: any) {
        console.error('Checkout error:', err);
        setError(err.message || 'Failed to initialize checkout');
        toast.error('Failed to load checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      createCheckout();
    }
  }, [user, authLoading, priceId]);

  const handleSuccess = () => {
    toast.success('Payment successful! Setting up your account...');
    navigate('/vault/onboarding?subscription=success');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-vault-primary mx-auto mb-4" />
          <p className="text-gray-600">Setting up secure checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/vault#pricing')} variant="outline">
            Back to Pricing
          </Button>
        </div>
      </div>
    );
  }

  if (!checkoutData) return null;

  const isYearly = priceId === 'yearly';

  const features = [
    'Log every jump with height, grip, step, and approach data',
    'Track personal bests and see your progression over time',
    'Smart equipment management with pole recommendations',
    'Detailed session history with notes and conditions',
    'Visual analytics to identify patterns in your performance',
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Plan Details (white background like Headspace) */}
      <div className="lg:w-1/2 bg-white p-6 lg:p-12 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/images/vault-logo.png"
            alt="VAULT Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-vault-primary font-bold text-2xl tracking-tight">VAULT</span>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Headline */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
              {isYearly && checkoutData.couponApplied ? '50% off ' : ''}
              {isYearly ? 'annual' : 'monthly'} membership
            </h1>

            {/* What's Included */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-4">What's included</h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-vault-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Pricing Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-gray-200 pt-6"
        >
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-base font-semibold text-gray-900">Total due today</span>
            <div className="text-right">
              {checkoutData.couponApplied && (
                <span className="text-gray-400 line-through mr-2">
                  ${checkoutData.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900">
                {isYearly ? '$0.00' : `$${checkoutData.discountedPrice.toFixed(2)}`}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {isYearly
              ? `$${checkoutData.discountedPrice.toFixed(2)} for first year after trial, then renews annually at $${checkoutData.originalPrice.toFixed(2)}. You can cancel anytime.`
              : `$${checkoutData.discountedPrice.toFixed(2)}/month. You can cancel anytime.`
            }
          </p>
        </motion.div>
      </div>

      {/* Right Side - Payment Form (blue gradient background) */}
      <div className="lg:w-1/2 bg-gradient-to-br from-vault-primary via-vault-primary-dark to-blue-900 p-6 lg:p-12 flex items-center justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-32 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

        {/* Bottom Cloud Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <div className="absolute bottom-8 left-1/4 w-24 h-12 bg-white/5 rounded-full blur-md" />
          <div className="absolute bottom-4 left-1/2 w-36 h-16 bg-white/10 rounded-full blur-lg" />
          <div className="absolute bottom-6 right-1/4 w-20 h-10 bg-white/5 rounded-full blur-md" />
        </div>

        {/* Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative z-10"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Select payment method
          </h2>

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: checkoutData.clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#1B3A57',
                  colorBackground: '#ffffff',
                  colorText: '#1B3A57',
                  colorDanger: '#ef4444',
                  fontFamily: 'Roboto, system-ui, sans-serif',
                  borderRadius: '12px',
                },
              },
            }}
          >
            <CheckoutForm
              checkoutData={checkoutData}
              onSuccess={handleSuccess}
            />
          </Elements>

          <p className="text-center text-xs text-gray-500 mt-6">
            <button
              onClick={() => navigate('/vault#pricing')}
              className="text-vault-primary hover:underline"
            >
              Cancel anytime
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VaultCheckout;
