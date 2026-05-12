'use client';

import React from 'react';
import clsx from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  count = 1,
  className,
  ...props
}) => {
  const widthStyle = typeof width === 'string' ? width : `${width}px`;
  const heightStyle = typeof height === 'string' ? height : `${height}px`;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'bg-neutral-200 animate-pulse',
            variant === 'circular' && 'rounded-full',
            variant === 'rectangular' && 'rounded-lg',
            variant === 'text' && 'rounded',
            className
          )}
          style={{
            width: widthStyle,
            height: heightStyle,
          }}
          {...props}
        />
      ))}
    </>
  );
};

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-4 p-4">
      <Skeleton height={24} width="60%" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={16}
            width={i === lines - 1 ? '80%' : '100%'}
          />
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
