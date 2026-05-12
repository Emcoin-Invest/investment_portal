'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const variantClasses = {
  default: 'bg-white border border-neutral-200',
  elevated: 'bg-white shadow-md',
  outlined: 'bg-transparent border border-neutral-300',
  filled: 'bg-neutral-50 border border-neutral-200',
};

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
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
          variantClasses[variant],
          paddingClasses[padding],
          'rounded-lg transition-all duration-200',
          hoverable && 'hover:shadow-lg hover:border-neutral-300 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
