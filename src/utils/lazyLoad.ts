// Performance optimization utilities for lazy loading and memoization

import dynamic from 'next/dynamic';
import React, { ComponentType } from 'react';

export function LazyComponentSkeleton() {
  return React.createElement('div', null, 'Loading...');
}

/**
 * Creates a lazy-loaded component with automatic fallback UI
 * @param importFn Dynamic import function
 * @param componentName Name for debugging
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  componentName: string
) {
  const Component = dynamic(importFn, {
    ssr: false, // Disable SSR for client-only components
  });

  Component.displayName = `Lazy(${componentName})`;
  return Component;
}

/**
 * Helper to memoize components with custom comparison
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return React.memo(Component, propsAreEqual);
}

/**
 * Create a lazy-loaded section component
 */
export function createLazySection(
  componentName: string,
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>
) {
  return dynamic(importFn);
}

export default {
  createLazyComponent,
  createLazySection,
  withMemo,
};
