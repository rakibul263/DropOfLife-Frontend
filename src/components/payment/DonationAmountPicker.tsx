'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { useLanguageStore } from '@/stores/languageStore';
import { supportTranslations, formatBilingualNumber } from '@/lib/translations';

interface DonationAmountPickerProps {
  selectedAmount: number;
  onSelectAmount: (amt: number) => void;
  customAmount: string;
  onCustomAmountChange: (val: string) => void;
}

export function DonationAmountPicker({
  selectedAmount,
  onSelectAmount,
  customAmount,
  onCustomAmountChange,
}: DonationAmountPickerProps) {
  const { language } = useLanguageStore();
  const t = supportTranslations[language];

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
        {t.amountStep}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {t.takaPresets.map((amt) => {
          const isSelected = selectedAmount === amt && !customAmount;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => {
                onSelectAmount(amt);
                onCustomAmountChange('');
              }}
              className={`relative py-3.5 px-2 rounded-xl font-black text-sm sm:text-base transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 text-white shadow-[0_8px_25px_rgba(225,29,72,0.55)] scale-105 ring-2 ring-rose-300 border border-white/40'
                  : 'bg-zinc-900/90 text-zinc-100 hover:text-white hover:bg-zinc-800 border border-zinc-700/80 hover:border-rose-500/60 shadow-md backdrop-blur-md hover:-translate-y-0.5'
              }`}
            >
              ৳{formatBilingualNumber(amt, language)}
            </button>
          );
        })}
      </div>

      <div className="pt-1">
        <Input
          type="number"
          min="10"
          placeholder={t.customPlaceholder}
          value={customAmount}
          onChange={(e) => onCustomAmountChange(e.target.value)}
          className="bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-400 h-11 text-sm font-medium"
        />
      </div>
    </div>
  );
}
