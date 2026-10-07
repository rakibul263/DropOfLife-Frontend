'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  Building2,
  Layers,
  Clock,
  Calendar,
  Heart,
  Droplet,
  LogOut,
  Home,
  Menu,
  X,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

function ProviderLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, initAuth } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentTab = searchParams.get('tab') || 'inventory';

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dropoflife_provider_sidebar_collapsed');
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
        localStorage.setItem('dropoflife_provider_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    if (user) {
      const userRole = (user.role || '').toLowerCase();
      if (userRole !== 'provider' && userRole !== 'hospital') {
        const dest = userRole === 'admin' ? '/dashboard/admin' : '/dashboard/donor';
        router.replace(dest);
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
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
      title: 'Blood Bank & Storage',
      items: [
        {
          name: 'Cold Storage & Inventory',
          href: '/dashboard/provider?tab=inventory',
          tabKey: 'inventory',
          icon: Layers,
        },
        {
          name: 'Emergency Request Queue',
          href: '/dashboard/provider?tab=requests',
          tabKey: 'requests',
          icon: Clock,
        },
      ],
    },
    {
      title: 'Outreach & Network',
      items: [
        {
          name: 'Donation Drives & Camps',
          href: '/dashboard/provider?tab=camps',
          tabKey: 'camps',
          icon: Calendar,
        },
        {
          name: 'Local Donor Radar',
          href: '/dashboard/provider?tab=donors',
          tabKey: 'donors',
          icon: Heart,
        },
        {
          name: 'Hospital Accreditation',
          href: '/dashboard/provider?tab=profile',
          tabKey: 'profile',
          icon: Building2,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3.5 bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-950">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm text-white tracking-tight">DropOfLife</span>
            <span className="text-[10px] block font-mono text-cyan-400 font-bold uppercase">
              Hospital Portal
            </span>
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
        {/* Dedicated Fixed & Non-Scrolling Hospital Sidebar with Minimize/Show Capability */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-zinc-950 border-r border-zinc-800/90 flex flex-col justify-between transition-all duration-300 ease-in-out h-screen overflow-hidden ${
            isCollapsed ? 'w-20' : 'w-72'
          } ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Top: Hospital Branding & Minimize Toggle */}
          <div
            className={`border-b border-zinc-800/80 transition-all ${
              isCollapsed
                ? 'p-3 flex flex-col items-center gap-2.5'
                : 'p-4 flex items-center justify-between'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 text-white shadow-md shadow-cyan-950/40 border border-cyan-500/50 shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-white tracking-tight">
                      Drop<span className="text-rose-500">OfLife</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                      Hospital
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium truncate">
                    Healthcare Provider Desk
                  </p>
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
                <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links Sections (Fixed, non-scrolling vertical distribution) */}
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
                              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950 font-bold'
                              : 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-950/60 font-bold border-l-4 border-cyan-300'
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

          {/* Sidebar Footer: Hospital Profile & Sign Out Actions */}
          <div className="p-3 border-t border-zinc-800/80 space-y-2 bg-zinc-950 shrink-0">
            {!isCollapsed ? (
              <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-cyan-950 shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.organizationName || user?.name || 'Dhaka Central Blood Bank'}
                    </p>
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                      DGHS
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                    {user?.licenseNumber || 'DGHS-BB-2024-984'}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-medium">Role: PROVIDER</p>
                </div>
              </div>
            ) : (
              <div
                className="flex justify-center py-1"
                title={`${user?.organizationName || user?.name || 'Dhaka Central Blood Bank'} - DGHS-BB-2024-984`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-cyan-950 cursor-pointer">
                  <Building2 className="w-4 h-4 text-white" />
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
                title="Sign Out Hospital Desk"
                className={`flex items-center rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer ${
                  isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'w-full gap-2.5 px-3 py-2'
                }`}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Sign Out Hospital Desk</span>}
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

        {/* Hospital Main Body with dynamic pl depending on isCollapsed */}
        <div
          className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
            isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
          }`}
        >
          {/* Top Hospital Operations Status Bar */}
          <div className="sticky top-0 z-20 hidden lg:flex items-center justify-between px-8 py-3 bg-zinc-950/90 border-b border-zinc-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-300">
                Hospital Clinical Blood Bank Desk • DGHS License: DGHS-BB-2024-984
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified Provider
              </span>
              <span>Authorized Session</span>
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

export default function ProviderDedicatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">
          Loading Hospital Interface...
        </div>
      }
    >
      <ProviderLayoutInner>{children}</ProviderLayoutInner>
    </Suspense>
  );
}
