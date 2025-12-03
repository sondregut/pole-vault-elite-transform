import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Chrome,
  Apple
} from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, db } from '@/utils/firebase';
import { redirectToCheckout, PriceId } from '@/services/stripeService';
import { toast } from 'sonner';
import VaultAppNavbar from '@/components/vault-app-landing/VaultAppNavbar';

const VaultSignup = () => {
  const navigate = useNavigate();
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

  // Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 6;
  const passwordsMatch = password === confirmPassword;
  const canSubmitEmail = isValidEmail && isValidPassword && passwordsMatch && !isLoading;

  // After successful auth, create user doc and redirect to checkout
  const handleAuthSuccess = async (
    userId: string,
    userEmail: string,
    authProvider: 'google' | 'apple' | 'email',
    displayName?: string | null
  ) => {
    try {
      // Small delay to ensure auth token is fully propagated
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create initial user document
      // Using set with merge:true to handle both new and existing users
      await setDoc(doc(db, 'users', userId), {
        email: userEmail.toLowerCase(),
        authProvider,
        fullName: displayName || '',
        subscriptionTier: 'free',
        subscriptionStatus: 'pending',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      // Redirect to Stripe Checkout
      await redirectToCheckout(plan, true, userId, userEmail);
    } catch (err: any) {
      console.error('Post-auth error:', err);

      // If it's a permission error, try to proceed to checkout anyway
      // The webhook will create/update the user doc
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        console.log('Permission error on user doc, attempting checkout anyway...');
        toast.info('Proceeding to checkout...');
        try {
          await redirectToCheckout(plan, true, userId, userEmail);
          return;
        } catch (checkoutErr: any) {
          console.error('Checkout also failed:', checkoutErr);
          toast.error(checkoutErr.message || 'Failed to start checkout');
        }
      } else {
        toast.error('Failed to proceed to checkout. Please try again.');
      }

      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  // Google Sign-In
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

  // Apple Sign-In
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

  // Email/Password Sign-Up
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

  const planDisplay = plan === 'yearly' ? '7-Day Free Trial' : 'Monthly Subscription';

  return (
    <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex flex-col">
      <VaultAppNavbar />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-vault-text mb-2">
                Create Your Account
              </h1>
              <p className="text-vault-text-secondary">
                Sign up to start your {planDisplay}
              </p>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border p-6 space-y-6">
              {/* Social Sign-In Buttons */}
              {!showEmailForm && (
                <>
                  <div className="space-y-3">
                    {/* Google Button */}
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full py-6 text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all"
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

                    {/* Apple Button */}
                    <Button
                      onClick={handleAppleSignIn}
                      disabled={isLoading}
                      className="w-full py-6 text-base font-semibold rounded-xl bg-black hover:bg-gray-900 text-white transition-all"
                    >
                      {loadingProvider === 'apple' ? (
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      ) : (
                        <Apple className="w-5 h-5 mr-3" />
                      )}
                      Continue with Apple
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-vault-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-vault-text-muted">or</span>
                    </div>
                  </div>

                  {/* Email Option */}
                  <Button
                    onClick={() => setShowEmailForm(true)}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full py-6 text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    Continue with Email
                  </Button>
                </>
              )}

              {/* Email Form */}
              {showEmailForm && (
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-sm text-vault-primary hover:underline mb-2"
                  >
                    ← Back to sign-in options
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-vault-text mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-5"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vault-text mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-5 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-text-muted hover:text-vault-text"
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
                    <label className="block text-sm font-medium text-vault-text mb-1">
                      Confirm Password
                    </label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-5"
                    />
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-sm text-red-500 mt-1">Passwords don't match</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmitEmail}
                    className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all disabled:opacity-50"
                  >
                    {loadingProvider === 'email' ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Sign In Link */}
              <p className="text-center text-sm text-vault-text-secondary">
                Already have an account?{' '}
                <Link
                  to="/vault/login"
                  className="text-vault-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-vault-text-muted mt-6 px-4">
              By creating an account, you agree to our{' '}
              <Link to="/vault/terms" className="underline hover:text-vault-text">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/vault/privacy" className="underline hover:text-vault-text">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default VaultSignup;
