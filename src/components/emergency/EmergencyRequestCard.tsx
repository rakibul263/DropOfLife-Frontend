'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BloodRequest } from '@/types';
import { BloodGroupBadge } from '@/components/shared/BloodGroupBadge';
import { UrgencyBadge } from '@/components/shared/UrgencyBadge';
import { formatTimeAgo, formatDate } from '@/lib/utils';
import {
  MapPin,
  Phone,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  XCircle,
  Droplet,
  AlertTriangle,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { emergencyTranslations, formatBilingualNumber } from '@/lib/translations';
import { useNotificationStore } from '@/stores/notificationStore';
import { usePledgeStore } from '@/stores/pledgeStore';
import { useAuthStore } from '@/stores/authStore';

interface EmergencyRequestCardProps {
  request: BloodRequest;
  onRespond?: (req: BloodRequest) => Promise<any> | void;
  onCancelPledge?: (req: BloodRequest) => Promise<any> | void;
  isResponding?: boolean;
}

export function EmergencyRequestCard({
  request,
  onRespond,
  onCancelPledge,
  isResponding = false,
}: EmergencyRequestCardProps) {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { isPledged, addPledge, removePledge } = usePledgeStore();
  const t = emergencyTranslations[language];

  const isFulfilled = request.status === 'Fulfilled';
  const isInProgress = request.status === 'In Progress';
  const isPending = request.status === 'Pending';

  // Persistent & reactive pledge state
  const hasPledged = isPledged(request._id, user, request.assignedDonors);
  const [pledgePending, setPledgePending] = useState(false);

  const urgencyConfig = {
    Critical: { border: 'border-rose-500/50', bg: 'from-rose-950/40 to-zinc-900', glow: 'shadow-rose-950/30' },
    Urgent: { border: 'border-amber-500/50', bg: 'from-amber-950/30 to-zinc-900', glow: 'shadow-amber-950/20' },
    Standard: { border: 'border-blue-500/40', bg: 'from-blue-950/20 to-zinc-900', glow: 'shadow-blue-950/20' },
    Routine: { border: 'border-zinc-600/50', bg: 'from-zinc-900 to-zinc-900', glow: '' },
  };
  const cfg = urgencyConfig[request.urgencyLevel] ?? urgencyConfig.Routine;

  const handlePledge = useCallback(async () => {
    if (!isAuthenticated || !user) {
      addNotification({
        title: language === 'bn' ? '⚠️ লগইন প্রয়োজন' : '⚠️ Login Required',
        body:
          language === 'bn'
            ? 'রক্তদানের অঙ্গীকার করতে অনুগ্রহ করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।'
            : 'Please log in to your account first to pledge for blood donation.',
        type: 'cancel',
        requestId: request._id,
      });
      router.push('/login?redirect=/emergency-requests');
      return;
    }

    setPledgePending(true);
    addPledge(request._id);
    try {
      if (onRespond) {
        await onRespond(request);
      }
      addNotification({
        title:
          language === 'bn'
            ? '🩸 রক্তদানের অঙ্গীকার নিশ্চিত!'
            : '🩸 Donation Pledge Confirmed!',
        body:
          language === 'bn'
            ? `আপনি ${request.patientName}-এর জন্য (${request.hospitalName}) রক্তদানের অঙ্গীকার করেছেন। ধন্যবাদ!`
            : `You have pledged to donate for ${request.patientName} at ${request.hospitalName}. Thank you!`,
        type: 'pledge',
        requestId: request._id,
      });
    } catch (err) {
      console.warn('Pledge network sync notice:', err);
    } finally {
      setPledgePending(false);
    }
  }, [request, onRespond, addNotification, addPledge, language]);

  const handleCancelPledge = useCallback(async () => {
    setPledgePending(true);
    removePledge(request._id);
    try {
      if (onCancelPledge) {
        await onCancelPledge(request);
      }
      addNotification({
        title:
          language === 'bn'
            ? '⚠️ অঙ্গীকার প্রত্যাহার করা হয়েছে'
            : '⚠️ Pledge Cancelled',
        body:
          language === 'bn'
            ? `${request.patientName}-এর আবেদন থেকে আপনার রক্তদানের অঙ্গীকার প্রত্যাহার করা হয়েছে।`
            : `Your donation pledge for ${request.patientName} has been cancelled.`,
        type: 'cancel',
        requestId: request._id,
      });
    } catch (err) {
      console.warn('Cancel pledge sync notice:', err);
    } finally {
      setPledgePending(false);
    }
  }, [request, onCancelPledge, addNotification, removePledge, language]);

  const statusColors = {
    Fulfilled: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'In Progress': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    Pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Cancelled: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30',
  };

  const statusText = {
    Fulfilled: t.fulfilled,
    'In Progress': t.inProgress,
    Pending: t.pending,
    Cancelled: 'Cancelled',
  };

  return (
    <div
      className={`group relative flex flex-col justify-between h-full rounded-2xl border bg-gradient-to-br shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cfg.border} ${cfg.bg} ${cfg.glow}`}
    >
      {/* Glassmorphism inner sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-2xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Critical pulsing border accent */}
      {request.urgencyLevel === 'Critical' && !isFulfilled && (
        <div className="absolute inset-0 rounded-2xl ring-1 ring-rose-500/30 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10 p-5 flex flex-col gap-4 flex-1">
        {/* ── TOP ROW: Blood Group + Urgency + Status ── */}
        <div className="flex items-start justify-between gap-2 min-h-[44px] shrink-0">
          <div className="flex items-center gap-3">
            <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
            <div>
              <p className="text-sm font-black text-white leading-tight">
                {formatBilingualNumber(request.unitsNeeded, language)}{' '}
                <span className="font-normal text-zinc-400">{t.unitsNeeded}</span>
              </p>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {t.posted} {formatTimeAgo(request.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <UrgencyBadge level={request.urgencyLevel} />
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${statusColors[request.status] ?? statusColors.Pending}`}>
              {statusText[request.status] ?? request.status}
            </span>
          </div>
        </div>

        {/* ── PATIENT & HOSPITAL ── */}
        <div className="space-y-2.5 pt-3 border-t border-white/10 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {t.patientName}
            </p>
            <h3 className="text-base font-black text-white mt-0.5 truncate">{request.patientName}</h3>
          </div>

          <div className="flex items-start gap-2 text-xs text-zinc-300 min-h-[38px] shrink-0">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate">{request.hospitalName}</p>
              <p className="text-zinc-400 text-[11px] truncate">{request.hospitalAddress || request.district}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{t.requiredBy} <strong className="text-white">{formatDate(request.requiredDate)}</strong></span>
          </div>

          {/* Reason Section (Uniform Fixed Height Box) */}
          <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 min-h-[48px] flex items-center shrink-0">
            <p className="text-[11px] text-zinc-300 leading-relaxed border-l-2 border-rose-600/60 pl-2.5 line-clamp-2 italic w-full">
              "{request.reason || (language === 'bn' ? 'জরুরি রক্তের আবেদন (নিকটবর্তী রক্তদাতাদের সহায়তা কাম্য)' : 'Emergency blood transfusion required')}"
            </p>
          </div>
        </div>

        {/* ── DONORS RESPONDING ROW ── */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 h-6 shrink-0 pt-1 border-t border-white/5">
          <HeartHandshake className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>
            <strong className="text-white font-extrabold">
              {formatBilingualNumber(request.matchedDonorsCount || 0, language)}
            </strong>{' '}
            {t.donorsResponding}
          </span>
          {hasPledged && (
            <span className="ml-auto flex items-center gap-1 text-emerald-400 text-[10px] font-black">
              <CheckCircle2 className="w-3 h-3" />
              {t.pledgedLabel}
            </span>
          )}
        </div>
      </div>

      {/* ── FOOTER: Action Buttons (Strictly pinned to bottom) ── */}
      <div className="relative z-10 px-4 sm:px-5 pb-4 sm:pb-5 pt-0 mt-auto shrink-0 flex flex-col min-[380px]:flex-row gap-2 sm:gap-2.5">
        {/* Call Button */}
        <a
          href={`tel:${request.contactNumber || '+8801521711716'}`}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-white text-xs font-bold transition-all shrink-0 whitespace-nowrap backdrop-blur-sm w-full min-[380px]:w-auto"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{t.callAttendant}</span>
        </a>

        {/* Pledge / Cancel / Fulfilled Button */}
        {isFulfilled ? (
          <div className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/40 text-zinc-400 text-xs font-bold cursor-not-allowed">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{t.fulfilled}</span>
          </div>
        ) : hasPledged ? (
          // Cancel pledge
          <button
            onClick={handleCancelPledge}
            disabled={pledgePending}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{pledgePending ? '...' : t.cancelPledgeBtn}</span>
          </button>
        ) : (
          // Pledge to donate
          <button
            onClick={handlePledge}
            disabled={isResponding || pledgePending}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold shadow-lg shadow-rose-950/60 hover:shadow-rose-900/60 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Droplet className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>{pledgePending ? '...' : t.pledgeBtn}</span>
          </button>
        )}
      </div>
    </div>
  );
}
