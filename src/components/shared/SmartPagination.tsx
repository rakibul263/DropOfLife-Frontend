'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { formatBilingualNumber } from '@/lib/translations';

interface SmartPaginationProps {
  totalItems: number;
  visibleCount: number;
  initialCount: number;
  onViewMore: () => void;
  onShowLess?: () => void;
  onViewAll?: () => void;
  itemNameBn?: string;
  itemNameEn?: string;
}

/**
 * Calculates smart initial display count ensuring clean 3-column rows:
 * - <= 3 items: show all (1-3)
 * - 4 or 5 items: show 3 (completes 1 row of 3, leaving no orphan on row 2)
 * - 6, 7, 8 items: show 6 (completes 2 rows of 3)
 * - 9 or more items: show 6 initially with progressive load
 */
export function getSmartInitialCount(totalCount: number): number {
  if (totalCount <= 3) {
    return totalCount;
  }
  if (totalCount <= 5) {
    return 3;
  }
  if (totalCount <= 8) {
    return 6;
  }
  return 6;
}

export function SmartPagination({
  totalItems,
  visibleCount,
  initialCount,
  onViewMore,
  onShowLess,
  onViewAll,
  itemNameBn = 'টি তথ্য',
  itemNameEn = 'items',
}: SmartPaginationProps) {
  const { language } = useLanguageStore();

  if (totalItems <= 0) {
    return null;
  }

  // If total items is less than or equal to initialCount, no pagination controls needed
  if (totalItems <= initialCount && visibleCount >= totalItems) {
    return (
      <div className="pt-6 pb-2 flex items-center justify-center text-xs text-zinc-400 font-medium">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {language === 'bn'
            ? `সবগুলো (${formatBilingualNumber(totalItems, language)} ${itemNameBn}) প্রদর্শিত হচ্ছে`
            : `Showing all ${totalItems} ${itemNameEn}`}
        </span>
      </div>
    );
  }

  const currentlyShowing = Math.min(visibleCount, totalItems);
  const remainingCount = Math.max(0, totalItems - currentlyShowing);
  const nextIncrement = remainingCount > 3 ? 3 : remainingCount;
  const progressPercent = Math.min(100, Math.round((currentlyShowing / totalItems) * 100));

  return (
    <div className="pt-8 pb-4 flex flex-col items-center justify-center space-y-4">
      {/* Visual Progress Bar & Count Status */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium">
            {language === 'bn' ? (
              <>
                প্রদর্শিত:{' '}
                <strong className="text-white font-bold">
                  {formatBilingualNumber(currentlyShowing, language)}
                </strong>{' '}
                / {formatBilingualNumber(totalItems, language)} {itemNameBn}
              </>
            ) : (
              <>
                Showing{' '}
                <strong className="text-white font-bold">{currentlyShowing}</strong> of{' '}
                <strong className="text-white font-bold">{totalItems}</strong> {itemNameEn}
              </>
            )}
          </span>
          <span className="font-mono text-rose-400 font-bold text-[11px]">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden ring-1 ring-white/5">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-3 flex-wrap justify-center pt-1">
        {remainingCount > 0 ? (
          <>
            {/* View More Button */}
            <button
              type="button"
              onClick={onViewMore}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-zinc-700/80 hover:border-rose-500/60 shadow-lg shadow-black/40 hover:shadow-rose-950/30 transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <span>
                {language === 'bn'
                  ? `আরও দেখুন (+${formatBilingualNumber(nextIncrement, language)})`
                  : `View More (+${nextIncrement})`}
              </span>
              <ChevronDown className="w-4 h-4 text-rose-400 group-hover:translate-y-0.5 transition-transform" />
            </button>

            {/* View All (if remaining > 3) */}
            {remainingCount > 3 && onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white font-semibold text-xs border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  {language === 'bn'
                    ? `সবগুলো দেখুন (${formatBilingualNumber(totalItems, language)})`
                    : `View All (${totalItems})`}
                </span>
              </button>
            )}
          </>
        ) : (
          /* Show Less Button when all are revealed */
          onShowLess &&
          totalItems > initialCount && (
            <button
              type="button"
              onClick={onShowLess}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs border border-zinc-700/70 hover:border-zinc-600 transition-all cursor-pointer group"
            >
              <span>{language === 'bn' ? 'সংক্ষেপ করুন' : 'Show Less'}</span>
              <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
