'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/client/dashboard" className="flex items-center gap-3 font-bold text-lg text-slate-900 hover:text-blue-600 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                IP
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Investment Portal</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <Link
                href="/client/notifications"
                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </Link>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {sidebarOpen && (
            <div className="lg:hidden pb-4 border-t border-slate-200 mt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
