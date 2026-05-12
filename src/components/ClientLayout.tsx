'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ClientGuard } from './ClientGuard';
import { Menu, X, LogOut, Bell, LayoutDashboard, Briefcase, FileText, Send, MessageSquare, ChevronRight } from 'lucide-react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/client/portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/client/statements', label: 'Statements', icon: FileText },
    { href: '/client/requests', label: 'Requests', icon: Send },
    { href: '/client/notifications', label: 'Notifications', icon: MessageSquare },
  ];

  // Wrap with ClientGuard to ensure only clients can see this layout
  return (
    <ClientGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* Top Navigation Bar - Premium styling */}
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with hover effect */}
            <Link 
              href="/client/dashboard" 
              className="flex items-center gap-3 group transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110 transition-all duration-300">
                IP
              </div>
              <span className="hidden sm:inline text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:text-blue-700 transition-all duration-300">
                Investment Portal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-200/50'
                        : 'text-slate-600 hover:bg-slate-100/50 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <Link
                href="/client/notifications"
                className="relative p-2.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
              </Link>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200/50">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 font-medium">{user?.role || 'Client'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
              >
                {sidebarOpen ? <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" /> : <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Premium styling */}
          {sidebarOpen && (
            <div className="lg:hidden pb-4 border-t border-slate-200 mt-2 space-y-1 animate-slideInUp">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200/50'
                        : 'text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200/50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content - Improved spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 animate-fadeIn">
        {children}
      </main>
      </div>
    </ClientGuard>
  );
}
