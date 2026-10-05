'use client';

import React from 'react';
import { User } from '@/types';
import { DonorCard } from '@/components/blood/DonorCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, RotateCcw, AlertCircle } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';


interface DonorGridProps {
  donors: User[];
  isLoading: boolean;
  onDirectRequest: (donor: User) => void;
  onResetFilters: () => void;
}

export function DonorGrid({
  donors,
  isLoading,
  onDirectRequest,
  onResetFilters,
}: DonorGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 border-zinc-800 bg-zinc-900/50 animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
            <div className="h-10 bg-zinc-800 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-zinc-800 bg-zinc-900/30 space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800/80 text-zinc-500 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">No Registered Donors Found</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            We could not find active donors matching your specific blood group or location filters.
          </p>
        </div>
        <Button
          onClick={onResetFilters}
          variant="outline"
          className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear All Search Filters
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {donors.map((donor, index) => (
        <ScrollReveal
          key={donor._id || donor.id}
          animation="fade-up"
          delay={Math.min((index % 6) * 90, 450)}
          duration={700}
          className="h-full flex flex-col"
        >
          <div className="h-full w-full flex flex-col flex-1 revealed-card-hover">
            <DonorCard
              donor={donor}
              onRequestBlood={() => onDirectRequest(donor)}
            />
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
