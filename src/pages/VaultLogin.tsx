import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';
import { Loader2, LogIn, ArrowLeft, BarChart3, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/Navbar';

const VaultLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useFirebaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/vault/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

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
        toast.success('Welcome back! Redirecting...');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Back to Vault link */}
            <div className="mb-6">
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
                <Link to="/vault">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Vault
                </Link>
              </Button>
            </div>

            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="text-center space-y-4">
                {/* Vault branding */}
                <Badge variant="secondary" className="w-fit mx-auto">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Vault Dashboard
                </Badge>

                <CardTitle className="text-2xl font-bold text-gray-900">
                  Sign in to your account
                </CardTitle>

                <p className="text-gray-600">
                  Access your pole vault training data and analytics
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-blue-200 focus:border-blue-500"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
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
                        className="border-blue-200 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In to Dashboard
                      </>
                    )}
                  </Button>
                </form>

                {/* Additional info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      Use the same email and password from your Vault mobile app
                    </p>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-medium mb-2">
                        Don't have the Vault app yet?
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" className="text-xs">
                          Download for iOS
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Download for Android
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VaultLogin;