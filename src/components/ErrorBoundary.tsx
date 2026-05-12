'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary is a React Error Boundary component that catches errors in the component tree.
 * It displays a user-friendly error UI and provides a reset button.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Component Error
            </h2>

            {/* Error Description */}
            <p className="text-slate-600 text-center mb-6">
              Something went wrong in this component. Please try refreshing the page.
            </p>

            {/* Error Details (Dev Only) */}
            {isDev && (
              <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded text-sm">
                <p className="text-red-800 font-mono break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={this.reset}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
