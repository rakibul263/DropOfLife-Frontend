'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Radio,
  Clock,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BloodAlertIcon } from '@/components/shared/BloodAlertIcon';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations, formatBilingualNumber } from '@/lib/translations';

interface DispatchNode {
  id: string;
  regionBn: string;
  regionEn: string;
  facilityBn: string;
  facilityEn: string;
  statusBn: string;
  statusEn: string;
  statusType: 'critical' | 'active' | 'success';
  timeBn: string;
  timeEn: string;
  detailsBn: string;
  detailsEn: string;
  bloodGroup: string;
}

const DISPATCH_NODES: DispatchNode[] = [
  {
    id: 'dhk-1',
    regionBn: 'ঢাকা সেন্ট্রাল',
    regionEn: 'Dhaka Central',
    facilityBn: 'ঢাকা মেডিকেল কলেজ হাসপাতাল (ডিএমসিএইচ)',
    facilityEn: 'Dhaka Medical College Hospital (DMCH)',
    statusBn: 'জরুরি রক্ত সরবরাহ প্রেরিত',
    statusEn: 'Emergency Transfusion Dispatched',
    statusType: 'active',
    timeBn: '৩ মিনিট আগে',
    timeEn: '3 mins ago',
    detailsBn: 'আইসিইউ ওয়ার্ড ৪-এ ২ ব্যাগ ও+ রক্ত দ্রুত পৌঁছানো হচ্ছে',
    detailsEn: '2 Units O+ whole blood en route to ICU Ward 4',
    bloodGroup: 'O+',
  },
  {
    id: 'ctg-1',
    regionBn: 'চট্টগ্রাম মেট্রো',
    regionEn: 'Chattogram Metro',
    facilityBn: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল',
    facilityEn: 'Chittagong Medical College Hospital',
    statusBn: 'কোল্ড-চেইন কুরিয়ার পথে রয়েছে',
    statusEn: 'Cold-Chain Courier En Route',
    statusType: 'success',
    timeBn: '৮ মিনিট আগে',
    timeEn: '8 mins ago',
    detailsBn: 'তাপমাত্রা নিয়ন্ত্রিত বিশেষ বক্সে প্লেটলেট সরবরাহ চলছে',
    detailsEn: 'Platelet concentrate in temperature-controlled box',
    bloodGroup: 'B+',
  },
  {
    id: 'raj-1',
    regionBn: 'রাজশাহী বিভাগ',
    regionEn: 'Rajshahi Division',
    facilityBn: 'রাজশাহী মেডিকেল কলেজ হাসপাতাল',
    facilityEn: 'Rajshahi Medical College Hospital',
    statusBn: 'রক্তদাতার প্রতিশ্রুতি নিশ্চিত',
    statusEn: 'Donor Pledge Verified',
    statusType: 'critical',
    timeBn: '১২ মিনিট আগে',
    timeEn: '12 mins ago',
    detailsBn: 'শিশুর জরুরি অপারেশনে দুর্লভ ও- গ্রুপের রক্তদাতা মিলেছে',
    detailsEn: 'Rare O- voluntary life saver matched for child surgery',
    bloodGroup: 'O-',
  },
  {
    id: 'syl-1',
    regionBn: 'সিলেট ও উত্তর-পূর্ব',
    regionEn: 'Sylhet & North-East',
    facilityBn: 'এমএজি ওসমানী মেডিকেল কলেজ',
    facilityEn: 'MAG Osmani Medical College',
    statusBn: 'ইনভেন্টরি রিস্টক সম্পন্ন',
    statusEn: 'Inventory Restocked',
    statusType: 'success',
    timeBn: '১৮ মিনিট আগে',
    timeEn: '18 mins ago',
    detailsBn: 'স্বাস্থ্য অধিদপ্তর কর্তৃক ৩৫ ব্যাগ পিআরবিসি কোল্ড স্টোরেজে সংরক্ষিত',
    detailsEn: '35 PRBC units verified in cold storage by DGHS',
    bloodGroup: 'A+',
  },
];

const LIVE_ALERTS_BN = [
  '🚑 চলমান সরবরাহ: ঢাকা মেডিকেলের আইসিইউ ওয়ার্ড ৪-এ ২ ইউনিট ও+ রক্ত পৌঁছেছে',
  '🩸 জরুরি মিল: উত্তরা সেক্টর ৭ এ ওপেন হার্ট সার্জারির জন্য এ- রক্তদাতা সংযুক্ত',
  '❄️ কোল্ড-চেইন পরিবহন: চট্টগ্রাম পোর্ট ক্লিনিকে তাপমাত্রা নিয়ন্ত্রিত প্লেটলেট বক্স পৌঁছেছে',
  '🏥 স্বাস্থ্য অধিদপ্তর সমন্বয়: ২৮টি হাসপাতালের ব্লাড ব্যাংকে শতভাগ কোল্ড-চেইন নিশ্চিত',
];

const LIVE_ALERTS_EN = [
  '🚑 Live Dispatch: 2 Units O+ arrived at Dhaka Medical College Hospital (ICU Ward 4)',
  '🩸 Urgent Match: Voluntary A- donor matched in Uttara Sector 7 for open cardiac surgery',
  '❄️ Cold-Chain Transit: Temperature-verified platelet box arrived at Chattogram Port Clinic',
  '🏥 DGHS Sync: 100% cold-chain calibration confirmed across 28 accredited hospital blood banks',
];

const REGIONAL_NODES = [
  { nameBn: 'ঢাকা বিভাগ', nameEn: 'Dhaka Division', units: 142, donors: 420, ping: '9ms', statusBn: 'অনুকূল', statusEn: 'Optimal' },
  { nameBn: 'চট্টগ্রাম বিভাগ', nameEn: 'Chattogram', units: 98, donors: 310, ping: '14ms', statusBn: 'উচ্চ প্রস্তুতি', statusEn: 'High Readiness' },
  { nameBn: 'রাজশাহী বিভাগ', nameEn: 'Rajshahi', units: 64, donors: 195, ping: '18ms', statusBn: 'অনুকূল', statusEn: 'Optimal' },
  { nameBn: 'সিলেট বিভাগ', nameEn: 'Sylhet', units: 52, donors: 160, ping: '21ms', statusBn: 'অনুকূল', statusEn: 'Optimal' },
  { nameBn: 'খুলনা বিভাগ', nameEn: 'Khulna', units: 48, donors: 145, ping: '16ms', statusBn: 'অনুকূল', statusEn: 'Optimal' },
  { nameBn: 'বরিশাল বিভাগ', nameEn: 'Barishal', units: 36, donors: 110, ping: '24ms', statusBn: 'স্ট্যান্ডবাই', statusEn: 'Standby' },
  { nameBn: 'রংপুর বিভাগ', nameEn: 'Rangpur', units: 41, donors: 130, ping: '22ms', statusBn: 'অনুকূল', statusEn: 'Optimal' },
  { nameBn: 'ময়মনসিংহ বিভাগ', nameEn: 'Mymensingh', units: 39, donors: 125, ping: '19ms', statusBn: 'অনুকূল', statusEn: 'Optimal' },
];

export function HeroBannerShowcase() {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].showcase;
  const alerts = language === 'bn' ? LIVE_ALERTS_BN : LIVE_ALERTS_EN;

  const [activeTab, setActiveTab] = useState<'dispatches' | 'nodes' | 'readiness'>('dispatches');
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [alerts.length]);

  return (
    <div className="mt-12 max-w-6xl mx-auto relative px-2 sm:px-4">
      {/* Outer Console Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-700/80 bg-gradient-to-b from-zinc-900/95 via-zinc-950 to-zinc-950 shadow-2xl shadow-black/80 ring-1 ring-white/10">
        {/* Futuristic Grid & Ambient Mesh Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] opacity-70 pointer-events-none" />
        <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="relative z-10 px-5 sm:px-8 pt-6 pb-4 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-400 uppercase tracking-widest font-mono">
                  {t.radarHeader}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {t.onlineBadge}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                {t.hubTitle}
              </h3>
            </div>
          </div>

          {/* Interactive Mode Pills */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-700/80 shrink-0 shadow-inner">
            <button
              onClick={() => setActiveTab('dispatches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dispatches'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.tabDispatches}
            </button>
            <button
              onClick={() => setActiveTab('nodes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'nodes'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.tabNodes}
            </button>
            <button
              onClick={() => setActiveTab('readiness')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'readiness'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.tabReadiness}
            </button>
          </div>
        </div>

        {/* Console Main Content Area */}
        <div className="relative z-10 p-5 sm:p-8">
          {activeTab === 'dispatches' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {DISPATCH_NODES.map((node) => (
                <div
                  key={node.id}
                  className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-500 hover:bg-zinc-850 transition-all shadow-xl group flex flex-col justify-between h-full"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-rose-950 shrink-0">
                            {node.bloodGroup}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                              {language === 'bn' ? node.regionBn : node.regionEn}
                            </p>
                            <h4 className="text-sm font-extrabold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                              {language === 'bn' ? node.facilityBn : node.facilityEn}
                            </h4>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                          {language === 'bn' ? node.timeBn : node.timeEn}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium line-clamp-2 min-h-[40px]">
                        {language === 'bn' ? node.detailsBn : node.detailsEn}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 mt-auto shrink-0 flex items-center justify-between text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 font-bold ${
                        node.statusType === 'critical'
                          ? 'text-rose-400'
                          : node.statusType === 'active'
                          ? 'text-cyan-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {language === 'bn' ? node.statusBn : node.statusEn}
                    </span>

                    <span className="text-zinc-400 text-[11px] font-semibold">
                      {t.gpsTracked}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'nodes' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-stretch">
              {REGIONAL_NODES.map((div) => (
                <div
                  key={div.nameEn}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-500 transition-all shadow-lg h-full flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      {language === 'bn' ? div.nameBn : div.nameEn}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">{div.ping}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-zinc-300">
                      <span>{t.unitsInStockLabel}</span>
                      <strong className="text-white font-bold">
                        {formatBilingualNumber(div.units, language)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>{t.activeDonorsLabel}</span>
                      <strong className="text-rose-400 font-bold">
                        {formatBilingualNumber(div.donors, language)}
                      </strong>
                    </div>
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-800 text-[10px] font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {language === 'bn' ? div.statusBn : div.statusEn}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'readiness' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-rose-400 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">{t.avgResponseTitle}</span>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{t.avgResponseVal}</div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal min-h-[44px] line-clamp-2 mt-2">
                  {t.avgResponseDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-cyan-400 mb-2">
                    <Truck className="w-5 h-5" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">{t.coldChainTitle}</span>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{t.coldChainVal}</div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal min-h-[44px] line-clamp-2 mt-2">
                  {t.coldChainDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-emerald-400 mb-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">{t.safetyTitle}</span>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{t.safetyVal}</div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal min-h-[44px] line-clamp-2 mt-2">
                  {t.safetyDesc}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Ticker Bar */}
        <div className="px-5 sm:px-8 py-3 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-sm">
              <BloodAlertIcon size="xs" pulse={true} />
              <span>{t.liveFeedLabel}</span>
            </span>
            <p className="text-zinc-200 truncate font-mono text-xs sm:text-sm">
              {alerts[currentAlertIndex]}
            </p>
          </div>
          <Link
            href="/emergency-requests"
            className="text-rose-400 hover:text-white font-bold flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>{t.viewAllBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Floating Telemetry Badges */}
        <div className="px-5 sm:px-8 py-4 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-black text-sm shrink-0">
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-zinc-300 font-bold uppercase tracking-wider">
                {t.gpsStatusTitle}
              </p>
              <p className="text-sm font-extrabold text-white">
                {t.gpsStatusDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/donors">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs h-9 px-4 rounded-xl"
              >
                {t.findDonorsQuick}
              </Button>
            </Link>
            <Link href="/emergency-requests">
              <Button
                variant="primary"
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-md shadow-rose-950"
              >
                {t.postRequestQuick}
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-300 font-bold uppercase tracking-wider">
                {t.dghsTitle}
              </p>
              <p className="text-sm font-extrabold text-white">
                {t.dghsDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
