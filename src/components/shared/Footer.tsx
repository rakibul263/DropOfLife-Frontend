'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/stores/languageStore';
import { navTranslations } from '@/lib/translations';
import {
  Droplet,
  PhoneCall,
  Heart,
  Shield,
  ShieldCheck,
  Activity,
  FileCheck2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { language } = useLanguageStore();

  // Hide footer on admin & hospital dashboards, login, and register
  if (
    pathname?.startsWith('/dashboard/admin') ||
    pathname?.startsWith('/dashboard/provider') ||
    pathname?.startsWith('/dashboard/hospital') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  const t = navTranslations[language];

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs">
      {/* Emergency Hotline Banner */}
      <div className="bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-b border-red-900/50 py-3.5 px-4 shadow-lg shadow-red-950/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-rose-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span className="font-bold tracking-wide">{t.footer.hotlineTitle}</span>
            <a
              href="tel:029351969"
              className="text-white font-mono font-black text-sm tracking-wider underline hover:text-rose-300 transition-colors"
            >
              {t.hotlineNumber}
            </a>
            <span className="text-zinc-500">|</span>
            <a
              href="tel:+8801521711716"
              className="text-rose-300 font-mono font-bold text-xs hover:underline"
            >
              {t.hotlineMobile}
            </a>
          </div>
          <span className="text-rose-300/90 text-[11px] font-medium">
            {t.footer.hotlineSub}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Platform Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-md shadow-rose-950/60 border border-rose-500/40">
                <Droplet className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {language === 'bn' ? (
                  <span className="text-rose-500 font-extrabold">{t.brandName}</span>
                ) : (
                  <>
                    Drop<span className="text-rose-500">OfLife</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.footer.protocol}</span>
            </div>
          </div>

          {/* Col 2: Emergency Actions */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/donors" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {t.footer.donors}
                </Link>
              </li>
              <li>
                <Link href="/emergency-requests" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {t.footer.requests}
                </Link>
              </li>
              <li>
                <Link href="/camps" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {t.footer.camps}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {t.footer.support}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Access */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t.footer.portalsTitle}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/login" className="hover:text-rose-400 transition-colors">
                  {t.footer.admin}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-rose-400 transition-colors">
                  {t.footer.donorReg}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-rose-400 transition-colors">
                  {t.footer.hospital}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-rose-400 transition-colors">
                  {t.footer.partner}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Clinical Standards & Accreditation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {t.footer.qualityTitle}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.footer.qualityDesc}
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold text-[11px]">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.footer.guidelines}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {t.footer.directDispatch}{' '}
                  <strong className="text-white font-mono">{t.hotlineNumber}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              {t.footer.dedication} <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
