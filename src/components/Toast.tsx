'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

interface InternalToast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle size={20} className="text-green-600" />,
      title: 'text-green-900',
      message: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle size={20} className="text-red-600" />,
      title: 'text-red-900',
      message: 'text-red-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info size={20} className="text-blue-600" />,
      title: 'text-blue-900',
      message: 'text-blue-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertCircle size={20} className="text-yellow-600" />,
      title: 'text-yellow-900',
      message: 'text-yellow-800',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-lg p-4 shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1">
          <p className={`font-semibold ${config.title}`}>{title}</p>
          {message && <p className={`text-sm mt-1 ${config.message}`}>{message}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
        >
          <X size={16} className={config.title} />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastProps[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [internalToasts, setInternalToasts] = useState<InternalToast[]>([]);

  const addToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setInternalToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id: string) => {
    setInternalToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toasts = internalToasts.map((t) => ({
    ...t,
    onClose: removeToast,
  }));

  return {
    toasts: toasts as ToastProps[],
    addToast,
    removeToast,
    success: (title: string, message?: string) => addToast('success', title, message, 5000),
    error: (title: string, message?: string) => addToast('error', title, message, 7000),
    info: (title: string, message?: string) => addToast('info', title, message, 5000),
    warning: (title: string, message?: string) => addToast('warning', title, message, 6000),
  };
}
