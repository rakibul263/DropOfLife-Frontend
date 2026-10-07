'use client';

import React, { useState } from 'react';
import { BloodGroup } from '@/types';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY } from '@/lib/constants';
import { Card } from '../ui/Card';
import { Heart, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations, formatBilingualNumber } from '@/lib/translations';

export const BloodCompatibilityMatrix: React.FC = () => {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].matrix;
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');

  const compatibility = BLOOD_COMPATIBILITY[selectedGroup];
  const summaryText = t.summaries[selectedGroup] || compatibility.summary;

  return (
    <Card variant="crimson" className="p-5 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Subtle Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.12)_0%,transparent_70%)] blur-2xl"
        aria-hidden="true"
      />

      {/* 1. Header Section with Generous Padding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-7 border-b border-zinc-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{t.badge}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {t.title}
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed font-normal">
            {t.desc}
          </p>
        </div>

        {/* Selected Highlight Pill */}
        <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-700/80 px-5 py-3 rounded-2xl shrink-0 shadow-lg ring-1 ring-white/[0.05]">
          <span className="text-xs sm:text-sm text-zinc-300 font-extrabold uppercase tracking-wider">
            {t.selected}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-base shadow-md shadow-rose-950/60 ring-1 ring-rose-400/50">
            {selectedGroup}
          </span>
        </div>
      </div>

      {/* 2. Blood Group Selectors */}
      <div className="mb-9 space-y-3.5">
        <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
          {t.choosePrompt}
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3.5">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`py-2.5 sm:py-3.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-600 via-rose-600 to-red-600 border-rose-400 text-white shadow-[0_8px_22px_-3px_rgba(225,29,72,0.65)] font-black scale-[1.04] ring-2 ring-rose-400/40'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-200 font-extrabold hover:border-zinc-600 hover:text-white hover:bg-zinc-850 shadow-sm'
                }`}
              >
                <div className="text-base sm:text-xl font-black">{group}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Compatibility Cards Grid with Spacious Padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Can Donate Red Blood Cells To */}
        <div className="bg-gradient-to-b from-zinc-900/95 via-zinc-900/80 to-zinc-950/95 border border-emerald-500/25 ring-1 ring-emerald-500/10 hover:border-emerald-500/40 transition-colors rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 h-full">
          <div className="space-y-5">
            {/* Sub-Card Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </span>
                <span>{t.canGiveTo}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-black border border-emerald-500/30 shrink-0">
                {formatBilingualNumber(compatibility.giveTo.length, language)} {t.typesCount}
              </span>
            </div>

            {/* Compatible Group Pills with Generous Margins & Wrapping */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 py-1">
              {compatibility.giveTo.map((target) => (
                <span
                  key={target}
                  className="px-4 py-2 rounded-xl bg-emerald-950/90 text-emerald-200 border border-emerald-500/40 font-black text-sm sm:text-base shadow-sm hover:scale-105 transition-all"
                >
                  {target}
                </span>
              ))}
            </div>
          </div>

          {/* Comfortable Inner Note Box (Text never touches outer border) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 text-zinc-300 text-sm sm:text-base leading-relaxed font-normal min-h-[88px] flex items-center mt-auto shrink-0">
            <p>
              {language === 'bn' ? (
                <>
                  <strong className="text-white font-extrabold">{selectedGroup}</strong> রক্তধারী ব্যক্তিরা হেমালাইটিক রিঅ্যাকশন ছাড়া নিরাপদে উল্লেখিত গ্রুপের রোগীদের রক্তদান করতে পারেন।
                </>
              ) : (
                <>
                  Donors with <strong className="text-white font-extrabold">{selectedGroup}</strong> blood can safely donate red blood cells to these recipient types without triggering transfusion reactions.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Can Receive Blood From */}
        <div className="bg-gradient-to-b from-zinc-900/95 via-zinc-900/80 to-zinc-950/95 border border-sky-500/25 ring-1 ring-sky-500/10 hover:border-sky-500/40 transition-colors rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 h-full">
          <div className="space-y-5">
            {/* Sub-Card Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-sky-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                <span className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-4 h-4 text-sky-400" />
                </span>
                <span>{t.canReceiveFrom}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-950/80 text-sky-300 text-xs font-black border border-sky-500/30 shrink-0">
                {formatBilingualNumber(compatibility.receiveFrom.length, language)} {t.typesCount}
              </span>
            </div>

            {/* Matched Source Group Pills */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 py-1">
              {compatibility.receiveFrom.map((src) => (
                <span
                  key={src}
                  className="px-4 py-2 rounded-xl bg-sky-950/90 text-sky-200 border border-sky-500/40 font-black text-sm sm:text-base shadow-sm hover:scale-105 transition-all"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Comfortable Inner Note Box (Text never touches outer border) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-950/20 border border-sky-900/40 text-zinc-300 text-sm sm:text-base leading-relaxed font-normal min-h-[88px] flex items-center mt-auto shrink-0">
            <p>
              {language === 'bn' ? (
                <>
                  <strong className="text-white font-extrabold">{selectedGroup}</strong> গ্রুপের রোগীরা জরুরি পরিস্থিতিতে শুধুমাত্র এই রক্তদাতাদের থেকে নিরাপদ রক্ত গ্রহণ করতে পারেন।
                </>
              ) : (
                <>
                  Patients with <strong className="text-white font-extrabold">{selectedGroup}</strong> blood type can safely receive emergency transfusions from these matched voluntary donors.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Clinical Summary Banner with Refined Spacing */}
      <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-zinc-900/95 border border-zinc-800 ring-1 ring-white/[0.05] shadow-xl flex items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-rose-400 uppercase tracking-widest">
            {language === 'bn' ? 'চিকিৎসা নির্দেশিকা পর্যবেক্ষণ' : 'Clinical Protocol Observation'}
          </p>
          <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed">
            {summaryText}
          </p>
        </div>
      </div>
    </Card>
  );
};
