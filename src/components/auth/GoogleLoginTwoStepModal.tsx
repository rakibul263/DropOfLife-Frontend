'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BloodGroup } from '@/types';
import { BLOOD_GROUPS, BANGLADESH_DIVISIONS } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import {
  Droplet,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  Sparkles,
  User,
  Heart,
  Quote,
} from 'lucide-react';
import { toast } from '@/stores/toastStore';

export interface GoogleAuthUser {
  name: string;
  email: string;
  avatarUrl: string;
  googleId?: string;
}

interface GoogleLoginTwoStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect?: string;
  initialStep?: 1 | 2;
  initialGoogleUser?: GoogleAuthUser | null;
}

export function GoogleLoginTwoStepModal({
  isOpen,
  onClose,
  onSuccessRedirect = '/dashboard/donor',
  initialStep = 1,
  initialGoogleUser = null,
}: GoogleLoginTwoStepModalProps) {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(initialStep);
  const [googleUser, setGoogleUser] = useState<GoogleAuthUser | null>(initialGoogleUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSubmittingStep2, setIsSubmittingStep2] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 2 Form States
  const [phone, setPhone] = useState('+8801521711716');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [note, setNote] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const popupRef = useRef<Window | null>(null);

  // Sync initial state if modal opens with pre-filled Google data
  useEffect(() => {
    if (initialGoogleUser) {
      setGoogleUser(initialGoogleUser);
      setStep(initialStep || 2);
    }
  }, [initialGoogleUser, initialStep]);

  // Listen for Google OAuth callback message from popup window
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      // Security check: Only accept messages from same origin
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsAuthenticating(false);
        setErrorMsg('');

        if (event.data.status === 'AUTHENTICATED') {
          // Existing User with Complete Profile -> Immediate Login
          setSuccessMsg(`Welcome back, ${event.data.user?.name || 'Lifesaver'}!`);
          setAuth(event.data.user, event.data.token);

          setTimeout(() => {
            onClose();
            router.push(event.data.returnUrl || onSuccessRedirect);
          }, 600);
        } else if (event.data.status === 'NEEDS_STEP_2') {
          // New User or Incomplete Profile -> Transition to Step 2
          setGoogleUser(event.data.googleUser);
          setStep(2);
        }
      } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
        setIsAuthenticating(false);
        setErrorMsg(event.data.message || 'Google authentication was cancelled or encountered an issue.');
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, [onClose, onSuccessRedirect, router, setAuth]);

  // Step 1: Open Google OAuth popup
  const handleGoogleSignIn = () => {
    setIsAuthenticating(true);
    setErrorMsg('');
    setSuccessMsg('');

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popupUrl = `/api/auth/google?returnUrl=${encodeURIComponent(onSuccessRedirect)}`;

    const popup = window.open(
      popupUrl,
      'DropOfLifeGoogleAuth',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Popup blocked by browser -> fallback to full-page redirect
      window.location.href = popupUrl;
      return;
    }

    popupRef.current = popup;

    // Check if popup was closed by user before completing
    const checkClosedInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosedInterval);
        setIsAuthenticating(false);
      }
    }, 1000);
  };

  // Step 2: Mandatory Donor Profile Completion & JWT Issuance
  const handleCompleteStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) return;

    if (!phone || phone.trim().length < 11) {
      setErrorMsg('A valid phone number with at least 11 digits is required for emergency dispatch.');
      return;
    }

    setIsSubmittingStep2(true);
    setErrorMsg('');

    try {
      // Connect to DropOfLife backend Google registration endpoint
      const res = await api.post('/auth/google', {
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
        googleId: googleUser.googleId,
        phone: phone.trim(),
        bloodGroup,
        gender,
        division,
        district,
        upazila: district,
        note: note.trim() || undefined,
        role: 'donor',
      });

      const { user, token } = res.data.data;
      setAuth(user, token);
      setSuccessMsg('Donor profile verified! Welcome to DropOfLife.');
      toast.success('গুগল অ্যাকাউন্ট দিয়ে রেজিস্ট্রেশন সফল হয়েছে! ড্যাশবোর্ডে স্বাগতম।', 'ড্রপ অব লাইফ');

      setTimeout(() => {
        onClose();
        router.push(onSuccessRedirect);
      }, 700);
    } catch (err: any) {
      const msg = err.message || 'Unable to finalize registration. Please verify details and try again.';
      setErrorMsg(msg);
      toast.error(msg, 'রেজিস্ট্রেশন ত্রুটি');
    } finally {
      setIsSubmittingStep2(false);
    }
  };

  const handleModalClose = () => {
    if (step === 2) {
      const confirmExit = window.confirm(
        'Warning: Donor profile registration is incomplete. Emergency dispatch requires verified contact and blood group. Exit anyway?'
      );
      if (!confirmExit) return;
    }
    setStep(1);
    setGoogleUser(null);
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-lg bg-zinc-950/95 border border-white/20 p-6 sm:p-7 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(225,29,72,0.25)] backdrop-blur-3xl text-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
              Verified Google OAuth 2.0 Identity
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {step === 1 ? 'Sign in with Google' : 'Step 2: Emergency Lifesaver Profile'}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            {step === 1
              ? 'Connect your verified Google Account to access DropOfLife immediately.'
              : 'Complete your emergency contact and blood group before first-time access.'}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/35 text-rose-300 text-xs flex items-center gap-2.5 backdrop-blur-md">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs flex items-center gap-2.5 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: ONE-CLICK GOOGLE SIGN IN */
          <div className="space-y-5 py-3">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-2.5 backdrop-blur-xl">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 flex items-center justify-center mx-auto text-white shadow-[0_0_25px_rgba(225,29,72,0.6)] border border-rose-400/30">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <h4 className="text-sm font-bold text-white">Instant Life-Saving Access</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Connect directly with Google. Existing donors are signed in immediately; new
                lifesavers only need to confirm their blood group & emergency phone number.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="w-full h-13 bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold text-sm shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer rounded-2xl border border-white/60"
            >
              {isAuthenticating ? (
                <span className="flex items-center gap-2 text-zinc-800">
                  <Sparkles className="w-4 h-4 animate-spin text-rose-600" />
                  <span>Connecting with Google...</span>
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct OAuth 2.0 with Google Cloud Production APIs</span>
            </div>
          </div>
        ) : (
          /* STEP 2: MANDATORY DONOR ONBOARDING CHECKPOINT */
          <form onSubmit={handleCompleteStep2} className="space-y-4 py-2">
            {/* Verified Google Account Summary */}
            <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-between text-xs backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <img
                  src={
                    googleUser?.avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      googleUser?.name || 'User'
                    )}`
                  }
                  alt={googleUser?.name || 'Google User'}
                  className="w-10 h-10 rounded-full border border-rose-500/40 object-cover shrink-0 shadow-md"
                />
                <div>
                  <p className="font-extrabold text-white line-clamp-1">{googleUser?.name}</p>
                  <p className="text-zinc-400 text-[11px] font-mono line-clamp-1">
                    {googleUser?.email}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Google Verified
              </span>
            </div>

            {/* Mandatory Medical Safety Alert */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] leading-relaxed backdrop-blur-md">
              <strong>Mandatory Lifesaver Checkpoint:</strong> Contact phone and blood group are
              strictly required so emergency patients and critical trauma units can contact you in
              real-time.
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>Emergency Contact Phone Number *</span>
              </label>
              <Input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801521711716"
                className="bg-white/[0.06] border-white/15 focus:border-rose-400 text-white font-mono h-11 text-sm rounded-xl"
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-rose-400" />
                <span>Your Blood Group *</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 px-2 rounded-xl font-black text-xs sm:text-sm transition-all border text-center cursor-pointer select-none ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-105 ring-2 ring-rose-400/50'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Biological Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>Biological Sex / Gender *</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ].map((item) => {
                  const isSelected = gender === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setGender(item.value as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-rose-600/35 border-rose-400 text-white shadow-md ring-1 ring-rose-400/40'
                          : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Division & District */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Division *</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full h-11 px-3 bg-zinc-900 border border-white/15 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rose-400 cursor-pointer"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">District / Upazila *</label>
                <Input
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Mirpur, Dhaka"
                  className="bg-white/[0.06] border-white/15 text-white h-11 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* Donor Note */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-rose-400" />
                <span>Emergency Donor Note (Optional)</span>
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Ready for emergency calls in Mirpur within 30 mins."
                className="bg-white/[0.06] border-white/15 text-white h-11 text-xs rounded-xl"
              />
            </div>

            {/* Availability Checkbox */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-zinc-800 border-white/20"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Mark as Available for Transfusion</span>
                <span className="text-zinc-400 text-[11px]">
                  Emergency patients nearby can dispatch requests
                </span>
              </div>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmittingStep2}
              className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold h-12 shadow-[0_10px_30px_rgba(225,29,72,0.5)] text-sm rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer mt-1"
            >
              {isSubmittingStep2 ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Finalizing Registration...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Complete Registration & Enter</span>
                </span>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
