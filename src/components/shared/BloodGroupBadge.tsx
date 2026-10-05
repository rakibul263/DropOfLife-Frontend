import React from 'react';
import { BloodGroup } from '@/types';
import { cn } from '@/lib/utils';

export interface BloodGroupBadgeProps {
  group?: BloodGroup | string;
  bloodGroup?: BloodGroup | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  bloodGroup,
  size = 'md',
  className,
}) => {
  const displayGroup = bloodGroup || group || 'O+';
  const sizes = {
    sm: 'text-xs px-2 py-0.5 min-w-[28px]',
    md: 'text-sm px-2.5 py-1 min-w-[36px]',
    lg: 'text-base font-bold px-3.5 py-1.5 min-w-[48px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-black rounded-lg bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-md shadow-rose-950/40 border border-rose-500/40 tracking-wider',
        sizes[size],
        className
      )}
    >
      {displayGroup}
    </span>
  );
};
