'use client';

import React from 'react';
import { BloodGroup, UrgencyLevel, RequestStatus } from '@/types';
import { BLOOD_GROUPS, URGENCY_LEVELS, REQUEST_STATUS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { PlusCircle, Filter } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { emergencyTranslations, formatBilingualNumber } from '@/lib/translations';

interface EmergencyFilterBarProps {
  selectedBloodGroup: BloodGroup | 'ALL';
  onBloodGroupChange: (bg: BloodGroup | 'ALL') => void;
  selectedUrgency: UrgencyLevel | 'ALL';
  onUrgencyChange: (lvl: UrgencyLevel | 'ALL') => void;
  selectedStatus: RequestStatus | 'ALL';
  onStatusChange: (status: RequestStatus | 'ALL') => void;
  onOpenCreateModal: () => void;
  totalRequests: number;
}

export function EmergencyFilterBar({
  selectedBloodGroup,
  onBloodGroupChange,
  selectedUrgency,
  onUrgencyChange,
  selectedStatus,
  onStatusChange,
  onOpenCreateModal,
  totalRequests,
}: EmergencyFilterBarProps) {
  const { language } = useLanguageStore();
  const t = emergencyTranslations[language];

  const getUrgencyLabel = (lvl: UrgencyLevel) => {
    if (lvl === 'Critical') return t.critical;
    if (lvl === 'Urgent') return t.urgent;
    return t.standard;
  };

  const getStatusLabel = (st: RequestStatus) => {
    if (st === 'Fulfilled') return t.fulfilled;
    if (st === 'In Progress') return t.inProgress;
    return t.pending;
  };

  return (
    <div className="bg-zinc-900/95 border border-zinc-800 ring-1 ring-white/[0.05] rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Urgency & Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-zinc-200">{t.filterUrgency}</span>
            <select
              value={selectedUrgency}
              onChange={(e) => onUrgencyChange(e.target.value as UrgencyLevel | 'ALL')}
              className="h-11 px-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-rose-500 cursor-pointer shadow-inner"
            >
              <option value="ALL">{t.allUrgencies}</option>
              {URGENCY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {getUrgencyLabel(lvl)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-zinc-200">{t.filterStatus}</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as RequestStatus | 'ALL')}
              className="h-11 px-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-rose-500 cursor-pointer shadow-inner"
            >
              <option value="ALL">{t.allStatuses}</option>
              {REQUEST_STATUS.map((st) => (
                <option key={st} value={st}>
                  {getStatusLabel(st)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onOpenCreateModal}
          className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-xl shadow-rose-950/60 h-11 px-5 rounded-xl shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t.broadcastBtn}
        </Button>
      </div>

      {/* Blood Group Filter Pills */}
      <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2.5 flex-wrap">
        <span className="text-xs sm:text-sm font-bold text-zinc-200 mr-2 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-rose-500" />
          {language === 'bn' ? 'রক্তের গ্রুপ:' : 'Blood Group:'}
        </span>

        <button
          onClick={() => onBloodGroupChange('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            selectedBloodGroup === 'ALL'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black ring-2 ring-rose-400/50'
              : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white border border-zinc-700'
          }`}
        >
          {language === 'bn' ? 'সকল গ্রুপ' : 'All Types'}
        </button>

        {BLOOD_GROUPS.map((bg) => (
          <button
            key={bg}
            onClick={() => onBloodGroupChange(bg)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedBloodGroup === bg
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black ring-2 ring-rose-400/50'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white border border-zinc-700'
            }`}
          >
            {bg}
          </button>
        ))}

        <span className="ml-auto text-xs sm:text-sm font-semibold text-zinc-300">
          {t.showingLabel}{' '}
          <strong className="text-rose-400 font-extrabold">
            {formatBilingualNumber(totalRequests, language)}
          </strong>{' '}
          {t.postsCount}
        </span>
      </div>
    </div>
  );
}
