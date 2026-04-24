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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Investment Portal</h1>
          <p className="text-slate-600">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field (sign up only) */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-300"></div>
            <span className="text-sm text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-300"></div>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:bg-slate-100 transition-colors flex items-center justify-center gap-2"
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
            Sign in with Google
          </button>

          {/* Toggle sign up / sign in */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-800">Client: client@example.com / password123</p>
          <p className="text-xs text-blue-800">Admin: admin@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}
