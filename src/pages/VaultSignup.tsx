import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Check
} from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, db } from '@/utils/firebase';
import { PriceId } from '@/services/stripeService';
import { toast } from 'sonner';

const VaultSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const plan = (searchParams.get('plan') as PriceId) || 'yearly';

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Check for error message passed from login page (e.g., phone auth with no account)
  useEffect(() => {
    const locationState = location.state as { error?: string } | null;
    if (locationState?.error) {
      setError(locationState.error);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 6;
  const passwordsMatch = password === confirmPassword;
  const canSubmitEmail = isValidEmail && isValidPassword && passwordsMatch && !isLoading;

  const handleAuthSuccess = async (
    userId: string,
    userEmail: string,
    authProvider: 'google' | 'apple' | 'email',
    displayName?: string | null
  ) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      await setDoc(doc(db, 'users', userId), {
        email: userEmail.toLowerCase(),
        authProvider,
        fullName: displayName || '',
        subscriptionTier: 'free',
        subscriptionStatus: 'pending',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      navigate(`/vault/checkout?plan=${plan}`);
    } catch (err: any) {
      console.error('Post-auth error:', err);

      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        console.log('Permission error on user doc, attempting checkout anyway...');
        toast.info('Proceeding to checkout...');
        navigate(`/vault/checkout?plan=${plan}`);
        return;
      } else {
        toast.error('Failed to proceed to checkout. Please try again.');
      }

      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoadingProvider('google');
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      await handleAuthSuccess(
        user.uid,
        user.email || '',
        'google',
        user.displayName
      );
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup, not an error
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setLoadingProvider('apple');
    setError('');

    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      await handleAuthSuccess(
        user.uid,
        user.email || '',
        'apple',
        user.displayName
      );
    } catch (err: any) {
      console.error('Apple sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup, not an error
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Apple Sign-In is not available yet. Please use Google or email.');
      } else {
        setError('Failed to sign in with Apple. Please try again.');
      }
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitEmail) return;

    setIsLoading(true);
    setLoadingProvider('email');
    setError('');

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        normalizedEmail,
        password
      );
      const user = userCredential.user;

      await handleAuthSuccess(user.uid, normalizedEmail, 'email');
    } catch (err: any) {
      console.error('Email sign-up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const planDisplay = plan === 'yearly' ? 'Annual Plan – 50% Off the first year' : 'Monthly Subscription';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-vault-primary via-vault-primary-dark to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-32 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <img
              src="/images/vault-logo.png"
              alt="VAULT Logo"
              className="h-7 w-7 object-contain"
            />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">VAULT</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Track Your Progress
            </h2>
            <p className="text-white/70 text-base mb-8">
              Join other athletes improving their pole vault with data-driven insights
            </p>

            {/* What's Included */}
            <div>
              <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wide">What's included</h3>
              <ul className="space-y-3">
                {[
                  'Log every jump with detailed metrics',
                  'Track personal bests over time',
                  'Smart equipment management',
                  'Session history with notes',
                  'Visual analytics and insights',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Cloud Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <div className="absolute bottom-8 left-1/4 w-24 h-12 bg-white/5 rounded-full blur-md" />
          <div className="absolute bottom-4 left-1/2 w-36 h-16 bg-white/10 rounded-full blur-lg" />
          <div className="absolute bottom-6 right-1/4 w-20 h-10 bg-white/5 rounded-full blur-md" />
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 lg:w-1/2 bg-white p-6 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
            <img
              src="/images/vault-logo.png"
              alt="VAULT Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-vault-primary font-bold text-2xl tracking-tight">VAULT</span>
          </div>

          {/* Back Button - Desktop */}
          <button
            onClick={() => navigate('/vault#pricing')}
            className="hidden lg:flex items-center text-gray-500 hover:text-vault-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to pricing
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600">
                Sign up to start your {planDisplay}
              </p>
              {plan === 'yearly' ? (
                <p className="text-sm text-gray-500 mt-2">
                  Or <Link to="/vault/signup?plan=monthly" className="text-vault-primary hover:underline">subscribe monthly</Link> for $9.99/mo
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Or <Link to="/vault/signup?plan=yearly" className="text-vault-primary hover:underline">get the annual plan</Link> for just $39.50/year
                </p>
              )}
            </div>

            {/* Social Sign-In Buttons */}
            {!showEmailForm && (
              <div className="space-y-3">
                {/* Apple Button */}
                <Button
                  onClick={handleAppleSignIn}
                  disabled={isLoading}
                  className="w-full py-6 text-base font-semibold rounded-full bg-black hover:bg-gray-900 text-white transition-all"
                >
                  {loadingProvider === 'apple' ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                  Continue with Apple
                </Button>

                {/* Google Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full py-6 text-base font-semibold rounded-full border-2 hover:bg-gray-50 transition-all"
                >
                  {loadingProvider === 'google' ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Email Option */}
                <Button
                  onClick={() => setShowEmailForm(true)}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full py-6 text-base font-semibold rounded-full border-2 hover:bg-gray-50 transition-all"
                >
                  Continue with email
                </Button>
              </div>
            )}

            {/* Email Form */}
            {showEmailForm && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleEmailSignUp}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-sm text-vault-primary hover:underline mb-4 flex items-center gap-1"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to sign-in options
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-5 rounded-xl"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-5 pr-12 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {password && password.length < 6 && (
                    <p className="text-sm text-amber-600 mt-1">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-5 rounded-xl"
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-red-500 mt-1">Passwords don't match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmitEmail}
                  className="w-full bg-vault-primary hover:bg-vault-primary-dark text-white font-semibold py-6 rounded-full transition-all disabled:opacity-50 mt-6"
                >
                  {loadingProvider === 'email' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.form>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mt-4"
              >
                {error}
              </motion.div>
            )}

            {/* Sign In Link */}
            <p className="text-center lg:text-left text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link
                to="/vault/login"
                className="text-vault-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center lg:text-left text-xs text-gray-500 mt-4">
              By creating an account, you agree to our{' '}
              <Link to="/vault/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/vault/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VaultSignup;
