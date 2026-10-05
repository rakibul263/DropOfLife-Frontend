'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BloodRequest } from '@/types';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { BloodGroupBadge } from '../shared/BloodGroupBadge';
import { BloodAlertIcon } from '../shared/BloodAlertIcon';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations, navTranslations, formatBilingualNumber } from '@/lib/translations';

interface UrgencyTickerProps {
  requests?: BloodRequest[];
}

export const UrgencyTicker: React.FC<UrgencyTickerProps> = ({ requests: propRequests }) => {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].ticker;
  const tNav = navTranslations[language];

  const { data: apiRequests } = useQuery<BloodRequest[]>({
    queryKey: ['live-urgency-requests'],
    queryFn: async () => {
      try {
        const res = await api.get('/requests');
        return res.data?.data?.requests || [];
      } catch (e) {
        return [];
      }
    },
    enabled: !propRequests,
  });

  const allRequests = propRequests || apiRequests || [];
  const urgentRequests = allRequests.filter(
    (r) => r.status === 'Pending' || r.status === 'In Progress'
  );

  if (urgentRequests.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-950/90 via-zinc-950 to-red-950/90 border-y border-red-900/40 py-2.5 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left Indicator */}
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest shrink-0">
          <BloodAlertIcon size="sm" pulse={true} />
          <span>{t.badge}</span>
        </div>

        {/* Requests Ticker items */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar text-xs">
          {urgentRequests.slice(0, 3).map((req) => (
            <div
              key={req._id}
              className="flex items-center gap-2 bg-zinc-900/90 border border-red-900/40 px-3 py-1.5 rounded-xl shrink-0 shadow-sm"
            >
              <BloodGroupBadge group={req.bloodGroup} size="sm" />
              <span className="text-zinc-200 font-medium">
                <strong className="text-white font-bold">
                  {formatBilingualNumber(req.unitsNeeded, language)}
                </strong>{' '}
                {t.urgentNeeded}{' '}
                <span className="text-white font-bold">{req.patientName}</span>
              </span>
              <span className="text-zinc-400 text-[11px] hidden md:inline">
                ({req.hospitalName})
              </span>
            </div>
          ))}
        </div>

        {/* Right Action & Phone */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <a
            href="tel:029351969"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800/60 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-rose-400" />
            <span className="font-mono">{tNav.hotlineNumber}</span>
          </a>

          <Link
            href="/emergency-requests"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
