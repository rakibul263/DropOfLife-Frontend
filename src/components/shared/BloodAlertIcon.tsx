'use client';

import React from 'react';
import Image from 'next/image';

interface BloodAlertIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  useImage?: boolean;
  pulse?: boolean;
}

const sizeMap = {
  xs: { box: 'w-4 h-4', img: 16 },
  sm: { box: 'w-5 h-5', img: 20 },
  md: { box: 'w-7 h-7', img: 28 },
  lg: { box: 'w-10 h-10', img: 40 },
  xl: { box: 'w-14 h-14', img: 56 },
};

/**
 * Custom Blood Alert Icon designed exclusively for DropOfLife.
 * Combines a glowing ruby blood droplet, medical heartbeat pulse,
 * and emergency beacon radar waves.
 */
export function BloodAlertIcon({
  className = '',
  size = 'sm',
  useImage = false,
  pulse = true,
}: BloodAlertIconProps) {
  const currentSize = sizeMap[size] || sizeMap.sm;

  if (useImage) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-[0_0_12px_rgba(225,29,72,0.6)] ${currentSize.box} ${
          pulse ? 'animate-pulse' : ''
        } ${className}`}
      >
        <Image
          src="/images/blood-alert-icon.png"
          alt="Emergency Blood Alert"
          width={currentSize.img}
          height={currentSize.img}
          className="w-full h-full object-cover scale-110 drop-shadow"
          priority
        />
      </div>
    );
  }

  // Ultra-crisp, high-fidelity SVG icon for inline UI elements
  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${currentSize.box} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_0_8px_rgba(225,29,72,0.8)] ${
          pulse ? 'animate-pulse' : ''
        }`}
      >
        <defs>
          <linearGradient id="bloodAlertGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="45%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="goldPulseGrad" x1="6" y1="12" x2="18" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
          <filter id="alertGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Radiating Emergency Radar Waves */}
        <path
          d="M20.5 8.5C21.8 10.3 22.5 12.6 22.5 15C22.5 17.4 21.8 19.7 20.5 21.5"
          stroke="#F43F5E"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.65"
          className="animate-ping"
          style={{ transformOrigin: 'center', animationDuration: '2s' }}
        />
        <path
          d="M3.5 8.5C2.2 10.3 1.5 12.6 1.5 15C1.5 17.4 2.2 19.7 3.5 21.5"
          stroke="#F43F5E"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.65"
          className="animate-ping"
          style={{ transformOrigin: 'center', animationDuration: '2s' }}
        />

        {/* Ruby Blood Droplet Shell */}
        <path
          d="M12 2.2C12 2.2 5.5 11 5.5 15.8C5.5 19.4 8.4 22.2 12 22.2C15.6 22.2 18.5 19.4 18.5 15.8C18.5 11 12 2.2 12 2.2Z"
          fill="url(#bloodAlertGrad)"
          stroke="#FDA4AF"
          strokeWidth="1.2"
          filter="url(#alertGlow)"
        />

        {/* Droplet Highlight Sheen */}
        <path
          d="M8.5 13C8.5 10.5 10.5 6.5 12 4.5"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Center Emergency Alarm Beacon Light & Heartbeat ECG Line */}
        {/* ECG Heartbeat Line */}
        <path
          d="M7.8 16.5H9.5L10.5 13.5L12 19.5L13.5 14.5L14.5 16.5H16.2"
          stroke="url(#goldPulseGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Emergency Beacon Core Dot */}
        <circle cx="12" cy="11.5" r="1.5" fill="#FFFFFF" className="animate-ping" />
        <circle cx="12" cy="11.5" r="1.2" fill="#FEF08A" />
      </svg>
    </span>
  );
}

/**
 * 3D Translucent Ruby Blood Alert Emblem (Uses the generated 3D image)
 */
export function BloodAlert3DEmblem({
  size = 36,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl p-0.5 bg-gradient-to-tr from-rose-600 via-amber-500/40 to-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.65)] ring-1 ring-white/30 overflow-hidden ${className}`}
    >
      <div className="w-full h-full rounded-[14px] overflow-hidden bg-black flex items-center justify-center">
        <Image
          src="/images/blood-alert-icon.png"
          alt="Emergency Blood Alert"
          width={size * 2}
          height={size * 2}
          className="w-full h-full object-cover scale-110"
        />
      </div>
    </div>
  );
}
