'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { BloodGroupBadge } from '@/components/shared/BloodGroupBadge';
import { User } from '@/types';
import { useLanguageStore } from '@/stores/languageStore';
import { toast } from '@/stores/toastStore';
import { api } from '@/lib/api';
import {
  Clock,
  Phone,
  MapPin,
  XCircle,
  CheckCircle,
  Inbox,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface RequestedDonorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestedDonors: User[];
  onDonorCancelled?: (donorId: string) => void;
}

export const RequestedDonorsModal: React.FC<RequestedDonorsModalProps> = ({
  isOpen,
  onClose,
  requestedDonors,
  onDonorCancelled,
}) => {
  const { language } = useLanguageStore();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const getCooldownDetails = (donor: User) => {
    let lastReqTime = donor.lastRequestedAt ? new Date(donor.lastRequestedAt).getTime() : 0;
    try {
      const stored = JSON.parse(localStorage.getItem('dropoflife_requested_donors') || '{}');
      const donorId = donor._id || donor.id;
      const localTime = stored[donorId] || (donor.email && stored[donor.email]) || 0;
      if (localTime && Number(localTime) > lastReqTime) {
        lastReqTime = Number(localTime);
      }
    } catch (e) {}

    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - lastReqTime;

    if (lastReqTime > 0 && elapsed < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - elapsed;
      const totalMinutes = Math.max(1, Math.ceil(remainingMs / (1000 * 60)));
      const remainingHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      return {
        remainingHours,
        remainingMinutes,
        textBn: `${remainingHours > 0 ? `${remainingHours} ঘণ্টা ` : ''}${remainingMinutes} মিনিট বাকি`,
        textEn: `${remainingHours > 0 ? `${remainingHours}h ` : ''}${remainingMinutes}m left`,
      };
    }

    return {
      remainingHours: 24,
      remainingMinutes: 0,
      textBn: '২৪ ঘণ্টার সীমাবদ্ধতা কার্যকর',
      textEn: '24h cooldown active',
    };
  };

  const handleCancelRequest = async (donor: User) => {
    const donorId = donor._id || donor.id;
    if (!donorId) return;

    setCancellingId(donorId);
    try {
      // 1. Backend API Call to cancel request and lift cooldown
      await api.post(`/donors/${donorId}/cancel-request`);

      // 2. Clear from localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('dropoflife_requested_donors') || '{}');
        delete stored[donorId];
        if (donor._id) delete stored[donor._id];
        if (donor.id) delete stored[donor.id];
        if (donor.email) delete stored[donor.email];
        localStorage.setItem('dropoflife_requested_donors', JSON.stringify(stored));
      } catch (e) {}

      // 3. Dispatch global sync events
      window.dispatchEvent(
        new CustomEvent('dropoflife_donor_requested', {
          detail: { donorId, cancelled: true },
        })
      );
      window.dispatchEvent(new Event('storage'));

      // 4. Callback to parent
      if (onDonorCancelled) {
        onDonorCancelled(donorId);
      }

      toast.success(
        language === 'bn'
          ? `${donor.name}-এর কাছে পাঠানো অনুরোধ বাতিল করা হয়েছে। রক্তদাতা পুনরায় মূল তালিকায় যুক্ত হয়েছেন।`
          : `Request to ${donor.name} cancelled. Donor is back in the active list.`,
        language === 'bn' ? 'অনুরোধ বাতিল সফল' : 'Request Cancelled'
      );
    } catch (err: any) {
      // Even if network drops, clear local state so user can proceed
      try {
        const stored = JSON.parse(localStorage.getItem('dropoflife_requested_donors') || '{}');
        delete stored[donorId];
        localStorage.setItem('dropoflife_requested_donors', JSON.stringify(stored));
        window.dispatchEvent(new CustomEvent('dropoflife_donor_requested', { detail: { donorId } }));
      } catch (e) {}

      if (onDonorCancelled) {
        onDonorCancelled(donorId);
      }

      toast.info(
        language === 'bn'
          ? `${donor.name}-এর অনুরোধ রিমুভ করা হয়েছে।`
          : `Removed ${donor.name} from requested list.`
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'bn' ? '📋 অনুরোধকৃত রক্তদাতাদের তালিকা (Requested Donors)' : '📋 Requested Donors List'}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Helper Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            {language === 'bn'
              ? 'নিচের রক্তদাতাদের সম্প্রতি রক্ত চেয়ে অনুরোধ পাঠানো হয়েছে। অপচয় ও অপ্রয়োজনীয় কল এড়াতে তাদের মূল তালিকা থেকে সাময়িকভাবে আলাদা রাখা হয়েছে। প্রয়োজনে এখান থেকে অনুরোধ বাতিল করতে পারেন।'
              : 'These donors have active direct blood requests. They are separated from the main directory during their 24h period. You can cancel requests here anytime.'}
          </p>
        </div>

        {/* Donors List */}
        {requestedDonors.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-500">
              <Inbox className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-zinc-300">
              {language === 'bn' ? 'আপাতত কোনো অনুরোধকৃত রক্তদাতা নেই' : 'No requested donors currently.'}
            </p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {language === 'bn'
                ? 'কাউকে রক্ত চেয়ে অনুরোধ পাঠালে তিনি এই তালিকায় জমা থাকবেন এবং মূল তালিকা থেকে আলাদা থাকবেন।'
                : 'Donors you send requests to will be organized here and hidden from the main search.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {requestedDonors.map((donor) => {
              const donorId = donor._id || donor.id;
              const cooldown = getCooldownDetails(donor);
              const isCancelling = cancellingId === donorId;

              return (
                <div
                  key={donorId}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-all space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Donor Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center font-black text-white text-base shadow-sm shrink-0">
                        {donor.name ? donor.name.trim()[0].toUpperCase() : 'D'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{donor.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {language === 'bn' ? 'অনুরোধ প্রেরিত' : 'Requested'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>
                              {donor.upazila ? `${donor.upazila}, ` : ''}
                              {donor.district || 'Dhaka'}
                            </span>
                          </span>
                          {donor.phone && (
                            <span className="flex items-center gap-1 font-mono text-zinc-300">
                              <Phone className="w-3 h-3 text-emerald-400" />
                              <span>{donor.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Blood Group Badge */}
                    <div className="shrink-0 self-start sm:self-auto">
                      <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                    </div>
                  </div>

                  {/* Cooldown & Action Row */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-zinc-800/80">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {language === 'bn' ? 'সীমাবদ্ধতা:' : 'Cooldown:'}{' '}
                        <strong className="text-amber-300 font-bold">
                          {language === 'bn' ? cooldown.textBn : cooldown.textEn}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {donor.phone && (
                        <a
                          href={`tel:${donor.phone}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{language === 'bn' ? 'কল দিন' : 'Call'}</span>
                        </a>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={isCancelling}
                        onClick={() => handleCancelRequest(donor)}
                        className="flex-1 sm:flex-initial text-xs font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 hover:border-rose-400 rounded-xl"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />
                        <span>{language === 'bn' ? 'অনুরোধ বাতিল করুন' : 'Cancel Request'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl text-xs">
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
