'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useLanguageStore } from '@/stores/languageStore';
import { BLOOD_GROUPS, BANGLADESH_DIVISIONS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { GoogleLoginTwoStepModal } from '@/components/auth/GoogleLoginTwoStepModal';
import {
  Droplet,
  Heart,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Sparkles,
  Calendar,
  Award,
  ShieldCheck,
  Quote,
} from 'lucide-react';
import { VascularBloodBackground } from '@/components/shared/VascularBloodBackground';
import { LiquidLifeLoader } from '@/components/shared/LiquidLifeLoader';
import { toast } from '@/stores/toastStore';

const registerSchema = z.object({
  role: z.enum(['donor', 'provider']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Valid phone number required'),
  bloodGroup: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  hasDonatedBefore: z.boolean(),
  totalDonations: z.coerce.number().optional(),
  lastDonationDate: z.string().optional(),
  division: z.string().min(1, 'Please select division'),
  district: z.string().min(1, 'Please enter district'),
  upazila: z.string().optional(),
  note: z.string().optional(),
  organizationName: z.string().optional(),
  licenseNumber: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterLoadingSkeleton() {
  return <LiquidLifeLoader fullscreen={true} />;
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const { language } = useLanguageStore();

  const { setAuth } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'donor' | 'provider'>('donor');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [googleUserForModal, setGoogleUserForModal] = useState<any>(null);
  const [googleModalStep, setGoogleModalStep] = useState<1 | 2>(1);

  // Check URL params for direct Step 2 fallback redirect
  React.useEffect(() => {
    const isStep2 = searchParams.get('google_step2') === 'true';
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const avatar = searchParams.get('avatar');
    const googleId = searchParams.get('googleId');

    if (isStep2 && email) {
      setGoogleUserForModal({
        name: name || 'Google Lifesaver',
        email,
        avatarUrl: avatar || '',
        googleId: googleId || undefined,
      });
      setGoogleModalStep(2);
      setIsGoogleModalOpen(true);
    }
  }, [searchParams]);

  // Direct Google OAuth message listener from popup window
  React.useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) return;

      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsGoogleSigningIn(false);
        if (event.data.status === 'AUTHENTICATED') {
          setIsGoogleModalOpen(false);
          setAuth(
            event.data.user,
            event.data.accessToken || event.data.token,
            event.data.refreshToken
          );
          toast.success(
            language === 'bn'
              ? `স্বাগতম, ${event.data.user?.name || 'লাইফসেভার'}! আপনার অ্যাকাউন্টে সফলভাবে প্রবেশ করা হয়েছে।`
              : `Welcome back, ${event.data.user?.name || 'Lifesaver'}! You are logged in.`,
            language === 'bn' ? 'লগইন সফল' : 'Login Successful'
          );
          const target = redirectPath || `/dashboard/${event.data.user.role || 'donor'}`;
          router.push(target);
        } else if (event.data.status === 'NEEDS_STEP_2') {
          setGoogleUserForModal(event.data.googleUser);
          setGoogleModalStep(2);
          setIsGoogleModalOpen(true);
        }
      } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
        setIsGoogleSigningIn(false);
        setErrorMessage(event.data.message || 'Google registration was cancelled.');
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [redirectPath, router, setAuth]);

  const handleDirectGoogleRegister = () => {
    setIsGoogleSigningIn(true);
    setErrorMessage('');

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popupUrl = `/api/auth/google?returnUrl=${encodeURIComponent(
      redirectPath || '/dashboard/donor'
    )}`;

    const popup = window.open(
      popupUrl,
      'DropOfLifeGoogleAuth',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setGoogleModalStep(1);
      setIsGoogleModalOpen(true);
      setIsGoogleSigningIn(false);
      return;
    }

    const checkClosedInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosedInterval);
        setIsGoogleSigningIn(false);
      }
    }, 1000);
  };


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'donor',
      name: '',
      email: '',
      password: '',
      phone: '',
      bloodGroup: 'O+',
      gender: 'Male',
      hasDonatedBefore: false,
      totalDonations: 0,
      lastDonationDate: '',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Mirpur',
      note: '',
    },
  });

  const hasDonatedBefore = watch('hasDonatedBefore');
  const selectedGender = watch('gender');
  const selectedBloodGroup = watch('bloodGroup') || 'O+';

  const handleRoleChange = (role: 'donor' | 'provider') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const handleBack = () => {
    if (redirectPath) {
      router.push(redirectPath);
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.post('/auth/register', data);
      const { user, token, accessToken, refreshToken } = response.data.data;
      setAuth(user, accessToken || token, refreshToken);

      toast.success(
        language === 'bn'
          ? 'স্বাগতম! আপনার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে।'
          : 'Registration successful! Welcome to DropOfLife.',
        language === 'bn' ? 'ড্রপ অব লাইফ' : 'DropOfLife'
      );

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push(`/dashboard/${user.role}`);
      }
    } catch (err: any) {
      const msg =
        err.message ||
        (language === 'bn'
          ? 'নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে তথ্য পুনরায় পরীক্ষা করুন।'
          : 'Registration failed. Please check details and try again.');
      setErrorMessage(msg);
      toast.error(msg, language === 'bn' ? 'নিবন্ধন ত্রুটি' : 'Registration Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden bg-transparent">
      {/* 60fps Micro-Vascular Animated Red Blood Cells (Erythrocytes) & Capillary Veins Canvas */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
        <VascularBloodBackground />
      </div>

      {/* Liquid Glass Ambient Background */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[550px] h-[550px] bg-rose-600/15 rounded-full blur-[140px] z-0" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] z-0" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] z-0" />

      {/* 1. Official Platform Brand Logo & Identity */}
      <div className="relative z-10 mb-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3.5 px-5 py-2.5 rounded-3xl bg-zinc-950/70 border border-white/15 hover:border-rose-500/50 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 group"
          title="DropOfLife - জীবনের এক ফোঁটা | Return to Home"
        >
          {/* Luminous Jewel Blood Droplet Logo */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white shadow-[0_0_25px_rgba(225,29,72,0.6)] border border-rose-300/40 shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />
            <Droplet className="w-5 h-5 fill-white text-white drop-shadow" />
          </div>

          <div className="flex flex-col text-left leading-none">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white whitespace-nowrap">
              <span>Drop</span>
              <span className="bg-gradient-to-r from-rose-500 to-red-400 bg-clip-text text-transparent">OfLife</span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.18em] text-zinc-400 uppercase whitespace-nowrap mt-1">
              {language === 'bn' ? 'জীবনের এক ফোঁটা · জরুরি রক্তদান' : 'One Drop · One Life • Blood Network'}
            </span>
          </div>
        </Link>
      </div>

      {/* Main Wide Liquid Glass Card Shell for Laptops & Desktops */}
      <div className="w-full max-w-4xl relative z-10 my-2">
        <div
          className="border border-white/20 bg-gradient-to-b from-white/[0.10] via-zinc-950/60 to-zinc-950/80 p-4 sm:p-8 lg:p-10 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.85),0_0_60px_rgba(225,29,72,0.18),inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_0_30px_rgba(255,255,255,0.02)] backdrop-blur-3xl rounded-3xl relative overflow-hidden ring-1 ring-white/15"
        >
          {/* Subtle top light sheen & liquid glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-white/10 via-rose-500/5 to-transparent rounded-full blur-3xl" />

          {/* Top Bar: Back Button & Context Badge */}
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-white/10">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-xl hover:bg-white/[0.08] border border-transparent hover:border-white/15 backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-rose-400" />
              <span>
                {language === 'bn' ? 'আগের পেজে ফিরুন' : 'Back to previous page'}
              </span>
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 backdrop-blur-xl shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{language === 'bn' ? 'নিবন্ধন পোর্টাল' : 'Registration Portal'}</span>
            </div>
          </div>

          {/* Header Title with Role Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>{language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account'}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                {language === 'bn'
                  ? 'জরুরি রক্তদান ও লাইফ-সেভিং নেটওয়ার্কে যুক্ত হয়ে মানুষের পাশে দাঁড়ান'
                  : 'Join the verified emergency life-saving network across Bangladesh'}
              </p>
            </div>

            {/* Role Switcher Pill */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-zinc-950/70 rounded-2xl border border-white/15 backdrop-blur-xl shrink-0">
              <button
                type="button"
                onClick={() => handleRoleChange('donor')}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedRole === 'donor'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>{language === 'bn' ? 'রক্তদাতা' : 'Donor'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('provider')}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedRole === 'provider'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'হাসপাতাল' : 'Hospital'}</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. MANUAL REGISTRATION FORM ON TOP */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                  {selectedRole === 'donor'
                    ? language === 'bn' ? 'আপনার পুরো নাম *' : 'Full Name *'
                    : language === 'bn' ? 'প্রতিনিধির নাম *' : 'Representative Name *'}
                </label>
                <div className="relative">
                  <Input
                    placeholder="e.g. Tanvir Ahmed"
                    error={errors.name?.message}
                    className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-11 transition-all"
                    {...register('name')}
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                  {language === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    error={errors.email?.message}
                    className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-11 transition-all"
                    {...register('email')}
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Password & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                  {language === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *' : 'Password (min 6 chars) *'}
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-11 transition-all"
                    {...register('password')}
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                  {language === 'bn' ? 'জরুরি যোগাযোগ ফোন *' : 'Emergency Contact Phone *'}
                </label>
                <div className="relative">
                  <Input
                    placeholder="+880 1..."
                    error={errors.phone?.message}
                    className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-11 transition-all"
                    {...register('phone')}
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 3: Role Specific Fields & Location */}
            {selectedRole === 'donor' ? (
              <div className="space-y-4">
                {/* Interactive Blood Group Chip Selector */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-rose-400 fill-rose-400" />
                      <span>{language === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন *' : 'Select Blood Group *'}</span>
                    </span>
                    <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                      {selectedBloodGroup}
                    </span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {BLOOD_GROUPS.map((bg) => {
                      const isSelected = selectedBloodGroup === bg;
                      return (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setValue('bloodGroup', bg)}
                          className={`py-2.5 px-2 rounded-xl font-black text-sm sm:text-base transition-all border text-center cursor-pointer select-none ${
                            isSelected
                              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.5)] scale-105 ring-2 ring-rose-400/50'
                              : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 hover:border-white/25 text-zinc-300 hover:text-white'
                          }`}
                        >
                          {bg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Division, District & Upazila */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'বিভাগ *' : 'Division *'}
                    </label>
                    <select
                      {...register('division')}
                      className="flex h-12 w-full rounded-xl border border-white/15 bg-zinc-900/90 hover:border-white/30 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20 backdrop-blur-xl cursor-pointer"
                    >
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <option key={div} value={div} className="bg-zinc-900 text-white">
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'জেলা *' : 'District *'}
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. Dhaka"
                        error={errors.district?.message}
                        className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-10 transition-all"
                        {...register('district')}
                      />
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-4 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'উপজেলা / এলাকা' : 'Upazila / Area'}
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. Mirpur-10"
                        className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-10 transition-all"
                        {...register('upazila')}
                      />
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Donor Emergency Lifesaver Note */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-rose-400" />
                      <span>{language === 'bn' ? 'রক্তদাতার বিশেষ নোট / বার্তা (ঐচ্ছিক)' : 'Emergency Donor Note (Optional)'}</span>
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {language === 'bn' ? 'কার্ডে প্রদর্শিত হবে' : 'Shown on donor card'}
                    </span>
                  </label>
                  <div className="relative">
                    <Input
                      placeholder={
                        language === 'bn'
                          ? 'যেমন: যেকোনো জরুরি প্রয়োজনে প্রস্তুত, মিরপুর ও আশপাশে ৩০ মিনিটে পৌঁছাতে পারব।'
                          : 'e.g. Ready for emergency dispatch in Mirpur area within 30 minutes.'
                      }
                      className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-10 transition-all"
                      {...register('note')}
                    />
                    <Quote className="w-4 h-4 text-zinc-400 absolute left-3 top-4 pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'হাসপাতাল বা ব্লাড ব্যাংকের নাম *' : 'Hospital / Blood Bank Name *'}
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. Dhaka Central Blood Center"
                        className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-11 transition-all"
                        {...register('organizationName')}
                      />
                      <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'হাসপাতাল লাইসেন্স নম্বর' : 'Hospital License Number'}
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. DGHS-BB-2026-01"
                        className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-11 transition-all"
                        {...register('licenseNumber')}
                      />
                      <ShieldCheck className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'বিভাগ *' : 'Division *'}
                    </label>
                    <select
                      {...register('division')}
                      className="flex h-12 w-full rounded-xl border border-white/15 bg-zinc-900/90 hover:border-white/30 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20 backdrop-blur-xl cursor-pointer"
                    >
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <option key={div} value={div} className="bg-zinc-900 text-white">
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {language === 'bn' ? 'জেলা *' : 'District *'}
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. Dhaka"
                        error={errors.district?.message}
                        className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl pl-11 transition-all"
                        {...register('district')}
                      />
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Row 4 (For Donors): Spacious Medical & Prior Blood Donation Profile Card */}
            {selectedRole === 'donor' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4">
                {/* Gender / Biological Sex */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-rose-400" />
                      <span>{language === 'bn' ? 'লিঙ্গ (Biological Sex / Gender) *' : 'Biological Sex / Gender *'}</span>
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {language === 'bn' ? 'মেডিকেল সেফটি গাইডলাইন' : 'Medical safety standard'}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { value: 'Male', labelBn: 'পুরুষ (Male)', labelEn: 'Male' },
                      { value: 'Female', labelBn: 'নারী (Female)', labelEn: 'Female' },
                      { value: 'Other', labelBn: 'অন্যান্য (Other)', labelEn: 'Other' },
                    ].map((item) => {
                      const isSelected = selectedGender === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setValue('gender', item.value as 'Male' | 'Female' | 'Other')}
                          className={`py-3 px-3 rounded-xl text-sm font-bold border transition-all cursor-pointer text-center select-none ${
                            isSelected
                              ? 'bg-rose-600/35 border-rose-400 text-white shadow-md ring-1 ring-rose-400/40'
                              : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                          }`}
                        >
                          {language === 'bn' ? item.labelBn : item.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prior Donation Experience */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                      <span>{language === 'bn' ? 'আপনি কি পূর্বে কখনো রক্তদান করেছেন?' : 'Have you donated blood before?'}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setValue('hasDonatedBefore', true);
                          if (!watch('totalDonations')) setValue('totalDonations', 1);
                        }}
                        className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                          hasDonatedBefore
                            ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-1 ring-rose-400/40'
                            : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        {language === 'bn' ? 'হ্যাঁ (Yes)' : 'Yes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setValue('hasDonatedBefore', false);
                          setValue('totalDonations', 0);
                          setValue('lastDonationDate', '');
                        }}
                        className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                          !hasDonatedBefore
                            ? 'bg-zinc-800 text-white border-white/25 shadow-md'
                            : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        {language === 'bn' ? 'না (প্রথমবার)' : 'No (First time)'}
                      </button>
                    </div>
                  </div>

                  {hasDonatedBefore ? (
                    <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-rose-400" />
                            <span>{language === 'bn' ? 'সর্বমোট কতবার রক্ত দিয়েছেন?' : 'Total Times Donated'}</span>
                          </label>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            placeholder="e.g. 3"
                            className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl transition-all"
                            {...register('totalDonations')}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-rose-400" />
                            <span>{language === 'bn' ? 'সর্বশেষ রক্তদানের তারিখ' : 'Last Donation Date'}</span>
                          </label>
                          <Input
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-white/[0.06] border-white/15 hover:border-white/30 focus:border-rose-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl backdrop-blur-xl transition-all"
                            {...register('lastDonationDate')}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 backdrop-blur-md">
                        <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          {language === 'bn'
                            ? 'নিরাপদ রক্তদানের জন্য পুরুষদের ৩ মাস এবং নারীদের ৪ মাস বিরতি রাখা স্বাস্থ্যসম্মত (DGHS ও WHO নির্দেশনা)।'
                            : 'Standard safety gap: minimum 3 months for men and 4 months for women between donations.'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 backdrop-blur-md">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {language === 'bn'
                          ? 'পবিত্র ও মহৎ কাজে প্রথমবার রক্তদাতা হিসেবে ড্রপ অব লাইফে আপনাকে উষ্ণ স্বাগতম!'
                          : 'Welcome first-time lifesaver! You are embarking on a truly noble mission.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Primary Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="relative w-full h-13 sm:h-14 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:via-red-400 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-[0_12px_40px_rgba(225,29,72,0.6)] rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer overflow-hidden group border border-white/30 mt-3"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating account...'}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 fill-white text-white shrink-0" />
                  <span>
                    {language === 'bn'
                      ? 'নিবন্ধন সম্পন্ন করে ড্যাশবোর্ডে প্রবেশ করুন'
                      : 'Complete Registration & Enter'}
                  </span>
                </span>
              )}
            </Button>
          </form>

          {/* 2. GOOGLE REGISTRATION BELOW MANUAL FORM */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {language === 'bn' ? 'বা গুগল দিয়ে এক ক্লিকে সম্পন্ন করুন' : 'Or Register Instantly with Google'}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Button
              type="button"
              disabled={isGoogleSigningIn || isLoading}
              onClick={handleDirectGoogleRegister}
              className="w-full h-12 bg-white/95 hover:bg-white text-zinc-950 font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer rounded-2xl border border-white/40 backdrop-blur-md"
            >
              {isGoogleSigningIn ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-rose-600" />
                  <span>{language === 'bn' ? 'গুগল সংযুক্ত করা হচ্ছে...' : 'Connecting with Google...'}</span>
                </span>
              ) : (
                <>
                  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>
                    {language === 'bn' ? 'গুগল দিয়ে দ্রুত নিবন্ধন করুন' : 'Register with Google'}
                  </span>
                </>
              )}
            </Button>
          </div>

          {/* Bottom Login Link */}
          <div className="mt-5 pt-3.5 border-t border-white/10 text-center text-xs sm:text-sm text-zinc-400">
            {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already registered?'}{' '}
            <Link
              href={redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login'}
              className="text-rose-400 hover:text-rose-300 font-bold hover:underline transition-colors"
            >
              {language === 'bn' ? 'এখানে লগইন করুন' : 'Sign In here'}
            </Link>
          </div>
        </div>
      </div>

      <GoogleLoginTwoStepModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccessRedirect={redirectPath || '/dashboard/donor'}
        initialStep={googleModalStep}
        initialGoogleUser={googleUserForModal}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoadingSkeleton />}>
      <RegisterContent />
    </Suspense>
  );
}
