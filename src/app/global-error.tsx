'use client';

import { useEffect } from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for monitoring/debugging
    console.error('[Global Error]', error);
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';
  const errorMessage = error?.message || 'An unexpected error occurred';
  const errorDigest = error?.digest;

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-md w-full mx-auto px-6">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
              Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-slate-600 text-center mb-6">
              We encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>

            {/* Error Details (Dev Only) */}
            {isDev && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-mono text-red-800 break-words">
                  {errorMessage}
                </p>
                {errorDigest && (
                  <p className="text-xs text-red-600 mt-2">
                    Digest: {errorDigest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => reset()}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
              <a
                href="/"
                className="w-full px-4 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
