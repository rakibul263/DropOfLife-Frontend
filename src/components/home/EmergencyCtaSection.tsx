'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PhoneCall, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BloodAlertIcon } from '@/components/shared/BloodAlertIcon';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations } from '@/lib/translations';

export function EmergencyCtaSection() {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].cta;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/90 via-zinc-900/95 to-zinc-950 border border-rose-500/40 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl ring-1 ring-rose-500/20">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <BloodAlertIcon size="sm" pulse={true} />
            <span>{t.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {t.title}
          </h2>

          <p className="text-zinc-100 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
            {t.desc}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            {/* Primary Landline Hotline */}
            <a
              href="tel:029351969"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 font-black text-base shadow-2xl hover:scale-105 transition-transform"
            >
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <span>{t.hotlineBtn}</span>
            </a>

            {/* Mobile 24/7 Hotline */}
            <a
              href="tel:+8801521711716"
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-white font-mono font-bold text-sm sm:text-base hover:border-rose-400 hover:bg-rose-900 transition-all shadow-xl"
            >
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>{t.mobileBtn}</span>
            </a>

            <Link href="/emergency-requests">
              <Button
                variant="outline"
                size="lg"
                className="h-14 border-zinc-700 bg-zinc-900/95 hover:bg-zinc-800 text-white font-bold text-sm sm:text-base px-6 rounded-2xl shadow-xl"
              >
                <span>{t.broadcastBtn}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 bg-zinc-950/90 rounded-2xl border border-zinc-800 ring-1 ring-white/[0.05] p-7 space-y-5 shadow-2xl">
          <div className="flex items-center gap-2.5 text-rose-400">
            <HeartHandshake className="w-5 h-5 text-rose-400" />
            <span className="font-extrabold text-white text-base">{t.protocolTitle}</span>
          </div>
          <ul className="text-sm text-zinc-200 space-y-3">
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-500/30" />
              <span className="font-medium">{t.protocol1}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-500/30" />
              <span className="font-medium">{t.protocol2}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-500/30" />
              <span className="font-medium">{t.protocol3}</span>
            </li>
          </ul>
          <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-zinc-300 text-xs sm:text-sm font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.protocolSafety}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
