'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from '@/stores/toastStore';
import {
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  defaultEmail?: string;
  onSuccess?: (newEmail: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  language = 'bn',
  defaultEmail = '',
  onSuccess,
}) => {
  const isBn = language === 'bn';

  // Step 1 = Request Link/Code; Step 2 = Enter Code & New Password; Step 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState(defaultEmail);
  const [tokenOrOtp, setTokenOrOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg(isBn ? 'ইমেইল অ্যাড্রেস লিখুন।' : 'Please enter your email.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      // Code is not auto-filled for security; user must input the code from email
      setTokenOrOtp('');

      toast.success(
        res.data?.message ||
          (isBn
            ? 'পাসওয়ার্ড রিসেট লিঙ্ক ও ভেরিফিকেশন কোড ইমেইলে পাঠানো হয়েছে।'
            : 'Password reset link & verification code sent to your email.')
      );
      setStep(2);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (isBn
          ? 'রিকোয়েস্ট প্রসেস করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'
          : 'Failed to process request. Please try again.');
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenOrOtp.trim()) {
      setErrorMsg(
        isBn
          ? '৬ ডিজিটের কোড বা ভেরিফিকেশন লিঙ্ক প্রদান করুন।'
          : 'Please enter verification code or token.'
      );
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(
        isBn
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(
        isBn ? 'পাসওয়ার্ড দুটি মিলছে না।' : 'Passwords do not match.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        tokenOrOtp: tokenOrOtp.trim(),
        newPassword,
      });

      toast.success(
        res.data?.message ||
          (isBn
            ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন লগইন করুন।'
            : 'Password successfully reset! You can now log in.')
      );
      setStep(3);
      if (onSuccess) {
        onSuccess(email);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (isBn
          ? 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। কোডটি চেক করুন।'
          : 'Failed to reset password. Please check your verification code.');
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrorMsg('');
    setTokenOrOtp('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-[calc(100vw-24px)] sm:max-w-md max-h-[90vh] overflow-y-auto overscroll-contain chat-custom-scrollbar bg-zinc-950/95 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-rose-950/40 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 border border-rose-500/40 shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              {isBn ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Your Password'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isBn
                ? 'ড্রপঅফলাইফ অ্যাকাউন্ট সিকিউরিটি পোর্টাল'
                : 'DropOfLife Account Security Portal'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-semibold animate-in shake">
            {errorMsg}
          </div>
        )}

        {/* ==========================================
            STEP 1: ENTER EMAIL TO RECEIVE CODE
           ========================================== */}
        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <p className="text-xs text-zinc-300 leading-relaxed">
              {isBn
                ? 'আপনার রেজিস্টার্ড ইমেইল অ্যাড্রেস লিখুন। আমরা আপনাকে তাৎক্ষণিক একটি ৬ ডিজিটের সিকিউরিটি কোড ও রিসেট লিঙ্ক পাঠাব।'
                : 'Enter your registered email address. We will dispatch a 6-digit security code and direct reset link.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-white placeholder:text-zinc-500 h-11 text-sm rounded-xl pl-10 pr-4 transition-all"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-rose-600 hover:bg-rose-500 font-bold text-sm text-white shadow-lg shadow-rose-950/40 rounded-xl mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isBn ? 'কোড পাঠানো হচ্ছে...' : 'Dispatching code...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {isBn ? 'রিসেট কোড পাঠান' : 'Send Verification Code'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/reset-password"
                onClick={handleClose}
                className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
              >
                {isBn
                  ? 'ডেডিকেটেড রিসেট পেইজে যেতে চান? এখানে ক্লিক করুন'
                  : 'Prefer dedicated reset page? Click here'}
              </Link>
            </div>
          </form>
        )}

        {/* ==========================================
            STEP 2: ENTER CODE & SET NEW PASSWORD
           ========================================== */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">
                  {isBn ? 'যাচাইকৃত ইমেইল:' : 'Target Email:'}
                </span>
                <span className="font-bold text-white">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {isBn ? 'পরিবর্তন' : 'Change'}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {isBn
                  ? '৬-ডিজিটের ভেরিফিকেশন কোড (OTP)'
                  : '6-Digit Verification Code (OTP)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="123456"
                  value={tokenOrOtp}
                  onChange={(e) => setTokenOrOtp(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-rose-500 text-rose-300 font-mono font-bold tracking-widest text-center h-12 text-lg rounded-xl transition-all"
                />
              </div>
              <p className="text-[11px] text-zinc-500 text-center">
                {isBn
                  ? 'ইমেইল ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন (মেয়াদ ১৫ মিনিট)।'
                  : 'Check your email inbox or spam folder (valid for 15 mins).'}
              </p>


              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-zinc-500">
                  {isBn ? 'কোড পাননি?' : "Didn't receive code?"}
                </span>
                <button
                  type="button"
                  onClick={handleRequestReset}
                  disabled={isLoading}
                  className="text-rose-400 hover:text-rose-300 hover:underline font-medium cursor-pointer"
                >
                  {isBn ? 'পুনরায় কোড পাঠান' : 'Resend Code'}
                </button>
              </div>
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
                  className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-rose-500 text-white h-11 text-sm rounded-xl pl-10 pr-10 transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-rose-500 text-white h-11 text-sm rounded-xl pl-10 pr-4 transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white shadow-lg shadow-emerald-950/40 rounded-xl mt-2 flex items-center justify-center gap-2"
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

        {/* ==========================================
            STEP 3: SUCCESS CONFIRMATION
           ========================================== */}
        {step === 3 && (
          <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-950">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">
                {isBn
                  ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'
                  : 'Password Successfully Changed!'}
              </h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {isBn
                  ? 'আপনার নতুন পাসওয়ার্ড কার্যকর হয়েছে। এখন আপনি আপনার অ্যাকাউন্টে সাইন ইন করতে পারেন।'
                  : 'Your account is updated and secure. You can now sign in with your new password.'}
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full h-11 bg-rose-600 hover:bg-rose-500 font-bold text-sm text-white shadow-lg shadow-rose-950/40 rounded-xl"
            >
              {isBn ? 'এখনই লগইন করুন' : 'Proceed to Login'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
