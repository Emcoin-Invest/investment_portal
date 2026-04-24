'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, Bell } from 'lucide-react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/client/dashboard', label: 'Dashboard' },
    { href: '/client/portfolio', label: 'Portfolio' },
    { href: '/client/statements', label: 'Statements' },
    { href: '/client/requests', label: 'Requests' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-slate-900">Investment Portal</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block w-64 bg-white border-r border-slate-200 min-h-screen fixed lg:relative z-30 lg:z-0`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Investment Portal</h2>

            {/* Navigation */}
            <nav className="space-y-2 mb-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User info */}
            <div className="border-t border-slate-200 pt-4">
              <div className="mb-4">
                <p className="text-sm text-slate-600">Logged in as</p>
                <p className="font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 w-full lg:w-auto">
          {/* Top bar */}
          <div className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4">
            <h1 className="text-lg font-semibold text-slate-900">Client Portal</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg relative">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
