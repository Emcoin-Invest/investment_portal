'use client';

import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300',
  outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-2.5 text-base rounded-lg',
  xl: 'px-8 py-3 text-lg rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          variantClasses[variant],
          sizeClasses[size],
          'font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
