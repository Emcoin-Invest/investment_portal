'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUser, createUser } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultRedirectPath } from '@/lib/routeProtection';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  if (user) {
    router.push(getDefaultRedirectPath(user.role));
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const uid = result.user.uid;

        // Create user document in Firestore
        await createUser(uid, {
          email,
          name: name || email.split('@')[0],
          role: 'client', // New users are clients by default
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Redirect to client dashboard
        router.push('/client/dashboard');
      } else {
        // Sign in
        const result = await signInWithEmailAndPassword(auth, email, password);
        const uid = result.user.uid;

        // Get user role
        const userData = await getUser(uid);
        if (!userData) {
          setError('User profile not found');
          return;
        }

        // Redirect based on role
        router.push(getDefaultRedirectPath(userData.role));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;

      // Check if user exists in Firestore
      let userData = await getUser(uid);

      // If not, create user document
      if (!userData) {
        await createUser(uid, {
          email: result.user.email || '',
          name: result.user.displayName || 'Google User',
          role: 'client', // New users are clients by default
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        userData = await getUser(uid);
      }

      if (!userData) {
        setError('Failed to create user profile');
        return;
      }

      // Redirect based on role
      router.push(getDefaultRedirectPath(userData.role));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Premium gradient background with branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Logo/Branding */}
        <div className="relative z-10">
          <div className="text-4xl font-bold mb-2">Investment Portal</div>
          <div className="text-slate-300 text-lg">Professional wealth management platform</div>
        </div>

        {/* Features list */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-lg">Secure & Encrypted</div>
              <div className="text-slate-300 text-sm">Enterprise-grade security for your investments</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-lg">Real-Time Updates</div>
              <div className="text-slate-300 text-sm">Live portfolio tracking and performance metrics</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-lg">Expert Support</div>
              <div className="text-slate-300 text-sm">24/7 dedicated support for your needs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Investment Portal</h1>
            <p className="text-slate-600">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="text-slate-600">
              {isSignUp ? 'Join our platform today' : 'Access your portfolio'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field (sign up only) */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 hover:bg-white"
                  placeholder="John Doe"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 hover:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 hover:bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:bg-slate-100 disabled:border-slate-200 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Toggle sign up / sign in */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold transition"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wide">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <span><strong>Client:</strong> client@example.com</span>
                <code className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">password123</code>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Admin:</strong> admin@example.com</span>
                <code className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">password123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
