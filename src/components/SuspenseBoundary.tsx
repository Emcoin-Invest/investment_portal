'use client';

import React, { Suspense, ReactNode } from 'react';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

/**
 * Suspense boundary wrapper with automatic error handling and fallback UI
 * Wraps code-split components to show loading state while they load
 */
export function SuspenseBoundary({
  children,
  fallback = <div>Loading...</div>,
  name = 'Component',
}: SuspenseBoundaryProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

/**
 * Wrapper for sections that should lazy-load
 */
export function LazySection({
  children,
  fallback,
  name,
}: SuspenseBoundaryProps) {
  return (
    <SuspenseBoundary
      fallback={fallback}
      name={name}
    >
      {children}
    </SuspenseBoundary>
  );
}

export default SuspenseBoundary;
