'use client';

import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';

interface LiquidLifeLoaderProps {
  fullscreen?: boolean;
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TELEMETRY_STEPS_BN = [
  'লাইফ-সেভিং ডেটাবেজ ও ডোনার তথ্য সিঙ্ক হচ্ছে...',
  'স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক স্ক্যান করা হচ্ছে...',
  'জরুরি রক্তের প্রাপ্যতা ক্যালিব্রেট হচ্ছে...',
  'নিরাপদ লাইফসেভার প্ল্যাটফর্ম প্রস্তুত হচ্ছে...',
];

const TELEMETRY_STEPS_EN = [
  'Synchronizing Life-Saving Database Records...',
  'Scanning 64-District Donor Beacons...',
  'Calibrating Emergency Blood Supply...',
  'Preparing Verified Lifesaver Portal...',
];

export function LiquidLifeLoader({
  fullscreen = true,
  message,
  submessage,
  size = 'lg',
}: LiquidLifeLoaderProps) {
  const { language } = useLanguageStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(24);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % TELEMETRY_STEPS_BN.length);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) return 96;
        const jump = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + jump, 96);
      });
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const activeMessage =
    message || (language === 'bn' ? TELEMETRY_STEPS_BN[stepIndex] : TELEMETRY_STEPS_EN[stepIndex]);

  const activeSubmessage =
    submessage ||
    (language === 'bn'
      ? 'প্রতি ফোঁটা রক্তে একটি জীবন — সাথে থাকার জন্য ধন্যবাদ'
      : 'Every drop is a heartbeat — Thank you for saving lives');

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden select-none ${
        fullscreen
          ? 'fixed inset-0 z-[99999] min-h-screen w-full bg-zinc-950/90 backdrop-blur-3xl'
          : 'w-full py-12 px-6'
      }`}
    >
      {/* Background Ambient Radial Light Field */}
      <div className="pointer-events-none absolute w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none absolute w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[90px] -z-10" />

      {/* Main Holographic / Liquid Vessel Stage */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Triple Concentric Vascular Shockwaves */}
        <div className="absolute w-32 h-32 rounded-full border border-rose-500/40 animate-vascular-wave-1 pointer-events-none" />
        <div className="absolute w-32 h-32 rounded-full border border-red-500/30 animate-vascular-wave-2 pointer-events-none" />
        <div className="absolute w-32 h-32 rounded-full border border-rose-400/20 animate-vascular-wave-3 pointer-events-none" />

        {/* Outer Orbital Red Blood Cell (Erythrocyte) Satellites */}
        <div className="absolute w-40 h-40 flex items-center justify-center pointer-events-none">
          {/* Orbiting Disc 1 (Clockwise) */}
          <div className="absolute animate-orbit-cw">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-red-700 shadow-[0_0_12px_rgba(225,29,72,0.8)] border border-rose-300/40 relative">
              <div className="absolute inset-1 rounded-full bg-red-950/60 shadow-inner" />
            </div>
          </div>
          {/* Orbiting Disc 2 (Counter-Clockwise) */}
          <div className="absolute animate-orbit-ccw">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-400 to-rose-700 shadow-[0_0_10px_rgba(244,63,94,0.8)] border border-rose-200/40 relative">
              <div className="absolute inset-0.5 rounded-full bg-rose-950/70 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Central Frosted Liquid Glass Container Capsule */}
        <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-white/[0.12] via-zinc-950/70 to-zinc-950/90 border border-white/25 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(225,29,72,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center p-3 animate-cardiac-cycle">
          {/* Top Glass Refraction Specular Sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="pointer-events-none absolute -top-8 -left-8 w-20 h-20 bg-white/15 rounded-full blur-xl" />

          {/* SVG Animated Blood Droplet with Dynamic Liquid Wave Fill */}
          <svg
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(225,29,72,0.7)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Droplet Outline Clip Path */}
              <clipPath id="dropletMask">
                <path d="M50 8 C50 8, 22 46, 22 66 C22 81.5, 34.5 94, 50 94 C65.5 94, 78 81.5, 78 66 C78 46, 50 8, 50 8 Z" />
              </clipPath>

              {/* Liquid Wave Gradient */}
              <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff2a5f" />
                <stop offset="35%" stopColor="#e11d48" />
                <stop offset="75%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>

              {/* Surface Reflection Gradient */}
              <linearGradient id="surfaceWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
              </linearGradient>

              {/* Glass Rim Gradient */}
              <linearGradient id="dropletRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fda4af" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#e11d48" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#881337" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Droplet Glass Outer Rim */}
            <path
              d="M50 8 C50 8, 22 46, 22 66 C22 81.5, 34.5 94, 50 94 C65.5 94, 78 81.5, 78 66 C78 46, 50 8, 50 8 Z"
              fill="#18181b"
              fillOpacity="0.5"
              stroke="url(#dropletRimGrad)"
              strokeWidth="2.5"
            />

            {/* Liquid Fill masked inside the droplet */}
            <g clipPath="url(#dropletMask)">
              {/* Blood Fluid Reservoir Fill */}
              <rect x="0" y="38" width="100" height="65" fill="url(#liquidGrad)" />

              {/* Undulating Dynamic Perfusion Wave */}
              <g className="animate-liquid-wave" style={{ width: '200px' }}>
                <path
                  d="M0 38 Q 25 33, 50 38 T 100 38 T 150 38 T 200 38 V 100 H 0 Z"
                  fill="url(#liquidGrad)"
                />
                <path
                  d="M0 38 Q 25 33, 50 38 T 100 38 T 150 38 T 200 38"
                  stroke="url(#surfaceWaveGrad)"
                  strokeWidth="2"
                  fill="none"
                />
              </g>

              {/* Ascending Micro-Oxygen Bubbles */}
              <circle cx="42" cy="75" r="2.2" fill="#ffffff" fillOpacity="0.7" className="animate-bubble-1" />
              <circle cx="56" cy="80" r="1.8" fill="#ffffff" fillOpacity="0.75" className="animate-bubble-2" />
              <circle cx="48" cy="85" r="1.4" fill="#ffffff" fillOpacity="0.8" className="animate-bubble-3" />

              {/* Inner Specular Light Glint Curve */}
              <path
                d="M50 14 C50 14, 28 48, 28 66 C28 72, 30 78, 34 82 C30 76, 29 70, 29 66 C29 50, 50 20, 50 14 Z"
                fill="#ffffff"
                fillOpacity="0.45"
              />
            </g>

            {/* Active ECG Heartbeat Arterial Laser Line */}
            <path
              d="M26 66 L38 66 L43 56 L47 78 L52 48 L56 72 L60 62 L63 66 L74 66"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg-laser drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            />
          </svg>
        </div>
      </div>

      {/* Cyber-Medical Telemetry & Status HUD Card */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md px-4 space-y-3">
        {/* Live Beacon Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-300 uppercase">
            DropOfLife • 64-DISTRICT LIVE NETWORK
          </span>
        </div>

        {/* Dynamic Rotating Telemetry Message */}
        <div className="min-h-[44px] flex flex-col items-center justify-center">
          <h2
            key={activeMessage}
            className="text-base sm:text-lg font-black text-white tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-300 drop-shadow-md"
          >
            {activeMessage}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
            {activeSubmessage}
          </p>
        </div>

        {/* High-Tech Liquid Segmented Progress Laser Bar */}
        <div className="w-64 sm:w-72 space-y-1.5 pt-1">
          <div className="relative h-2 w-full bg-zinc-900/90 rounded-full border border-white/15 overflow-hidden backdrop-blur-md p-0.5">
            {/* Segmented base track */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Sweeping Neon Laser Beam */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-neon-beam" />
            </div>
          </div>

          {/* Telemetry Numbers */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 font-semibold px-1">
            <span className="text-rose-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>78 BPM • NORMAL SINUS</span>
            </span>
            <span>{progress}% READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
