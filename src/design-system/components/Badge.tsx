'use client';

import React from 'react';
import clsx from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  neutral: 'bg-neutral-100 text-neutral-800',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs rounded',
  md: 'px-3 py-1 text-sm rounded-md',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = 'primary', size = 'md', icon, className, children, ...props },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={clsx(
          variantClasses[variant],
          sizeClasses[size],
          'font-medium inline-flex items-center gap-1',
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
