'use client';

import { AlertCircle, InboxIcon, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="min-h-64 flex items-center justify-center p-6 animate-fadeIn">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400">
            {icon || <InboxIcon className="w-8 h-8" />}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        {description && <p className="text-slate-600 text-sm mb-6">{description}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({ title = 'Something went wrong', message, retry, fullScreen = false }: ErrorStateProps) {
  return (
    <div className={`${fullScreen ? 'min-h-screen' : 'min-h-64'} flex items-center justify-center p-6 animate-fadeIn`}>
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full text-red-600">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

interface InfoMessageProps {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function InfoMessage({ title, message, type }: InfoMessageProps) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconColor = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  };

  return (
    <div className={`p-4 rounded-lg border ${typeStyles[type]} animate-slideIn`}>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-sm opacity-90">{message}</p>
    </div>
  );
}
