'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BLOOD_GROUPS, URGENCY_LEVELS, BANGLADESH_DIVISIONS } from '@/lib/constants';
import { useLanguageStore } from '@/stores/languageStore';

const requestSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const),
  unitsNeeded: z.coerce.number().min(1, 'At least 1 unit is required').max(10),
  urgencyLevel: z.enum(['Standard', 'Urgent', 'Critical'] as const),
  hospitalName: z.string().min(3, 'Hospital name is required'),
  hospitalAddress: z.string().min(3, 'Hospital address is required'),
  district: z.string().min(2, 'District is required'),
  division: z.string().min(2, 'Division is required'),
  contactNumber: z
    .string()
    .min(11, 'Valid Bangladeshi contact phone is required'),
  reason: z.string().min(5, 'Brief reason or clinical notes required'),
});

export type RequestFormValues = z.infer<typeof requestSchema>;

interface CreateEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RequestFormValues) => void;
  isSubmitting: boolean;
}

const DIVISION_NAMES_BN: Record<string, string> = {
  Dhaka: 'ঢাকা বিভাগ',
  Chattogram: 'চট্টগ্রাম বিভাগ',
  Rajshahi: 'রাজশাহী বিভাগ',
  Khulna: 'খুলনা বিভাগ',
  Barishal: 'বরিশাল বিভাগ',
  Sylhet: 'সিলেট বিভাগ',
  Rangpur: 'রংপুর বিভাগ',
  Mymensingh: 'ময়মনসিংহ বিভাগ',
};

const URGENCY_NAMES_BN: Record<string, string> = {
  Critical: 'সঙ্কটাপন্ন (Critical)',
  Urgent: 'জরুরি (Urgent)',
  Standard: 'স্বাভাবিক (Standard)',
};

export function CreateEmergencyModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateEmergencyModalProps) {
  const { language } = useLanguageStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema) as any,
    defaultValues: {
      patientName: '',
      bloodGroup: 'O+',
      unitsNeeded: 1,
      urgencyLevel: 'Urgent',
      hospitalName: '',
      hospitalAddress: '',
      district: 'Dhaka',
      division: 'Dhaka',
      contactNumber: '+8801521711716',
      reason: 'Urgent medical transfusion needed.',
    },
  });

  const handleFormSubmit = (data: RequestFormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'bn' ? 'জরুরি রক্তের আবেদন পোস্ট করুন' : 'Broadcast Emergency Blood Request'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'রোগীর পুরো নাম' : 'Patient Full Name'}
            </label>
            <Input
              {...register('patientName')}
              placeholder={language === 'bn' ? 'যেমন: কাজী ফারহানা' : 'e.g. Kazi Farhana'}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {errors.patientName && (
              <p className="text-xs text-rose-500">{errors.patientName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'প্রয়োজনীয় রক্তের গ্রুপ' : 'Blood Group Needed'}
            </label>
            <select
              {...register('bloodGroup')}
              className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-rose-500"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg} {language === 'bn' ? 'গ্রুপ' : 'Group'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'প্রয়োজনীয় রক্তের পরিমাণ (ব্যাগ)' : 'Units Needed (Bags)'}
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              {...register('unitsNeeded')}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {errors.unitsNeeded && (
              <p className="text-xs text-rose-500">{errors.unitsNeeded.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'জরুরি মাত্রা' : 'Urgency Level'}
            </label>
            <select
              {...register('urgencyLevel')}
              className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-rose-500"
            >
              {URGENCY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {language === 'bn' ? URGENCY_NAMES_BN[lvl] || lvl : lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'হাসপাতাল / ক্লিনিকের নাম' : 'Hospital / Clinic Name'}
            </label>
            <Input
              {...register('hospitalName')}
              placeholder={language === 'bn' ? 'যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল' : 'e.g. National Heart Foundation'}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {errors.hospitalName && (
              <p className="text-xs text-rose-500">{errors.hospitalName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'যোগাযোগের মোবাইল নম্বর' : 'Attendant Contact Hotline'}
            </label>
            <Input
              {...register('contactNumber')}
              placeholder="+8801521711716"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {errors.contactNumber && (
              <p className="text-xs text-rose-500">{errors.contactNumber.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'বিভাগ' : 'Division'}
            </label>
            <select
              {...register('division')}
              className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-rose-500"
            >
              {BANGLADESH_DIVISIONS.map((div) => (
                <option key={div} value={div}>
                  {language === 'bn' ? DIVISION_NAMES_BN[div] || div : `${div} Division`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              {language === 'bn' ? 'জেলা / এলাকা' : 'District / Upazila'}
            </label>
            <Input
              {...register('district')}
              placeholder={language === 'bn' ? 'যেমন: মিরপুর, ঢাকা' : 'e.g. Mirpur, Dhaka'}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">
            {language === 'bn' ? 'হাসপাতালের পূর্ণ ঠিকানা' : 'Hospital Address Details'}
          </label>
          <Input
            {...register('hospitalAddress')}
            placeholder={language === 'bn' ? 'যেমন: প্লট-৪, সেকশন-২, মিরপুর, ঢাকা' : 'e.g. Plot-4, Section-2, Mirpur, Dhaka'}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
          {errors.hospitalAddress && (
            <p className="text-xs text-rose-500">{errors.hospitalAddress.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">
            {language === 'bn' ? 'জরুরি কারণ / চিকিৎসার বিবরণ' : 'Medical Notes / Urgency Reason'}
          </label>
          <Input
            {...register('reason')}
            placeholder={language === 'bn' ? 'যেমন: আইসিইউ রোগীর ওপেন হার্ট সার্জারি' : 'e.g. ICU patient undergoing open-heart bypass surgery'}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
          {errors.reason && (
            <p className="text-xs text-rose-500">{errors.reason.message}</p>
          )}
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400">
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
          >
            {isSubmitting
              ? (language === 'bn' ? 'পোস্ট হচ্ছে...' : 'Broadcasting...')
              : (language === 'bn' ? 'আবেদন পোস্ট করুন' : 'Broadcast Emergency Post')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
