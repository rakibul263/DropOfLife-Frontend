'use client';

import React from 'react';
import { Truck, Heart } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { supportTranslations } from '@/lib/translations';

export type SupportPurpose = 'Cold_Chain_Courier' | 'Lifesaver_Fund';

interface SupportPurposeSelectorProps {
  selectedPurpose: SupportPurpose;
  onSelectPurpose: (purpose: SupportPurpose) => void;
}

export function SupportPurposeSelector({
  selectedPurpose,
  onSelectPurpose,
}: SupportPurposeSelectorProps) {
  const { language } = useLanguageStore();
  const t = supportTranslations[language];

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
        {t.purposeStep}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {/* Purpose 1: Cold Chain Courier */}
        <div
          onClick={() => onSelectPurpose('Cold_Chain_Courier')}
          className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 backdrop-blur-2xl overflow-hidden h-full flex flex-col justify-between ${
            selectedPurpose === 'Cold_Chain_Courier'
              ? 'bg-gradient-to-br from-rose-950/70 via-zinc-900/80 to-zinc-950/90 border-rose-500/80 shadow-[0_15px_40px_rgba(225,29,72,0.25)] ring-2 ring-rose-500/40 -translate-y-1'
              : 'bg-gradient-to-br from-white/[0.07] via-zinc-900/50 to-zinc-950/80 border-white/15 hover:border-white/30 hover:bg-white/[0.09] shadow-lg hover:-translate-y-0.5 ring-1 ring-white/5'
          }`}
        >
          {/* Glass specular sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative z-10 flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                selectedPurpose === 'Cold_Chain_Courier'
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-950 ring-1 ring-white/20 scale-105'
                  : 'bg-zinc-800/80 text-zinc-300 border border-white/10'
              }`}
            >
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">{t.courierTitle}</h4>
              <p className="text-xs text-rose-300 font-medium mt-0.5">{t.courierSub}</p>
            </div>
          </div>
          <p className="relative z-10 text-sm text-zinc-200 mt-4 leading-relaxed font-normal min-h-[64px] line-clamp-3">
            {t.courierDesc}
          </p>
        </div>

        {/* Purpose 2: Lifesaver Subsidy */}
        <div
          onClick={() => onSelectPurpose('Lifesaver_Fund')}
          className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 backdrop-blur-2xl overflow-hidden h-full flex flex-col justify-between ${
            selectedPurpose === 'Lifesaver_Fund'
              ? 'bg-gradient-to-br from-rose-950/70 via-zinc-900/80 to-zinc-950/90 border-rose-500/80 shadow-[0_15px_40px_rgba(225,29,72,0.25)] ring-2 ring-rose-500/40 -translate-y-1'
              : 'bg-gradient-to-br from-white/[0.07] via-zinc-900/50 to-zinc-950/80 border-white/15 hover:border-white/30 hover:bg-white/[0.09] shadow-lg hover:-translate-y-0.5 ring-1 ring-white/5'
          }`}
        >
          {/* Glass specular sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative z-10 flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                selectedPurpose === 'Lifesaver_Fund'
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-950 ring-1 ring-white/20 scale-105'
                  : 'bg-zinc-800/80 text-zinc-300 border border-white/10'
              }`}
            >
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">{t.subsidyTitle}</h4>
              <p className="text-xs text-rose-300 font-medium mt-0.5">{t.subsidySub}</p>
            </div>
          </div>
          <p className="relative z-10 text-sm text-zinc-200 mt-4 leading-relaxed font-normal min-h-[64px] line-clamp-3">
            {t.subsidyDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
