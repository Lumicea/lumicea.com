import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Gem, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const isEmailNotConfirmed = error.includes('Email not confirmed');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        // Successful login
        navigate('/');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setResendingEmail(true);
    setError('');
    setResendSuccess(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setError(error.message);
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <div className="w-16 h-16 bg-lumicea-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Gem className="h-8 w-8 text-lumicea-navy" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Sign in to your Lumicea account to access your orders, wishlist, and exclusive member benefits.
            </p>
          </div>
        </section>

        {/* Login Form */}
        <section className="py-16">
          <div className="lumicea-container max-w-md mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Sign In to Your Account
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Enter your credentials to access your account
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                      {isEmailNotConfirmed && (
                        <div className="mt-3">
                          <Button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={resendingEmail}
                            variant="outline"
                            size="sm"
                            className="text-red-700 border-red-300 hover:bg-red-100"
                          >
                            {resendingEmail ? (
                              <div className="flex items-center space-x-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Sending...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>Resend Verification Email</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success Message for Resend */}
                  {resendSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                      Verification email sent! Please check your inbox and click the verification link to activate your account.
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full lumicea-button-primary h-12 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <Button as={Link} to="/signup" variant="outline" className="w-full lumicea-button-secondary h-12">
                    Create New Account
                  </Button>
                </div>

                {/* Forgot Password */}
                <div className="text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-lumicea-navy hover:text-lumicea-navy-light transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Demo Account Info */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Demo Account</h4>
              <p className="text-sm text-blue-800 mb-3">
                For testing purposes, you can use the admin account:
              </p>
              <div className="text-sm text-blue-800 font-mono bg-white p-3 rounded border">
                <p>Email: admin@lumicea.com</p>
                <p>Password: password123</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}