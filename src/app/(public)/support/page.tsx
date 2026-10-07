'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SupportPurposeSelector, SupportPurpose } from '@/components/payment/SupportPurposeSelector';
import { DonationAmountPicker } from '@/components/payment/DonationAmountPicker';
import {
  Heart,
  ArrowRight,
  Lock,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Truck,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import {
  supportTranslations,
  formatBilingualNumber,
  formatTaka,
} from '@/lib/translations';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export default function SupportPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = supportTranslations[language];

  const [selectedPurpose, setSelectedPurpose] =
    useState<SupportPurpose>('Cold_Chain_Courier');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Default name and email are empty as requested
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  const [validationError, setValidationError] = useState('');

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleProceedToStripe = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (finalAmount <= 0) {
      setValidationError(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক অনুদানের পরিমাণ নির্বাচন করুন।'
          : 'Please select a valid contribution amount.'
      );
      return;
    }

    if (!donorName.trim()) {
      setValidationError(
        language === 'bn'
          ? 'অনুগ্রহ করে সাহায্যকারীর নাম লিখুন।'
          : 'Please enter supporter full name.'
      );
      return;
    }

    if (!donorEmail.trim() || !donorEmail.includes('@')) {
      setValidationError(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।'
          : 'Please enter a valid email address.'
      );
      return;
    }

    // Redirect to dedicated Stripe Checkout page with query parameters
    const checkoutUrl = `/support/checkout?amount=${finalAmount}&purpose=${selectedPurpose}&name=${encodeURIComponent(
      donorName.trim()
    )}&email=${encodeURIComponent(donorEmail.trim())}`;

    router.push(checkoutUrl);
  };

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Background Liquid Atmosphere */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-[96%] sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] mx-auto px-2 sm:px-6 space-y-8 sm:space-y-10">
        {/* Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 backdrop-blur-md">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl min-[380px]:text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-zinc-300 text-xs sm:text-base leading-relaxed">
              {t.desc}
            </p>
          </div>
        </ScrollReveal>

        {/* Main Donation Setup Container */}
        <ScrollReveal animation="fade-up" delay={120} duration={750}>
          <Card
            variant="liquid"
            hoverEffect={false}
            className="p-5 sm:p-10 border border-white/20 bg-gradient-to-br from-white/[0.08] via-zinc-900/65 to-zinc-950/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(225,29,72,0.12)] space-y-8 backdrop-blur-3xl relative overflow-hidden ring-1 ring-white/10"
          >
          {/* Ambient liquid light glow */}
          <div className="pointer-events-none absolute -top-32 -right-32 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-72 h-72 bg-sky-600/15 rounded-full blur-3xl" />

          {/* Component 1: Purpose Selector */}
          <SupportPurposeSelector
            selectedPurpose={selectedPurpose}
            onSelectPurpose={setSelectedPurpose}
          />

          {/* Component 2: Amount Picker */}
          <DonationAmountPicker
            selectedAmount={selectedAmount}
            onSelectAmount={setSelectedAmount}
            customAmount={customAmount}
            onCustomAmountChange={setCustomAmount}
          />

          {/* Component 3: Supporter Information (NO CARD INPUTS HERE) */}
          <form onSubmit={handleProceedToStripe} className="space-y-6 pt-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  {language === 'bn' ? '৩. সাহায্যকারীর তথ্যাবলী' : '3. Supporter Details'}
                </label>
                <span className="text-[11px] text-zinc-400">
                  {language === 'bn' ? 'রসিদ ও স্বীকৃতির জন্য' : 'For receipt & recognition'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">
                    {t.formName} <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Your full name'}
                    className="bg-zinc-900/80 border-zinc-700/80 hover:border-zinc-500 focus:border-rose-500 text-white h-11 backdrop-blur-md transition-all placeholder:text-zinc-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">
                    {t.formEmail} <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার ইমেইল (রসিদের জন্য)' : 'your.email@example.com'}
                    className="bg-zinc-900/80 border-zinc-700/80 hover:border-zinc-500 focus:border-rose-500 text-white h-11 backdrop-blur-md transition-all placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>

            {/* Validation Error Prompt */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Donation Summary Bar before Stripe redirect */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="space-y-0.5">
                <span className="text-zinc-400 font-medium">
                  {language === 'bn' ? 'নির্বাচিত অনুদান:' : 'Selected Donation:'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-black text-rose-400">
                    {formatTaka(finalAmount, language)}
                  </span>
                  <span className="text-xs text-zinc-400">
                    • {selectedPurpose === 'Cold_Chain_Courier' ? t.courierTitle : t.subsidyTitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {language === 'bn' ? '১০০% স্বচ্ছ ও যাচাইকৃত' : '100% Transparent'}
                </span>
              </div>
            </div>

            {/* Big Prominent "Proceed to Stripe" CTA Button */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={finalAmount <= 0}
                className="relative w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:via-red-400 hover:to-rose-500 text-white font-black h-14 text-base sm:text-lg shadow-[0_12px_40px_rgba(225,29,72,0.6),0_0_25px_rgba(244,63,94,0.35)] hover:shadow-[0_16px_50px_rgba(225,29,72,0.75),0_0_35px_rgba(244,63,94,0.5)] border border-white/30 ring-2 ring-rose-400/50 rounded-2xl transition-all duration-300 hover:scale-[1.015] active:scale-[0.98] cursor-pointer overflow-hidden group flex items-center justify-center gap-3"
              >
                {/* Shimmer light reflection effect */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                <Lock className="w-5 h-5 fill-white text-white shrink-0 drop-shadow" />
                <span className="tracking-wide">
                  {language === 'bn'
                    ? `${t.proceedToCheckout}`
                    : `Proceed to Stripe Secure Checkout →`}
                </span>
                <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
              </Button>

              <p className="text-center text-xs text-zinc-400 leading-relaxed">
                {t.checkoutSubtitle}
              </p>
            </div>

            {/* Security & Trust Footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-rose-400" />
                <span>{language === 'bn' ? 'ভিসা, মাস্টারকার্ড, অ্যামেক্স' : 'Visa, Mastercard, Amex'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'পিসিআই-ডিএসএস অনুমোদিত' : 'PCI-DSS Level 1'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{language === 'bn' ? '২৫৬-বিট এনক্রিপশন' : '256-Bit SSL'}</span>
              </span>
            </div>
          </form>
        </Card>
      </ScrollReveal>

      {/* Impact Cards Section */}
      <ScrollReveal animation="fade-up" delay={200} duration={800}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl space-y-2 revealed-card-hover">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
              ৳৫০০
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'জরুরি ক্রস-ম্যাচিং টেস্ট' : 'Emergency Screening Test'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'bn'
                ? 'আইসিইউ রোগীদের জীবন বাঁচাতে নিরাপদ রক্ত পরীক্ষার সম্পূর্ণ খরচ বহন করে।'
                : 'Subsidizes critical HIV/Hepatitis/Cross-matching tests for indigent ICU patients.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl space-y-2 revealed-card-hover">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm">
              ৳১,০০০
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'কোল্ড-চেইন ইনসুলেটেড বক্স' : 'Cold-Chain Courier Box'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'bn'
                ? 'দূরবর্তী জেলায় ২°C-৬°C নিয়ন্ত্রিত তাপমাত্রায় প্লেটলেট নিরাপদে পৌঁছে দেয়।'
                : 'Provides temperature-regulated insulated transit boxes for inter-district delivery.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl space-y-2 revealed-card-hover">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              ৳৫,০০০
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'সম্পূর্ণ আইসিইউ ট্রান্সফিউশন' : 'Complete ICU Transfusion'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'bn'
                ? 'অসহায় রোগীর জরুরি একাধিক ব্যাগ রক্ত ও লজিস্টিকস সম্পূর্ণভাবে নিশ্চিত করে।'
                : 'Funds full life-saving component therapy and volunteer transit for crisis patients.'}
            </p>
          </div>
        </div>
      </ScrollReveal>
      </div>
    </div>
  );
}
