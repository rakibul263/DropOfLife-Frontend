'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useLanguageStore } from '@/stores/languageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { navTranslations } from '@/lib/translations';
import { Button } from '../ui/Button';
import {
  Droplet,
  Menu,
  X,
  Search,
  AlertCircle,
  Calendar,
  LogOut,
  User,
  Globe,
  Home,
  Heart,
  ShieldAlert,
  Bell,
  BellRing,
} from 'lucide-react';
import { ComplaintReportModal } from './ComplaintReportModal';
import { NotificationPanel } from './NotificationBell';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, initAuth } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { unreadCount, directRequests, togglePanel, isPanelOpen } = useNotificationStore();
  const pendingRequestsCount = directRequests.filter((r: any) => r.status === 'Pending').length;
  const totalBadgeCount = unreadCount + pendingRequestsCount;

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide platform navbar on admin & hospital dashboards, login, and register
  if (
    pathname?.startsWith('/dashboard/admin') ||
    pathname?.startsWith('/dashboard/provider') ||
    pathname?.startsWith('/dashboard/hospital') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  const loginUrl =
    pathname && pathname !== '/'
      ? `/login?redirect=${encodeURIComponent(pathname)}`
      : '/login';

  const t = navTranslations[language];

  const currentPath = pathname || '/';

  const navLinks = [
    { name: t.navLinks.home, href: '/', icon: Home },
    { name: t.navLinks.donors, href: '/donors', icon: Search },
    { name: t.navLinks.requests, href: '/emergency-requests', icon: AlertCircle },
    { name: t.navLinks.camps, href: '/camps', icon: Calendar },
    { name: t.navLinks.support, href: '/support', icon: Heart },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleLabel = (role?: string) => {
    if (role === 'admin') return t.auth.roleAdmin;
    if (role === 'provider') return t.auth.roleProvider;
    return t.auth.roleDonor;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 pt-2 sm:pt-3 px-2 sm:px-6 flex flex-col items-center">
      {/* Liquid Glass Navigation Shell */}
      <div
        className={`w-full max-w-[1600px] relative rounded-2xl sm:rounded-3xl transition-all duration-300 ${
          scrolled
            ? 'liquid-glass-scrolled py-1 shadow-2xl shadow-black/40 ring-1 ring-white/15'
            : 'liquid-glass py-1.5 shadow-xl shadow-black/25 ring-1 ring-white/10'
        }`}
      >
        {/* Top Edge Specular Highlight Line (Prismatic Glass Rim) */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full" />

        {/* Ambient Center Underglow */}
        <div
          className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 w-96 h-5 bg-rose-500/15 blur-xl"
          aria-hidden="true"
        />

        <div className="w-full flex h-15 sm:h-16 items-center justify-between px-3.5 sm:px-6 lg:px-8 relative z-10">
          {/* 1. Brand Logo: Liquid Jewel Droplet & Title (Always in English DropOfLife) */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {/* Luminous Liquid Jewel Icon */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white shadow-[0_0_20px_rgba(225,29,72,0.45)] border border-rose-300/40 shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {/* Internal Refraction Glint */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent pointer-events-none" />
              <Droplet className="w-4.5 h-4.5 fill-white text-white drop-shadow-sm" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-base min-[380px]:text-lg sm:text-xl font-black tracking-tight text-white whitespace-nowrap">
                <span className="text-white font-black">Drop</span>
                <span className="bg-gradient-to-r from-rose-500 to-red-400 bg-clip-text text-transparent font-black">OfLife</span>
              </span>
              <span className="hidden min-[360px]:inline text-[8px] min-[400px]:text-[9px] font-semibold tracking-[0.18em] text-zinc-400 uppercase whitespace-nowrap">
                {language === 'bn' ? 'এক ফোঁটা রক্ত · এক জীবন' : 'One Drop · One Life'}
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Capsule (Floating Liquid Pill Menu) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl liquid-pill shadow-inner">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? currentPath === '/'
                  : currentPath === link.href || currentPath.startsWith(`${link.href}/`);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'liquid-pill-active text-rose-300 font-black shadow-md'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isActive ? 'text-rose-400' : 'text-zinc-400'
                    }`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Desktop Right Actions: Liquid Language Toggle, Bell & Auth */}
          <div className="hidden sm:flex items-center gap-3.5 shrink-0">
            {/* BN / EN Compact Switch */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-pill text-xs font-black tracking-wide border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer group shadow-inner shrink-0"
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            >
              <Globe className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span className={language === 'bn' ? 'text-rose-400 font-black' : 'text-zinc-400 font-semibold'}>
                BN
              </span>
              <span className="text-zinc-600 text-[10px] font-normal">/</span>
              <span className={language === 'en' ? 'text-rose-400 font-black' : 'text-zinc-400 font-semibold'}>
                EN
              </span>
            </button>

            {/* Report Issue & Misbehavior Trigger Button */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-pill text-xs font-bold text-zinc-300 hover:text-amber-400 hover:bg-amber-500/10 border border-zinc-700/50 hover:border-amber-500/30 transition-all cursor-pointer group shadow-inner"
              title={
                language === 'bn'
                  ? 'ওয়েবসাইটের সমস্যা অথবা দুর্ব্যবহারের অভিযোগ জানান'
                  : 'Report site issue or user misbehavior'
              }
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">
                {language === 'bn' ? 'অভিযোগ / ইস্যু' : 'Report'}
              </span>
            </button>

            {/* Emergency Blood Alert Bell Icon */}
            <button
              type="button"
              onClick={togglePanel}
              data-notif-trigger
              id="navbar-alert-bell"
              className={`relative p-2 rounded-xl liquid-pill border transition-all cursor-pointer group shadow-inner shrink-0 ${
                totalBadgeCount > 0
                  ? 'border-rose-500/70 text-rose-300 bg-rose-950/30 shadow-[0_0_15px_rgba(225,29,72,0.35)] hover:border-rose-400 hover:text-white'
                  : 'border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-500/50'
              }`}
              title={language === 'bn' ? 'জরুরি রক্তের অ্যালার্ট' : 'Emergency Blood Alerts'}
              aria-label="Emergency Blood Alerts"
            >
              {totalBadgeCount > 0 ? (
                <BellRing className="w-4 h-4 text-rose-400 transition-all group-hover:scale-110 animate-bounce" />
              ) : (
                <Bell className="w-4 h-4 text-zinc-400 transition-all group-hover:scale-110" />
              )}
              {totalBadgeCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-gradient-to-r from-rose-600 to-red-500 text-white text-[9px] font-black flex items-center justify-center px-1 shadow-sm border border-white/20 animate-pulse">
                  {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
                </span>
              )}
            </button>

            {/* Authentication Action */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5 shrink-0 max-w-[220px]">
                <Link
                  href={`/dashboard/${user.role?.toLowerCase() || 'donor'}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-pill border border-white/10 hover:border-rose-500/40 hover:bg-white/[0.08] transition-all shrink-1 min-w-0 group"
                  title={user.name}
                >
                  <User className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-xs font-extrabold text-white truncate max-w-[105px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 shrink-0 bg-zinc-800/80 px-1.5 py-0.5 rounded-lg border border-zinc-700/60 group-hover:border-rose-500/40">
                    {getRoleLabel(user.role)}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 liquid-pill text-zinc-400 hover:text-red-400 hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer shrink-0"
                  title={t.auth.signOut}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href={loginUrl}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-[0_4px_20px_-2px_rgba(225,29,72,0.55)] hover:shadow-[0_6px_25px_rgba(225,29,72,0.75)] border border-rose-400/40 transition-all duration-200 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                >
                  {t.auth.signIn}
                </Button>
              </Link>
            )}
          </div>

          {/* 4. Mobile Menu Trigger Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Emergency Blood Alert Bell */}
            <button
              onClick={togglePanel}
              data-notif-trigger
              id="mobile-alert-bell"
              className={`relative p-2 rounded-xl liquid-pill border transition-all cursor-pointer shrink-0 ${
                totalBadgeCount > 0
                  ? 'border-rose-500/70 text-rose-300 bg-rose-950/30 shadow-[0_0_15px_rgba(225,29,72,0.35)]'
                  : 'border-zinc-700/50 text-zinc-400'
              }`}
              title={language === 'bn' ? 'জরুরি রক্তের অ্যালার্ট' : 'Emergency Blood Alerts'}
              aria-label="Emergency Blood Alerts"
            >
              {totalBadgeCount > 0 ? (
                <BellRing className="w-5 h-5 text-rose-400 animate-bounce" />
              ) : (
                <Bell className="w-5 h-5 text-zinc-400" />
              )}
              {totalBadgeCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center px-1 border border-white/20 animate-pulse">
                  {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl liquid-pill text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Matching Liquid Glass Sheet) */}
      {mobileMenuOpen && (
        <div
          data-lenis-prevent="true"
          className="lg:hidden w-full max-w-[1600px] mt-2 rounded-2xl sm:rounded-3xl border border-white/15 bg-zinc-950/98 backdrop-blur-3xl px-4 sm:px-5 pt-4 pb-7 space-y-4 shadow-2xl shadow-black/80 ring-1 ring-white/10 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain chat-custom-scrollbar"
        >
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl liquid-pill">
            <span className="text-xs text-zinc-300 font-extrabold flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" />
              {language === 'bn' ? 'ভাষা:' : 'Language:'}
            </span>
            <button
              type="button"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-pill text-xs font-black tracking-wide border border-white/10"
            >
              <span className={language === 'bn' ? 'text-rose-400 font-black' : 'text-zinc-400 font-semibold'}>
                BN
              </span>
              <span className="text-zinc-600 text-[10px]">/</span>
              <span className={language === 'en' ? 'text-rose-400 font-black' : 'text-zinc-400 font-semibold'}>
                EN
              </span>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? currentPath === '/'
                  : currentPath === link.href || currentPath.startsWith(`${link.href}/`);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'liquid-pill-active text-rose-300 font-black shadow-md'
                      : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-rose-400' : 'text-zinc-400'
                      }`}
                    />
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Complaint/Issue Report Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsReportModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-black transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{language === 'bn' ? 'অভিযোগ অথবা ওয়েবসাইটের সমস্যা জানান' : 'Report Misbehavior / Website Issue'}</span>
            </button>
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2.5">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={`/dashboard/${user.role?.toLowerCase() || 'donor'}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="md" className="w-full rounded-2xl font-black">
                    {t.auth.dashboard} ({getRoleLabel(user.role)})
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-red-400 hover:text-red-300 hover:bg-zinc-900 rounded-2xl font-bold"
                >
                  {t.auth.signOut}
                </Button>
              </>
            ) : (
              <Link href={loginUrl} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  size="md"
                  className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black rounded-2xl shadow-xl shadow-rose-950/60"
                >
                  {t.auth.signIn}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Global Complaint & Website Issue Modal */}
      <ComplaintReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultType="website_issue"
      />

      {/* Notification Panel (Dropdown from Navbar Bell) */}
      {isPanelOpen && <NotificationPanel />}
    </header>
  );
};
