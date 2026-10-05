'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User, BloodGroup } from '@/types';
import { DonorFilterBar } from '@/components/donors/DonorFilterBar';
import { DonorGrid } from '@/components/donors/DonorGrid';
import { DirectRequestModal } from '@/components/donors/DirectRequestModal';
import { RequestedDonorsModal } from '@/components/donors/RequestedDonorsModal';
import { BANGLADESH_DISTRICTS } from '@/lib/constants';
import { UserCheck, ClipboardList } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { donorsTranslations } from '@/lib/translations';
import { SmartPagination } from '@/components/shared/SmartPagination';

export default function DonorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const t = donorsTranslations[language];

  // State from URL query or defaults
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDonorForRequest, setSelectedDonorForRequest] = useState<User | null>(null);
  const [isRequestListModalOpen, setIsRequestListModalOpen] = useState(false);
  const [requestedDonorsVersion, setRequestedDonorsVersion] = useState(0);

  // Sync state with URL params
  useEffect(() => {
    const bgParam = searchParams.get('bloodGroup');
    setSelectedBloodGroup(bgParam && bgParam !== 'ALL' ? (bgParam as BloodGroup) : 'ALL');

    const divParam = searchParams.get('division');
    setSelectedDivision(divParam && divParam !== 'ALL' ? divParam : 'ALL');

    const distParam = searchParams.get('district');
    setSelectedDistrict(distParam && distParam !== 'ALL' ? distParam : 'ALL');

    const availParam = searchParams.get('available');
    if (availParam !== null) {
      setOnlyAvailable(availParam === 'true');
    }
  }, [searchParams]);

  // Fetch full dataset from Backend API (Neon PostgreSQL), excluding self if logged in
  const { data: allDonors = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ['donors-directory', user?._id || user?.id],
    queryFn: async () => {
      const params: any = {};
      if (user?._id || user?.id) {
        params.excludeUserId = user._id || user.id;
      }
      const res = await api.get('/donors', { params });
      return (res.data?.data?.donors || []) as User[];
    },
    staleTime: 60 * 1000,
  });

  // Global sync listener for donor requests & cancellations
  useEffect(() => {
    const handleSync = () => {
      setRequestedDonorsVersion((v) => v + 1);
      refetch();
    };
    window.addEventListener('dropoflife_donor_requested', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dropoflife_donor_requested', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refetch]);

  // Check if a donor has an active 24-hour request cooldown
  const isDonorRequested = (donor: User): boolean => {
    const donorId = donor._id || donor.id;
    let lastReqTime = donor.lastRequestedAt ? new Date(donor.lastRequestedAt).getTime() : 0;
    try {
      const stored = JSON.parse(localStorage.getItem('dropoflife_requested_donors') || '{}');
      const localTime = stored[donorId] || (donor.email && stored[donor.email]) || 0;
      if (localTime && Number(localTime) > lastReqTime) {
        lastReqTime = Number(localTime);
      }
    } catch (e) {}

    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - lastReqTime;
    return lastReqTime > 0 && elapsed < COOLDOWN_MS;
  };

  // Requested Donors List (Separated from the main directory)
  const requestedDonors = useMemo(() => {
    return allDonors.filter((donor) => isDonorRequested(donor));
  }, [allDonors, requestedDonorsVersion]);

  // Comprehensive Client-Side Filtering & Sorting
  const donorsList = useMemo(() => {
    return allDonors
      .filter((donor) => {
        // 0. EXCLUDE LOGGED-IN DONOR: A logged-in user must not see their own profile in the donors directory
        if (user) {
          const currentUserId = String(user._id || user.id || '').trim();
          const donorId = String(donor._id || donor.id || '').trim();
          if (currentUserId && donorId && currentUserId === donorId) {
            return false;
          }
          if (
            user.email &&
            donor.email &&
            user.email.toLowerCase().trim() === donor.email.toLowerCase().trim()
          ) {
            return false;
          }
          if (
            user.phone &&
            donor.phone &&
            user.phone.replace(/\D/g, '') === donor.phone.replace(/\D/g, '')
          ) {
            return false;
          }
        }

        // 0.1 EXCLUDE REQUESTED DONORS: Requested donors are separated into Request List modal
        if (isDonorRequested(donor)) {
          return false;
        }

        // 1. Blood Group Filter
        if (selectedBloodGroup !== 'ALL') {
          if (donor.bloodGroup !== selectedBloodGroup) {
            return false;
          }
        }

        // 2. Division Filter
        if (selectedDivision !== 'ALL') {
          if (donor.division?.toLowerCase() !== selectedDivision.toLowerCase()) {
            return false;
          }
        }

        // 3. District Filter (matches Bengali or English district name)
        if (selectedDistrict !== 'ALL') {
          const distLower = selectedDistrict.toLowerCase();
          const donorDistLower = (donor.district || '').toLowerCase();
          // Find district mapping to match English and Bengali equivalents
          const mapped = BANGLADESH_DISTRICTS.find(
            (d) =>
              d.nameBn.toLowerCase() === distLower ||
              d.nameEn.toLowerCase() === distLower
          );
          const matchDirect = donorDistLower === distLower;
          const matchMapped = mapped
            ? donorDistLower === mapped.nameBn.toLowerCase() ||
              donorDistLower === mapped.nameEn.toLowerCase()
            : false;

          if (!matchDirect && !matchMapped) {
            return false;
          }
        }

        // 4. Availability / Readiness Filter (3-month medical rule + user setting)
        if (onlyAvailable) {
          if (donor.isAvailable === false) return false;
          if (donor.lastDonationDate) {
            const lastTime = new Date(donor.lastDonationDate).getTime();
            const daysSince = Math.floor((Date.now() - lastTime) / (1000 * 60 * 60 * 24));
            if (daysSince < 90) return false;
          }
        }

        // 5. Keyword Search: intelligent matching across name, district, division, phone, upazila, note
        if (searchTerm.trim() !== '') {
          const term = searchTerm.trim().toLowerCase();

          // Check direct field matches
          const matchName = donor.name.toLowerCase().includes(term);
          const matchPhone = (donor.phone || '').includes(term);
          const matchUpazila = (donor.upazila || '').toLowerCase().includes(term);
          const matchDistrict = (donor.district || '').toLowerCase().includes(term);
          const matchDivision = (donor.division || '').toLowerCase().includes(term);
          const matchNote = (donor.note || '').toLowerCase().includes(term);
          const matchBlood = (donor.bloodGroup || '').toLowerCase() === term;

          // Check transliterated district match (e.g. user typed "panchagarh", donor.district is "পঞ্চগড়")
          const matchedDistrictInfo = BANGLADESH_DISTRICTS.find(
            (d) =>
              d.nameEn.toLowerCase().includes(term) ||
              d.nameBn.toLowerCase().includes(term)
          );
          const matchTransliteratedDistrict = matchedDistrictInfo
            ? (donor.district || '').toLowerCase() === matchedDistrictInfo.nameBn.toLowerCase() ||
              (donor.district || '').toLowerCase() === matchedDistrictInfo.nameEn.toLowerCase()
            : false;

          if (
            !matchName &&
            !matchPhone &&
            !matchUpazila &&
            !matchDistrict &&
            !matchDivision &&
            !matchNote &&
            !matchBlood &&
            !matchTransliteratedDistrict
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => (Number(b.totalDonations) || 0) - (Number(a.totalDonations) || 0));
  }, [allDonors, selectedBloodGroup, selectedDivision, selectedDistrict, onlyAvailable, searchTerm, user, requestedDonorsVersion]);

  // Progressive Grid View Count (12 items per batch)
  const INITIAL_PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PAGE_SIZE);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [selectedBloodGroup, selectedDivision, selectedDistrict, onlyAvailable, searchTerm]);

  const visibleDonors = donorsList.slice(0, visibleCount);

  const handleResetFilters = () => {
    setSelectedBloodGroup('ALL');
    setSelectedDivision('ALL');
    setSelectedDistrict('ALL');
    setOnlyAvailable(false);
    setSearchTerm('');
    router.push('/donors');
  };

  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'ALL') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/donors?${params.toString()}`);
  };

  return (
    <div className="min-h-screen py-8 sm:py-10">
      <div className="w-[94%] max-w-[1600px] mx-auto px-2 sm:px-4 space-y-7">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              {t.desc}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Request List Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsRequestListModalOpen(true)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-lg active:scale-95 ${
                requestedDonors.length > 0
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-amber-950/40 ring-1 ring-amber-500/30 animate-pulse'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60'
              }`}
              title={
                language === 'bn'
                  ? 'অনুরোধকৃত রক্তদাতাদের তালিকা দেখুন ও প্রয়োজনে বাতিল করুন'
                  : 'View requested donors list or cancel requests'
              }
            >
              <ClipboardList className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'bn' ? 'অনুরোধের তালিকা' : 'Request List'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  requestedDonors.length > 0
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {requestedDonors.length}
              </span>
            </button>

            <button
              onClick={handleResetFilters}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors underline cursor-pointer"
            >
              {language === 'bn' ? 'সকল ফিল্টার রিসেট করুন' : 'Clear all filters'}
            </button>
          </div>
        </div>

        {/* Filter Bar with Division & District Selection */}
        <DonorFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedBloodGroup={selectedBloodGroup}
          onBloodGroupChange={(bg) => {
            setSelectedBloodGroup(bg);
            updateUrlParam('bloodGroup', bg);
          }}
          selectedDivision={selectedDivision}
          onDivisionChange={(div) => {
            setSelectedDivision(div);
            updateUrlParam('division', div);
            setSelectedDistrict('ALL');
            updateUrlParam('district', null);
          }}
          selectedDistrict={selectedDistrict}
          onDistrictChange={(dist) => {
            setSelectedDistrict(dist);
            updateUrlParam('district', dist);
          }}
          onlyAvailable={onlyAvailable}
          onOnlyAvailableChange={(avail) => {
            setOnlyAvailable(avail);
            updateUrlParam('available', avail ? 'true' : null);
          }}
          onResetFilters={handleResetFilters}
          totalDonors={donorsList.length}
        />

        {/* Modular Grid Component */}
        <DonorGrid
          donors={visibleDonors}
          isLoading={isLoading}
          onDirectRequest={(donor) => setSelectedDonorForRequest(donor)}
          onResetFilters={handleResetFilters}
        />

        {/* Smart Progressive Load & View More Pagination */}
        {!isLoading && donorsList.length > visibleCount && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_PAGE_SIZE)}
              className="px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm border border-zinc-700 hover:border-rose-500/50 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              {language === 'bn'
                ? `আরও ১২ জন রক্তদাতা দেখুন (${visibleCount} / ${donorsList.length})`
                : `Load 12 More Donors (${visibleCount} of ${donorsList.length})`}
            </button>

            <button
              type="button"
              onClick={() => setVisibleCount(donorsList.length)}
              className="px-5 py-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs sm:text-sm border border-rose-500/30 transition-all cursor-pointer"
            >
              {language === 'bn' ? `সব ${donorsList.length} জন দেখুন` : `View All ${donorsList.length}`}
            </button>
          </div>
        )}

        {/* Modular Direct Request Modal Component */}
        <DirectRequestModal
          donor={selectedDonorForRequest}
          isOpen={!!selectedDonorForRequest}
          onClose={() => {
            setSelectedDonorForRequest(null);
            setRequestedDonorsVersion((v) => v + 1);
            refetch();
          }}
        />

        {/* Requested Donors List Modal with Instant Cancel Action */}
        <RequestedDonorsModal
          isOpen={isRequestListModalOpen}
          onClose={() => setIsRequestListModalOpen(false)}
          requestedDonors={requestedDonors}
          onDonorCancelled={() => {
            setRequestedDonorsVersion((v) => v + 1);
            refetch();
          }}
        />
      </div>
    </div>
  );
}
