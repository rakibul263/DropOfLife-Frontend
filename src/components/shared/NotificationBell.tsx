'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, CheckCircle, Droplet, XCircle, Info } from 'lucide-react';
import { useNotificationStore, AppNotification } from '@/stores/notificationStore';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import { BloodAlertIcon, BloodAlert3DEmblem } from './BloodAlertIcon';

// Helper: get icon by notification type
function getNotifIcon(type: AppNotification['type']) {
  if (type === 'critical') return <Droplet className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />;
  if (type === 'pledge') return <Droplet className="w-4 h-4 text-rose-400 fill-rose-400" />;
  if (type === 'cancel') return <XCircle className="w-4 h-4 text-amber-400" />;
  if (type === 'success') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  return <Info className="w-4 h-4 text-zinc-400" />;
}

/**
 * NotificationPanel — Dropdown panel rendered inside the Navbar.
 * Exported separately and used in Navbar.tsx when isPanelOpen is true.
 */
export function NotificationPanel() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    activeToast,
    isPanelOpen,
    directRequests,
    setPanelOpen,
    dismissToast,
    markAllRead,
    markRead,
    clearAll,
  } = useNotificationStore();
  const { language } = useLanguageStore();

  const pendingRequestsCount = directRequests.filter((r: any) => r.status === 'Pending').length;
  const totalBadgeCount = unreadCount + pendingRequestsCount;

  // Close panel on outside click
  useEffect(() => {
    if (!isPanelOpen) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-notif-panel]') && !target.closest('[data-notif-trigger]')) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isPanelOpen, setPanelOpen]);

  return (
    <div
      data-notif-panel
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed sm:absolute top-16 sm:top-full right-2 sm:right-6 mt-2 w-[calc(100vw-16px)] sm:w-96 max-w-[420px] max-h-[80vh] flex flex-col rounded-2xl bg-zinc-950/98 border border-zinc-700/80 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-[9990]"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <BloodAlertIcon size="sm" pulse={totalBadgeCount > 0} />
          <span className="text-sm font-black text-white">
            {language === 'bn' ? 'জরুরি রক্তের অ্যালার্ট' : 'Emergency Blood Alerts'}
          </span>
          {totalBadgeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
              {totalBadgeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'সব পড়েছি' : 'Mark all read'}
            </button>
          )}
          <button
            onClick={() => setPanelOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Direct Blood Requests Section */}
      {directRequests.length > 0 && (
        <div className="p-3 bg-gradient-to-r from-rose-950/90 to-red-950/90 border-b border-rose-500/40 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-rose-300 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {language === 'bn'
                ? `🚨 সরাসরি রক্তের আবেদন (${directRequests.length}টি)`
                : `🚨 Direct Requests (${directRequests.length})`}
            </span>
            <button
              type="button"
              onClick={() => {
                setPanelOpen(false);
                router.push('/dashboard/donor');
              }}
              className="text-[10px] font-bold text-rose-300 hover:text-white underline cursor-pointer"
            >
              {language === 'bn' ? 'প্রোফাইলে দেখুন' : 'View in profile'}
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {directRequests.slice(0, 3).map((req: any) => (
              <div
                key={req._id || req.id}
                onClick={() => {
                  setPanelOpen(false);
                  router.push('/dashboard/donor');
                }}
                className="p-2.5 rounded-xl bg-black/50 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {req.patientName} ({req.bloodGroup})
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">
                    {req.unitsNeeded || 1} ব্যাগ
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 truncate">
                  🏥 {req.hospitalName}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-zinc-400 font-mono">
                    📞 {req.contactNumber}
                  </span>
                  <span className="text-rose-400 font-extrabold flex items-center gap-0.5">
                    {language === 'bn' ? 'প্রোফাইলে দেখুন →' : 'View in Profile →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
        {notifications.length === 0 && directRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-500">
            <BloodAlertIcon size="md" pulse={false} className="opacity-30" />
            <p className="text-xs font-bold">
              {language === 'bn' ? 'কোনো জরুরি রক্তের অ্যালার্ট নেই' : 'No active emergency alerts'}
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => {
                markRead(notif.id);
                if (notif.type === 'critical' || notif.requestId) {
                  setPanelOpen(false);
                  router.push('/dashboard/donor');
                }
              }}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-all cursor-pointer hover:bg-zinc-900/80 ${
                !notif.read ? 'bg-zinc-900/60' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                {getNotifIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-white truncate">{notif.title}</p>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">{notif.body}</p>
                <p className="text-[10px] text-zinc-600 font-mono">
                  {formatTimeAgo(new Date(notif.timestamp).toISOString())}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Clear All Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-800/80 shrink-0">
          <button
            onClick={clearAll}
            className="text-[10px] font-bold text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'সব মুছে দিন' : 'Clear all'}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * NotificationBell — Global manager for polling + toast alerts.
 * No longer renders a floating button. Just manages background polling and toasts.
 * Placed in layout.tsx for global coverage.
 */
export function NotificationBell() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const {
    activeToast,
    isPanelOpen,
    directRequests,
    setPanelOpen,
    setDirectRequests,
    dismissToast,
    markRead,
    addNotification,
  } = useNotificationStore();
  const { language } = useLanguageStore();

  // Initialize auth from cache if needed
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Audio alert chime using native Web Audio API
  const playAlertChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // Global polling for direct blood requests targeting the logged-in donor
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const donorId = user._id || user.id || user.email;
    if (!donorId) return;

    const checkDirectRequests = async () => {
      try {
        const res = await api.get('/requests', {
          params: {
            targetDonorId: donorId,
            targetDonorEmail: user.email,
            targetDonorPhone: user.phone,
            forMe: 'true',
          },
        });
        const requests = res.data?.data?.requests || [];
        if (!Array.isArray(requests)) return;

        setDirectRequests(requests);
        if (requests.length === 0) return;

        const alertedKey = `dropoflife_alerted_direct_${user.email || donorId}`;
        let alertedIds: string[] = [];
        try {
          alertedIds = JSON.parse(localStorage.getItem(alertedKey) || '[]');
        } catch (e) {}

        let hasNew = false;
        for (const req of requests) {
          const reqId = req._id || req.id;
          if (!reqId || alertedIds.includes(reqId)) continue;

          addNotification({
            title:
              language === 'bn'
                ? '🚨 নতুন রক্তের সরাসরি আবেদন!'
                : '🚨 New Direct Blood Request!',
            body:
              language === 'bn'
                ? `${req.requesterName || 'রোগীর স্বজন'} ${req.patientName}-এর জন্য জরুরি ভিত্তিতে ${req.bloodGroup} রক্ত চেয়ে আপনার প্রোফাইলে আবেদন জানিয়েছেন।`
                : `${req.requesterName || 'Attendant'} directly requested ${req.bloodGroup} blood for ${req.patientName}.`,
            type: 'critical',
            requestId: reqId,
          });

          alertedIds.push(reqId);
          hasNew = true;
        }

        if (hasNew) {
          playAlertChime();
          try {
            localStorage.setItem(alertedKey, JSON.stringify(alertedIds));
          } catch (e) {}
        }
      } catch (err) {
        // Silently catch background poll error
      }
    };

    checkDirectRequests();
    const interval = setInterval(checkDirectRequests, 5000);

    const onDonorRequested = () => {
      checkDirectRequests();
    };
    window.addEventListener('dropoflife_donor_requested', onDonorRequested);
    window.addEventListener('storage', onDonorRequested);

    return () => {
      clearInterval(interval);
      window.removeEventListener('dropoflife_donor_requested', onDonorRequested);
      window.removeEventListener('storage', onDonorRequested);
    };
  }, [isAuthenticated, user?.id, user?._id, user?.email, user?.role, language, addNotification, setDirectRequests]);

  // Auto-dismiss active toast after 5 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeToast, dismissToast]);

  // Hide on auth pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <>
      {/* Real-time Interactive Toast Notification Alert (bottom-right) */}
      {activeToast && !isPanelOpen && (
        <div
          role="alert"
          onClick={() => {
            markRead(activeToast.id);
            dismissToast();
            if (activeToast.type === 'critical' || activeToast.requestId) {
              router.push('/dashboard/donor');
            } else {
              setPanelOpen(true);
            }
          }}
          className="fixed bottom-20 sm:bottom-24 right-3 sm:right-5 z-[9999] w-[calc(100vw-24px)] sm:w-96 max-w-[400px] rounded-2xl bg-zinc-900/95 border border-rose-500/60 shadow-[0_15px_40px_-5px_rgba(225,29,72,0.35)] p-3.5 sm:p-4 flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-3 fade-in duration-300 cursor-pointer hover:border-rose-400 transition-all select-none ring-1 ring-rose-500/20"
        >
          <BloodAlert3DEmblem size={38} className="shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-black text-white truncate">
                {activeToast.title}
              </h4>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissToast();
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed line-clamp-3">
              {activeToast.body}
            </p>
            <span className="text-[9px] text-rose-400 font-mono mt-1 block">
              {language === 'bn' ? 'প্রোফাইলে দেখতে ক্লিক করুন • এখনই' : 'Click to view in profile • Just now'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

