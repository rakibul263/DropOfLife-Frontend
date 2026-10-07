'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card } from '../ui/Card';
import { BloodGroupBadge } from '../shared/BloodGroupBadge';
import { Button } from '../ui/Button';
import {
  MapPin,
  Phone,
  Award,
  ShieldCheck,
  Calendar,
  Clock,
  Heart,
  Star,
  MessageSquareHeart,
  Flag,
  Quote,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { formatBilingualNumber } from '@/lib/translations';
import { DonorReviewModal } from '../donors/DonorReviewModal';
import { ComplaintReportModal } from '../shared/ComplaintReportModal';

interface DonorCardProps {
  donor: User;
  onRequestBlood?: (donor: User) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  onRequestBlood,
}) => {
  const { language } = useLanguageStore();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // 1. Calculate Medical Eligibility based on 3-month (90 days) rule
  const calculateMedicalStatus = () => {
    if (!donor.lastDonationDate) {
      return {
        isEligible: true,
        days: null,
        months: null,
        displayTextBn: 'পূর্বে রক্তদানের তথ্য নেই (সরাসরি প্রস্তুত)',
        displayTextEn: 'No prior donation record (Ready)',
        badgeTextBn: 'রক্তদানে প্রস্তুত',
        badgeTextEn: 'Ready to Donate',
        type: 'ready' as const,
      };
    }

    const lastDate = new Date(donor.lastDonationDate).getTime();
    const now = Date.now();
    const diffDays = Math.max(0, Math.floor((now - lastDate) / (1000 * 60 * 60 * 24)));
    const months = Math.floor(diffDays / 30);
    const extraDays = diffDays % 30;

    if (diffDays >= 90) {
      // 3 months or more passed -> Eligible!
      return {
        isEligible: true,
        days: diffDays,
        months,
        displayTextBn: `${months > 0 ? `${months} মাস ` : ''}${extraDays > 0 ? `${extraDays} দিন ` : ''}আগে রক্ত দিয়েছেন`,
        displayTextEn: `${months > 0 ? `${months}m ` : ''}${extraDays > 0 ? `${extraDays}d ` : ''}ago`,
        badgeTextBn: 'উপযুক্ত (৩+ মাস অতিক্রান্ত)',
        badgeTextEn: 'Eligible (3+ Months)',
        type: 'eligible' as const,
      };
    } else {
      // Within 3 months -> Resting / In recovery
      const daysRemaining = 90 - diffDays;
      return {
        isEligible: false,
        days: diffDays,
        months,
        displayTextBn: `${diffDays} দিন আগে দিয়েছেন (${daysRemaining} দিন বাকি)`,
        displayTextEn: `${diffDays}d ago (${daysRemaining}d left)`,
        badgeTextBn: `বিশ্রামে আছেন (${daysRemaining} দিন বাকি)`,
        badgeTextEn: `Resting (${daysRemaining}d left)`,
        type: 'resting' as const,
      };
    }
  };

  const medStatus = calculateMedicalStatus();

  // 2. Combined Availability: User's manual toggle + Medical eligibility
  const isDonorActive = donor.isAvailable && medStatus.isEligible;

  // 2.1 Direct Request 24-Hour Cool-down Tracking
  const [localCooldown, setLocalCooldown] = useState<number | null>(null);

  useEffect(() => {
    const checkCooldown = () => {
      try {
        const donorId = donor._id || donor.id;
        const stored = JSON.parse(localStorage.getItem('dropoflife_requested_donors') || '{}');
        if (stored[donorId]) {
          setLocalCooldown(Number(stored[donorId]));
        }
      } catch (e) {}
    };

    checkCooldown();
    window.addEventListener('dropoflife_donor_requested', checkCooldown);
    return () => window.removeEventListener('dropoflife_donor_requested', checkCooldown);
  }, [donor]);

  const getRequestCooldown = () => {
    const donorId = donor._id || donor.id;
    let lastReqTime = donor.lastRequestedAt ? new Date(donor.lastRequestedAt).getTime() : 0;
    if (localCooldown && localCooldown > lastReqTime) {
      lastReqTime = localCooldown;
    }

    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - lastReqTime;

    if (lastReqTime > 0 && elapsed < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - elapsed;
      const totalMinutes = Math.max(1, Math.ceil(remainingMs / (1000 * 60)));
      const remainingHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      return {
        isCoolingDown: true,
        remainingHours,
        remainingMinutes,
      };
    }
    return { isCoolingDown: false, remainingHours: 0, remainingMinutes: 0 };
  };

  const reqCooldown = getRequestCooldown();

  // 3. Lifesaver Tier based on Total Donations
  const totalDonations = donor.totalDonations || 0;
  const getDonationTier = () => {
    if (totalDonations >= 10) {
      return {
        labelBn: '🏆 গোল্ডেন লাইফসেভার (১০+ বার)',
        labelEn: '🏆 Golden Lifesaver (10+)',
        color: 'from-amber-500/20 via-yellow-500/20 to-amber-600/20 text-amber-300 border-amber-500/40',
      };
    }
    if (totalDonations >= 5) {
      return {
        labelBn: '🥇 সিনিয়র রক্তদাতা (৫+ বার)',
        labelEn: '🥇 Senior Lifesaver (5+)',
        color: 'from-rose-500/20 via-red-500/20 to-rose-600/20 text-rose-300 border-rose-500/40',
      };
    }
    if (totalDonations >= 2) {
      return {
        labelBn: '⭐ নিয়মিত রক্তদাতা',
        labelEn: '⭐ Regular Donor',
        color: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30',
      };
    }
    return {
      labelBn: '🌱 নতুন লাইফসেভার',
      labelEn: '🌱 First-time Lifesaver',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    };
  };

  const tier = getDonationTier();

  return (
    <>
      <Card
        variant="default"
        hoverEffect
        className="p-5 sm:p-6 h-full flex flex-col justify-between space-y-4 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.85),0_0_20px_rgba(225,29,72,0.1)] border-white/15 bg-gradient-to-b from-white/[0.07] via-zinc-950/70 to-zinc-950/90 backdrop-blur-2xl rounded-3xl transition-all duration-300 relative overflow-hidden group"
      >
        {/* Ambient Top Light Line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="space-y-3.5 flex-1 flex flex-col">
          {/* Top Row: Lifesaver Tier Badge & Blood Group Badge */}
          <div className="flex items-center justify-between gap-2 h-7 shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-wide uppercase border bg-gradient-to-r ${tier.color} shadow-sm backdrop-blur-md`}
            >
              {language === 'bn' ? tier.labelBn : tier.labelEn}
            </span>

            <BloodGroupBadge group={donor.bloodGroup || 'O+'} size="md" />
          </div>

          {/* Donor Name & Location */}
          <div className="space-y-1 pt-1 min-h-[52px] shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg sm:text-xl text-white tracking-tight line-clamp-1 group-hover:text-rose-300 transition-colors">
                {donor.name}
              </h3>
              {donor.isVerified && (
                <span title="ভেরিফাইড লাইফসেভার রক্তদাতা">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </span>
              )}
            </div>

            {/* Detailed Location: Upazila, District, Division */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold text-zinc-200 line-clamp-1">
                {donor.upazila ? `${donor.upazila}, ` : ''}
                {donor.district || 'ঢাকা'}, {donor.division || 'ঢাকা'}
              </span>
            </div>
          </div>

          {/* Donor Personal Note / Lifesaver Statement (Fixed Uniform Height) */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 relative text-xs leading-relaxed text-zinc-300 backdrop-blur-md min-h-[60px] flex items-center shrink-0">
            <Quote className="w-3.5 h-3.5 text-rose-400 absolute top-2.5 right-2.5 opacity-40 shrink-0" />
            <p className="line-clamp-2 pr-4 italic">
              "{donor.note || (language === 'bn' ? 'জরুরি প্রয়োজনে নিকটবর্তী যে কোনো রক্তগ্রহীতাকে সহায়তা করতে প্রস্তুত।' : 'Available for urgent emergency transfusion in nearby hospitals.')}"
            </p>
          </div>

          {/* Metrics & Medical Eligibility Pill */}
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-2 text-xs flex-1 flex flex-col justify-between">
            {/* Total Donations & Rating */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>
                  সর্বমোট রক্তদান:{' '}
                  <strong className="text-white font-black">
                    {formatBilingualNumber(totalDonations, language)}
                  </strong>{' '}
                  বার
                </span>
              </div>

              {/* Clickable Rating Badge */}
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[11px] hover:bg-amber-500/25 transition-colors cursor-pointer"
                title="রিভিউ এবং রোগীর মতামত দেখতে ক্লিক করুন"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{donor.rating || 5.0}</span>
                <span className="text-[10px] text-amber-400/80">({donor.reviewCount || 1})</span>
              </button>
            </div>

            {/* Calculated Last Donation & 3-Month Rule Indicator */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>সর্বশেষ রক্তদান:</span>
                </span>
                <span className="font-mono text-zinc-200 font-semibold text-right text-[11px]">
                  {medStatus.displayTextBn}
                </span>
              </div>

              {/* Status Badge: Active vs Resting vs Paused by Donor */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-400">মেডিকেল স্ট্যাটাস:</span>
                {!donor.isAvailable ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-zinc-800 text-zinc-400 border border-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    <span>আপাতত স্থগিত (Paused)</span>
                  </span>
                ) : isDonorActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>রক্তদানে সক্রিয় ও উপযুক্ত</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{medStatus.badgeTextBn}</span>
                  </span>
                )}
              </div>

              {/* Direct Request Status Badge (Uniform 4th row) */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10 min-h-[26px]">
                {reqCooldown.isCoolingDown ? (
                  <>
                    <span className="text-[11px] text-amber-400/90 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{language === 'bn' ? 'অনুরোধের অবস্থা:' : 'Request Status:'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                      <span>
                        {language === 'bn'
                          ? `২৪ ঘণ্টার সীমাবদ্ধতা (${reqCooldown.remainingHours > 0 ? `${reqCooldown.remainingHours}ঘ ` : ''}${reqCooldown.remainingMinutes}মি বাকি)`
                          : `24h Cooldown (${reqCooldown.remainingHours}h ${reqCooldown.remainingMinutes}m left)`}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{language === 'bn' ? 'অনুরোধের সুযোগ:' : 'Requests:'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
                      {language === 'bn' ? 'সরাসরি অনুরোধ উন্মুক্ত' : 'Available for Request'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Strictly pinned to bottom) */}
        <div className="space-y-2 pt-3 border-t border-white/10 mt-auto shrink-0">
          <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2">
            {donor.phone ? (
              <a
                href={`tel:${donor.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 transition-all shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'সরাসরি কল করুন' : 'Direct Call'}</span>
              </a>
            ) : (
              <div className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl text-xs font-semibold bg-zinc-900/60 border border-zinc-800 text-zinc-500 cursor-not-allowed">
                <Phone className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>{language === 'bn' ? 'নম্বর গোপনীয়' : 'Private'}</span>
              </div>
            )}

            {reqCooldown.isCoolingDown ? (
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="flex-1 h-11 text-xs font-bold bg-zinc-800/90 border border-amber-500/40 text-amber-300/90 cursor-not-allowed opacity-90 rounded-xl"
                title={
                  language === 'bn'
                    ? `এই রক্তদাতাকে সম্প্রতি অনুরোধ পাঠানো হয়েছে। পরবর্তী অনুরোধ পাঠানোর আগে আরও ${reqCooldown.remainingHours} ঘণ্টা ${reqCooldown.remainingMinutes} মিনিট অপেক্ষা করতে হবে।`
                    : `This donor has already received a blood request. Please wait ${reqCooldown.remainingHours}h ${reqCooldown.remainingMinutes}m.`
                }
              >
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">
                  {language === 'bn'
                    ? `অনুরোধ প্রেরিত (${reqCooldown.remainingHours > 0 ? `${reqCooldown.remainingHours}ঘ ` : ''}${reqCooldown.remainingMinutes}মি)`
                    : `Requested (${reqCooldown.remainingHours}h ${reqCooldown.remainingMinutes}m)`}
                </span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="flex-1 h-11 text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-950/60 rounded-xl"
                onClick={() => onRequestBlood && onRequestBlood(donor)}
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{language === 'bn' ? 'রক্ত চেয়ে রিকোয়েস্ট' : 'Request Blood'}</span>
              </Button>
            )}
          </div>

          {/* Secondary Utility Row: Reviews & Misbehavior Report */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 pt-1 h-5">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <MessageSquareHeart className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? `রিভিউ ও মতামত (${donor.reviewCount || 1})` : `Reviews (${donor.reviewCount || 1})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsComplaintModalOpen(true)}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              title="রক্তদাতার অনাকাঙ্ক্ষিত আচরণ বা সমস্যা রিপোর্ট করুন"
            >
              <Flag className="w-3 h-3 text-rose-500" />
              <span>{language === 'bn' ? 'অভিযোগ জানান' : 'Report'}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Review & Rating Modal */}
      <DonorReviewModal
        donor={donor}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Misbehavior Report Modal */}
      <ComplaintReportModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        defaultType="misbehavior"
        targetDonorId={donor._id || donor.id}
        targetDonorName={donor.name}
      />
    </>
  );
};
