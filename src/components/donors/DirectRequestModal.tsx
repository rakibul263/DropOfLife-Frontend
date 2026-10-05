'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BloodGroupBadge } from '@/components/shared/BloodGroupBadge';
import { api } from '@/lib/api';
import { CheckCircle2, AlertTriangle, Clock, UserCheck } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';

interface DirectRequestModalProps {
  donor: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DirectRequestModal({
  donor,
  isOpen,
  onClose,
}: DirectRequestModalProps) {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterPhone, setRequesterPhone] = useState(user?.phone || '+8801521711716');
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [contactNumber, setContactNumber] = useState('+8801521711716');
  const [unitsNeeded, setUnitsNeeded] = useState('1');
  const [reason, setReason] = useState(
    language === 'bn' ? 'জরুরি রক্তের ট্রান্সফিউশন প্রয়োজন।' : 'Urgent transfusion required.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 24-hour cool-down calculation
  const getCooldownStatus = () => {
    if (!donor) return { isCoolingDown: false, remainingHours: 0, remainingMinutes: 0 };
    const donorId = donor._id || donor.id;
    let lastReqTime = donor.lastRequestedAt ? new Date(donor.lastRequestedAt).getTime() : 0;

    try {
      const stored = JSON.parse(localStorage.getItem('dropoflife_requested_donors') || '{}');
      if (stored[donorId] && Number(stored[donorId]) > lastReqTime) {
        lastReqTime = Number(stored[donorId]);
      }
    } catch (e) {}

    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - lastReqTime;

    if (lastReqTime > 0 && elapsed < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - elapsed;
      const totalMinutes = Math.max(1, Math.ceil(remainingMs / (1000 * 60)));
      const remainingHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      return { isCoolingDown: true, remainingHours, remainingMinutes };
    }

    return { isCoolingDown: false, remainingHours: 0, remainingMinutes: 0 };
  };

  const cooldown = getCooldownStatus();

  if (!donor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown.isCoolingDown) {
      setErrorMessage(
        language === 'bn'
          ? `এই রক্তদাতাকে ইতিমধ্যে অনুরোধ পাঠানো হয়েছে। পরবর্তী অনুরোধ পাঠানোর আগে আরও ${cooldown.remainingHours} ঘণ্টা ${cooldown.remainingMinutes} মিনিট অপেক্ষা করুন।`
          : `This donor has already received a request recently. Please wait ${cooldown.remainingHours}h ${cooldown.remainingMinutes}m.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const donorId = donor._id || donor.id;
      const finalReqName = requesterName.trim() || user?.name || patientName;
      const finalReqPhone = requesterPhone.trim() || user?.phone || contactNumber;

      await api.post('/requests', {
        requesterName: finalReqName,
        requesterPhone: finalReqPhone,
        patientName,
        bloodGroup: donor.bloodGroup || 'O+',
        unitsNeeded: Number(unitsNeeded),
        hospitalName,
        hospitalAddress: hospitalName,
        contactNumber,
        reason,
        urgencyLevel: 'Critical',
        targetDonorId: donorId,
        targetDonorEmail: donor.email,
        targetDonorPhone: donor.phone,
      });

      // Track cool-down in localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('dropoflife_requested_donors') || '{}');
        stored[donorId] = Date.now();
        if (donor.email) stored[donor.email] = Date.now();
        if (donor.id) stored[donor.id] = Date.now();
        if (donor._id) stored[donor._id] = Date.now();
        localStorage.setItem('dropoflife_requested_donors', JSON.stringify(stored));
        window.dispatchEvent(new CustomEvent('dropoflife_donor_requested', { detail: { donorId, donorEmail: donor.email } }));
      } catch (e) {}

      // Add in-app confirmation notification for sender
      addNotification({
        title: language === 'bn' ? '🩸 সরাসরি রক্তের অনুরোধ সফল!' : 'Direct Blood Request Sent',
        body: language === 'bn'
          ? `${donor.name}-এর কাছে ${patientName}-এর জন্য রক্তের জরুরি আবেদন এবং ইমেইল অ্যালার্ট পাঠানো হয়েছে।`
          : `Emergency request for ${patientName} has been dispatched to ${donor.name} along with instant email notification.`,
        type: 'success',
      });

      setIsSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (language === 'bn'
          ? 'অনুরোধ পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
          : 'Failed to send request. Please try again.');
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  const modalTitle = isSuccess
    ? (language === 'bn' ? 'সরাসরি রক্তের অনুরোধ পাঠানো হয়েছে' : 'Direct Blood Request Sent')
    : (language === 'bn' ? 'রক্তদাতার কাছে সরাসরি অনুরোধ' : 'Request Blood Directly');

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={modalTitle}
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {language === 'bn' ? 'জরুরি অনুরোধ প্রেরিত হয়েছে!' : 'Emergency Request Dispatched!'}
            </h3>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto">
              {language === 'bn' ? (
                <>
                  আমরা <strong>{donor.name}</strong> ({donor.bloodGroup}) কে অবহিত করেছি এবং জরুরি এসএমএস পাঠিয়েছি। ২৪ ঘণ্টার মধ্যে পুনরায় পাঠানো যাবে না।
                </>
              ) : (
                <>
                  We notified <strong>{donor.name}</strong> ({donor.bloodGroup}) and dispatched an urgent alert. 24-hour cool-down now active.
                </>
              )}
            </p>
          </div>
          <div className="pt-4">
            <Button onClick={handleModalClose} className="bg-rose-600 hover:bg-rose-500 text-white w-full">
              {language === 'bn' ? 'সম্পন্ন' : 'Done'}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Active Cooldown Banner */}
          {cooldown.isCoolingDown && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {language === 'bn'
                    ? '২৪ ঘণ্টার কুলডাউন সক্রিয়'
                    : '24-Hour Cool-down Active'}
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                {language === 'bn'
                  ? `এই রক্তদাতাকে সম্প্রতি অনুরোধ পাঠানো হয়েছে। সিস্টেমের ২৪ ঘণ্টার সীমাবদ্ধতার কারণে আরও ${
                      cooldown.remainingHours > 0 ? `${cooldown.remainingHours} ঘণ্টা ` : ''
                    }${cooldown.remainingMinutes} মিনিট পর পুনরায় অনুরোধ পাঠানো যাবে।`
                  : `This donor has already received a request recently. Under the 24-hour limit, please wait another ${cooldown.remainingHours}h ${cooldown.remainingMinutes}m before requesting again.`}
              </p>
            </div>
          )}

          {/* Backend Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {donor.bloodGroup && <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />}
              <div>
                <p className="text-xs text-zinc-400 font-medium">
                  {language === 'bn' ? 'নির্বাচিত রক্তদাতা' : 'Selected Donor'}
                </p>
                <p className="text-sm font-bold text-white">{donor.name}</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              {donor.district || 'Dhaka'}
            </span>
          </div>

          {/* 1. Requester / Attendant Details */}
          <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/60 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আবেদনকারী / স্বজনের বিবরণ' : 'Requester / Attendant Information'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300">
                  {language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                </label>
                <Input
                  disabled={cooldown.isCoolingDown}
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: আহসান হাবিব' : 'e.g. Ahsan Habib'}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300">
                  {language === 'bn' ? 'আপনার ফোন নম্বর' : 'Your Contact Phone'}
                </label>
                <Input
                  disabled={cooldown.isCoolingDown}
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  placeholder="+8801..."
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'রোগীর পুরো নাম' : 'Patient Full Name'}
            </label>
            <Input
              required
              disabled={cooldown.isCoolingDown}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: ফারহানা বেগম' : 'e.g. Farhana Begum'}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {language === 'bn' ? 'হাসপাতাল / মেডিকেল' : 'Hospital / Medical Center'}
              </label>
              <Input
                required
                disabled={cooldown.isCoolingDown}
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: ঢাকা মেডিকেল' : 'e.g. Dhaka Medical College'}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {language === 'bn' ? 'পরিমাণ (ব্যাগ)' : 'Units (Bags)'}
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                disabled={cooldown.isCoolingDown}
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'যোগাযোগের মোবাইল নম্বর' : 'Attendant Contact Hotline'}
            </label>
            <Input
              required
              disabled={cooldown.isCoolingDown}
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+8801521711716"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'চিকিৎসার বিবরণ / রক্তের কারণ' : 'Medical Notes / Transfusion Reason'}
            </label>
            <Input
              disabled={cooldown.isCoolingDown}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: জরুরি অপারেশন, রক্তক্ষরণ' : 'e.g. Emergency surgery, blood loss'}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={handleModalClose} className="text-zinc-400">
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || cooldown.isCoolingDown}
              className={
                cooldown.isCoolingDown
                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 font-bold cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white font-bold'
              }
            >
              {isSubmitting
                ? (language === 'bn' ? 'অনুরোধ পাঠানো হচ্ছে...' : 'Sending Request...')
                : cooldown.isCoolingDown
                ? (language === 'bn'
                    ? `অনুরোধ সীমাবদ্ধ (${cooldown.remainingHours > 0 ? `${cooldown.remainingHours}ঘ ` : ''}${cooldown.remainingMinutes}মি বাকি)`
                    : `Cooling Down (${cooldown.remainingHours}h ${cooldown.remainingMinutes}m left)`)
                : (language === 'bn' ? 'জরুরি অনুরোধ পাঠান' : 'Send Urgent Request')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
