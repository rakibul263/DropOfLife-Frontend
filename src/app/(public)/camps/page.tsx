'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BloodCamp } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Users,
  Target,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { campsTranslations, formatBilingualNumber } from '@/lib/translations';
import { SmartPagination, getSmartInitialCount } from '@/components/shared/SmartPagination';
import { ScrollReveal } from '@/components/shared/ScrollReveal';


const FALLBACK_CAMPS: BloodCamp[] = [
  {
    _id: '673000000000000000000001',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    title: 'University of Dhaka Youth Blood Drive 2026',
    description:
      'Organized in collaboration with Badhan and DropOfLife. Free comprehensive blood grouping, hemoglobin screening, and health checkup by certified doctors.',
    venueAddress: 'Teacher-Student Centre (TSC) Auditorium, Dhaka University',
    district: 'Dhaka',
    division: 'Dhaka',
    startDate: '2026-10-18T09:00:00Z',
    endDate: '2026-10-19T17:00:00Z',
    targetUnits: 250,
    collectedUnits: 85,
    status: 'Upcoming',
    contactPhone: '+8801521711716',
    volunteersCount: 42,
    registeredVolunteers: ['Tanvir Hossain', 'Nusrat Jahan'],
  },
  {
    _id: '673000000000000000000002',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    title: 'Chattogram Port City Emergency Camp',
    description:
      'Specialized mobile blood bank bus providing donation facilities for port workers and city residents with refreshments and digital certificates.',
    venueAddress: 'GEC Convention Center, Chattogram',
    district: 'Chattogram',
    division: 'Chattogram',
    startDate: '2026-10-25T10:00:00Z',
    endDate: '2026-10-25T18:00:00Z',
    targetUnits: 120,
    collectedUnits: 0,
    status: 'Upcoming',
    contactPhone: '+8801521711716',
    volunteersCount: 18,
    registeredVolunteers: ['Fahim Morshed'],
  },
];

export default function CampsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const t = campsTranslations[language];
  const [volunteeredCampId, setVolunteeredCampId] = useState<string | null>(null);

  const { data: camps = FALLBACK_CAMPS, isLoading } = useQuery<BloodCamp[]>({
    queryKey: ['camps'],
    queryFn: async () => {
      try {
        const response = await api.get('/camps');
        return response.data?.data?.camps || FALLBACK_CAMPS;
      } catch (e) {
        return FALLBACK_CAMPS;
      }
    },
  });

  const [visibleCount, setVisibleCount] = useState<number>(6);

  React.useEffect(() => {
    setVisibleCount(getSmartInitialCount(camps.length));
  }, [camps.length]);

  const initialCount = getSmartInitialCount(camps.length);
  const visibleCamps = camps.slice(0, visibleCount);

  // Mutation to persist volunteer registration in the database
  const volunteerMutation = useMutation({
    mutationFn: async ({
      campId,
      volunteerName,
    }: {
      campId: string;
      volunteerName: string;
    }) => {
      const res = await api.post(`/camps/${campId}/volunteer`, {
        name: volunteerName,
      });
      return res.data.data.camp as BloodCamp;
    },
    onSuccess: (updatedCamp) => {
      queryClient.setQueryData(['camps'], (old: BloodCamp[] = []) =>
        old.map((c) => (c._id === updatedCamp._id ? updatedCamp : c))
      );
      queryClient.invalidateQueries({ queryKey: ['camps'] });
      setVolunteeredCampId(updatedCamp._id);
      addNotification({
        title:
          language === 'bn'
            ? '🎉 স্বেচ্ছাসেবক হিসেবে নিবন্ধন নিশ্চিত!'
            : '🎉 Volunteer Registration Confirmed!',
        body:
          language === 'bn'
            ? `ধন্যবাদ ${user?.name}! আপনি "${updatedCamp.title}" রক্তদান ড্রাইভে সফলভাবে স্বেচ্ছাসেবক হিসেবে যুক্ত হয়েছেন।`
            : `Thank you ${user?.name}! You have successfully registered as a volunteer for "${updatedCamp.title}".`,
        type: 'pledge',
      });
    },
    onError: (err: any) => {
      addNotification({
        title: language === 'bn' ? '⚠️ নিবন্ধন ত্রুটি' : '⚠️ Registration Error',
        body:
          err.message ||
          (language === 'bn'
            ? 'স্বেচ্ছাসেবক নিবন্ধন সম্পন্ন করা সম্ভব হয়নি।'
            : 'Could not complete volunteer registration.'),
        type: 'cancel',
      });
    },
  });

  const handleVolunteer = (camp: BloodCamp) => {
    if (!isAuthenticated || !user) {
      addNotification({
        title: language === 'bn' ? '⚠️ লগইন প্রয়োজন' : '⚠️ Login Required',
        body:
          language === 'bn'
            ? 'রক্তদান ক্যাম্পে স্বেচ্ছাসেবক হিসেবে যোগ দিতে অনুগ্রহ করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।'
            : 'Please log in to your account first to join as a volunteer for blood camps.',
        type: 'cancel',
      });
      router.push('/login?redirect=/camps');
      return;
    }

    volunteerMutation.mutate({
      campId: camp._id,
      volunteerName: user.name || user.email || 'Volunteer Donor',
    });
  };

  return (
    <div className="w-full max-w-[96%] sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] mx-auto px-2 sm:px-6 py-8 sm:py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-1.5">
          <Calendar className="w-4 h-4 text-rose-500" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
          {t.desc}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {visibleCamps.map((camp, index) => {
            const progressPercent = Math.min(
              100,
              Math.round((camp.collectedUnits / camp.targetUnits) * 100)
            );

            return (
              <ScrollReveal
                key={camp._id}
                animation="fade-up"
                delay={Math.min((index % 4) * 110, 330)}
                duration={750}
                className="h-full flex flex-col"
              >
                <Card
                  variant="liquid"
                  hoverEffect
                  className="p-6 sm:p-8 h-full flex flex-col justify-between shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85),0_0_30px_rgba(225,29,72,0.1)] space-y-6 transition-all relative overflow-hidden backdrop-blur-3xl border border-white/20 hover:border-rose-500/50 group revealed-card-hover"
                >
                {/* Liquid glass light refraction orbs */}
                <div className="pointer-events-none absolute -right-20 -top-20 w-48 h-48 bg-rose-600/15 rounded-full blur-3xl group-hover:bg-rose-600/25 transition-all duration-500" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 w-48 h-48 bg-sky-600/10 rounded-full blur-3xl group-hover:bg-sky-600/20 transition-all duration-500" />

                <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 min-h-[72px]">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-sm backdrop-blur-md inline-block">
                      {camp.status} {t.drive}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-snug line-clamp-2 min-h-[36px]">
                      {camp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-200 font-medium mt-1">
                      {t.organizedBy} <strong className="text-white">{camp.providerName}</strong>
                    </p>
                  </div>

                  <p className="text-sm text-zinc-200 leading-relaxed font-normal line-clamp-3 min-h-[54px]">
                    {camp.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-zinc-800/80 text-xs sm:text-sm text-zinc-200 min-h-[58px]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        {formatDate(camp.startDate)} – {formatDate(camp.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">
                        {camp.venueAddress}, {camp.district}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-zinc-200 flex items-center gap-2 font-medium">
                        <Target className="w-4 h-4 text-amber-400" /> {t.targetUnits}
                      </span>
                      <span className="font-extrabold text-white">
                        {formatBilingualNumber(camp.collectedUnits, language)} /{' '}
                        {formatBilingualNumber(camp.targetUnits, language)} {t.units} (
                        {formatBilingualNumber(progressPercent, language)}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden ring-1 ring-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-rose-600 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 border-t border-zinc-800/80 mt-auto shrink-0 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-200 font-medium">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>
                      <strong className="text-white font-extrabold">
                        {formatBilingualNumber(camp.volunteersCount || 0, language)}
                      </strong>{' '}
                      {t.volunteersRegistered}
                    </span>
                  </div>

                  {volunteeredCampId === camp._id ||
                  (user?.name && camp.registeredVolunteers?.includes(user.name)) ||
                  (user?.email && camp.registeredVolunteers?.includes(user.email)) ? (
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-300 bg-emerald-950/80 px-4 py-2.5 rounded-xl border border-emerald-700/60 shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{t.registeredSuccess}</span>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVolunteer(camp)}
                      disabled={volunteerMutation.isPending}
                      className="h-11 px-4 text-xs sm:text-sm font-extrabold gap-2 rounded-xl shadow-lg shadow-rose-950/60 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>
                        {volunteerMutation.isPending
                          ? (language === 'bn' ? 'নিবন্ধন হচ্ছে...' : 'Registering...')
                          : t.volunteerBtn}
                      </span>
                    </Button>
                  )}
                </div>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>

        {/* Smart Progressive Load & View More Pagination */}
        {!isLoading && camps.length > 0 && (
          <SmartPagination
            totalItems={camps.length}
            visibleCount={visibleCount}
            initialCount={initialCount}
            onViewMore={() =>
              setVisibleCount((prev) => {
                const remaining = camps.length - prev;
                if (remaining <= 3) return camps.length;
                return prev + 3;
              })
            }
            onShowLess={() => setVisibleCount(initialCount)}
            onViewAll={() => setVisibleCount(camps.length)}
            itemNameBn="টি রক্তদান ক্যাম্প"
            itemNameEn="blood camps"
          />
        )}
      </div>
    </div>
  );
}
