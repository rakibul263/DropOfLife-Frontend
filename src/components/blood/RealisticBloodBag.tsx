'use client';

import React from 'react';
import { Droplet, Activity, Heart, Shield, Check, Sparkles } from 'lucide-react';

interface RealisticBloodBagProps {
  fillPercent: number; // 0 to 100
  volumeMl: number; // 0 to 450
  selectedBloodGroup?: string;
  isRocking?: boolean;
  statusText?: string;
  language?: 'bn' | 'en';
  className?: string;
}

export function RealisticBloodBag({
  fillPercent,
  volumeMl,
  selectedBloodGroup = 'O+',
  isRocking = false,
  statusText,
  language = 'bn',
  className = '',
}: RealisticBloodBagProps) {
  // Clamp fill percent
  const clampedPercent = Math.min(100, Math.max(0, fillPercent));
  const isFlowing = volumeMl > 0;
  const isFull = fillPercent >= 98;

  // Weight calculation: average human whole blood density is ~1.053 g/mL
  const weightGrams = Math.round(volumeMl * 1.053);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Outer Agitator Rocking Wrapper */}
      <div
        className={`relative flex flex-col items-center transition-transform duration-700 ${
          isRocking ? 'animate-agitator-rock' : ''
        }`}
      >
        {/* ======================================================== */}
        {/* 1. TOP SUSPENSION SYSTEM (Hangers, Tube & Ports) */}
        {/* ======================================================== */}
        <div className="relative w-72 flex justify-center items-end -mb-1 z-20">
          {/* Top Medical IV Tubing extending upward */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* Upper tube segment */}
            <div className="w-2.5 h-16 rounded-t-full bg-white/20 border border-white/40 backdrop-blur-md relative overflow-hidden shadow-inner">
              {/* Animated blood flow stream inside tube */}
              {isFlowing && (
                <div className="absolute inset-0 bg-gradient-to-b from-rose-700 via-red-600 to-rose-700 animate-tubing-drip" />
              )}
              {/* Highlight sheen along tubing */}
              <div className="absolute top-0 left-0 w-0.5 h-full bg-white/60" />
            </div>

            {/* Central tube junction / inlet collar */}
            <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-zinc-200 to-zinc-400 border border-zinc-400/80 shadow-md -mt-0.5 relative z-10">
              <div className="w-1.5 h-full mx-auto bg-rose-700/60" />
            </div>
          </div>

          {/* Left Plastic Suspension Hanger Tab */}
          <div className="w-7 h-11 bg-white/15 border-2 border-white/40 rounded-t-lg rounded-b-sm flex items-center justify-center backdrop-blur-sm shadow-sm mr-12 relative overflow-hidden">
            {/* Die-cut suspension hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-950/70 border border-white/30 shadow-inner" />
            {/* Plastic sheen highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          </div>

          {/* Right Plastic Suspension Hanger Tab */}
          <div className="w-7 h-11 bg-white/15 border-2 border-white/40 rounded-t-lg rounded-b-sm flex items-center justify-center backdrop-blur-sm shadow-sm ml-12 relative overflow-hidden">
            {/* Die-cut suspension hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-950/70 border border-white/30 shadow-inner" />
            {/* Plastic sheen highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Top Ports Sealing Flange */}
        <div className="w-64 h-5 rounded-t-xl bg-gradient-to-b from-white/20 to-white/10 border-t-2 border-x-2 border-white/35 flex items-center justify-around px-4 relative z-15 backdrop-blur-sm">
          {/* Left Access Spike Port */}
          <div className="w-4 h-3 bg-zinc-200/90 rounded-t border border-zinc-400/60 shadow-xs relative">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white border border-zinc-400" />
          </div>

          {/* 3 Heat-seal eyelet holes in flange */}
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-950/60 border border-white/40 shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-950/60 border border-white/40 shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-950/60 border border-white/40 shadow-inner" />

          {/* Right Access Spike Port */}
          <div className="w-4 h-3 bg-zinc-200/90 rounded-t border border-zinc-400/60 shadow-xs relative">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white border border-zinc-400" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN BLOOD BAG BODY (PVC Translucent Vessel) */}
        {/* ======================================================== */}
        <div className="relative w-72 sm:w-80 h-[430px] rounded-[36px] p-3 border-2 border-white/40 bg-gradient-to-b from-white/15 via-white/5 to-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(225,29,72,0.25)] backdrop-blur-md overflow-hidden flex flex-col justify-between">
          {/* Heat-welded perimeter seam texture */}
          <div className="absolute inset-1.5 rounded-[30px] border border-white/25 pointer-events-none z-30" />
          <div className="absolute inset-2.5 rounded-[26px] border border-dashed border-white/15 pointer-events-none z-30" />

          {/* Translucent Gloss Sheen Overlays */}
          <div className="absolute -left-10 top-0 w-24 h-full bg-gradient-to-r from-white/20 via-white/5 to-transparent rotate-6 pointer-events-none z-30" />
          <div className="absolute top-2 right-4 w-16 h-40 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-full -rotate-12 blur-[1px] pointer-events-none z-30" />

          {/* ======================================================== */}
          {/* 3. LIQUID BLOOD CHAMBER & WAVE ANIMATIONS */}
          {/* ======================================================== */}
          <div className="absolute inset-3 rounded-[24px] overflow-hidden bg-zinc-950/40 z-10 flex flex-col justify-end">
            {/* Clear Anticoagulant solution (when empty / pre-fill) */}
            {volumeMl === 0 && (
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-sky-400/20 via-sky-300/10 to-transparent border-t border-sky-300/30">
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-sky-200/80 tracking-wider">
                  CPDA-1 63mL STERILE
                </span>
              </div>
            )}

            {/* Blood Liquid Body (Dynamic Height based on fillPercent) */}
            <div
              className="relative w-full transition-all duration-1000 ease-out"
              style={{ height: `${Math.max(clampedPercent, volumeMl > 0 ? 8 : 0)}%` }}
            >
              {/* Double Wave Fluid Surface Meniscus */}
              {volumeMl > 0 && clampedPercent < 98 && (
                <div className="absolute -top-4 inset-x-0 h-6 overflow-hidden pointer-events-none z-10">
                  {/* Wave Layer 1 (Back, darker ruby) */}
                  <svg
                    className="absolute w-[200%] h-full animate-blood-wave-back opacity-60 text-red-900 fill-current"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,0 C150,90 350,-40 500,40 C650,110 900,-30 1200,30 L1200,120 L0,120 Z" />
                  </svg>
                  {/* Wave Layer 2 (Front, vibrant crimson) */}
                  <svg
                    className="absolute w-[200%] h-full animate-blood-wave-front opacity-90 text-rose-700 fill-current"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,40 C150,-20 300,90 600,30 C900,-20 1050,70 1200,40 L1200,120 L0,120 Z" />
                  </svg>
                  {/* Wave Specular Foam Line */}
                  <div className="absolute top-2 inset-x-0 h-0.5 bg-rose-300/50 blur-[0.5px]" />
                </div>
              )}

              {/* Liquid Mass (Realistic Deep Venous/Arterial Blood Gradient) */}
              <div className="w-full h-full bg-gradient-to-b from-rose-700 via-red-800 to-rose-950 relative overflow-hidden shadow-inner">
                {/* Lateral depth shading */}
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />

                {/* Animated Rising Micro-Bubbles */}
                {isFlowing && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="absolute bottom-2 left-[20%] w-1.5 h-1.5 rounded-full bg-rose-300/80 animate-blood-bubble-1" />
                    <span className="absolute bottom-4 left-[45%] w-2 h-2 rounded-full bg-rose-200/90 animate-blood-bubble-2" />
                    <span className="absolute bottom-1 left-[70%] w-1 h-1 rounded-full bg-rose-400/70 animate-blood-bubble-3" />
                    <span className="absolute bottom-6 left-[82%] w-1.5 h-1.5 rounded-full bg-rose-300/80 animate-blood-bubble-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. AUTHENTIC MEDICAL WHITE ADHESIVE LABEL */}
          {/* ======================================================== */}
          <div className="relative z-20 mx-auto my-auto w-[92%] bg-white text-zinc-900 rounded-xl p-3 shadow-xl border border-zinc-200/90 flex flex-col justify-between overflow-hidden">
            {/* Subtle paper texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white pointer-events-none" />

            {/* Gloss reflection passing across label */}
            <div className="absolute -top-12 -left-12 w-28 h-48 bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-25 pointer-events-none" />

            {/* --- LABEL HEADER: ANIMATED "Drop of Life" BRAND --- */}
            <div className="relative pb-2 border-b border-zinc-300 flex items-center justify-between">
              <div className="space-y-0.5">
                {/* The User-Requested Animated "Drop of Life" Name */}
                <div className="flex items-center gap-1.5">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping absolute" />
                    <Droplet className="w-4 h-4 text-rose-600 fill-rose-600 relative z-10" />
                  </div>

                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-none bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 bg-clip-text text-transparent animate-brand-glow">
                    Drop of Life
                  </h3>
                </div>

                <p className="text-[8.5px] font-extrabold uppercase tracking-widest text-zinc-600 pl-5">
                  Single Blood Bag 450mL
                </p>
              </div>

              {/* Certified Standard Seal */}
              <div className="text-right">
                <span className="inline-block px-1.5 py-0.5 text-[8px] font-black text-rose-700 bg-rose-50 border border-rose-200 rounded tracking-wider">
                  CPDA-1 • 450 ML
                </span>
                <p className="text-[7.5px] font-mono text-zinc-600">WHO / DGHS</p>
              </div>
            </div>

            {/* --- LABEL BODY: MEDICAL TECHNICAL MATRIX --- */}
            <div className="relative grid grid-cols-12 gap-2 py-2 text-[8px] leading-tight">
              {/* Left Column: Donation & ABO Group */}
              <div className="col-span-7 space-y-1.5 border-r border-zinc-200 pr-1.5">
                <div className="flex justify-between font-mono text-zinc-700">
                  <span className="font-bold text-zinc-900">DONATION NO:</span>
                  <span className="font-black text-rose-700">DOL-2026-X89</span>
                </div>

                <div className="flex justify-between text-zinc-700 font-mono">
                  <span>COLL. DATE:</span>
                  <span className="font-semibold text-zinc-900">2026.10</span>
                </div>

                <div className="flex justify-between text-zinc-700 font-mono">
                  <span>EXPIRY DATE:</span>
                  <span className="font-semibold text-zinc-900">2026.11</span>
                </div>

                {/* ABO / RhD Blood Group Highlighted Box */}
                <div className="mt-1 p-1 rounded bg-zinc-900 text-white flex items-center justify-between shadow-xs">
                  <span className="text-[7.5px] font-mono text-zinc-300">ABO / RhD</span>
                  <span className="text-xs font-black text-rose-400 tracking-wider">
                    {selectedBloodGroup} POSITIVE
                  </span>
                </div>
              </div>

              {/* Right Column: Medical Specs & Capacity Diagram */}
              <div className="col-span-5 space-y-1 pl-0.5">
                {/* Visual Bag Capacity Icon */}
                <div className="border border-zinc-300 rounded p-1 bg-zinc-50 flex items-center justify-between text-[7px] font-mono">
                  <div className="w-3.5 h-4.5 border border-zinc-400 rounded-xs flex flex-col justify-end p-0.5 bg-white">
                    <div
                      className="w-full bg-rose-600 rounded-2xs transition-all duration-500"
                      style={{ height: `${Math.max(clampedPercent, 10)}%` }}
                    />
                  </div>
                  <div className="text-right leading-none space-y-0.5">
                    <p className="font-bold text-zinc-900">600mL MAX</p>
                    <p className="text-rose-600 font-extrabold">450mL UNIT</p>
                    <p className="text-zinc-600">CPDA-1 63mL</p>
                  </div>
                </div>

                <div className="text-[7px] font-mono text-zinc-700 space-y-0.5">
                  <p>
                    <strong className="text-zinc-900">NEEDLE:</strong> 16G SILICONIZED
                  </p>
                  <p>
                    <strong className="text-zinc-900">STORAGE:</strong> 2°C - 6°C
                  </p>
                  <p className="text-zinc-600">Rx ONLY • STERILE</p>
                </div>
              </div>
            </div>

            {/* --- MEDICAL PROTOCOL SYMBOLS ROW --- */}
            <div className="relative pt-1 border-t border-zinc-200 flex items-center justify-between text-[7.5px] font-mono text-zinc-600">
              <span className="px-1 py-0.2 rounded border border-zinc-300 font-bold">STERILE</span>
              <span className="px-1 py-0.2 rounded border border-zinc-300">② DO NOT REUSE</span>
              <span className="px-1 py-0.2 rounded border border-zinc-300">LATEX FREE</span>
              <span className="font-black text-zinc-900">CE 0123</span>
            </div>

            {/* --- BOTTOM REALISTIC BARCODE WITH ANIMATED OPTICAL LASER --- */}
            <div className="relative mt-1.5 pt-1 border-t border-zinc-200">
              {/* Barcode Lines Graphic */}
              <div className="relative h-6 w-full flex items-stretch justify-between overflow-hidden bg-white px-1">
                {/* 36 Realistic Barcode Lines */}
                {[
                  2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2, 1, 3,
                  1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2,
                ].map((width, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-zinc-900"
                    style={{ width: `${width * 1.5}px` }}
                  />
                ))}

                {/* Animated Optical Laser Sweep Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-barcode-laser pointer-events-none" />
              </div>

              {/* Barcode Numerical Code */}
              <div className="flex justify-between font-mono text-[7px] text-zinc-600 tracking-wider pt-0.5">
                <span>REF: BB5040</span>
                <span className="font-bold text-zinc-800">10E08B5040</span>
                <span>LOT: 1111111</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. BAG BOTTOM HEAT-SEALED CONTOUR */}
          {/* ======================================================== */}
          <div className="relative z-20 flex items-center justify-between px-3 text-[8px] font-mono text-zinc-300 border-t border-white/20 pt-1">
            <span className="flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              <span>100% NON-PYROGENIC</span>
            </span>
            <span className="text-zinc-300">CPDA-1 WHO-GMP</span>
          </div>
        </div>

        {/* Ambient Under-Bag Crimson Reflection Glow */}
        <div className="w-48 h-6 bg-rose-600/30 blur-xl rounded-full -mt-2 pointer-events-none" />
      </div>

      {/* ======================================================== */}
      {/* 6. DIGITAL AGITATOR SCALE BASE (Automatic Rocker & Scale) */}
      {/* ======================================================== */}
      <div className="w-64 sm:w-72 mt-3 rounded-2xl bg-zinc-900 border border-zinc-700/80 p-3 shadow-xl flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRocking
                  ? 'bg-emerald-400 animate-ping'
                  : isFlowing
                  ? 'bg-rose-500 animate-pulse'
                  : 'bg-zinc-600'
              }`}
            />
            <span className="text-[11px] font-black tracking-wider uppercase text-zinc-200">
              {language === 'bn' ? 'ডিজিটাল এজিমিক্সার স্কেল' : 'Digital Agimixer Rocker'}
            </span>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
              isRocking
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 animate-pulse'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            {isRocking
              ? language === 'bn'
                ? 'রোকার সক্রিয় (৬০ RPM)'
                : 'Oscillating (60 RPM)'
              : language === 'bn'
              ? 'স্ট্যান্ডবাই'
              : 'Standby'}
          </span>
        </div>

        {/* Digital Telemetry Display */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-950 rounded-xl p-2 border border-zinc-800 font-mono text-center">
          <div>
            <span className="text-[9px] text-zinc-400 block uppercase">
              {language === 'bn' ? 'সংগৃহীত আয়তন' : 'Net Volume'}
            </span>
            <span className="text-lg font-black text-rose-400">
              {volumeMl}{' '}
              <span className="text-xs font-normal text-zinc-400">
                {language === 'bn' ? 'মিলি' : 'mL'}
              </span>
            </span>
          </div>

          <div>
            <span className="text-[9px] text-zinc-400 block uppercase">
              {language === 'bn' ? 'স্কেল ওজন' : 'Scale Weight'}
            </span>
            <span className="text-lg font-black text-emerald-400">
              {weightGrams}{' '}
              <span className="text-xs font-normal text-zinc-400">
                {language === 'bn' ? 'গ্রাম' : 'g'}
              </span>
            </span>
          </div>
        </div>

        {/* Progress Percent Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-zinc-400">
            <span>{statusText || (language === 'bn' ? 'সংগ্রহ অগ্রগতি' : 'Collection Progress')}</span>
            <span className="text-white font-extrabold">{clampedPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-emerald-400 transition-all duration-700"
              style={{ width: `${clampedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
