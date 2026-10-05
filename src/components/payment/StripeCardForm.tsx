'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreditCard, Lock, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { supportTranslations, formatBilingualNumber } from '@/lib/translations';

interface StripeCardFormProps {
  donorName: string;
  onDonorNameChange: (val: string) => void;
  donorEmail: string;
  onDonorEmailChange: (val: string) => void;
  cardNumber: string;
  onCardNumberChange: (val: string) => void;
  expiry: string;
  onExpiryChange: (val: string) => void;
  cvc: string;
  onCvcChange: (val: string) => void;
  finalAmount: number;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function StripeCardForm({
  donorName,
  onDonorNameChange,
  donorEmail,
  onDonorEmailChange,
  cardNumber,
  onCardNumberChange,
  expiry,
  onExpiryChange,
  cvc,
  onCvcChange,
  finalAmount,
  isLoading,
  onSubmit,
}: StripeCardFormProps) {
  const { language } = useLanguageStore();
  const t = supportTranslations[language];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Donor Personal Information */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          {language === 'bn' ? '৩. সাহায্যকারীর তথ্যাবলী' : '3. Supporter Details'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-300 font-medium">{t.formName}</label>
            <Input
              required
              value={donorName}
              onChange={(e) => onDonorNameChange(e.target.value)}
              placeholder={language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Your full name'}
              className="bg-zinc-900/80 border-zinc-700/80 hover:border-zinc-500 focus:border-rose-500 text-white h-11 backdrop-blur-md transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-300 font-medium">{t.formEmail}</label>
            <Input
              required
              type="email"
              value={donorEmail}
              onChange={(e) => onDonorEmailChange(e.target.value)}
              placeholder={language === 'bn' ? 'আপনার ইমেইল' : 'your.email@example.com'}
              className="bg-zinc-900/80 border-zinc-700/80 hover:border-zinc-500 focus:border-rose-500 text-white h-11 backdrop-blur-md transition-all"
            />
          </div>
        </div>
      </div>

      {/* Payment Elements (Sandbox Test Card) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            {language === 'bn' ? '৪. পেমেন্ট কার্ড (নিরাপদ স্যান্ডবক্স)' : '4. Payment Card (Secure Sandbox)'}
          </label>
          <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 backdrop-blur-sm">
            {language === 'bn' ? 'নিরাপদ টেস্ট মোড সক্রিয়' : 'Sandbox Test Mode Active'}
          </span>
        </div>

        {/* Liquid Glass Test Card Box */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.09] via-zinc-900/70 to-zinc-950/90 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] space-y-4 overflow-hidden ring-1 ring-white/10">
          {/* Liquid glass light sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

          <div className="relative z-10 space-y-1">
            <label className="text-xs text-zinc-300 font-medium">{t.formCard}</label>
            <div className="relative">
              <Input
                required
                value={cardNumber}
                onChange={(e) => onCardNumberChange(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="bg-zinc-900/90 border-white/15 text-white font-mono pl-10 h-11 backdrop-blur-md focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">{t.formExpiry}</label>
              <Input
                required
                value={expiry}
                onChange={(e) => onExpiryChange(e.target.value)}
                placeholder="12/28"
                className="bg-zinc-900/90 border-white/15 text-white font-mono h-11 backdrop-blur-md focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">{t.formCvc}</label>
              <Input
                required
                value={cvc}
                onChange={(e) => onCvcChange(e.target.value)}
                placeholder="123"
                className="bg-zinc-900/90 border-white/15 text-white font-mono h-11 backdrop-blur-md focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || finalAmount <= 0}
        className="relative w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:via-red-400 hover:to-rose-500 text-white font-black h-14 text-base sm:text-lg shadow-[0_12px_40px_rgba(225,29,72,0.55),0_0_25px_rgba(244,63,94,0.35)] hover:shadow-[0_16px_50px_rgba(225,29,72,0.7),0_0_35px_rgba(244,63,94,0.5)] border border-white/30 ring-2 ring-rose-400/50 rounded-2xl transition-all duration-300 hover:scale-[1.015] active:scale-[0.98] cursor-pointer overflow-hidden group"
      >
        {/* Shimmer light reflection effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

        {isLoading ? (
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>{language === 'bn' ? 'অনুদানের পেমেন্ট প্রক্রিয়াধীন...' : 'Authorizing Secure Payment...'}</span>
          </span>
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            <Heart className="w-5 h-5 fill-white text-white animate-pulse shrink-0 drop-shadow-md" />
            <span className="tracking-wide">
              {language === 'bn'
                ? `৳${formatBilingualNumber(finalAmount, 'bn')} টাকা অনুদান সম্পন্ন করুন`
                : `Complete Contribution of ৳${formatBilingualNumber(finalAmount, 'en')} BDT`}
            </span>
          </span>
        )}
      </Button>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 pt-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {language === 'bn' ? 'পিসিআই-ডিএসএস অনুমোদিত' : 'PCI-DSS Level 1 Compliant'}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-zinc-400" />
          {language === 'bn' ? '২৫৬-বিট এসএসএল সুরক্ষিত' : '256-Bit SSL Encrypted'}
        </span>
      </div>
    </form>
  );
}
