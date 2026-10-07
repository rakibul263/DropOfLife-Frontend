'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  Scale,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations } from '@/lib/translations';

export const EligibilityChecker: React.FC = () => {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].eligibility;

  const [ageOk, setAgeOk] = useState<boolean | null>(null);
  const [weightOk, setWeightOk] = useState<boolean | null>(null);
  const [timeOk, setTimeOk] = useState<boolean | null>(null);
  const [healthyOk, setHealthyOk] = useState<boolean | null>(null);

  const allAnswered =
    ageOk !== null && weightOk !== null && timeOk !== null && healthyOk !== null;
  const isEligible = ageOk && weightOk && timeOk && healthyOk;

  const resetQuiz = () => {
    setAgeOk(null);
    setWeightOk(null);
    setTimeOk(null);
    setHealthyOk(null);
  };

  return (
    <Card variant="crimson" className="p-5 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-7 border-b border-zinc-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>{t.badge}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {t.title}
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed font-normal">
            {t.desc}
          </p>
        </div>

        {allAnswered && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetQuiz}
            className="text-xs sm:text-sm font-bold gap-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white self-start md:self-auto shrink-0 px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetBtn}</span>
          </Button>
        )}
      </div>

      {/* 4 Interactive Checks */}
      {/* 4 Interactive Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 items-stretch">
        {/* Q1: Age */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 ring-1 ring-white/[0.05] flex flex-col justify-between shadow-xl transition-all h-full">
          <div>
            <div className="flex items-center gap-2.5 text-white font-extrabold text-sm sm:text-base mb-2 min-h-[28px]">
              <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{t.q1Title}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 mb-5 leading-relaxed font-normal min-h-[56px] line-clamp-3">
              {t.q1Desc}
            </p>
          </div>
          <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-800/80 mt-auto shrink-0">
            <button
              onClick={() => setAgeOk(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                ageOk === true
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-black ring-2 ring-emerald-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.yes}
            </button>
            <button
              onClick={() => setAgeOk(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                ageOk === false
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black ring-2 ring-rose-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.no}
            </button>
          </div>
        </div>

        {/* Q2: Weight */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 ring-1 ring-white/[0.05] flex flex-col justify-between shadow-xl transition-all h-full">
          <div>
            <div className="flex items-center gap-2.5 text-white font-extrabold text-sm sm:text-base mb-2 min-h-[28px]">
              <Scale className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{t.q2Title}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 mb-5 leading-relaxed font-normal min-h-[56px] line-clamp-3">
              {t.q2Desc}
            </p>
          </div>
          <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-800/80 mt-auto shrink-0">
            <button
              onClick={() => setWeightOk(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                weightOk === true
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-black ring-2 ring-emerald-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.yes}
            </button>
            <button
              onClick={() => setWeightOk(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                weightOk === false
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black ring-2 ring-rose-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.no}
            </button>
          </div>
        </div>

        {/* Q3: Time Interval */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 ring-1 ring-white/[0.05] flex flex-col justify-between shadow-xl transition-all h-full">
          <div>
            <div className="flex items-center gap-2.5 text-white font-extrabold text-sm sm:text-base mb-2 min-h-[28px]">
              <Heart className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.q3Title}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 mb-5 leading-relaxed font-normal min-h-[56px] line-clamp-3">
              {t.q3Desc}
            </p>
          </div>
          <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-800/80 mt-auto shrink-0">
            <button
              onClick={() => setTimeOk(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                timeOk === true
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-black ring-2 ring-emerald-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.yes}
            </button>
            <button
              onClick={() => setTimeOk(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                timeOk === false
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black ring-2 ring-rose-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.no}
            </button>
          </div>
        </div>

        {/* Q4: Well-being */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 ring-1 ring-white/[0.05] flex flex-col justify-between shadow-xl transition-all h-full">
          <div>
            <div className="flex items-center gap-2.5 text-white font-extrabold text-sm sm:text-base mb-2 min-h-[28px]">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.q4Title}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 mb-5 leading-relaxed font-normal min-h-[56px] line-clamp-3">
              {t.q4Desc}
            </p>
          </div>
          <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-800/80 mt-auto shrink-0">
            <button
              onClick={() => setHealthyOk(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                healthyOk === true
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-black ring-2 ring-emerald-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.yes}
            </button>
            <button
              onClick={() => setHealthyOk(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                healthyOk === false
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black ring-2 ring-rose-400/40'
                  : 'bg-zinc-850 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {t.no}
            </button>
          </div>
        </div>
      </div>

      {/* Result Display Banner */}
      {allAnswered && (
        <div className="transition-all duration-300 animate-in fade-in">
          {isEligible ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border border-emerald-500/70 ring-1 ring-emerald-500/40 p-6 sm:p-7 rounded-2xl text-emerald-100 shadow-2xl">
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 bg-emerald-900/90 border border-emerald-500/60 rounded-2xl text-emerald-300 shrink-0 shadow-lg shadow-emerald-950">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-lg sm:text-xl text-white">
                    {t.eligibleTitle}
                  </h4>
                  <p className="text-sm sm:text-base text-zinc-200 mt-1 leading-relaxed">
                    {t.eligibleDesc}
                  </p>
                </div>
              </div>
              <Link href="/emergency-requests" className="w-full sm:w-auto shrink-0">
                <Button variant="primary" size="lg" className="w-full sm:w-auto font-extrabold gap-2 shadow-xl shadow-emerald-950/60 px-6 py-3 justify-center">
                  <span>{t.viewUrgentNeedsBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-start sm:items-center gap-4 bg-gradient-to-r from-amber-950 via-zinc-900 to-zinc-950 border border-amber-500/70 ring-1 ring-amber-500/40 p-6 sm:p-7 rounded-2xl text-amber-100 shadow-2xl">
              <div className="p-3 bg-amber-900/90 border border-amber-500/60 rounded-2xl text-amber-300 shrink-0 shadow-lg shadow-amber-950">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white">
                  {t.ineligibleTitle}
                </h4>
                <p className="text-sm sm:text-base text-zinc-200 mt-1 leading-relaxed">
                  {t.ineligibleDesc}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
