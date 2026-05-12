'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/design-system/components';

const clientNavItems = [
  { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/client/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/client/statements', label: 'Statements', icon: FileText },
  { href: '/client/requests', label: 'Requests', icon: MessageSquare },
];

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Briefcase },
  { href: '/admin/requests', label: 'Requests', icon: MessageSquare },
  { href: '/admin/statements', label: 'Statements', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) return null;

  const navItems = user.role === 'admin' ? adminNavItems : clientNavItems;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 shadow-lg transition-all duration-300 z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200">
            <h1 className="text-2xl font-bold text-blue-600">InvestPortal</h1>
            <p className="text-xs text-neutral-500 mt-1">{user.role.toUpperCase()}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200',
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-neutral-200 space-y-3">
            <div className="px-4 py-3 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500">Logged in as</p>
              <p className="font-medium text-neutral-900 truncate">{user.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              fullWidth
              icon={<LogOut className="w-4 h-4" />}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
