'use client';

import React, { useEffect, useState } from 'react';
import { useToastStore, ToastItem } from '@/stores/toastStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

function ToastCard({ toastItem }: { toastItem: ToastItem }) {
  const { removeToast } = useToastStore();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = toastItem.duration || 4500;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          removeToast(toastItem.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toastItem, removeToast]);

  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      border: 'border-emerald-500/50 shadow-[0_15px_40px_rgba(16,185,129,0.35)]',
      glow: 'bg-emerald-500/10',
      progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      titleColor: 'text-emerald-300',
      defaultTitle: 'সফল (Success)',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      border: 'border-rose-500/60 shadow-[0_15px_40px_rgba(225,29,72,0.4)]',
      glow: 'bg-rose-500/15',
      progressBar: 'bg-gradient-to-r from-rose-600 to-red-500',
      titleColor: 'text-rose-300',
      defaultTitle: 'ত্রুটি (Error Alert)',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      border: 'border-amber-500/50 shadow-[0_15px_40px_rgba(245,158,11,0.35)]',
      glow: 'bg-amber-500/10',
      progressBar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      titleColor: 'text-amber-300',
      defaultTitle: 'সতর্কতা (Warning)',
    },
    info: {
      icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
      border: 'border-cyan-500/50 shadow-[0_15px_40px_rgba(6,182,212,0.35)]',
      glow: 'bg-cyan-500/10',
      progressBar: 'bg-gradient-to-r from-cyan-500 to-blue-400',
      titleColor: 'text-cyan-300',
      defaultTitle: 'বিজ্ঞপ্তি (Notification)',
    },
  }[toastItem.type];

  return (
    <div
      role="alert"
      className={`relative w-[340px] sm:w-[390px] rounded-2xl bg-zinc-950/90 border ${config.border} p-4 backdrop-blur-2xl text-white shadow-2xl transition-all duration-300 animate-in slide-in-from-top-4 fade-in overflow-hidden select-none group`}
    >
      {/* Specular Top Sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className={`pointer-events-none absolute -top-10 -right-10 w-24 h-24 ${config.glow} rounded-full blur-xl`} />

      <div className="flex items-start gap-3 relative z-10">
        <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 shrink-0">
          {config.icon}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4 className={`text-xs font-black tracking-tight ${config.titleColor}`}>
            {toastItem.title || config.defaultTitle}
          </h4>
          <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed break-words">
            {toastItem.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeToast(toastItem.id)}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Shrinking Time Indicator Bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/10 overflow-hidden">
        <div
          className={`h-full ${config.progressBar} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function LiquidToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-4 sm:right-6 z-[999999] flex flex-col gap-3 pointer-events-auto items-end"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toastItem={item} />
      ))}
    </div>
  );
}
