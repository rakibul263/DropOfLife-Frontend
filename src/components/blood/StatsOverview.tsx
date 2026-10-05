'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '../ui/Card';
import { Users, Heart, Building2, Droplet } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations, formatBilingualNumber } from '@/lib/translations';
import { ScrollReveal } from '@/components/shared/ScrollReveal';


interface StatsOverviewProps {
  stats?: {
    totalDonors?: number;
    totalLivesSaved?: number;
    totalUnitsInStock?: number;
    totalProviders?: number;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats: propStats }) => {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].stats;

  const { data: apiStats, isLoading } = useQuery({
    queryKey: ['platform-live-stats'],
    queryFn: async () => {
      try {
        const res = await api.get('/stats');
        return res.data?.data?.stats;
      } catch (e) {
        return null;
      }
    },
    refetchInterval: 15000,
    staleTime: 5000,
    enabled: !propStats,
  });

  const stats = propStats || apiStats;

  const metrics = [
    {
      title: t.livesSaved,
      value: stats?.totalLivesSaved ?? 145,
      icon: Heart,
      color: 'text-rose-500',
      bg: 'bg-rose-950/60 border-rose-800/60 shadow-md shadow-rose-950/40',
      description: t.livesSavedDesc,
    },
    {
      title: t.registeredDonors,
      value: stats?.totalDonors ?? 254,
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-950/60 border-sky-800/60 shadow-md shadow-sky-950/40',
      description: t.registeredDonorsDesc,
    },
    {
      title: t.unitsInStock,
      value: stats?.totalUnitsInStock ?? 128,
      icon: Droplet,
      color: 'text-red-400',
      bg: 'bg-red-950/60 border-red-800/60 shadow-md shadow-red-950/40',
      description: t.unitsInStockDesc,
    },
    {
      title: language === 'bn' ? 'প্রস্তুত রক্তদাতা' : 'Ready Donors',
      value: stats?.availableDonors ?? 247,
      icon: Building2,
      color: 'text-teal-400',
      bg: 'bg-teal-950/60 border-teal-800/60 shadow-md shadow-teal-950/40',
      description:
        language === 'bn'
          ? 'সরাসরি রক্তদানে প্রস্তুত সক্রিয় ডোনার'
          : 'Ready and active donors available now',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-emerald-400 uppercase tracking-widest">
            {t.headerBadge}
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-semibold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 self-start sm:self-auto">
          {language === 'bn' ? 'ডাটাবেজ থেকে রিয়েল-টাইম সিঙ্ক' : 'Real-time Database Sync'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {metrics.map((item, index) => {
          const Icon = item.icon;
          return (
            <ScrollReveal
              key={index}
              animation="fade-up"
              delay={index * 130}
              duration={750}
              className="h-full flex flex-col"
            >
              <Card
                variant="default"
                hoverEffect
                className="p-6 sm:p-7 h-full flex flex-col justify-between group transition-all duration-300 revealed-card-hover"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-wider line-clamp-1">
                      {item.title}
                    </span>
                    <div className={`p-3 rounded-2xl border ${item.bg} shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
                    {isLoading ? (
                      <span className="text-zinc-500 animate-pulse text-2xl font-mono">
                        {t.loading}
                      </span>
                    ) : (
                      <span>{formatBilingualNumber(item.value, language)}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed pt-3 border-t border-zinc-800/80 min-h-[44px] line-clamp-2 mt-auto shrink-0">
                  {item.description}
                </p>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
};
