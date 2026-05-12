'use client';

import React from 'react';
import Sidebar from './Sidebar';

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="min-h-screen">
          {/* Header */}
          {(title || subtitle) && (
            <div className="bg-white border-b border-neutral-200 p-6 md:p-8">
              {title && <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>}
              {subtitle && <p className="text-neutral-600 mt-2">{subtitle}</p>}
            </div>
          )}

          {/* Page content */}
          <div className="p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
