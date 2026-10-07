'use client';

import React from 'react';
import { BloodGroup } from '@/types';
import { BLOOD_GROUPS, BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, RotateCcw, MapPin } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { donorsTranslations, formatBilingualNumber } from '@/lib/translations';

interface DonorFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedBloodGroup: BloodGroup | 'ALL';
  onBloodGroupChange: (bg: BloodGroup | 'ALL') => void;
  selectedDivision: string;
  onDivisionChange: (div: string) => void;
  selectedDistrict: string;
  onDistrictChange: (dist: string) => void;
  onlyAvailable: boolean;
  onOnlyAvailableChange: (val: boolean) => void;
  onResetFilters: () => void;
  totalDonors: number;
}

const DIVISION_NAMES_BN: Record<string, string> = {
  Dhaka: 'ঢাকা বিভাগ',
  Chattogram: 'চট্টগ্রাম বিভাগ',
  Rajshahi: 'রাজশাহী বিভাগ',
  Khulna: 'খুলনা বিভাগ',
  Barishal: 'বরিশাল বিভাগ',
  Sylhet: 'সিলেট বিভাগ',
  Rangpur: 'রংপুর বিভাগ',
  Mymensingh: 'ময়মনসিংহ বিভাগ',
};

export function DonorFilterBar({
  searchTerm,
  onSearchChange,
  selectedBloodGroup,
  onBloodGroupChange,
  selectedDivision,
  onDivisionChange,
  selectedDistrict,
  onDistrictChange,
  onlyAvailable,
  onOnlyAvailableChange,
  onResetFilters,
  totalDonors,
}: DonorFilterBarProps) {
  const { language } = useLanguageStore();
  const t = donorsTranslations[language];

  // Filter available districts based on selected division
  const filteredDistricts = React.useMemo(() => {
    if (selectedDivision === 'ALL') {
      return BANGLADESH_DISTRICTS;
    }
    return BANGLADESH_DISTRICTS.filter((d) => d.division.toLowerCase() === selectedDivision.toLowerCase());
  }, [selectedDivision]);

  return (
    <div className="bg-zinc-900/95 border border-zinc-800 ring-1 ring-white/[0.05] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 backdrop-blur-2xl">
      {/* Top Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
        {/* Keyword Search */}
        <div className="sm:col-span-2 lg:col-span-4 relative">
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'নাম, জেলা বা এলাকা দিয়ে খুঁজুন...'
                : 'Search by name, district, or area...'
            }
            className="pl-10 h-11 bg-zinc-800/90 border-zinc-700 text-white placeholder-zinc-400 focus:border-rose-500 rounded-xl font-medium shadow-inner"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
        </div>

        {/* Division Selector */}
        <div className="lg:col-span-3">
          <select
            value={selectedDivision}
            onChange={(e) => {
              onDivisionChange(e.target.value);
              // Reset district if no longer in the division
              onDistrictChange('ALL');
            }}
            className="w-full h-11 px-3 bg-zinc-800/90 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-rose-500 cursor-pointer shadow-inner"
          >
            <option value="ALL">
              {language === 'bn' ? '🌐 সকল বিভাগ (All Divisions)' : '🌐 All Divisions'}
            </option>
            {BANGLADESH_DIVISIONS.map((div) => (
              <option key={div} value={div}>
                {language === 'bn' ? DIVISION_NAMES_BN[div] || div : `${div} Division`}
              </option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        <div className="lg:col-span-3">
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full h-11 px-3 bg-zinc-800/90 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-rose-500 cursor-pointer shadow-inner"
          >
            <option value="ALL">
              {language === 'bn' ? '📍 সকল জেলা (All Districts)' : '📍 All Districts'}
            </option>
            {filteredDistricts.map((dist) => (
              <option key={dist.nameEn} value={dist.nameBn}>
                {dist.nameBn} ({dist.nameEn})
              </option>
            ))}
          </select>
        </div>

        {/* Only Available Toggle & Reset Button */}
        <div className="sm:col-span-2 lg:col-span-2 flex items-center justify-between lg:justify-end gap-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-200 hover:text-white select-none shrink-0">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => onOnlyAvailableChange(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-zinc-800 border-zinc-700 cursor-pointer accent-rose-600"
            />
            <span className="whitespace-nowrap">
              {language === 'bn' ? 'প্রস্তুত আছেন' : 'Ready Only'}
            </span>
          </label>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold px-3 h-9 rounded-xl cursor-pointer shrink-0"
            title="সব ফিল্টার রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            {t.resetBtn}
          </Button>
        </div>
      </div>

      {/* Blood Group Quick Pill Selector */}
      <div className="pt-3 border-t border-zinc-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-zinc-300 mr-1 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-rose-500" />
            {t.bloodGroupFilter}
          </span>

          <button
            type="button"
            onClick={() => onBloodGroupChange('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedBloodGroup === 'ALL'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-950/80 font-black ring-2 ring-rose-400/50'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'
            }`}
          >
            {t.allTypes}
          </button>

          {BLOOD_GROUPS.map((bg) => (
            <button
              type="button"
              key={bg}
              onClick={() => onBloodGroupChange(bg)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedBloodGroup === bg
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-950/80 font-black ring-2 ring-rose-400/50'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'
              }`}
            >
              {bg}
            </button>
          ))}

          <span className="w-full sm:w-auto sm:ml-auto pt-2 sm:pt-0 text-xs sm:text-sm font-semibold text-zinc-300 flex items-center justify-end gap-1.5 border-t sm:border-t-0 border-zinc-800/60 mt-1 sm:mt-0">
            {t.foundLabel}{' '}
            <strong className="text-rose-400 font-extrabold text-sm sm:text-base">
              {formatBilingualNumber(totalDonors, language)}
            </strong>{' '}
            {t.donorsCount}
          </span>
        </div>
      </div>
    </div>
  );
}
