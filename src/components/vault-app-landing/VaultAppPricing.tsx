import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Crown, Sparkles, Loader2, Mail, CheckCircle } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { checkCouponAvailability, redirectToCheckout, PriceId } from '@/services/stripeService';
import { toast } from 'sonner';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const VaultAppPricing = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [couponData, setCouponData] = useState<{
    available: boolean;
    remaining: number;
    discountPercent: number;
  } | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [coachWaitlistEmail, setCoachWaitlistEmail] = useState('');
  const [coachWaitlistLoading, setCoachWaitlistLoading] = useState(false);
  const [coachWaitlistSuccess, setCoachWaitlistSuccess] = useState(false);
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  // Handle coach waitlist signup
  const handleCoachWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coachWaitlistEmail || !coachWaitlistEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setCoachWaitlistLoading(true);

    try {
      // Check if email already exists in waitlist
      const waitlistRef = collection(db, 'coachWaitlist');
      const existingQuery = query(waitlistRef, where('email', '==', coachWaitlistEmail.toLowerCase()));
      const existingDocs = await getDocs(existingQuery);

      if (!existingDocs.empty) {
        toast.info('You\'re already on the waitlist!');
        setCoachWaitlistSuccess(true);
        setCoachWaitlistLoading(false);
        return;
      }

      // Add to waitlist
      await addDoc(waitlistRef, {
        email: coachWaitlistEmail.toLowerCase(),
        signedUpAt: new Date().toISOString(),
        source: 'pricing_page',
        notified: false,
      });

      setCoachWaitlistSuccess(true);
      toast.success('You\'re on the list! We\'ll notify you when Coach is ready.');
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setCoachWaitlistLoading(false);
    }
  };

  // Fetch coupon availability on mount
  useEffect(() => {
    const fetchCouponData = async () => {
      try {
        const data = await checkCouponAvailability();
        setCouponData({
          available: data.available,
          remaining: data.remaining,
          discountPercent: data.discountPercent,
        });
      } catch (error) {
        console.error('Failed to fetch coupon availability:', error);
      }
    };

    fetchCouponData();
  }, []);

  const handleSubscribe = async (tierName: string) => {
    if (tierName === 'Lite') {
      // Free tier - just redirect to signup/login
      if (user) {
        navigate('/vault/dashboard');
      } else {
        navigate('/vault/login');
      }
      return;
    }

    if (tierName === 'Coach') {
      // Coming soon
      return;
    }

    // Pro tier - start checkout
    if (!user) {
      // Redirect to login with return URL
      const priceId = isYearly ? 'yearly' : 'monthly';
      navigate(`/vault/login?redirect=/vault&checkout=${priceId}`);
      return;
    }

    setLoadingCheckout(tierName);

    try {
      const priceId: PriceId = isYearly ? 'yearly' : 'monthly';
      await redirectToCheckout(
        priceId,
        user.uid,
        user.email || '',
        couponData?.available || false
      );
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout. Please try again.');
      setLoadingCheckout(null);
    }
  };

  // Calculate discounted prices
  const getDiscountedPrice = (originalPrice: number) => {
    if (couponData?.available && couponData.discountPercent) {
      return originalPrice * (1 - couponData.discountPercent / 100);
    }
    return originalPrice;
  };

  const monthlyPrice = 9.99;
  const yearlyPrice = 79;
  const limitedTimeDiscount = 0.50; // 50% off
  const yearlyPriceDiscounted = yearlyPrice * (1 - limitedTimeDiscount);
  const yearlyMonthlyEquivalent = yearlyPriceDiscounted / 12; // $3.29/mo with 50% off
  const discountedMonthly = getDiscountedPrice(monthlyPrice);
  const discountedYearly = getDiscountedPrice(yearlyPriceDiscounted);
  const discountedYearlyMonthly = getDiscountedPrice(yearlyMonthlyEquivalent);

  const tiers = [
    {
      name: 'Lite',
      icon: Zap,
      price: 'Free',
      period: '',
      description: 'Perfect for casual jumpers',
      features: [
        '1 Session per week',
        '5 Jumps per session',
        '10 Poles max in library',
        'Basic Stats',
        'No Video',
      ],
      cta: 'Get Started',
      popular: false,
      comingSoon: false,
    },
    {
      name: 'Pro',
      icon: Star,
      price: isYearly
        ? `$${yearlyMonthlyEquivalent.toFixed(2)}`
        : `$${monthlyPrice.toFixed(2)}`,
      originalPrice: isYearly ? `$${(yearlyPrice / 12).toFixed(2)}` : null,
      period: '/mo',
      yearlyBillingNote: isYearly
        ? `$${yearlyPriceDiscounted.toFixed(0)} billed annually`
        : '',
      originalYearlyPrice: isYearly ? `$${yearlyPrice}` : null,
      limitedOffer: isYearly,
      yearlyNote: isYearly ? '50% OFF – Limited Time!' : '',
      description: 'For serious competitors',
      features: [
        'Unlimited Sessions',
        'Unlimited Jumps',
        'Unlimited Pole Library',
        'Full Video Analysis',
        'Advanced Analytics',
        'Offline Mode',
      ],
      cta: isYearly ? 'Start 14-Day Free Trial' : 'Subscribe Now',
      popular: true,
      comingSoon: false,
    },
    {
      name: 'Coach',
      icon: Crown,
      price: '$TBD',
      period: '/mo',
      description: 'For coaches and teams',
      features: [
        'Manage Multiple Athletes',
        'Team Analytics',
        'Remote Coaching Tools',
        'Video Feedback Drawing',
        'Export Team Reports',
      ],
      cta: 'Coming Soon',
      popular: false,
      comingSoon: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Discount Banner */}
        {couponData?.available && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white px-6 py-3 rounded-full shadow-vault-md">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">
                {couponData.discountPercent}% OFF – Only {couponData.remaining} spots left!
              </span>
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-vault-text mb-4">Simple Pricing</h2>
          <p className="text-lg text-vault-text-secondary mb-8">
            Start for free. Upgrade for professional insights.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-vault-primary-muted rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? 'bg-vault-primary text-white shadow-vault-sm'
                  : 'text-vault-text-secondary hover:text-vault-text'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly
                  ? 'bg-vault-primary text-white shadow-vault-sm'
                  : 'text-vault-text-secondary hover:text-vault-text'
              }`}
            >
              Yearly (Save ~30%)
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                tier.popular
                  ? 'bg-gradient-to-br from-vault-primary-dark to-vault-primary text-white shadow-vault-lg scale-105'
                  : 'bg-white border border-vault-border shadow-vault'
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vault-warning text-white border-0 px-4 py-1">
                  Most Popular
                </Badge>
              )}

              {tier.comingSoon && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vault-text-muted text-white border-0 px-4 py-1">
                  Coming Soon
                </Badge>
              )}

              <div className="text-center mb-6">
                <div
                  className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                    tier.popular ? 'bg-white/20' : 'bg-vault-primary-muted'
                  }`}
                >
                  <tier.icon
                    className={`w-7 h-7 ${tier.popular ? 'text-white' : 'text-vault-primary'}`}
                  />
                </div>

                <h3
                  className={`text-xl font-bold mb-1 ${
                    tier.popular ? 'text-white' : 'text-vault-text'
                  }`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    tier.popular ? 'text-white/80' : 'text-vault-text-muted'
                  }`}
                >
                  {tier.description}
                </p>

                {/* Limited Time Offer Badge */}
                {tier.limitedOffer && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 bg-vault-warning text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      50% OFF – LIMITED TIME
                    </span>
                  </div>
                )}

                <div className="mb-2">
                  {/* Show original price with strikethrough for 50% off */}
                  {tier.originalPrice && (
                    <span
                      className={`text-lg line-through mr-2 ${
                        tier.popular ? 'text-white/50' : 'text-vault-text-muted'
                      }`}
                    >
                      {tier.originalPrice}
                    </span>
                  )}
                  <span
                    className={`text-4xl font-bold ${
                      tier.popular ? 'text-white' : 'text-vault-text'
                    }`}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span
                      className={`text-lg ${tier.popular ? 'text-white/70' : 'text-vault-text-muted'}`}
                    >
                      {tier.period}
                    </span>
                  )}
                </div>
                {/* Show yearly billing note with original price crossed out */}
                {tier.yearlyBillingNote && (
                  <p className={`text-sm mb-1 ${tier.popular ? 'text-white/70' : 'text-vault-text-muted'}`}>
                    {tier.originalYearlyPrice && (
                      <span className="line-through mr-1">{tier.originalYearlyPrice}</span>
                    )}
                    {tier.yearlyBillingNote}
                  </p>
                )}
                {tier.yearlyNote && (
                  <p className={`text-xs font-semibold ${tier.popular ? 'text-vault-warning' : 'text-vault-success'}`}>
                    {tier.yearlyNote}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        tier.popular ? 'text-white' : 'text-vault-success'
                      }`}
                    />
                    <span
                      className={`text-sm ${tier.popular ? 'text-white/90' : 'text-vault-text-secondary'}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Coach Waitlist Form */}
              {tier.name === 'Coach' ? (
                <div className="space-y-3">
                  {coachWaitlistSuccess ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="w-12 h-12 rounded-full bg-vault-success/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-vault-success" />
                      </div>
                      <p className="text-sm font-medium text-vault-success">You're on the list!</p>
                      <p className="text-xs text-vault-text-muted text-center">We'll email you when Coach launches.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleCoachWaitlistSignup} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-text-muted" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={coachWaitlistEmail}
                          onChange={(e) => setCoachWaitlistEmail(e.target.value)}
                          className="pl-10 py-5 rounded-xl border-vault-border focus:border-vault-primary focus:ring-vault-primary"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={coachWaitlistLoading}
                        className="w-full py-6 text-base font-semibold rounded-xl bg-vault-primary text-white hover:bg-vault-primary-light"
                      >
                        {coachWaitlistLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          'Join Waitlist for Early Access'
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => handleSubscribe(tier.name)}
                  disabled={tier.comingSoon || loadingCheckout === tier.name}
                  className={`w-full py-6 text-base font-semibold rounded-xl ${
                    tier.popular
                      ? 'bg-white text-vault-primary hover:bg-white/90'
                      : tier.comingSoon
                      ? 'bg-vault-border text-vault-text-muted cursor-not-allowed'
                      : 'bg-vault-primary text-white hover:bg-vault-primary-light'
                  }`}
                >
                  {loadingCheckout === tier.name ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    tier.cta
                  )}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-vault-text-muted mt-8"
        >
          {isYearly ? 'Yearly plan includes a 14-day free trial. Credit card required.' : 'Monthly plan billed immediately. No trial period.'}
        </motion.p>
      </div>
    </section>
  );
};

export default VaultAppPricing;
