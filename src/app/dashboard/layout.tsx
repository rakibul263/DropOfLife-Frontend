'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  Heart,
  Building2,
  ShieldAlert,
  Droplet,
  LogOut,
  Home,
  Layers,
  Radio,
  Clock,
  Calendar,
  CheckCircle,
  FileCheck,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAuthenticated, isLoading, logout, initAuth } =
    useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // If visiting /dashboard/admin, /dashboard/provider, or /dashboard/donor, let them render independently
  if (
    pathname?.startsWith('/dashboard/admin') ||
    pathname?.startsWith('/dashboard/provider') ||
    pathname?.startsWith('/dashboard/hospital') ||
    pathname?.startsWith('/dashboard/donor')
  ) {
    return <>{children}</>;
  }

  const getSidebarLinks = () => {
    if (role === 'admin') {
      return [
        { name: 'Mission Control', href: '/dashboard/admin', icon: Radio },
        { name: 'Emergency Radar', href: '/emergency-requests', icon: ShieldAlert },
        { name: 'Donor Directory', href: '/donors', icon: Heart },
        { name: 'Blood Drives', href: '/camps', icon: Calendar },
      ];
    }
    if (role === 'provider') {
      return [
        { name: 'Inventory & Stock', href: '/dashboard/provider', icon: Layers },
        { name: 'Emergency Requests', href: '/emergency-requests', icon: Clock },
        { name: 'Blood Drives', href: '/camps', icon: Calendar },
        { name: 'Public Directory', href: '/donors', icon: Heart },
      ];
    }
    // Default: donor
    return [
      { name: 'Lifesaver Portal', href: '/dashboard/donor', icon: Heart },
      { name: 'Emergency Feed', href: '/emergency-requests', icon: Clock },
      { name: 'Find Donors', href: '/donors', icon: Droplet },
      { name: 'Blood Camps', href: '/camps', icon: Calendar },
    ];
  };

  const links = getSidebarLinks();

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4.5rem)]">
      {/* Dashboard Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 p-4 sm:p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User Badge Banner */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
              {role === 'admin' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : role === 'provider' ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">
                {user?.name || 'Authenticated User'}
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-800/40 inline-block">
                Role: {role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 bg-zinc-900/40 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </section>
    </div>
  );
}
