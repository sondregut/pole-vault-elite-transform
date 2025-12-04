import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Eye, EyeOff, Sparkles, Phone, Mail } from 'lucide-react';
import VaultAppNavbar from '@/components/vault-app-landing/VaultAppNavbar';
import VaultAppFooter from '@/components/vault-app-landing/VaultAppFooter';
import { redirectToCheckout, PriceId } from '@/services/stripeService';
import {
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, db } from '@/utils/firebase';

type AuthMethod = 'select' | 'email' | 'phone';

const VaultLogin = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('select');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get redirect and checkout params from URL
  const redirectUrl = searchParams.get('redirect') || '/vault/dashboard';
  const checkoutPriceId = searchParams.get('checkout') as PriceId | null;

  const fromLocation = location.state?.from;
  const from = fromLocation
    ? `${fromLocation.pathname}${fromLocation.search || ''}`
    : redirectUrl;

  // Handle post-login redirect
  useEffect(() => {
    const handlePostLogin = async () => {
      if (user && checkoutPriceId) {
        try {
          toast.info('Redirecting to checkout...');
          await redirectToCheckout(checkoutPriceId, true, user.uid, user.email || undefined);
        } catch (error: any) {
          console.error('Checkout error:', error);
          toast.error('Failed to start checkout. Please try again from the pricing page.');
          navigate('/vault#pricing');
        }
      } else if (user) {
        navigate(from, { replace: true });
      }
    };

    handlePostLogin();
  }, [user, checkoutPriceId, navigate, from]);

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLoadingProvider('google');
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      // No toast - useEffect will handle redirect
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup, not an error
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // Apple Sign-In
  const handleAppleSignIn = async () => {
    setLoading(true);
    setLoadingProvider('apple');
    setError('');

    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      await signInWithPopup(firebaseAuth, provider);
      // No toast - useEffect will handle redirect
    } catch (err: any) {
      console.error('Apple sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Apple Sign-In is not available. Please use another method.');
      } else {
        setError('Failed to sign in with Apple. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // Email Sign-In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingProvider('email');
    setError('');

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // No toast - useEffect will handle redirect
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // Phone Sign-In - Send Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingProvider('phone');
    setError('');

    try {
      // Format phone number
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+1' + formattedPhone.replace(/\D/g, '');
      }

      // Initialize reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
      });

      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowVerificationInput(true);
      toast.success('Verification code sent!');
    } catch (err: any) {
      console.error('Phone sign-in error:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Please include country code (e.g., +1).');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // Phone Sign-In - Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;

    setLoading(true);
    setLoadingProvider('phone');
    setError('');

    try {
      const result = await confirmationResult.confirm(verificationCode);

      // Check if user already exists in Firestore (has an account from app)
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));

      if (!userDoc.exists()) {
        // No existing account - sign them out and redirect to signup with error
        await signOut(firebaseAuth);
        navigate('/vault/signup?plan=yearly', {
          state: {
            error: 'No account found with this phone number. Please sign up with email to create an account.',
          },
        });
        return;
      }

      // User exists - useEffect will handle redirect
    } catch (err: any) {
      console.error('Verification error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code. Please try again.');
      } else {
        setError('Failed to verify code. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vault-primary" />
        <p className="mt-4 text-vault-text-secondary">
          {checkoutPriceId ? 'Redirecting to checkout...' : 'Redirecting...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white font-roboto flex flex-col">
      <VaultAppNavbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Back to Vault link */}
            <div className="mb-6">
              <Button asChild variant="ghost" className="text-vault-primary hover:text-vault-primary-dark">
                <Link to="/vault">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Vault
                </Link>
              </Button>
            </div>

            {/* Checkout Notice */}
            {checkoutPriceId && (
              <div className="mb-6 bg-vault-primary/10 border border-vault-primary/20 rounded-xl p-4 text-center">
                <Sparkles className="w-5 h-5 text-vault-primary mx-auto mb-2" />
                <p className="text-sm text-vault-text font-medium">
                  Sign in to continue to checkout
                </p>
                <p className="text-xs text-vault-text-secondary mt-1">
                  {checkoutPriceId === 'yearly' ? 'Pro Yearly Plan' : 'Pro Monthly Plan'}
                </p>
              </div>
            )}

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <img
                    src="/images/vault-logo.png"
                    alt="VAULT Logo"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold text-vault-text mb-2">
                  Sign in to VAULT
                </h1>
                <p className="text-vault-text-secondary">
                  Access your pole vault training data and analytics
                </p>
              </div>

              {/* Auth Method Selection */}
              {authMethod === 'select' && (
                <div className="space-y-3">
                  {/* Google Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
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
                    disabled={loading}
                    className="w-full py-6 text-base font-semibold rounded-xl bg-black hover:bg-gray-900 text-white transition-all"
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

                  {/* Phone Button */}
                  <Button
                    onClick={() => setAuthMethod('phone')}
                    disabled={loading}
                    variant="outline"
                    className="w-full py-6 text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all"
                  >
                    <Phone className="w-5 h-5 mr-3" />
                    Continue with Phone
                  </Button>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-vault-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-vault-text-muted">or</span>
                    </div>
                  </div>

                  {/* Email Button */}
                  <Button
                    onClick={() => setAuthMethod('email')}
                    disabled={loading}
                    variant="outline"
                    className="w-full py-6 text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    Continue with Email
                  </Button>
                </div>
              )}

              {/* Email Form */}
              {authMethod === 'email' && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('select'); setError(''); }}
                    className="text-sm text-vault-primary hover:underline mb-2"
                  >
                    ← Back to sign-in options
                  </button>

                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-vault-text font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 border-vault-border focus:border-vault-primary focus:ring-vault-primary rounded-xl"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-vault-text font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-12 border-vault-border focus:border-vault-primary focus:ring-vault-primary rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vault-text-muted hover:text-vault-text"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold rounded-xl hover:shadow-vault-md transition-all text-base"
                      disabled={loading}
                    >
                      {loadingProvider === 'email' ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {/* Phone Form */}
              {authMethod === 'phone' && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('select');
                      setError('');
                      setShowVerificationInput(false);
                      setConfirmationResult(null);
                    }}
                    className="text-sm text-vault-primary hover:underline mb-2"
                  >
                    ← Back to sign-in options
                  </button>

                  {!showVerificationInput ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-vault-text font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          className="h-12 border-vault-border focus:border-vault-primary focus:ring-vault-primary rounded-xl"
                          autoFocus
                        />
                        <p className="text-xs text-vault-text-muted">
                          Include country code (e.g., +1 for US)
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold rounded-xl hover:shadow-vault-md transition-all text-base"
                        disabled={loading}
                      >
                        {loadingProvider === 'phone' ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending Code...
                          </>
                        ) : (
                          'Send Verification Code'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="code" className="text-vault-text font-medium">
                          Verification Code
                        </Label>
                        <Input
                          id="code"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          required
                          maxLength={6}
                          className="h-12 border-vault-border focus:border-vault-primary focus:ring-vault-primary rounded-xl text-center text-2xl tracking-widest"
                          autoFocus
                        />
                        <p className="text-xs text-vault-text-muted text-center">
                          Code sent to {phoneNumber}
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold rounded-xl hover:shadow-vault-md transition-all text-base"
                        disabled={loading || verificationCode.length < 6}
                      >
                        {loadingProvider === 'phone' ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Sign In'
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowVerificationInput(false);
                          setVerificationCode('');
                        }}
                        className="w-full text-sm text-vault-primary hover:underline"
                      >
                        Use a different phone number
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* reCAPTCHA container (invisible) */}
              <div id="recaptcha-container"></div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-vault-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-vault-text-muted">New to VAULT?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Button
                  variant="outline"
                  asChild
                  className="border-vault-primary text-vault-primary hover:bg-vault-primary hover:text-white transition-colors"
                >
                  <Link to="/vault/signup?plan=yearly">
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VaultAppFooter />
    </div>
  );
};

export default VaultLogin;
