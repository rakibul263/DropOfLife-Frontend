'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, TestTube, Sparkles } from 'lucide-react';

interface PilotSampleTubesRackProps {
  isFilled: boolean;
  language?: 'bn' | 'en';
}

export function PilotSampleTubesRack({ isFilled, language = 'bn' }: PilotSampleTubesRackProps) {
  const tubes = [
    {
      id: 'edta',
      capColor: 'bg-purple-600 border-purple-400',
      capGlow: 'shadow-[0_0_10px_rgba(147,51,234,0.6)]',
      nameBn: 'EDTA টিউব (পার্পল)',
      nameEn: 'EDTA Vacutainer (Lavender)',
      testBn: 'কমপ্লিট ব্লাড কাউন্ট (CBC) ও ব্লাড গ্রুপিং নিশ্চিতকরণ',
      testEn: 'Complete Blood Count (CBC) & Group Confirmation',
    },
    {
      id: 'serum',
      capColor: 'bg-red-600 border-red-400',
      capGlow: 'shadow-[0_0_10px_rgba(220,38,38,0.6)]',
      nameBn: 'সিরাম টিউব (রেড)',
      nameEn: 'Serum Clot Tube (Red)',
      testBn: 'এইচআইভি, হেপাটাইটিস বি/সি ও সিফিলিস স্ক্রিনিং',
      testEn: 'HIV 1/2, Hepatitis B/C & Syphilis Screening',
    },
    {
      id: 'citrate',
      capColor: 'bg-sky-500 border-sky-300',
      capGlow: 'shadow-[0_0_10px_rgba(14,165,233,0.6)]',
      nameBn: 'সাইট্রেট টিউব (ব্লু)',
      nameEn: 'Sodium Citrate (Blue)',
      testBn: 'ক্রস-ম্যাচিং ও কোয়াগুলেশন স্ক্রিনিং পরীক্ষা',
      testEn: 'Cross-Matching & Coagulation Profiling',
    },
  ];

  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-black uppercase tracking-wider text-zinc-200">
            {language === 'bn' ? 'পাইলট স্যাম্পল ডায়াগনস্টিক টেস্ট টিউব' : 'Pilot Diagnostic Vacutainers'}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isFilled
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-zinc-900 text-zinc-400 border-zinc-700'
          }`}
        >
          {isFilled
            ? language === 'bn'
              ? 'নমুনা সংগৃহীত ও বারকোডেড'
              : 'Collected & Barcoded'
            : language === 'bn'
            ? 'প্রক্রিয়াধীন'
            : 'Pending Stage 05'}
        </span>
      </div>

      {/* Visual Tubes Rack Display */}
      <div className="grid grid-cols-3 gap-3">
        {tubes.map((tube) => (
          <div
            key={tube.id}
            className="flex flex-col items-center bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800 relative overflow-hidden group hover:border-zinc-700 transition-all"
          >
            {/* Vacutainer Tube Silhouette */}
            <div className="w-5 h-16 rounded-b-xl border-2 border-white/30 bg-white/5 relative overflow-hidden flex flex-col justify-between shadow-inner">
              {/* Rubber Stopper Cap */}
              <div
                className={`w-full h-4 rounded-t-xs border-b border-black/40 ${tube.capColor} ${tube.capGlow}`}
              />

              {/* Blood Liquid Fill Simulation */}
              <div
                className={`w-full bg-gradient-to-t from-rose-900 to-red-600 transition-all duration-700 ${
                  isFilled ? 'h-10' : 'h-0'
                }`}
              />

              {/* Mini Tube Label & Barcode */}
              <div className="absolute top-5 inset-x-0.5 h-6 bg-white/90 rounded-2xs flex flex-col justify-around py-0.5 px-0.5 pointer-events-none">
                <div className="w-full h-0.5 bg-zinc-800" />
                <div className="w-2/3 h-0.5 bg-zinc-800" />
                <div className="w-4/5 h-0.5 bg-zinc-800" />
              </div>
            </div>

            {/* Tube Info */}
            <div className="mt-2 text-center space-y-0.5">
              <p className="text-[10px] font-black text-white">
                {language === 'bn' ? tube.nameBn : tube.nameEn}
              </p>
              <p className="text-[8.5px] text-zinc-400 line-clamp-2 leading-tight">
                {language === 'bn' ? tube.testBn : tube.testEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
