'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Heart, AlertTriangle, FileText, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguageStore } from '@/stores/languageStore';

export function TermsModal() {
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    try {
      const accepted = localStorage.getItem('dropoflife_terms_accepted');
      if (!accepted) {
        // Show modal after slight delay for smooth entrance
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('dropoflife_terms_accepted', 'true');
    } catch (e) {
      // Ignore
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
    >
      {/* Dark Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={handleAccept}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl shadow-black ring-1 ring-white/10 overflow-hidden my-auto">
        {/* Top Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-400" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                    {language === 'bn' ? 'জরুরি নির্দেশিকা' : 'Official Guidelines'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {language === 'bn'
                    ? 'স্বেচ্ছায় রক্তদান নীতি ও ব্যবহারের শর্তাবলি'
                    : 'Voluntary Blood Donation Policy & Terms'}
                </h3>
              </div>
            </div>

            <button
              onClick={handleAccept}
              className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            {language === 'bn'
              ? 'ড্রপ অব লাইফ প্ল্যাটফর্মে আপনাকে স্বাগতম। রোগীদের জীবন রক্ষা ও রক্তদাতাদের সার্বিক সুরক্ষার স্বার্থে নিচের মূল চিকিৎসা নীতিমালা ও ব্যবহারের শর্তাবলি মেনে চলা বাধ্যতামূলক:'
              : 'Welcome to Drop of Life. To safeguard voluntary donors and emergency patients, please review and agree to our clinical code of conduct:'}
          </p>

          {/* Scrollable Terms Content */}
          <div
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) {
                setHasScrolledToBottom(true);
              }
            }}
            className="max-h-60 sm:max-h-72 overflow-y-auto space-y-3.5 pr-2 rounded-2xl bg-zinc-950/70 p-4 sm:p-5 border border-zinc-800 text-xs sm:text-sm text-zinc-300"
          >
            {language === 'bn' ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    ১
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">
                      ১০০% অ-বাণিজ্যিক ও সম্পূর্ণ বিনামূল্যে রক্তদান
                    </h5>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                      রক্ত কেনাবেচা আইনত দণ্ডনীয় অপরাধ। এই প্ল্যাটফর্মে কোনো প্রকার আর্থিক লেনদেন সম্পূর্ণ নিষিদ্ধ। রক্তদান শুধুই মানবতার খাতিরে নিঃস্বার্থ জীবনদান।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    ২
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">
                      সঠিক স্বাস্থ্য তথ্য ও ডোনার নিরাপত্তা
                    </h5>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                      নিবন্ধন ও রক্তদানের সময় সঠিক বয়স (১৮-৬৫ বছর), ওজন (ন্যূনতম ৪৫/৫০ কেজি) এবং স্বাস্থ্য ইতিহাস প্রদান করতে হবে। অসুস্থ অবস্থায় বা অ্যান্টিবায়োটিক সেবনরত অবস্থায় রক্তদান করা যাবে না।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    ৩
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">
                      জরুরি পরিস্থিতিতে হাসপাতাল ও রোগী যোগাযোগ সম্মতি
                    </h5>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                      রক্তদাতা হিসেবে যুক্ত হলে জরুরি সংকটে ভেরিফায়েড হাসপাতাল ও রক্তের আবেদনকারী সরাসরি আপনার সাথে ফোন বা এসএমএসে যোগাযোগের অনুমতি পাবে।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    ৪
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">
                      স্বাস্থ্য অধিদপ্তর (DGHS) ও বিশ্ব স্বাস্থ্য সংস্থা প্রোটোকল
                    </h5>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                      সকল ট্রান্সফিউশন স্বীকৃত ব্লাড ব্যাংকে ক্রস-ম্যাচিং ও স্ক্রিনিং (এইচআইভি, হেপাটাইটিস, সিফিলিস) সম্পন্ন করে পরিচালনা করতে হবে।
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">
                      100% Voluntary & Non-Commercial
                    </h5>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                      Selling blood is strictly illegal. Drop of Life is purely humanitarian. No financial transactions are permitted under any circumstances.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">
                      Accurate Health Declarations
                    </h5>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                      Donors must fulfill clinical eligibility: Age 18-65, weight 50kg+, minimum 90-120 days since last whole blood donation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">
                      Emergency Contact Authorization
                    </h5>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                      By registering, you consent to verified healthcare providers and critical patients contacting you strictly for matched emergencies.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'bn'
                  ? 'শর্তাবলি সম্পূর্ণ পড়ে সম্মতি নিশ্চিত করুন'
                  : 'By entering, you accept these healthcare terms'}
              </span>
            </div>

            <Button
              size="lg"
              onClick={handleAccept}
              className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black px-7 py-3 rounded-2xl shadow-xl shadow-rose-950/60 cursor-pointer"
            >
              <Check className="w-5 h-5 mr-2" />
              <span>
                {language === 'bn' ? 'আমি সম্মত ও শুরু করুন' : 'I Agree & Proceed'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
