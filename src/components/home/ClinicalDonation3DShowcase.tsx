'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Activity,
  Droplet,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Heart,
  Eye,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { formatBilingualNumber } from '@/lib/translations';

interface Hotspot {
  id: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  icon: 'droplet' | 'shield' | 'activity' | 'heart';
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'cannula',
    xPercent: 52.2,
    yPercent: 55.6,
    titleBn: 'ব্যথাহীন ১৬-গেজ ক্যানুলা',
    titleEn: '16G Siliconized Cannula',
    subtitleBn: 'একক ব্যবহার্য সিলিকন সুঁই • ১০০% জীবাণুমুক্ত',
    subtitleEn: 'Single-use siliconized cannula • 100% sterile',
    icon: 'shield',
  },
  {
    id: 'tubing',
    xPercent: 39.5,
    yPercent: 48.0,
    titleBn: 'অ্যাসপটিক আইভি টিউবিং',
    titleEn: 'Aseptic Transfusion Line',
    subtitleBn: 'ক্লোজড-লুপ ভ্যাকুয়াম প্রবাহ • রক্ত জমাটমুক্ত',
    subtitleEn: 'Closed-loop vacuum flow • Clot-free line',
    icon: 'droplet',
  },
  {
    id: 'bag',
    xPercent: 35.6,
    yPercent: 19.5,
    titleBn: 'CPDA-1 হোল ব্লাড ব্যাগ',
    titleEn: 'CPDA-1 450mL Vessel',
    subtitleBn: '৪৫০ মিলি স্ট্যান্ডার্ড ইউনিট • ডব্লিউএইচও সার্টিফাইড',
    subtitleEn: '450mL standard unit • WHO certified',
    icon: 'heart',
  },
  {
    id: 'monitor',
    xPercent: 88.0,
    yPercent: 14.0,
    titleBn: 'লাইভ ভাইটাল সাইন মনিটর',
    titleEn: 'Live Vitals Monitor',
    subtitleBn: 'পালস: ৭৪ BPM • প্রেসার: ১১৮/৭৮ mmHg',
    subtitleEn: 'Pulse: 74 BPM • BP: 118/78 mmHg',
    icon: 'activity',
  },
];

export function ClinicalDonation3DShowcase() {
  const { language } = useLanguageStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumeMl, setVolumeMl] = useState(380);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth 3D perspective mouse tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DEnabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle natural tilt angles (-4deg to +4deg)
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 5;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  // Continuous donation volume fill loop when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setVolumeMl((prev) => {
        if (prev >= 450) return 65; // loop smoothly from initial flow
        return prev + 5;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <section className="relative rounded-3xl bg-zinc-950/95 border border-zinc-800 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] p-6 sm:p-10 lg:p-12 overflow-hidden ring-1 ring-white/10">
      {/* Background Ambient Lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      {/* ======================================================== */}
      {/* SECTION HEADER: Clean, Minimal, Non-Intrusive */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {language === 'bn'
                ? '৩ডি লাইভ ক্লিনিক্যাল স্যুট'
                : '3D Live Phlebotomy Suite'}
            </span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'bn' ? (
              <>
                বাস্তব রক্তদান প্রক্রিয়া •{' '}
                <span className="bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent">
                  লাইভ ভিজ্যুয়াল সিমুলেশন
                </span>
              </>
            ) : (
              <>
                Clinical Phlebotomy •{' '}
                <span className="bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent">
                  Live 3D Patient Simulation
                </span>
              </>
            )}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400">
            {language === 'bn'
              ? 'আধুনিক ও ব্যথাহীন পরিবেশে দক্ষ চিকিৎসকের তত্ত্বাবধানে নিরাপদ রক্তদান প্রক্রিয়া।'
              : 'Safe, painless blood collection under expert medical supervision in a sterile clinic.'}
          </p>
        </div>

        {/* Quick Top Metrics Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold text-white">৭৪ BPM</span>
            <span className="text-[10px] text-zinc-500">PULSE</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 font-mono">
            <Droplet className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-bold text-rose-400">
              {formatBilingualNumber(volumeMl, language)} / ৪৫০
            </span>
            <span className="text-[10px] text-zinc-500">ML</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN 3D INTERACTIVE CINEMATIC CANVAS */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[16/9] max-h-[640px] rounded-3xl overflow-hidden border border-zinc-700/80 shadow-2xl bg-zinc-950 select-none group"
        style={{ perspective: '1200px' }}
      >
        {/* 3D Transforming Stage Body */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out preserve-3d"
          style={{
            transform: is3DEnabled
              ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.01, 1.01, 1.01)`
              : 'none',
          }}
        >
          {/* Base Photographic Master Render (Real Humans with Exact Specified Faces) */}
          <Image
            src="/images/clinical_donation_live_scene.jpg"
            alt="Real human blood donation clinical simulation"
            fill
            priority
            className="object-cover object-center pointer-events-none"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          {/* Interactive Specular Glare Layer (Shifts with mouse tilt) */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none transition-opacity duration-300"
            style={{
              transform: is3DEnabled
                ? `translateX(${rotate.y * -8}px) translateY(${rotate.x * -8}px)`
                : 'none',
            }}
          />

          {/* ======================================================== */}
          {/* SVG OVERLAY: ANIMATED BLOOD FLOW & TELEMETRY */}
          {/* ======================================================== */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 1376 768"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Blood Flow Linear Gradient */}
              <linearGradient id="liveBloodGrad" x1="1" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>

              {/* Glowing Filter for Arterial Blood */}
              <filter id="bloodGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. IV Tubing Path (From Donor Arm (716, 426) to Bag Drip Chamber (480, 268)) */}
            <path
              d="M 716 426 C 650 470, 580 435, 480 268"
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Animated Venous Blood Stream through the tube */}
            {isPlaying && (
              <path
                d="M 716 426 C 650 470, 580 435, 480 268"
                fill="none"
                stroke="url(#liveBloodGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#bloodGlow)"
                className="animate-blood-stream"
              />
            )}

            {/* Cannula Arm Insertion Site Pulse Aura */}
            <circle
              cx="716"
              cy="426"
              r="10"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2"
              className="animate-ping"
              opacity="0.75"
            />
            <circle
              cx="716"
              cy="426"
              r="4"
              fill="#ef4444"
              className="animate-pulse"
            />

            {/* Bag Inlet Drip Point Animated Drop */}
            {isPlaying && (
              <circle
                cx="480"
                cy="268"
                r="3"
                fill="#f43f5e"
                className="animate-pulse"
                filter="url(#bloodGlow)"
              />
            )}

            {/* Vital Signs Monitor ECG Live Trace Overlay (Coordinates: 1090 to 1320 on x, 35 to 80 on y) */}
            <path
              d="M 1095 62 L 1120 62 L 1125 50 L 1130 75 L 1135 38 L 1140 70 L 1145 62 L 1175 62 L 1180 50 L 1185 75 L 1190 38 L 1195 70 L 1200 62 L 1235 62 L 1240 50 L 1245 75 L 1250 38 L 1255 70 L 1260 62 L 1315 62"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-ecg opacity-90"
              filter="drop-shadow(0 0 4px #22c55e)"
            />
          </svg>

          {/* ======================================================== */}
          {/* INTERACTIVE HOTSPOTS: Minimalist Tactile Glowing Pins */}
          {/* ======================================================== */}
          {HOTSPOTS.map((spot) => {
            const isActive = activeHotspot === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                style={{
                  left: `${spot.xPercent}%`,
                  top: `${spot.yPercent}%`,
                }}
                onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                {/* Glowing Pulse Ring */}
                <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-pulse-ring pointer-events-none" />

                {/* Tactile Pin Button */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all shadow-lg backdrop-blur-md ${
                    isActive
                      ? 'bg-rose-600 border-white text-white scale-125 shadow-[0_0_20px_#e11d48]'
                      : 'bg-zinc-950/80 border-rose-500/80 text-rose-400 hover:scale-110 hover:border-white'
                  }`}
                >
                  {spot.icon === 'droplet' && <Droplet className="w-3.5 h-3.5 fill-current" />}
                  {spot.icon === 'shield' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {spot.icon === 'heart' && <Heart className="w-3.5 h-3.5 fill-current" />}
                  {spot.icon === 'activity' && <Activity className="w-3.5 h-3.5" />}
                </div>

                {/* Micro Tooltip: Clean, 1-Line, Zero Clutter */}
                {isActive && (
                  <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-zinc-950/95 border border-zinc-700/80 text-white rounded-xl p-2.5 shadow-2xl backdrop-blur-xl whitespace-nowrap z-40 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{language === 'bn' ? spot.titleBn : spot.titleEn}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono pt-0.5">
                      {language === 'bn' ? spot.subtitleBn : spot.subtitleEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* FLOATING FROSTED GLASS CONTROLLER: Minimalist & Clean */}
        {/* ======================================================== */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* Left: Flow Status Indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
              }`}
            />
            <span className="text-xs font-bold text-zinc-200 hidden sm:inline">
              {isPlaying
                ? language === 'bn'
                  ? 'স্বাভাবিক রক্তপ্রবাহ সক্রিয় (৪৮ মিলি/মিনিট)'
                  : 'Flow Active (48 mL/min)'
                : language === 'bn'
                ? 'সিমুলেশন স্থগিত'
                : 'Simulation Paused'}
            </span>
            <span className="text-xs font-bold text-zinc-200 sm:hidden">
              {isPlaying ? 'সক্রিয়' : 'স্থগিত'}
            </span>
          </div>

          {/* Center: Live Volume Progress Bar */}
          <div className="flex-1 max-w-xs mx-2 flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400 hidden md:inline">
              {language === 'bn' ? 'সংগ্রহ:' : 'Vol:'}
            </span>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 transition-all duration-300"
                style={{ width: `${(volumeMl / 450) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-black text-rose-400 shrink-0">
              {formatBilingualNumber(volumeMl, language)}
              <span className="text-[9px] text-zinc-500 ml-0.5">ML</span>
            </span>
          </div>

          {/* Right: Controls (Play/Pause, 3D Toggle, Reset) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-rose-500/50 transition-all cursor-pointer"
              title={isPlaying ? 'Pause Flow' : 'Resume Flow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-rose-500" />}
            </button>

            {/* 3D Depth Toggle */}
            <button
              onClick={() => setIs3DEnabled(!is3DEnabled)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer hidden sm:flex items-center gap-1 ${
                is3DEnabled
                  ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400'
              }`}
              title="Toggle 3D Depth Parallax"
            >
              <span>3D</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setVolumeMl(65);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Reset Volume"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
