'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  ShieldAlert,
  Radio,
  Building2,
  Users,
  Droplet,
  LogOut,
  Home,
  Menu,
  X,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, initAuth } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dropoflife_admin_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch (e) {
      // ignore SSR or storage restrictions
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dropoflife_admin_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  interface NavItem {
    name: string;
    href: string;
    tabKey: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navItems: NavSection[] = [
    {
      title: 'Platform Governance',
      items: [
        {
          name: 'Central Mission Control',
          href: '/dashboard/admin?tab=overview',
          tabKey: 'overview',
          icon: Radio,
        },
        {
          name: 'Complaints Moderation',
          href: '/dashboard/admin?tab=complaints',
          tabKey: 'complaints',
          icon: AlertTriangle,
        },
        {
          name: 'Emergency Radar Feed',
          href: '/dashboard/admin?tab=radar',
          tabKey: 'radar',
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: 'Entity & Operations',
      items: [
        {
          name: 'User & Donor Control',
          href: '/dashboard/admin?tab=users',
          tabKey: 'users',
          icon: Users,
        },
        {
          name: 'Hospital Accreditation',
          href: '/dashboard/admin?tab=verifications',
          tabKey: 'verifications',
          icon: Building2,
        },
        {
          name: 'Financial & Fund Audit',
          href: '/dashboard/admin?tab=payments',
          tabKey: 'payments',
          icon: TrendingUp,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3.5 bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950">
            <Droplet className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-black text-sm text-white tracking-tight">DropOfLife</span>
            <span className="text-[10px] block font-mono text-rose-400 font-bold uppercase">Admin Console</span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Dedicated Fixed & Non-Scrolling Admin Sidebar with Minimize/Show Capability */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-zinc-950 border-r border-zinc-800/90 flex flex-col justify-between transition-all duration-300 ease-in-out h-screen overflow-hidden ${
            isCollapsed ? 'w-20' : 'w-72'
          } ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Top: Platform & Admin Badge + Minimize Toggle */}
          <div
            className={`border-b border-zinc-800/80 transition-all ${
              isCollapsed
                ? 'p-3 flex flex-col items-center gap-2.5'
                : 'p-4 flex items-center justify-between'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white shadow-md shadow-rose-950/40 border border-rose-500/50 shrink-0">
                <Droplet className="w-5 h-5 fill-white text-white" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-white tracking-tight">
                      Drop<span className="text-rose-500">OfLife</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/80 border border-rose-800 text-rose-300">
                      Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium truncate">Administration Portal</p>
                </div>
              )}
            </div>

            {/* Minimize / Expand Toggle Button on Sidebar Header */}
            <button
              type="button"
              onClick={toggleCollapse}
              className={`p-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer hidden lg:flex items-center justify-center ${
                isCollapsed ? 'w-8 h-8 mt-1' : ''
              }`}
              title={isCollapsed ? 'Show / Expand Sidebar' : 'Minimize Sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-rose-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links Sections (Completely non-scrolling, compact vertical distribution) */}
          <div className="flex-1 overflow-hidden px-2.5 py-3 flex flex-col justify-start space-y-4">
            {navItems.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono mb-1.5">
                    {section.title}
                  </h4>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = currentTab === item.tabKey;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        title={item.name}
                        className={`flex items-center rounded-xl transition-all ${
                          isCollapsed
                            ? 'justify-center p-2.5 mx-auto w-11 h-11 relative'
                            : 'justify-between px-3.5 py-2.5 text-sm font-semibold'
                        } ${
                          isActive
                            ? isCollapsed
                              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-bold'
                              : 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-950/60 font-bold border-l-4 border-rose-400'
                            : 'text-zinc-300 hover:text-white hover:bg-zinc-900/90'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                          {!isCollapsed && <span className="tracking-tight truncate">{item.name}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer: Admin Profile & Sign Out Actions */}
          <div className="p-3 border-t border-zinc-800/80 space-y-2 bg-zinc-950 shrink-0">
            {/* Current Admin User Identity Profile alongside signout */}
            {!isCollapsed ? (
              <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-rose-950 shrink-0">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.name || 'Rakibul hasan'}
                    </p>
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                      SUPER
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                    {user?.email || 'rakibul@dropoflife.com'}
                  </p>
                  <p className="text-[10px] text-rose-400 font-medium">Role: SUPER_ADMIN</p>
                </div>
              </div>
            ) : (
              <div
                className="flex justify-center py-1"
                title={`${user?.name || 'Rakibul hasan'} (${user?.email || 'rakibul@dropoflife.com'}) - SUPER_ADMIN`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-rose-950 cursor-pointer">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Link
                href="/"
                title="Back to Public Portal"
                className={`flex items-center rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors ${
                  isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'gap-2.5 px-3 py-2'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Back to Public Portal</span>}
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out Administration"
                className={`flex items-center rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer ${
                  isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'w-full gap-2.5 px-3 py-2'
                }`}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Sign Out Administration</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Admin Main Body & Content View with dynamic pl depending on isCollapsed */}
        <div
          className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
            isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
          }`}
        >
          {/* Top Administrative Bar */}
          <div className="sticky top-0 z-20 hidden lg:flex items-center justify-between px-8 py-3 bg-zinc-950/90 border-b border-zinc-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-zinc-300">DropOfLife Mission Control System</span>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Authorized Session • Super Administrator
            </div>
          </div>

          {/* Main Children Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-zinc-950">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminDedicatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">Loading Admin Interface...</div>}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
