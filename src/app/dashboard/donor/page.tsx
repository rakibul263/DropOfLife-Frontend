'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useLanguageStore } from '@/stores/languageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { api } from '@/lib/api';
import { BloodRequest } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BloodGroupBadge } from '@/components/shared/BloodGroupBadge';
import { BANGLADESH_DIVISIONS } from '@/lib/constants';
import { toast } from '@/stores/toastStore';
import { VascularBloodBackground } from '@/components/shared/VascularBloodBackground';
import {
  Heart,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Edit3,
  Quote,
  Trash2,
  Save,
  AlertTriangle,
  Phone,
  User as UserIcon,
  Mail,
  ArrowLeft,
  LogOut,
  Droplet,
  BellRing,
  Clock,
  Building2,
  UserCheck,
  HeartHandshake,
  Check,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function DonorDashboardPage() {
  const router = useRouter();
  const { user, updateUser, logout, initAuth } = useAuthStore();
  const { language } = useLanguageStore();
  const { addNotification } = useNotificationStore();

  // Initialize auth from cache if needed
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'requests' | 'profile'>('requests');

  // Targeted direct blood requests states
  const [targetedRequests, setTargetedRequests] = useState<BloodRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // Form states for donor profile details
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [division, setDivision] = useState(user?.division || 'Dhaka');
  const [district, setDistrict] = useState(user?.district || 'Dhaka');
  const [upazila, setUpazila] = useState(user?.upazila || 'Mirpur');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [note, setNote] = useState(user?.note || '');
  const [totalDonations, setTotalDonations] = useState<number>(user?.totalDonations || 0);
  const [lastDonationDate, setLastDonationDate] = useState(
    user?.lastDonationDate
      ? new Date(user.lastDonationDate).toISOString().split('T')[0]
      : '2026-06-10'
  );
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Synchronize with active user in state
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setDivision(user.division || 'Dhaka');
      setDistrict(user.district || 'Dhaka');
      setUpazila(user.upazila || 'Mirpur');
      setGender(user.gender || 'Male');
      setNote(user.note || '');
      setTotalDonations(user.totalDonations ?? 0);
      if (user.lastDonationDate) {
        setLastDonationDate(new Date(user.lastDonationDate).toISOString().split('T')[0]);
      }
      setIsAvailable(user.isAvailable ?? true);
    }
  }, [user]);

  // Fetch all blood requests directly targeted to this donor
  const fetchTargetedRequests = async () => {
    const donorId = user?._id || user?.id || user?.email;
    if (!donorId) return;
    setIsLoadingRequests(true);
    try {
      const res = await api.get('/requests', {
        params: {
          targetDonorId: donorId,
          targetDonorEmail: user?.email,
          targetDonorPhone: user?.phone,
          forMe: 'true',
        },
      });
      const list: BloodRequest[] = res.data?.data?.requests || [];
      setTargetedRequests(list);

      // Check for unalerted requests and trigger notification
      try {
        const alerted: string[] = JSON.parse(
          sessionStorage.getItem('dropoflife_alerted_requests') || '[]'
        );
        let hasNew = false;
        for (const req of list) {
          if (!alerted.includes(req._id)) {
            addNotification({
              title:
                language === 'bn'
                  ? '🚨 নতুন রক্তের সরাসরি আবেদন!'
                  : '🚨 New Direct Blood Request!',
              body:
                language === 'bn'
                  ? `${req.requesterName || 'রোগীর স্বজন'} ${req.patientName}-এর জন্য ${req.bloodGroup} রক্ত চেয়ে আপনার প্রোফাইলে আবেদন জানিয়েছেন।`
                  : `${req.requesterName || 'Attendant'} requested ${req.bloodGroup} blood for ${req.patientName}.`,
              type: 'critical',
              requestId: req._id,
            });
            alerted.push(req._id);
            hasNew = true;
          }
        }
        if (hasNew) {
          sessionStorage.setItem('dropoflife_alerted_requests', JSON.stringify(alerted));
        }
      } catch (e) {}
    } catch (err) {
      console.warn('Failed to load targeted requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchTargetedRequests();
    const interval = setInterval(fetchTargetedRequests, 5000);

    const onRequested = () => fetchTargetedRequests();
    window.addEventListener('dropoflife_donor_requested', onRequested);
    window.addEventListener('storage', onRequested);

    return () => {
      clearInterval(interval);
      window.removeEventListener('dropoflife_donor_requested', onRequested);
      window.removeEventListener('storage', onRequested);
    };
  }, [user?.id, user?._id, user?.email]);

  const bloodGroup = user?.bloodGroup || 'O+';

  // Handle Logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Handle Pledge / Respond to Request
  const handlePledge = async (requestId: string, action: 'pledge' | 'cancel') => {
    setRespondingId(requestId);
    try {
      await api.patch(`/requests/${requestId}/status`, {
        status: action === 'pledge' ? 'In Progress' : 'Pending',
        action,
        donorName: user?.name || name || 'লাইফসেভার রক্তদাতা',
      });

      toast.success(
        action === 'pledge'
          ? (language === 'bn'
              ? 'ধন্যবাদ! রক্তদানের জন্য আপনার সম্মতি গ্রহণ করা হয়েছে।'
              : 'Thank you! Your donation pledge has been confirmed.')
          : (language === 'bn'
              ? 'সম্মতি প্রত্যাহার করা হয়েছে।'
              : 'Donation pledge cancelled.'),
        language === 'bn' ? 'সফল হয়েছে' : 'Success'
      );

      fetchTargetedRequests();
    } catch (err: any) {
      toast.error(
        err.message ||
          (language === 'bn' ? 'স্ট্যাটাস আপডেট করা সম্ভব হয়নি।' : 'Failed to update status.')
      );
    } finally {
      setRespondingId(null);
    }
  };

  // Handle Save Donor Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning(
        language === 'bn' ? 'আপনার পুরো নাম লিখুন।' : 'Please enter your full name.',
        language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete Information'
      );
      return;
    }
    if (!phone.trim()) {
      toast.warning(
        language === 'bn' ? 'জরুরি যোগাযোগের ফোন নম্বর লিখুন।' : 'Please enter your phone number.',
        language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete Information'
      );
      return;
    }

    setIsSavingProfile(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        division,
        district: district.trim(),
        upazila: upazila.trim(),
        gender,
        note: note.trim(),
        lastDonationDate: lastDonationDate || null,
        totalDonations: Math.max(0, Number(totalDonations) || 0),
        isAvailable,
      };

      const res = await api.patch('/donors/profile', payload);
      const updatedUser = res.data?.data?.user || res.data?.data || payload;
      updateUser(updatedUser);

      toast.success(
        language === 'bn'
          ? 'রক্তদাতার বিবরণ সফলভাবে হালনাগাদ করা হয়েছে!'
          : 'Donor details updated successfully!',
        language === 'bn' ? 'প্রোফাইল সংরক্ষিত' : 'Profile Saved'
      );
    } catch (err: any) {
      toast.error(
        err.message ||
          (language === 'bn'
            ? 'প্রোফাইল আপডেট করা যায়নি।'
            : 'Failed to update donor profile.'),
        language === 'bn' ? 'ত্রুটি' : 'Error'
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleClearNote = () => {
    setNote('');
    toast.info(
      language === 'bn'
        ? 'নোট মুছে ফেলা হয়েছে। স্থায়ী করতে সংরক্ষণ করুন।'
        : 'Note cleared. Click Save to persist.',
      language === 'bn' ? 'নোট অপসারিত' : 'Note Cleared'
    );
  };

  return (
    <div className="min-h-screen w-full relative pb-20 bg-zinc-950 text-white">
      {/* Dynamic vascular background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40 select-none"
      >
        <VascularBloodBackground />
      </div>

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[550px] h-[550px] bg-rose-600/10 rounded-full blur-[140px] z-0" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[140px] z-0" />

      {/* Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Top Control Bar: Back to Home & Logout */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-lg">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Availability Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                isAvailable
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50'
                  : 'bg-amber-950/60 text-amber-400 border-amber-700/50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>
                {isAvailable
                  ? language === 'bn'
                    ? 'রক্তদানে সক্রিয়'
                    : 'Active Donor'
                  : language === 'bn'
                  ? 'বিশ্রামে আছেন'
                  : 'On Rest'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 text-xs font-bold border border-red-800/40 transition-all cursor-pointer"
              title={language === 'bn' ? 'লগআউট করুন' : 'Sign Out'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'bn' ? 'লগআউট' : 'Logout'}
              </span>
            </button>
          </div>
        </div>

        {/* Donor Identity Card (Header) */}
        <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-7 border border-rose-500/25 shadow-2xl backdrop-blur-2xl overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -bottom-8 w-44 h-44 bg-rose-500/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Avatar Initial Icon */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-600 to-red-700 border-2 border-rose-300/40 flex items-center justify-center font-black text-white text-2xl shadow-[0_0_25px_rgba(225,29,72,0.4)] shrink-0">
                {name ? name.trim()[0].toUpperCase() : 'D'}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {name || (language === 'bn' ? 'রক্তদাতা প্রোফাইল' : 'Donor Profile')}
                  </h1>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {language === 'bn' ? 'ভেরিফাইড ডোনার' : 'Verified Donor'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{user?.email || 'donor@dropoflife.org'}</span>
                </p>
              </div>
            </div>

            {/* Blood Group & Total Donations Pills */}
            <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  {language === 'bn' ? 'সর্বমোট রক্তদান' : 'Total Donations'}
                </span>
                <span className="text-base font-extrabold text-white">
                  {totalDonations} {language === 'bn' ? 'বার' : 'times'}
                </span>
              </div>
              <BloodGroupBadge group={bloodGroup} size="lg" />
            </div>
          </div>
        </div>

        {/* Urgent Direct Requests Alert Callout */}
        {targetedRequests.length > 0 && (
          <div className="relative rounded-2xl bg-gradient-to-r from-rose-950/90 via-red-950/90 to-rose-950/90 border border-rose-500/60 p-4 sm:p-5 shadow-[0_0_30px_rgba(225,29,72,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 border border-rose-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-950 animate-bounce">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {language === 'bn'
                      ? `🚨 আপনার কাছে ${targetedRequests.length}টি রক্তের জরুরি আবেদন এসেছে!`
                      : `🚨 You have ${targetedRequests.length} Direct Blood Request(s)!`}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    NEW
                  </span>
                </div>
                <p className="text-xs text-rose-200">
                  {language === 'bn'
                    ? 'সংকটাপন্ন রোগীর স্বজন আপনার সাহায্য চেয়েছেন। অনুরোধের বিবরণ দেখে রক্তদানে সম্মতি দিন।'
                    : 'A patient is waiting for your immediate transfusion. Review details below.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>{language === 'bn' ? 'অনুরোধগুলো দেখুন' : 'View Requests'}</span>
            </button>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>
              {language === 'bn'
                ? 'আমার কাছে আসা রক্তের অনুরোধসমূহ'
                : 'Direct Blood Requests'}
            </span>
            {targetedRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-white text-rose-700 shadow-sm animate-pulse">
                {targetedRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>
              {language === 'bn' ? 'প্রোফাইল বিবরণ ও সেটিংস' : 'Profile Settings'}
            </span>
          </button>
        </div>

        {/* TAB 1: DIRECT BLOOD REQUESTS LIST */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>
                    {language === 'bn'
                      ? 'সরাসরি প্রাপ্ত রক্তের জরুরি আবেদন'
                      : 'Emergency Blood Requests For You'}
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {language === 'bn'
                    ? 'রোগী ও তাদের স্বজনরা আপনার প্রোফাইল দেখে সরাসরি এই অনুরোধগুলো পাঠিয়েছেন।'
                    : 'These requests were sent directly to your profile by patients and their families.'}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchTargetedRequests}
                disabled={isLoadingRequests}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-rose-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRequests ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
              </button>
            </div>

            {isLoadingRequests && targetedRequests.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3">
                <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
                <p className="text-sm text-zinc-400 font-medium">
                  {language === 'bn' ? 'অনুরোধ তালিকা লোড হচ্ছে...' : 'Loading requests...'}
                </p>
              </div>
            ) : targetedRequests.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-white/10 space-y-4 backdrop-blur-xl">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <HeartHandshake className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-white">
                    {language === 'bn'
                      ? 'আপাতত কোনো সরাসরি রক্তের অনুরোধ নেই'
                      : 'No Direct Blood Requests Yet'}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {language === 'bn'
                      ? 'যখন কোনো রোগী বা তাদের স্বজন রক্তদাতা তালিকা থেকে আপনাকে নির্বাচন করবেন, তাদের অনুরোধ ও যোগাযোগের সকল তথ্য এখানে এবং আপনার ইমেইলে সরাসরি নোটিফিকেশন হিসেবে দেখতে পাবেন।'
                      : 'When someone selects you from the donor directory, their request, contact details, and hospital notes will appear here and in your email inbox.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {targetedRequests.map((req) => {
                  const isPledged =
                    req.status === 'In Progress' ||
                    (req.assignedDonors &&
                      req.assignedDonors.some(
                        (d) => d === (user?.name || name)
                      ));

                  return (
                    <Card
                      key={req._id || req.id}
                      className="p-5 sm:p-6 rounded-3xl bg-zinc-900/90 border border-rose-500/30 hover:border-rose-500/60 shadow-xl backdrop-blur-2xl transition-all space-y-4 relative overflow-hidden"
                    >
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            🚨 {req.urgencyLevel || 'Urgent'}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              isPledged
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {isPledged
                              ? language === 'bn'
                                ? '✅ রক্তদানের প্রতিশ্রুতি দেওয়া হয়েছে'
                                : 'Pledged / In Progress'
                              : language === 'bn'
                              ? '⏳ সিদ্ধান্তের অপেক্ষায় (Pending)'
                              : 'Pending Your Response'}
                          </span>
                        </div>

                        <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>
                            {new Date(req.createdAt).toLocaleDateString('bn-BD', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                        {/* 1. Requester / Attendant Details */}
                        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-blue-500/30 space-y-2 h-full flex flex-col justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                            <UserCheck className="w-4 h-4 text-blue-400" />
                            <span>
                              {language === 'bn'
                                ? 'আবেদনকারী / স্বজনের তথ্য'
                                : 'Requester Details'}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-zinc-300 flex-1">
                            <p>
                              <span className="text-zinc-500">নাম:</span>{' '}
                              <strong className="text-white font-bold">
                                {req.requesterName || 'রোগীর স্বজন'}
                              </strong>
                            </p>
                            <p className="flex items-center gap-1.5 pt-1">
                              <span className="text-zinc-500">মোবাইল:</span>{' '}
                              <a
                                href={`tel:${req.requesterPhone || req.contactNumber}`}
                                className="font-mono font-black text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{req.requesterPhone || req.contactNumber}</span>
                              </a>
                            </p>
                          </div>
                        </div>

                        {/* 2. Patient & Hospital Details */}
                        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-rose-500/30 space-y-2 h-full flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-extrabold text-rose-400 uppercase tracking-wider">
                              <Building2 className="w-4 h-4 text-rose-400" />
                              <span>
                                {language === 'bn'
                                  ? 'রোগীর চিকিৎসার বিবরণ'
                                  : 'Patient & Hospital'}
                              </span>
                            </div>
                            <BloodGroupBadge group={req.bloodGroup} size="sm" />
                          </div>

                          <div className="space-y-1 text-xs text-zinc-300">
                            <p>
                              <span className="text-zinc-500">রোগীর নাম:</span>{' '}
                              <strong className="text-white font-bold">{req.patientName}</strong>{' '}
                              ({req.unitsNeeded || 1} ব্যাগ)
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="font-semibold text-zinc-200">
                                {req.hospitalName}, {req.district}
                              </span>
                            </p>
                            {req.hospitalAddress && req.hospitalAddress !== req.hospitalName && (
                              <p className="text-[11px] text-zinc-400 pl-4">
                                {req.hospitalAddress}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Transfusion Reason Note */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-300 flex items-start gap-2">
                        <Quote className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <p className="italic leading-relaxed">
                          "{req.reason || 'জরুরি রক্তের ট্রান্সফিউশন প্রয়োজন।'}"
                        </p>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10">
                        {/* Direct Call to Attendant Hotline */}
                        <a
                          href={`tel:${req.contactNumber || req.requesterPhone}`}
                          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 transition-all shadow-md active:scale-95"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>
                            {language === 'bn'
                              ? `রোগীর স্বজনকে সরাসরি কল দিন (${req.contactNumber})`
                              : `Call Requester (${req.contactNumber})`}
                          </span>
                        </a>

                        {/* Pledge Decision Buttons */}
                        <div className="flex items-center gap-2">
                          {isPledged ? (
                            <button
                              type="button"
                              onClick={() => handlePledge(req._id || req.id!, 'cancel')}
                              disabled={respondingId === (req._id || req.id)}
                              className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all cursor-pointer"
                            >
                              <span>{language === 'bn' ? 'প্রতিশ্রুতি প্রত্যাহার' : 'Cancel Pledge'}</span>
                            </button>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => handlePledge(req._id || req.id!, 'pledge')}
                              isLoading={respondingId === (req._id || req.id)}
                              className="h-11 px-5 rounded-xl text-xs sm:text-sm font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60"
                            >
                              <Heart className="w-4 h-4 mr-1.5 fill-white" />
                              <span>
                                {language === 'bn'
                                  ? 'রক্তদানে সম্মতি দিন (Pledge)'
                                  : 'Pledge to Donate'}
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE DETAILS FORM */}
        {activeTab === 'profile' && (
          <Card className="border border-white/10 bg-zinc-900/95 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-2xl space-y-7">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {language === 'bn' ? 'রক্তদাতার বিবরণ হালনাগাদ' : 'Update Donor Details'}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {language === 'bn'
                    ? 'আপনার ব্যক্তিগত ও যোগাযোগের তথ্য আপডেট করুন। তথ্য নির্ভুল রাখা জরুরি।'
                    : 'Update your personal and contact details. Keeping accurate info helps save lives.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* 1. Blood Group Status (Security Protected / Read-Only) */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs sm:text-sm font-bold text-zinc-200">
                      {language === 'bn'
                        ? 'রক্তের গ্রুপ (নিরাপত্তাজনিত কারণে লকড)'
                        : 'Blood Group (Locked for Medical Safety)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-400/90 leading-relaxed">
                    {language === 'bn'
                      ? 'চিকিৎসাগত ও রোগীর নিরাপত্তার স্বার্থে রেজিস্ট্রেশনের পর রক্তের গ্রুপ পরিবর্তন করা যায় না।'
                      : 'For medical integrity and patient safety, blood group cannot be self-modified.'}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-black">
                    <Droplet className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    <span>{bloodGroup}</span>
                  </span>
                </div>
              </div>

              {/* 2. Personal Information: Full Name & Gender */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'পুরো নাম *' : 'Full Name *'}
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                      className="bg-zinc-950/90 border-white/10 text-white h-12 text-sm rounded-xl focus:border-rose-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'লিঙ্গ' : 'Gender'}
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-12 px-3.5 bg-zinc-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500 cursor-pointer"
                    >
                      <option value="Male">{language === 'bn' ? 'পুরুষ (Male)' : 'Male'}</option>
                      <option value="Female">{language === 'bn' ? 'নারী (Female)' : 'Female'}</option>
                      <option value="Other">{language === 'bn' ? 'অন্যান্য (Other)' : 'Other'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Emergency Contact & Location */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'জরুরি যোগাযোগ ও ঠিকানা' : 'Emergency Contact & Location'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'যোগাযোগের মোবাইল নম্বর *' : 'Contact Mobile Number *'}
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801..."
                      className="bg-zinc-950/90 border-white/10 text-white font-mono h-12 text-sm rounded-xl focus:border-rose-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'বিভাগ *' : 'Division *'}
                    </label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full h-12 px-3.5 bg-zinc-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500 cursor-pointer"
                    >
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'জেলা *' : 'District *'}
                    </label>
                    <Input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Dhaka"
                      className="bg-zinc-950/90 border-white/10 text-white h-12 text-sm rounded-xl focus:border-rose-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'উপজেলা / থানা / এলাকা' : 'Upazila / Area'}
                    </label>
                    <Input
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      placeholder="e.g. Mirpur-10"
                      className="bg-zinc-950/90 border-white/10 text-white h-12 text-sm rounded-xl focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Donation Record & Availability Status */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'রক্তদানের ইতিহাস ও প্রস্তুতি' : 'Donation History & Status'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'সর্বশেষ রক্তদানের তারিখ' : 'Last Donation Date'}
                    </label>
                    <Input
                      type="date"
                      value={lastDonationDate}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="bg-zinc-950/90 border-white/10 text-white h-12 text-sm rounded-xl focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'সর্বমোট রক্তদানের সংখ্যা' : 'Total Donations Count'}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={totalDonations}
                      onChange={(e) => setTotalDonations(Number(e.target.value))}
                      className="bg-zinc-950/90 border-white/10 text-white font-mono h-12 text-sm rounded-xl focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Ready / Available Toggle Card */}
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">
                      {language === 'bn'
                        ? 'জরুরি রক্তদানের জন্য প্রস্তুত ও সক্রিয় থাকুন'
                        : 'Available for Emergency Blood Donations'}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {language === 'bn'
                        ? 'সক্রিয় থাকলে রোগী ও তাদের স্বজনরা অনুসন্ধান তালিকায় আপনার প্রোফাইল খুঁজে পাবে'
                        : 'When active, requesters can discover your profile in the donor directory'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 bg-zinc-900 border-zinc-700 cursor-pointer shrink-0"
                  />
                </div>
              </div>

              {/* 5. Lifesaver Note / Bio */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-rose-400" />
                    <span>
                      {language === 'bn'
                        ? 'রক্তদাতার ব্যক্তিগত নোট / জরুরি বার্তা'
                        : 'Donor Lifesaver Note / Message'}
                    </span>
                  </label>
                  {note && (
                    <button
                      type="button"
                      onClick={handleClearNote}
                      className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'নোট মুছুন' : 'Clear Note'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'যেমন: যেকোনো জরুরি প্রয়োজনে নিঃসংকোচে কল দিন। ঢাকা মেডিকেল ও সোহরাওয়ার্দী হাসপাতালে দ্রুততম সময়ে পৌঁছাতে পারব।'
                      : 'e.g. Ready for emergency donations in Dhaka Medical area. Call anytime for critical patients.'
                  }
                  className="w-full p-3.5 rounded-2xl bg-zinc-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 placeholder:text-zinc-500 leading-relaxed"
                />
                <p className="text-[11px] text-zinc-400">
                  {language === 'bn'
                    ? 'এই বার্তাটি পাবলিক রক্তদাতা অনুসন্ধান তালিকায় আপনার নামের নিচে প্রদর্শিত হবে।'
                    : 'This message will appear under your donor card in the public directory.'}
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-white/10">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSavingProfile}
                  className="w-full bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm sm:text-base py-4 rounded-2xl shadow-xl shadow-rose-950/60 hover:shadow-rose-900/80 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>
                    {language === 'bn' ? 'বিবরণ সংরক্ষণ করুন' : 'Save & Update Details'}
                  </span>
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
