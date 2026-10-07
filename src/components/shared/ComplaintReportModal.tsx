'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldAlert, Bug, AlertTriangle, UserX, CheckCircle2, HelpCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/stores/toastStore';

interface ComplaintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'misbehavior' | 'website_issue';
  targetDonorId?: string;
  targetDonorName?: string;
}

export function ComplaintReportModal({
  isOpen,
  onClose,
  defaultType = 'website_issue',
  targetDonorId,
  targetDonorName,
}: ComplaintReportModalProps) {
  const [activeTab, setActiveTab] = useState<'misbehavior' | 'website_issue'>(
    targetDonorName ? 'misbehavior' : defaultType
  );

  useEffect(() => {
    if (targetDonorName) {
      setActiveTab('misbehavior');
    }
  }, [targetDonorName, isOpen]);

  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [category, setCategory] = useState(
    targetDonorName
      ? 'অনাকাঙ্ক্ষিত আচরণ বা দুর্ব্যবহার'
      : 'ওয়েবসাইটের পেজ বা ফিচারে সমস্যা'
  );
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reporterName.trim() || !description.trim()) {
      toast.warning('অনুগ্রহ করে আপনার নাম এবং ঘটনার বিস্তারিত বিবরণ লিখুন।', 'তথ্য অসম্পূর্ণ');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/reports', {
        type: activeTab,
        reportedUserId: targetDonorId || undefined,
        reportedUserName: targetDonorName || undefined,
        reporterName: reporterName.trim(),
        reporterContact: reporterContact.trim(),
        category,
        description: description.trim(),
      });

      toast.success(
        'আপনার রিপোর্টটি সফলভাবে গ্রহণ করা হয়েছে। অ্যাডমিন টিম দ্রুত পর্যালোচনা করে ব্যবস্থা গ্রহণ করবে।',
        'রিপোর্ট গৃহীত হয়েছে'
      );

      setDescription('');
      setReporterName('');
      setReporterContact('');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'রিপোর্ট জমা দিতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-lenis-prevent="true"
        className="w-[calc(100vw-24px)] sm:max-w-lg max-h-[90vh] overflow-y-auto chat-custom-scrollbar bg-zinc-950/95 border border-white/20 p-5 sm:p-7 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(225,29,72,0.25)] backdrop-blur-3xl text-white"
      >
        <DialogHeader className="border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
              নিরাপত্তা ও সহায়তা কেন্দ্র • ড্রপ অফ লাইফ
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white">
            অভিযোগ বা সমস্যা জানান
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            রক্তদাতার খারাপ আচরণ, অনৈতিক অর্থ দাবি বা ওয়েবসাইটের যে কোনো কারিগরি ত্রুটি সরাসরি জানান
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-white/[0.04] rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('misbehavior');
              setCategory('অনাকাঙ্ক্ষিত আচরণ বা দুর্ব্যবহার');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'misbehavior'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>আচরণ সংক্রান্ত অভিযোগ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('website_issue');
              setCategory('ওয়েবসাইটের পেজ বা ফিচারে সমস্যা');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'website_issue'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>সাইটের সমস্যা / বাগ</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {activeTab === 'misbehavior' ? (
            <div className="space-y-3">
              {targetDonorName ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs flex items-center justify-between text-rose-300">
                  <span>অভিযোগ প্রাপ্ত রক্তদাতা:</span>
                  <strong className="text-white font-black">{targetDonorName}</strong>
                </div>
              ) : null}

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">অভিযোগের ধরন *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-900 border border-white/15 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rose-400 cursor-pointer"
                >
                  <option value="অনাকাঙ্ক্ষিত আচরণ বা দুর্ব্যবহার">
                    অনাকাঙ্ক্ষিত আচরণ বা দুর্ব্যবহার (Rude / Abusive Behavior)
                  </option>
                  <option value="রক্তের বিনিময়ে অর্থ বা অনৈতিক দাবি">
                    রক্তের বিনিময়ে অর্থ বা অনৈতিক দাবি (Demanded Money)
                  </option>
                  <option value="জরুরি প্রতিশ্রুতি দিয়ে ফোন বন্ধ বা অনুপস্থিত">
                    জরুরি প্রতিশ্রুতি দিয়ে ফোন বন্ধ বা অনুপস্থিত (No-show / Unreachable)
                  </option>
                  <option value="ভুল রক্তের গ্রুপ বা মিথ্যা তথ্য প্রদান">
                    ভুল রক্তের গ্রুপ বা মিথ্যা তথ্য প্রদান (Fake Info)
                  </option>
                  <option value="অন্যান্য অভিযোগ">অন্যান্য সমস্যা (Other)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">সমস্যার ধরন *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-900 border border-white/15 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="ওয়েবসাইটের পেজ বা ফিচারে সমস্যা">
                  পেজ লোডিং বা আটকে যাওয়ার সমস্যা (Page Loading Issue)
                </option>
                <option value="লোকেশন বা জেলা ফিল্টারিং সমস্যা">
                  লোকেশন বা রক্তদাতা ফিল্টারিং সমস্যা (Filter Issue)
                </option>
                <option value="লগইন বা গুগল সাইন-ইন সমস্যা">
                  লগইন বা একাউন্ট সংক্রান্ত সমস্যা (Login / OAuth Issue)
                </option>
                <option value="নতুন কোনো ফিচারের প্রস্তাবনা">
                  নতুন পরামর্শ বা প্রস্তাবনা (Feature Suggestion)
                </option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">আপনার নাম *</label>
              <Input
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="যেমনঃ মোঃ করিম"
                className="bg-zinc-900 border-white/15 text-white h-10 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">মোবাইল নম্বর (যোগাযোগের জন্য)</label>
              <Input
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="+880 1..."
                className="bg-zinc-900 border-white/15 text-white h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300">বিস্তারিত বিবরণ *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="কি ঘটেছিল বা কোন পেজে কি সমস্যা দেখতে পাচ্ছেন তা পরিষ্কারভাবে লিখুন... *"
              className="w-full p-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-11 font-extrabold text-xs shadow-lg rounded-xl cursor-pointer ${
              activeTab === 'misbehavior'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/60 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/60 text-white'
            }`}
          >
            {isSubmitting ? 'রিপোর্ট পাঠানো হচ্ছে...' : 'অ্যাডমিন টিমের কাছে রিপোর্ট জমা দিন'}
          </Button>

          <p className="text-[10px] text-zinc-500 text-center">
            প্রয়োজনে অ্যাডমিন টিম সরাসরি অভিযুক্ত ব্যবহারকারীকে প্ল্যাটফর্ম থেকে <strong>স্থগিত (Suspend)</strong> করতে পারে।
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
