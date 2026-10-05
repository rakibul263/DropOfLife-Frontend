'use client';

import React from 'react';
import { UrgencyLevel } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle } from 'lucide-react';
import { BloodAlertIcon } from './BloodAlertIcon';
import { useLanguageStore } from '@/stores/languageStore';

interface UrgencyBadgeProps {
  level: UrgencyLevel | string;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  level,
  className,
}) => {
  const { language } = useLanguageStore();

  if (level === 'Critical') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-950/80 text-red-300 border border-red-500/50 shadow-sm shadow-red-900/30',
          className
        )}
      >
        <BloodAlertIcon size="xs" pulse={true} />
        {language === 'bn' ? 'সঙ্কটাপন্ন' : 'Critical Urgency'}
      </span>
    );
  }

  if (level === 'Urgent') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40',
          className
        )}
      >
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        {language === 'bn' ? 'জরুরি' : 'Urgent'}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/40',
        className
      )}
    >
      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
      {language === 'bn' ? 'স্বাভাবিক' : 'Standard'}
    </span>
  );
};
