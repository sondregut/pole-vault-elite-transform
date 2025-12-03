import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';
import { Loader2, LogIn, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import VaultAppNavbar from '@/components/vault-app-landing/VaultAppNavbar';
import VaultAppFooter from '@/components/vault-app-landing/VaultAppFooter';
import { redirectToCheckout, PriceId } from '@/services/stripeService';

const VaultLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useFirebaseAuth();
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

  // Handle post-login checkout if needed
  useEffect(() => {
    const handlePostLoginCheckout = async () => {
      if (user && checkoutPriceId) {
        try {
          toast.info('Redirecting to checkout...');
          await redirectToCheckout(checkoutPriceId, true);
        } catch (error: any) {
          console.error('Checkout error:', error);
          toast.error('Failed to start checkout. Please try again from the pricing page.');
          navigate('/vault#pricing');
        }
      } else if (user) {
        navigate(from, { replace: true });
      }
    };

    handlePostLoginCheckout();
  }, [user, checkoutPriceId, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user: signedInUser, error } = await signIn(email, password);

      if (error) {
        toast.error(error);
        return;
      }

      if (signedInUser) {
        if (checkoutPriceId) {
          toast.success('Signed in! Redirecting to checkout...');
        } else {
          toast.success('Welcome back! Redirecting...');
        }
        // The useEffect will handle the redirect/checkout
      }
    } catch (error: any) {
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
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

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-5">
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
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold rounded-xl hover:shadow-vault-md transition-all text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      {checkoutPriceId ? 'Sign In & Continue' : 'Sign In to Dashboard'}
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-vault-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-vault-text-muted">or</span>
                </div>
              </div>

              {/* Additional info */}
              <div className="text-center space-y-4">
                <p className="text-sm text-vault-text-secondary">
                  Use the same email and password from your VAULT mobile app
                </p>

                <div className="bg-vault-primary/5 rounded-xl p-4 border border-vault-primary/10">
                  <p className="text-sm text-vault-text font-medium mb-3">
                    Don't have an account yet?
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="border-vault-primary text-vault-primary hover:bg-vault-primary hover:text-white transition-colors"
                  >
                    <a href="/vault#pricing">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Sign Up – 50% Off
                    </a>
                  </Button>
                </div>
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
