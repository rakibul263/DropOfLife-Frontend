'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '../ui/Card';
import { Building2, ShieldCheck, PhoneCall, Calendar, MapPin, Users } from 'lucide-react';
import { BloodCamp } from '@/types';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations, formatBilingualNumber } from '@/lib/translations';
import { ScrollReveal } from '@/components/shared/ScrollReveal';


export const HospitalAlliance: React.FC = () => {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].alliance;

  const { data: camps = [], isLoading } = useQuery<BloodCamp[]>({
    queryKey: ['alliance-camps'],
    queryFn: async () => {
      try {
        const res = await api.get('/camps');
        return res.data?.data?.camps || [];
      } catch (e) {
        return [];
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.title}
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed font-normal">
          {t.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {camps.length > 0 ? (
          camps.slice(0, 4).map((camp, index) => (
            <ScrollReveal
              key={camp._id}
              animation="fade-up"
              delay={index * 120}
              duration={750}
              className="h-full flex flex-col"
            >
              <Card
                variant="liquid"
                hoverEffect
                className="p-6 sm:p-8 h-full flex flex-col justify-between shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] border border-white/20 transition-all backdrop-blur-2xl relative overflow-hidden revealed-card-hover"
              >
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3 min-h-[64px]">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg sm:text-xl text-white leading-snug line-clamp-1">
                        {camp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-200 font-medium mt-0.5 line-clamp-1">
                        {t.institution} <strong className="text-white font-bold">{camp.providerName}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm shrink-0">
                    {t.accredited}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium truncate">{camp.venueAddress}, {camp.district}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm py-3.5 border-y border-zinc-800/80 text-zinc-100 gap-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Calendar className="w-4 h-4 text-rose-400" />
                    {t.target} <strong className="text-white">{formatBilingualNumber(camp.targetUnits, language)} {t.units}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <Users className="w-4 h-4 text-cyan-400" />
                    {t.volunteers} <strong className="text-white">{formatBilingualNumber(camp.volunteersCount || 0, language)}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-rose-950 text-rose-300 border border-rose-700/60">
                    {camp.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-zinc-800/80 mt-auto shrink-0">
                <span className="text-xs sm:text-sm text-zinc-300 font-semibold">{t.helpline}</span>
                <a
                  href={`tel:${camp.contactPhone || '029351969'}`}
                  className="px-4 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-sm font-bold text-white hover:text-rose-400 flex items-center gap-2 font-mono transition-all shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-rose-500" />
                  <span>{camp.contactPhone || '02-9351969'}</span>
                </a>
              </div>
            </Card>
          </ScrollReveal>
        ))
        ) : (
          <div className="col-span-full p-8 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-400">
            {isLoading ? t.loading : (language === 'bn' ? 'কোনো ক্যাম্প পাওয়া যায়নি' : 'No camps currently listed')}
          </div>
        )}
      </div>
    </div>
  );
};
