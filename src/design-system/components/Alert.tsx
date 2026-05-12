'use client';

import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const typeClasses = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

const defaultIcons = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle2 className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      icon,
      onDismiss,
      dismissible = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'border rounded-lg p-4 flex gap-3',
          typeClasses[type],
          className
        )}
        {...props}
      >
        <div className="flex-shrink-0">{icon || defaultIcons[type]}</div>
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
