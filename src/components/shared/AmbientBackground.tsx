'use client';

import React from 'react';
import { VascularBloodBackground } from './VascularBloodBackground';

export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none"
    >
      {/* 1. Deep Obsidian Base Foundation */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* 2. Micro-Vascular Vein Network & Global Animated Blood Cells */}
      <VascularBloodBackground />

      {/* 2. Top Hero Ambient Fluid Halo (Arterial Crimson Glow) */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1200px] h-[650px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.16)_0%,rgba(159,18,57,0.06)_50%,transparent_75%)] blur-3xl opacity-90 animate-pulse-slow" />

      {/* 3. Mid-Page Left Arterial Vitality Aura */}
      <div className="absolute top-[35%] -left-[250px] w-[750px] h-[750px] rounded-full bg-[radial-gradient(circle_at_center,rgba(190,18,60,0.10)_0%,rgba(136,19,55,0.03)_50%,transparent_70%)] blur-3xl opacity-75" />

      {/* 4. Lower-Page Right Healthcare Safety Aura (Subtle Emerald/Cyan Bloom) */}
      <div className="absolute top-[60%] -right-[250px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.08)_0%,rgba(16,185,129,0.04)_45%,transparent_70%)] blur-3xl opacity-70" />

      {/* 5. Bottom Page Atmospheric Grounding Halo */}
      <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(159,18,57,0.12)_0%,transparent_70%)] blur-3xl opacity-80" />

      {/* 6. Classic Fine-Art Micro-Lattice Pattern (Subtle Stippled Matrix) */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(244,63,94,0.07)_1px,transparent_1px)] [background-size:32px_32px] opacity-70" />

      {/* 7. Precision Architectural Geometry Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:64px_64px] opacity-60" />

      {/* 8. Cinematic Vignette (Soft Depth Attenuation around Viewport Edges) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.65)_85%)]" />
    </div>
  );
}
