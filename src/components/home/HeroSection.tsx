'use client';

import React from 'react';
import Link from 'next/link';
import { BloodGroup } from '@/types';
import { BLOOD_GROUPS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Droplet, Search, ArrowRight, ShieldCheck, Clock, Heart, Users, Activity } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations } from '@/lib/translations';

interface HeroSectionProps {
  selectedBlood: BloodGroup;
  onSelectBlood: (bg: BloodGroup) => void;
  onQuickSearch: (e: React.FormEvent) => void;
}

export function HeroSection({
  selectedBlood,
  onSelectBlood,
  onQuickSearch,
}: HeroSectionProps) {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].hero;

  return (
    <div className="text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">
      {/* 1. Live Nationwide Dispatch Status Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-zinc-900/90 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-950/20 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
        </span>
        <span className="uppercase tracking-wider">{t.badge}</span>
      </div>

      {/* 2. Flat Modern High-Impact Clean Headline */}
      <div className="space-y-2">
        <h1 className="text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-normal leading-tight sm:leading-snug">
          <span className="inline-block text-zinc-100">{t.titlePart1}</span>{' '}
          <span className="bg-gradient-to-r from-rose-500 via-red-400 via-pink-400 to-rose-500 bg-clip-text text-transparent animate-text-shimmer inline-block">
            {t.titlePart2}
          </span>
        </h1>
        <p className="text-xs sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal pt-1">
          {t.desc}
        </p>
      </div>

      {/* 3. Unified Ergonomic Search & Emergency Dispatch Hub */}
      <div className="max-w-2xl mx-auto pt-2">
        <form
          onSubmit={onQuickSearch}
          className="p-2 sm:p-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2.5 ring-1 ring-white/10"
        >
          {/* Blood Dropdown */}
          <div className="flex items-center gap-2.5 flex-1 w-full pl-3 pr-2 py-1">
            <Droplet className="w-5 h-5 text-rose-500 fill-rose-500/20 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold text-zinc-200 shrink-0">
              {t.bloodGroupLabel}
            </span>
            <select
              value={selectedBlood}
              onChange={(e) => onSelectBlood(e.target.value as BloodGroup)}
              className="bg-zinc-800 text-white text-xs sm:text-sm font-black rounded-xl px-3.5 py-2.5 border border-zinc-700 focus:outline-none focus:border-rose-500 w-full cursor-pointer shadow-inner"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg} className="bg-zinc-900 text-white font-bold py-1">
                  {bg} {language === 'bn' ? 'গ্রুপের রক্ত' : 'Blood Type'}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search Action */}
          <Button
            type="submit"
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg shadow-rose-950/60 shrink-0 h-11 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Search className="w-4 h-4 mr-2" />
            <span>{t.findDonorsBtn}</span>
          </Button>
        </form>

        {/* Quick Direct Actions Strip */}
        <div className="flex flex-col min-[440px]:flex-row items-stretch min-[440px]:items-center justify-center gap-2.5 sm:gap-3 pt-3.5">
          <Link href="/emergency-requests" className="w-full min-[440px]:w-auto">
            <Button
              size="sm"
              className="w-full min-[440px]:w-auto bg-zinc-900 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 font-extrabold px-5 h-10 text-xs sm:text-sm rounded-xl border border-rose-500/40 shadow-md cursor-pointer justify-center"
            >
              <Activity className="w-4 h-4 mr-2 text-rose-500 animate-pulse" />
              <span>{t.requestBloodBtn}</span>
            </Button>
          </Link>

          <Link href="/register" className="w-full min-[440px]:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full min-[440px]:w-auto bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-extrabold px-5 h-10 text-xs sm:text-sm rounded-xl border border-zinc-700 shadow-md cursor-pointer justify-center"
            >
              <span>{t.registerDonorBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4. Live Telemetry Micro-Pill Row */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-zinc-300 font-medium border-t border-zinc-800/80 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{language === 'bn' ? '৬৪ জেলায় নেটওয়ার্ক সক্রিয়' : 'Active across 64 Districts'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          <span>{language === 'bn' ? 'গড় সাড়া: ৯.২ মিনিট' : 'Avg response: 9.2 mins'}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'bn' ? '১০০% অ-বাণিজ্যিক ও নিরাপদ' : '100% Voluntary & Safe'}</span>
        </div>
      </div>
    </div>
  );
}
