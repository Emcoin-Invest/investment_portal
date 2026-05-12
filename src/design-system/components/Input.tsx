'use client';

import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      variant = 'default',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random()}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full px-4 py-2 rounded-lg border transition-colors duration-200',
              'text-neutral-900 placeholder-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              variant === 'default' && 'bg-white border-neutral-300',
              variant === 'filled' && 'bg-neutral-50 border-neutral-200',
              error && 'border-red-500 focus:ring-red-500',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {helperText && !error && <p className="text-sm text-neutral-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
