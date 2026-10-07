'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Heart,
  Droplet,
  CheckCircle2,
  ShieldCheck,
  Clock,
  FlaskConical,
  Award,
  Sparkles,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { RealisticBloodBag } from '@/components/blood/RealisticBloodBag';

interface StepData {
  id: number;
  stepNumberBn: string;
  stepNumberEn: string;
  titleBn: string;
  titleEn: string;
  shortDescBn: string;
  shortDescEn: string;
  clinicalDetailsBn: string[];
  clinicalDetailsEn: string[];
  safetyHighlightBn: string;
  safetyHighlightEn: string;
  donorFeelingBn: string;
  donorFeelingEn: string;
  badgeBn: string;
  badgeEn: string;
  durationBn: string;
  durationEn: string;
  bagFillPercent: number; // 0 to 100
  volumeMl: number; // 0 to 450
  statusTagBn: string;
  statusTagEn: string;
  isAgitating: boolean;
}

const STEPS: StepData[] = [
  {
    id: 1,
    stepNumberBn: '০১',
    stepNumberEn: '01',
    titleBn: 'মেডিকেল প্রি-স্ক্রিনিং ও হিমোগ্লোবিন টেস্ট',
    titleEn: 'Clinical Pre-Screening & Hemoglobin Test',
    shortDescBn:
      'রক্তদানের ঠিক পূর্বে ডোনারের ভাইটাল সাইন, রক্তের ঘনত্ব ও সার্বিক শারীরিক সুস্থতা নিশ্চিত করা হয়।',
    shortDescEn:
      'Verifying vital signs, arterial pressure, and hemoglobin concentration prior to donation.',
    clinicalDetailsBn: [
      'ডিজিটাল বিপি মনিটরে রক্তচাপ মাপা হয় (আদর্শ মান: ১২০/৮০ mmHg)।',
      'আঙুলের ডগায় দ্রুত ড্রপ টেস্টে হিমোগ্লোবিন যাচাই (ন্যূনতম ১২.৫ g/dL আবশ্যক)।',
    ],
    clinicalDetailsEn: [
      'Digital BP check to confirm normal arterial pressure (optimal 120/80 mmHg).',
      'Rapid fingerprick cuvette test to verify hemoglobin level (minimum 12.5 g/dL).',
    ],
    safetyHighlightBn: '১০০% জীবাণুমুক্ত মাইক্রো-ল্যান্সেট ও ডিজিটাল সেন্সর ব্যবহার করা হয়।',
    safetyHighlightEn: '100% sterile micro-lancet and calibrated digital telemetry used.',
    donorFeelingBn: 'সামান্য আঙুল ছোঁয়ার অনুভূতি, কোনো ধরনের দুর্বলতা হয় না।',
    donorFeelingEn: 'Minor fingertip prick sensation; entirely comfortable and safe.',
    badgeBn: 'স্বাস্থ্য মূল্যায়ন',
    badgeEn: 'Health Assessment',
    durationBn: '৩-৫ মিনিট',
    durationEn: '3-5 Mins',
    bagFillPercent: 0,
    volumeMl: 0,
    statusTagBn: 'উপযুক্ত হিসেবে সার্টিফাইড',
    statusTagEn: 'Certified Eligible',
    isAgitating: false,
  },
  {
    id: 2,
    stepNumberBn: '০২',
    stepNumberEn: '02',
    titleBn: 'শিরা নির্বাচন ও অ্যান্টিসেপটিক ক্লিনিং',
    titleEn: 'Vein Selection & Antiseptic Sterilization',
    shortDescBn:
      'কনুইয়ের ভাঁজে উপযুক্ত মিডিয়ান কিউবিটাল শিরা শনাক্ত করে ত্বক সম্পূর্ণ জীবাণুমুক্ত করা হয়।',
    shortDescEn:
      'Identifying median cubital vein and sterilizing the dermal layer with two-stage antiseptic.',
    clinicalDetailsBn: [
      'হাতে নরম আরামদায়ক টুরনিকেট বেঁধে শিরা সুস্পষ্টভাবে চিহ্নিত করা হয়।',
      '৭০% অ্যালকোহল ও পোভিডন-আইওডিন সোয়াব দিয়ে ৩০ সেকেন্ড বৃত্তাকারে পরিষ্কার করা হয়।',
    ],
    clinicalDetailsEn: [
      'Soft ergonomic tourniquet applied on upper arm to engorge the median cubital vein.',
      '70% isopropyl alcohol & povidone-iodine circular aseptic swab for 30 seconds.',
    ],
    safetyHighlightBn: 'ডাবল অ্যান্টিসেপটিক প্রক্রিয়ায় ত্বকের ব্যাক্টেরিয়া শূন্যে নামিয়ে আনা হয়।',
    safetyHighlightEn: 'Dual-phase antiseptic protocol ensures zero surface bio-burden.',
    donorFeelingBn: 'ত্বকে হালকা ঠান্ডা শীতল অনুভূতি ছাড়া কোনো ধরনের অস্বস্তি নেই।',
    donorFeelingEn: 'Cool soothing sensation on skin; completely relaxed.',
    badgeBn: 'অ্যান্টিসেপটিক প্রোটোকল',
    badgeEn: 'Aseptic Protocol',
    durationBn: '১-২ মিনিট',
    durationEn: '1-2 Mins',
    bagFillPercent: 0,
    volumeMl: 0,
    statusTagBn: 'ত্বক সম্পূর্ণ জীবাণুমুক্ত',
    statusTagEn: 'Sterilization Complete',
    isAgitating: false,
  },
  {
    id: 3,
    stepNumberBn: '০৩',
    stepNumberEn: '03',
    titleBn: 'ব্যথাহীন ১৬-গেজ সুই প্রবেশ ও ফ্লো শুরু',
    titleEn: 'Sterile 16-Gauge Needle Insertion',
    shortDescBn:
      'একক ব্যবহার্য সিলিকনাইজড নিডলের মাধ্যমে মাত্র ১ সেকেন্ডে ব্যথাহীনভাবে মসৃণ রক্তপ্রবাহ চালু হয়।',
    shortDescEn:
      'Single-use siliconized cannula inserted painlessly to initiate smooth venous blood flow.',
    clinicalDetailsBn: [
      'চিকিৎসাবিজ্ঞানের আল্ট্রা-থিন ১৬-গেজ সুই ১৫°-৩০° কোণে আলতোভাবে শিরায় প্রবেশ করে।',
      'স্বচ্ছ ফ্ল্যাশব্যাক চেম্বারে রক্ত দৃশ্যমান হওয়ার সাথে সাথে ক্যাথেটার লক করা হয়।',
    ],
    clinicalDetailsEn: [
      'Siliconized 16-gauge sterile needle gently inserted at a 15°-30° angle.',
      'Flashback chamber confirms immediate, smooth intravenous connection.',
    ],
    safetyHighlightBn: 'প্যাকেট থেকে বের করা ব্র্যান্ড নিউ সিলিকন কোটেড একক ব্যবহার্য সুই।',
    safetyHighlightEn: 'Brand-new factory-sealed siliconized needle used only once and discarded.',
    donorFeelingBn: 'একটি ছোট পিঁপড়ার কামড়ের মতো সামান্য অনুভূতি যা ১ সেকেন্ডেই মিলিয়ে যায়।',
    donorFeelingEn: 'Mild pinch sensation for less than a second, then completely painless.',
    badgeBn: 'ব্যথাহীন প্রবেশ',
    badgeEn: 'Painless Phlebotomy',
    durationBn: '৩০ সেকেন্ড',
    durationEn: '30 Seconds',
    bagFillPercent: 15,
    volumeMl: 65,
    statusTagBn: 'রক্তপ্রবাহ নিশ্চিত',
    statusTagEn: 'Venous Flow Confirmed',
    isAgitating: false,
  },
  {
    id: 4,
    stepNumberBn: '০৪',
    stepNumberEn: '04',
    titleBn: 'অটোমেটিক এজিমিক্সার মেশিনে রক্ত সংগ্রহ',
    titleEn: 'Agitator Rocking & Blood Collection',
    shortDescBn:
      'স্বয়ংক্রিয় দোলায়মান মেশিনে CPDA-1 প্রিজারভেটিভসহ রক্ত জমাট না বেঁধে আদর্শ মানে সংগৃহীত হয়।',
    shortDescEn:
      'Automated continuous oscillation rocker mixes blood with CPDA-1 anticoagulant gently.',
    clinicalDetailsBn: [
      'রক্ত স্বচ্ছ টিউবিং দিয়ে ৩৫০/৪৫০ মিলি জীবাণুমুক্ত CPDA-1 অ্যান্টিকোয়াগুল্যান্ট ব্যাগে জমা হয়।',
      'ডিজিটাল এজিমিক্সার রোকার ব্যাগটিকে ক্রমাগত আলতোভাবে দোলায় যাতে রক্ত জমাট না বাঁধে।',
    ],
    clinicalDetailsEn: [
      'Blood flows into vacuum sterile collection bag pre-filled with CPDA-1 anticoagulant.',
      'Automated digital balance rocker gently agitates the bag (60 RPM) to prevent micro-clotting.',
    ],
    safetyHighlightBn: 'অটো-সেন্সর কখনই নির্ধারিত ৪৫০ মিলির বেশি রক্ত সংগ্রহ করতে দেয় না।',
    safetyHighlightEn: 'Automatic optical scale prevents collecting more than the precise 450mL limit.',
    donorFeelingBn: 'আরামদায়ক বেডে শুয়ে গান শোনা বা মোবাইল ব্যবহারের প্রশান্তিময় মুহূর্ত।',
    donorFeelingEn: 'Relaxing on the recliner bed; completely painless and comfortable.',
    badgeBn: 'স্বয়ংক্রিয় সংগ্রহ',
    badgeEn: 'Automated Collection',
    durationBn: '৭-১০ মিনিট',
    durationEn: '7-10 Mins',
    bagFillPercent: 85,
    volumeMl: 380,
    statusTagBn: 'সফলভাবে পূর্ণ হচ্ছে',
    statusTagEn: 'Filling Smoothly',
    isAgitating: true,
  },
  {
    id: 5,
    stepNumberBn: '০৫',
    stepNumberEn: '05',
    titleBn: 'ল্যাব পরীক্ষার জন্য পাইলট স্যাম্পল সংগ্রহ',
    titleEn: 'Pilot Diagnostic Sample Tubes',
    shortDescBn:
      'এইচআইভি, হেপাটাইটিস ও ক্রস-ম্যাচিং পরীক্ষার জন্য ডাইভারশন পাউচ থেকে টেস্ট টিউব নেওয়া হয়।',
    shortDescEn:
      'Collecting sample vacutainers from diversion pouch for mandatory 5 infectious screenings.',
    clinicalDetailsBn: [
      'প্রধান ব্যাগ পূর্ণ হওয়ার পর সরাসরি ইনটিগ্রাল ডাইভারশন পাউচ থেকে টেস্ট টিউবে স্যাম্পল নেওয়া হয়।',
      'বাধ্যতামূলক ৫টি স্ক্রিনিং: HIV-1/2, Hepatitis B, Hepatitis C, Syphilis ও Malaria।',
    ],
    clinicalDetailsEn: [
      'Diagnostic vacutainer tubes filled directly from the integral diversion pouch.',
      'Mandatory WHO screening: HIV-1/2, Hepatitis B, Hepatitis C, Syphilis, and Malaria.',
    ],
    safetyHighlightBn: 'আন্তর্জাতিক মানদণ্ডে ৫ স্তরের রোগমুক্ত স্ক্রিনিং নিশ্চিত করা হয়।',
    safetyHighlightEn: '5 mandatory clinical screenings guarantee 100% disease-free transfusion safety.',
    donorFeelingBn: 'ডোনারকে আলাদা কোনো সুই ফোটাতে হয় না, পূর্বের লাইন থেকেই নমুনা নেওয়া হয়।',
    donorFeelingEn: 'No extra needle required; filled seamlessly via the integrated line.',
    badgeBn: 'ল্যাব স্ক্রিনিং',
    badgeEn: 'Safety Screening',
    durationBn: '১ মিনিট',
    durationEn: '1 Min',
    bagFillPercent: 100,
    volumeMl: 450,
    statusTagBn: 'স্যাম্পল সংগ্রহ সম্পন্ন',
    statusTagEn: 'Samples Barcoded',
    isAgitating: false,
  },
  {
    id: 6,
    stepNumberBn: '০৬',
    stepNumberEn: '06',
    titleBn: 'সুই প্রত্যাহার ও জীবাণুমুক্ত ব্যান্ডেজ',
    titleEn: 'Needle Withdrawal & Hemostasis',
    shortDescBn:
      'অতি আলতোভাবে সুই অপসারণ করে অ্যান্টিসেপটিক প্রেসার গজ ও ওয়াটারপ্রুফ ব্যান্ডেজ লাগানো হয়।',
    shortDescEn:
      'Needle removed smoothly with sterile dry gauze and sealed with medical adhesive bandage.',
    clinicalDetailsBn: [
      'টুরনিকেট খুলে মসৃণভাবে সুই প্রত্যাহার করে জীবাণুমুক্ত গজ দিয়ে ৩-৫ মিনিট চাপ দেওয়া হয়।',
      'প্রাকৃতিক হেমাটোস্ট্যাসিস সম্পন্ন হলে অ্যান্টিসেপটিক ব্যান্ডেজ লাগানো হয়।',
    ],
    clinicalDetailsEn: [
      'Tourniquet released; needle smoothly withdrawn under gentle sterile cotton pressure.',
      'Firm dry pressure applied for 3-5 minutes until natural hemostasis is complete.',
    ],
    safetyHighlightBn: 'জীবাণুমুক্ত গজ প্রেসার ও ওয়াটারপ্রুফ ব্যান্ডেজে কোনো ইনফেকশনের সুযোগ থাকে না।',
    safetyHighlightEn: 'Sterile cotton hemostasis and medical seal eliminate any risk of infection.',
    donorFeelingBn: 'সুই বের করার অনুভূতি টেরই পাওয়া যায় না, সম্পূর্ণ স্বস্তিদায়ক।',
    donorFeelingEn: 'Barely noticeable withdrawal; clean and sterile comfort.',
    badgeBn: 'সুরক্ষিত ব্যান্ডেজ',
    badgeEn: 'Sterile Dressing',
    durationBn: '২ মিনিট',
    durationEn: '2 Mins',
    bagFillPercent: 100,
    volumeMl: 450,
    statusTagBn: 'নিরাপদ প্রত্যাহার',
    statusTagEn: 'Hemostasis Complete',
    isAgitating: false,
  },
  {
    id: 7,
    stepNumberBn: '০৭',
    stepNumberEn: '07',
    titleBn: 'তরল রিহাইড্রেশন ও ডিজিটাল সার্টিফিকেট',
    titleEn: 'Hydration Refreshment & Life Saver Certificate',
    shortDescBn:
      'ফ্রুট জুস ও স্ন্যাকস পান করে তরল পূর্ণ করা এবং ডোনারকে ডিজিটাল সম্মাননা সনদ প্রদান।',
    shortDescEn:
      'Fluid replenishment with electrolytes and fruit juice, followed by digital Life Saver Certificate.',
    clinicalDetailsBn: [
      'ডোনার লাউঞ্জে ১৫ মিনিট বিশ্রাম নিয়ে ফ্রুট জুস ও খাবার স্যালাইন গ্রহণ করা হয়।',
      'শরীরের তরল আয়তন (প্লাজমা) ২৪-৪৮ ঘণ্টার মধ্যে সম্পূর্ণ প্রাকৃতিক নিয়মে স্বাভাবিক অবস্থায় ফিরে আসে।',
    ],
    clinicalDetailsEn: [
      'Relaxation in donor lounge for 15 mins with juice and refreshments to restore volume.',
      'Plasma fluid volume naturally regenerates within 24 to 48 hours.',
    ],
    safetyHighlightBn: '২৪-৪৮ ঘণ্টার মধ্যে রক্তের তরল অংশ পুনরায় তৈরি হয় যা স্বাস্থ্যের জন্য উপকারী।',
    safetyHighlightEn: 'Stimulates bone marrow hematopoiesis, renewing fresh blood cells naturally.',
    donorFeelingBn: 'একটি ব্যাগ রক্ত দিয়ে ৩টি তাজা প্রাণ বাঁচানোর অপরিসীম আত্মতৃপ্তি ও আনন্দ।',
    donorFeelingEn: 'Deep pride and joy of saving up to 3 lives with a single heroic donation.',
    badgeBn: 'পূর্ণ পুনরুদ্ধার',
    badgeEn: 'Complete Recovery',
    durationBn: '১৫ মিনিট',
    durationEn: '15 Mins',
    bagFillPercent: 100,
    volumeMl: 450,
    statusTagBn: '৩টি জীবন রক্ষা পেল',
    statusTagEn: 'Saved Up to 3 Lives',
    isAgitating: false,
  },
];

export function BloodDonationProcessInteractive() {
  const { language } = useLanguageStore();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const currentStep = STEPS[activeStepIndex];

  // Pin detection and scroll progress tracker
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!trackRef.current) {
            ticking = false;
            return;
          }
          const rect = trackRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const scrolled = -rect.top;
            const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));
            setScrollProgress(progress);

            // Divide scroll distance evenly among the 7 steps
            const stepIndex = Math.min(
              STEPS.length - 1,
              Math.max(0, Math.floor(progress * STEPS.length))
            );
            setActiveStepIndex(stepIndex);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    /* Outer Scroll Runway: Generous height (380vh) so user naturally scrolls through the 7 steps */
    <div ref={trackRef} className="relative h-[380vh] w-full">
      {/* Sticky Viewport Container: Pinned to the screen, fits within a single viewport */}
      <div className="sticky top-0 h-screen max-h-screen w-full flex flex-col justify-between py-4 sm:py-6 px-4 sm:px-8 lg:px-12 bg-zinc-950 border border-zinc-800/90 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] overflow-hidden ring-1 ring-white/10 select-none">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-red-700/10 blur-[130px] pointer-events-none" />

        {/* ======================================================== */}
        {/* 1. TOP HEADER: Clean, Focused, with Active Step Pill */}
        {/* ======================================================== */}
        <div className="w-full flex items-center justify-between gap-4 pb-3 border-b border-zinc-800/80 relative z-10 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-500/30">
              <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>
                {language === 'bn'
                  ? 'রক্তদান প্রক্রিয়া • স্ক্রোল গাইড'
                  : 'Phlebotomy Protocol • Scroll Driven'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? (
                <>
                  কীভাবে রক্ত নেওয়া হয়?{' '}
                  <span className="bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent">
                    ধাপে ধাপে নিরাপদ পদ্ধতি
                  </span>
                </>
              ) : (
                <>
                  How Is Blood Collected?{' '}
                  <span className="bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent">
                    Safe Step-by-Step Experience
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Current Step Counter Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-right">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                {language === 'bn' ? 'বর্তমান পর্যায়' : 'Current Stage'}
              </span>
              <span className="text-sm font-black text-rose-400">
                {language === 'bn'
                  ? `ধাপ ${currentStep.stepNumberBn} / ০৭`
                  : `Step ${currentStep.stepNumberEn} / 07`}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN 2-COLUMN VIEWPORT: Fits completely inside screen */}
        {/* ======================================================== */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center py-1 sm:py-2 relative z-10 overflow-hidden">
          {/* LEFT COLUMN: Animated Blood Bag with Drop of Life branding */}
          <div className="lg:col-span-5 hidden min-[480px]:flex flex-col items-center justify-center h-auto lg:h-full relative shrink-0">
            <RealisticBloodBag
              fillPercent={currentStep.bagFillPercent}
              volumeMl={currentStep.volumeMl}
              isRocking={currentStep.isAgitating}
              statusText={language === 'bn' ? currentStep.statusTagBn : currentStep.statusTagEn}
              language={language}
              className="scale-[0.60] sm:scale-[0.78] lg:scale-[0.86] xl:scale-95 origin-center transition-transform duration-500 -my-6 sm:my-0"
            />
          </div>

          {/* RIGHT COLUMN: Active Step Clinical Details Card */}
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4 max-w-xl mx-auto lg:mx-0 w-full overflow-y-auto max-h-full chat-custom-scrollbar py-1"
          >
            {/* Step Header Pill & Duration */}
            <div className="flex items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-xs shadow-md shadow-rose-950/60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                <span>
                  {language === 'bn'
                    ? `ধাপ ${currentStep.stepNumberBn}: ${currentStep.badgeBn}`
                    : `Step ${currentStep.stepNumberEn}: ${currentStep.badgeEn}`}
                </span>
              </span>

              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  {language === 'bn' ? currentStep.durationBn : currentStep.durationEn}
                </span>
              </div>
            </div>

            {/* Step Title */}
            <h3
              key={`title-${currentStep.id}`}
              className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-normal leading-snug animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {language === 'bn' ? currentStep.titleBn : currentStep.titleEn}
            </h3>

            {/* Short Narrative */}
            <p
              key={`desc-${currentStep.id}`}
              className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {language === 'bn' ? currentStep.shortDescBn : currentStep.shortDescEn}
            </p>

            {/* Clinical Procedure Points */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 shadow-inner">
              <h4 className="text-[11px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {language === 'bn' ? 'চিকিৎসা পদ্ধতি:' : 'Clinical Method:'}
                </span>
              </h4>

              <ul className="space-y-1.5">
                {(language === 'bn'
                  ? currentStep.clinicalDetailsBn
                  : currentStep.clinicalDetailsEn
                ).map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety & Sensation Cards in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'bn' ? 'নিরাপত্তা প্রটোকল' : 'Safety Standard'}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-tight">
                  {language === 'bn'
                    ? currentStep.safetyHighlightBn
                    : currentStep.safetyHighlightEn}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-400 uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? 'শারীরিক অনুভূতি' : 'Donor Feeling'}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-tight">
                  {language === 'bn'
                    ? currentStep.donorFeelingBn
                    : currentStep.donorFeelingEn}
                </p>
              </div>
            </div>

            {/* Step 7 Recognition Badge */}
            {currentStep.id === 7 && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-200">
                  {language === 'bn'
                    ? 'আপনার ১ ব্যাগ রক্ত ৩ জন মুমূর্ষু রোগীর প্রাণ রক্ষা করে।'
                    : '1 single unit fractions to save up to 3 patient lives.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
