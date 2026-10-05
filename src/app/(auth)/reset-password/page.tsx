'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/stores/languageStore';
import { toast } from '@/stores/toastStore';
import { Button } from '@/components/ui/Button';
import {
  KeyRound,
  Lock,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Droplet,
  ShieldCheck,
} from 'lucide-react';
import { VascularBloodBackground } from '@/components/shared/VascularBloodBackground';

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const initialEmail = searchParams.get('email') || '';
  const initialToken = searchParams.get('token') || '';

  // If token is provided in the URL, start at step 2 (Set New Password)
  const [step, setStep] = useState<1 | 2 | 3>(initialToken ? 2 : 1);
  const [email, setEmail] = useState(initialEmail);
  const [tokenOrOtp, setTokenOrOtp] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialToken) {
      setTokenOrOtp(initialToken);
      setStep(2);
    }
  }, [initialEmail, initialToken]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে আপনার ইমেইল প্রদান করুন।' : 'Please enter your email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      // OTP is not auto-filled for security; user must manually enter it from email
      if (!initialToken) {
        setTokenOrOtp('');
      }

      toast.success(
        isBn
          ? 'পাসওয়ার্ড রিসেট কোড আপনার ইমেইলে পাঠানো হয়েছে।'
          : 'Password reset code sent to your email.'
      );
      setStep(2);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (isBn
          ? 'রিকোয়েস্ট প্রসেস করা যায়নি। পুনরায় চেষ্টা করুন।'
          : 'Failed to process request. Please try again.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenOrOtp.trim()) {
      setErrorMessage(
        isBn
          ? '৬ ডিজিটের কোড বা ভেরিফিকেশন লিঙ্ক প্রদান করুন।'
          : 'Please enter verification code or token.'
      );
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage(
        isBn
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(isBn ? 'পাসওয়ার্ড দুটি মিলছে না।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        tokenOrOtp: tokenOrOtp.trim(),
        newPassword,
      });

      toast.success(
        isBn
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'
          : 'Password updated successfully!'
      );
      setStep(3);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (isBn
          ? 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। কোডটি চেক করুন।'
          : 'Failed to reset password. Please check your verification code.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white overflow-hidden">
      <VascularBloodBackground />

      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Top Back Link & Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{isBn ? 'লগইনে ফিরে যান' : 'Back to Login'}</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 font-bold">
            <Droplet className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>DropOfLife</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="relative bg-zinc-900/80 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-8 backdrop-blur-2xl text-zinc-100">
          {/* Card Header Icon & Title */}
          <div className="flex items-center gap-3.5 mb-6 border-b border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 border border-rose-500/40 shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {isBn ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Your Password'}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isBn
                  ? 'নিরাপদ অ্যাকাউন্ট ভেরিফিকেশন ও পাসওয়ার্ড আপডেট'
                  : 'Secure Account Verification & Credential Update'}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: REQUEST CODE */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {isBn
                  ? 'আপনার ড্রপঅফলাইফ অ্যাকাউন্টের ইমেইল লিখুন। আমরা আপনাকে পাসওয়ার্ড পরিবর্তনের জন্য একটি ভেরিফিকেশন কোড ও লিঙ্ক পাঠাব।'
                  : 'Enter the email linked to your DropOfLife account. We will send a verification code & direct reset link.'}
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-12 text-sm rounded-xl pl-10 pr-4 transition-all"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 rounded-xl mt-3 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isBn ? 'কোড পাঠানো হচ্ছে...' : 'Dispatching Code...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {isBn ? 'রিসেট নির্দেশিকা পাঠান' : 'Send Reset Instructions'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: ENTER CODE & SET NEW PASSWORD */}
          {step === 2 && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono">
                    {isBn ? 'অ্যাকাউন্ট ইমেইল:' : 'Account Email:'}
                  </span>
                  <span className="font-bold text-white">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  {isBn ? 'ইমেইল পরিবর্তন' : 'Change'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  {isBn
                    ? '৬-ডিজিটের ভেরিফিকেশন কোড (OTP)'
                    : '6-Digit Verification Code (OTP)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  value={tokenOrOtp}
                  onChange={(e) => setTokenOrOtp(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-700 focus:border-rose-500 text-rose-300 font-mono font-bold tracking-widest text-center h-12 text-lg rounded-xl transition-all"
                />
                <p className="text-[11px] text-zinc-500 text-center">
                  {isBn
                    ? 'ইমেইল ইনবক্স বা স্প্যাম ফোল্ডারে প্রাপ্ত কোডটি লিখুন।'
                    : 'Enter the 6-digit code received in your email.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  {isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-700 focus:border-rose-500 text-white h-12 text-sm rounded-xl pl-10 pr-10 transition-all"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-4 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  {isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-700 focus:border-rose-500 text-white h-12 text-sm rounded-xl pl-10 pr-4 transition-all"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 rounded-xl mt-3 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isBn ? 'আপডেট করা হচ্ছে...' : 'Updating password...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isBn ? 'পাসওয়ার্ড পরিবর্তন সম্পন্ন করুন' : 'Update Password Now'}
                    </span>
                  </>
                )}
              </Button>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 3 && (
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-950">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-white">
                  {isBn
                    ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'
                    : 'Password Successfully Changed!'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  {isBn
                    ? 'আপনার অ্যাকাউন্টের ক্রেডেনশিয়াল নিরাপদে আপডেট করা হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।'
                    : 'Your account credentials have been securely updated. You can now sign in with your new password.'}
                </p>
              </div>

              <Link href="/login" className="block w-full">
                <Button className="w-full h-12 bg-rose-600 hover:bg-rose-500 font-bold text-sm text-white shadow-lg shadow-rose-950/50 rounded-xl">
                  {isBn ? 'এখনই সাইন ইন করুন' : 'Sign In Now'}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">
          Loading Security Portal...
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
