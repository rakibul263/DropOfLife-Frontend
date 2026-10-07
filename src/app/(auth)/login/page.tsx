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
import { DEMO_CREDENTIALS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { GoogleLoginTwoStepModal } from '@/components/auth/GoogleLoginTwoStepModal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';
import {
  Droplet,
  Heart,
  Building2,
  Zap,
  ArrowLeft,
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { VascularBloodBackground } from '@/components/shared/VascularBloodBackground';
import { LiquidLifeLoader } from '@/components/shared/LiquidLifeLoader';
import { toast } from '@/stores/toastStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginLoadingSkeleton() {
  return <LiquidLifeLoader fullscreen={true} />;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const { language } = useLanguageStore();

  const { setAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuickRole, setActiveQuickRole] = useState<string | null>(null);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [googleUserForModal, setGoogleUserForModal] = useState<any>(null);
  const [googleModalStep, setGoogleModalStep] = useState<1 | 2>(1);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  // Direct Google OAuth message listener from popup
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
              ? `স্বাগতম, ${event.data.user?.name || 'লাইফসেভার'}! আপনি সফলভাবে প্রবেশ করেছেন।`
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
        setErrorMessage(event.data.message || 'Google authentication was cancelled.');
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [redirectPath, router, setAuth]);

  const handleDirectGoogleLogin = () => {
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle Intuitive Back Navigation to where user clicked login
  const handleBack = () => {
    if (redirectPath) {
      router.push(redirectPath);
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.post('/auth/login', data);
      const { user, token, accessToken, refreshToken } = response.data.data;
      setAuth(user, accessToken || token, refreshToken);

      toast.success(
        language === 'bn'
          ? `স্বাগতম, ${user.name}! আপনি সফলভাবে প্রবেশ করেছেন।`
          : `Welcome back, ${user.name}! You are logged in.`,
        language === 'bn' ? 'লগইন সফল' : 'Login Successful'
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
          ? 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে ক্রেডেনশিয়াল যাচাই করুন।'
          : 'Login failed. Please check your credentials.');
      setErrorMessage(msg);
      toast.error(msg, language === 'bn' ? 'লগইন ত্রুটি' : 'Authentication Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demo: (typeof DEMO_CREDENTIALS)[number]) => {
    setActiveQuickRole(demo.role);
    setValue('email', demo.email);
    setValue('password', demo.password);
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await api.post('/auth/login', {
        email: demo.email,
        password: demo.password,
      });
      const { user, token } = response.data.data;
      setAuth(user, token);

      toast.success(
        language === 'bn'
          ? `ডেমো ${demo.role.toUpperCase()} হিসেবে প্রবেশ করেছেন!`
          : `Logged in as demo ${demo.role.toUpperCase()}!`,
        language === 'bn' ? 'স্বাগতম' : 'Welcome'
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
          ? 'ওয়ান-ক্লিক লগইন ব্যর্থ হয়েছে।'
          : '1-Click login failed.');
      setErrorMessage(msg);
      toast.error(msg, language === 'bn' ? 'লগইন ত্রুটি' : 'Login Error');
    } finally {
      setIsLoading(false);
      setActiveQuickRole(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden bg-transparent">
      {/* 60fps Micro-Vascular Animated Red Blood Cells (Erythrocytes) & Capillary Veins Canvas */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
        <VascularBloodBackground />
      </div>

      {/* Liquid Glass Ambient Aura */}
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

      {/* Main Wide Liquid Glass Shell for Laptops & Desktops */}
      <div className="w-full max-w-4xl relative z-10">
        <div
          className="border border-white/20 bg-gradient-to-b from-white/[0.10] via-zinc-950/60 to-zinc-950/80 p-4 sm:p-8 lg:p-10 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.85),0_0_60px_rgba(225,29,72,0.18),inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_0_30px_rgba(255,255,255,0.02)] backdrop-blur-3xl rounded-3xl relative overflow-hidden ring-1 ring-white/15"
        >
          {/* Liquid glass specular top highlight line */}
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
                {language === 'bn' ? 'আগের পেজে ফিরে যান' : 'Back to previous page'}
              </span>
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 backdrop-blur-xl shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{language === 'bn' ? 'জরুরি পোর্টাল' : 'Emergency Portal'}</span>
            </div>
          </div>

          {/* 2-Column Wide Grid Layout on Laptop / Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* LEFT COLUMN: Telemetry & 1-Click Demo Access */}
            <div className="lg:col-span-5 space-y-4">
              {/* Portal Intro */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{language === 'bn' ? 'জরুরি লাইফসেভার নেটওয়ার্ক' : 'Emergency Lifesaver Network'}</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার অ্যাকাউন্টে প্রবেশ করে রক্তদানের অঙ্গীকার, জরুরি রিকোয়েস্ট ও রক্তের প্রাপ্যতা পরিচালনা করুন।'
                    : 'Access your life-saving dashboard to pledge blood donations, manage requests, and track verified dispatches.'}
                </p>
              </div>

              {/* Trust & Telemetry Micro-Pills */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-zinc-300">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{language === 'bn' ? '৬৪ জেলায় স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক' : '64-District voluntary donor registry'}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-zinc-300">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{language === 'bn' ? '১১.৪ মিনিট গড় জরুরি রেসপন্স সময়' : '11.4 min average response dispatch'}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? '১০০% ডিজিএইচএস ও ডব্লিউএইচও স্ট্যান্ডার্ড' : '100% DGHS & WHO safety compliance'}</span>
                </div>
              </div>

              {/* Compact 1-Click Demo Login Box */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{language === 'bn' ? '১-ক্লিক ডেমো লগইন:' : '1-Click Demo Logins:'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDemoInfo(!showDemoInfo)}
                    className="text-[10px] text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    {showDemoInfo
                      ? language === 'bn' ? 'বন্ধ করুন' : 'Hide'
                      : language === 'bn' ? 'ক্রেডেনশিয়াল' : 'Details'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {DEMO_CREDENTIALS.map((demo) => {
                    const Icon =
                      demo.role === 'admin'
                        ? ShieldAlert
                        : demo.role === 'donor'
                        ? Heart
                        : Building2;
                    const isSelected = activeQuickRole === demo.role;

                    return (
                      <button
                        key={demo.role}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleQuickLogin(demo)}
                        title={`${demo.title}: ${demo.email}`}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600/40 border-rose-400 text-white shadow-md'
                            : 'bg-zinc-900/90 hover:bg-zinc-800 border-white/10 hover:border-white/20 text-zinc-200'
                        }`}
                      >
                        {isSelected && isLoading ? (
                          <span className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                          <Icon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className="truncate text-[11px]">
                          {demo.role === 'admin'
                            ? language === 'bn' ? 'অ্যাডমিন' : 'Admin'
                            : demo.role === 'donor'
                            ? language === 'bn' ? 'রক্তদাতা' : 'Donor'
                            : language === 'bn' ? 'হাসপাতাল' : 'Hospital'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {showDemoInfo && (
                  <div className="p-2 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-zinc-400 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-rose-400 font-bold">Admin:</span>
                      <span className="text-zinc-300">rakibul@dropoflife.com <span className="text-zinc-500">(admin123)</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-rose-400 font-bold">Donor:</span>
                      <span className="text-zinc-300">rakibulhasan@gmail.com <span className="text-zinc-500">(123456)</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-rose-400 font-bold">Hospital:</span>
                      <span className="text-zinc-300">hospital@dropoflife.org <span className="text-zinc-500">(123456)</span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Sign-In Form (Liquid Glass) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Account Sign In'}
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {language === 'bn'
                    ? 'আপনার সুরক্ষিত ক্রেডেনশিয়াল দিয়ে প্রবেশ করুন'
                    : 'Sign in to access your customized dashboard'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Manual Form On Top */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                    {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
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

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-zinc-200">
                    {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
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

                <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-300 pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-zinc-900 border-white/20 text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>{language === 'bn' ? '৭ দিন মনে রাখুন' : 'Remember me'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetPasswordModalOpen(true)}
                    className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer transition-colors bg-transparent border-0 p-0 text-xs sm:text-sm font-medium"
                  >
                    {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                  </button>
                </div>

                {/* Primary Radiant CTA Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full h-12 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:via-red-400 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-[0_10px_35px_rgba(225,29,72,0.6)] rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer overflow-hidden group border border-white/30"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  {isLoading && !activeQuickRole ? (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-white" />
                      <span>{language === 'bn' ? 'প্রবেশ করা হচ্ছে...' : 'Signing in...'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4 fill-current shrink-0" />
                      <span>
                        {language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Dashboard'}
                      </span>
                    </span>
                  )}
                </Button>
              </form>

              {/* 2. Google 1-Tap Sign-In Below Manual Form */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    {language === 'bn' ? 'বা গুগল দিয়ে এক ক্লিকে প্রবেশ করুন' : 'Or Sign In with Google'}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <Button
                  type="button"
                  disabled={isGoogleSigningIn || isLoading}
                  onClick={handleDirectGoogleLogin}
                  className="w-full h-12 bg-white/95 hover:bg-white text-zinc-950 font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer rounded-xl border border-white/40 backdrop-blur-md"
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
                        {language === 'bn' ? 'গুগল দিয়ে সরাসরি এগিয়ে যান' : 'Continue with Google'}
                      </span>
                    </>
                  )}
                </Button>
              </div>

              {/* Registration Link */}
              <div className="pt-3 text-center text-xs sm:text-sm text-zinc-400 border-t border-white/10">
                {language === 'bn' ? 'এখনো অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                <Link
                  href={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register'}
                  className="text-rose-400 hover:text-rose-300 font-bold hover:underline transition-colors"
                >
                  {language === 'bn'
                    ? 'রক্তদাতা হিসেবে নিবন্ধন করুন'
                    : 'Register as Donor or Hospital'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory 2-Step Google Onboarding Modal */}
      <GoogleLoginTwoStepModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccessRedirect={redirectPath || '/dashboard/donor'}
        initialStep={googleModalStep}
        initialGoogleUser={googleUserForModal}
      />

      {/* Password Reset Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        language={language}
        defaultEmail={watch('email')}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
