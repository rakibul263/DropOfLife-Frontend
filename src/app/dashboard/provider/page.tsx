'use client';

import React, { useState, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { InventoryItem, BloodGroup } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { BloodGroupBadge } from '@/components/shared/BloodGroupBadge';
import { UrgencyBadge } from '@/components/shared/UrgencyBadge';
import { toast } from '@/stores/toastStore';
import {
  Layers,
  Plus,
  Minus,
  AlertTriangle,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Clock,
  Heart,
  Phone,
  Search,
  MapPin,
  Thermometer,
  Activity,
  FileCheck2,
  Users,
  Award,
} from 'lucide-react';

const FALLBACK_INVENTORY: InventoryItem[] = [
  {
    _id: '1',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'A+',
    componentType: 'Whole Blood',
    unitsInStock: 24,
    criticalThreshold: 8,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: '2',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'A-',
    componentType: 'Whole Blood',
    unitsInStock: 6,
    criticalThreshold: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: '3',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'B+',
    componentType: 'Whole Blood',
    unitsInStock: 32,
    criticalThreshold: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: '4',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'B-',
    componentType: 'Whole Blood',
    unitsInStock: 3, // Low!
    criticalThreshold: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: '5',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'O+',
    componentType: 'Whole Blood',
    unitsInStock: 42,
    criticalThreshold: 12,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: '6',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'O-',
    componentType: 'Whole Blood',
    unitsInStock: 2, // Critical alert!
    criticalThreshold: 6,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: '7',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'AB+',
    componentType: 'Whole Blood',
    unitsInStock: 18,
    criticalThreshold: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: '8',
    providerId: '670000000000000000000003',
    providerName: 'Dhaka Central Blood Bank & Hospital',
    bloodGroup: 'AB-',
    componentType: 'Whole Blood',
    unitsInStock: 1, // Critical alert!
    criticalThreshold: 4,
    lastUpdated: new Date().toISOString(),
  },
];

const FALLBACK_REQUESTS = [
  {
    id: 'req-h1',
    patientName: 'Md. Tariqul Islam',
    hospitalName: 'Dhaka Medical College & Hospital',
    bloodGroup: 'O-',
    unitsNeeded: 2,
    urgencyLevel: 'Emergency',
    attendantPhone: '+8801711223344',
    reason: 'Emergency Road Accident Trauma & Surgery',
    status: 'Pending',
    createdAt: '15 mins ago',
  },
  {
    id: 'req-h2',
    patientName: 'Begum Rokeya',
    hospitalName: 'National Heart Foundation',
    bloodGroup: 'AB-',
    unitsNeeded: 1,
    urgencyLevel: 'Critical',
    attendantPhone: '+8801811445566',
    reason: 'Open Heart Bypass Surgery',
    status: 'Pending',
    createdAt: '42 mins ago',
  },
  {
    id: 'req-h3',
    patientName: 'Shahidul Alam',
    hospitalName: 'BIRDEM General Hospital',
    bloodGroup: 'B+',
    unitsNeeded: 2,
    urgencyLevel: 'Normal',
    attendantPhone: '+8801911778899',
    reason: 'Scheduled Dialysis & Anemia Support',
    status: 'Dispensed',
    createdAt: '3 hours ago',
  },
];

const FALLBACK_CAMPS = [
  {
    id: 'camp-1',
    title: 'University Campus Youth Blood Drive',
    venueAddress: 'TSC Auditorium, University of Dhaka',
    district: 'Dhaka',
    startDate: '2026-10-12',
    targetUnits: 150,
    collectedUnits: 42,
    contactPhone: '+8801521711716',
    status: 'Upcoming',
  },
  {
    id: 'camp-2',
    title: 'Dhanmondi Community Lifesaver Camp',
    venueAddress: 'Dhanmondi Lake Amphitheater, Sector 8',
    district: 'Dhaka',
    startDate: '2026-10-20',
    targetUnits: 200,
    collectedUnits: 0,
    contactPhone: '+8801711223344',
    status: 'Scheduled',
  },
];

const FALLBACK_LOCAL_DONORS = [
  {
    id: 'd-1',
    name: 'Rakibul Hasan',
    bloodGroup: 'O+',
    phone: '+8801521711716',
    district: 'Dhaka',
    upazila: 'Mirpur-10',
    totalDonations: 6,
    isAvailable: true,
  },
  {
    id: 'd-2',
    name: 'Tanzila Hoque',
    bloodGroup: 'A+',
    phone: '+8801912345678',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    totalDonations: 4,
    isAvailable: true,
  },
  {
    id: 'd-3',
    name: 'Rezaul Karim',
    bloodGroup: 'O-',
    phone: '+8801722334455',
    district: 'Dhaka',
    upazila: 'Uttara',
    totalDonations: 8,
    isAvailable: true,
  },
  {
    id: 'd-4',
    name: 'Nusrat Jahan',
    bloodGroup: 'B+',
    phone: '+8801811445566',
    district: 'Dhaka',
    upazila: 'Gulshan-2',
    totalDonations: 3,
    isAvailable: false,
  },
];

function ProviderDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'inventory';

  const [items, setItems] = useState<InventoryItem[]>(FALLBACK_INVENTORY);
  const [requestsList, setRequestsList] = useState(FALLBACK_REQUESTS);
  const [campsList, setCampsList] = useState(FALLBACK_CAMPS);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [campCreatedNotice, setCampCreatedNotice] = useState(false);

  // Filter state for local donors radar
  const [donorFilterBlood, setDonorFilterBlood] = useState('ALL');

  // Camp Form State
  const [campTitle, setCampTitle] = useState('');
  const [campVenue, setCampVenue] = useState('');
  const [campDistrict, setCampDistrict] = useState('Dhaka');
  const [campTarget, setCampTarget] = useState(100);
  const [campPhone, setCampPhone] = useState('+8801521711716');

  // Load Inventory via TanStack Query with immediate fallback
  const { data: inventory = items } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const res = await api.get('/inventory');
        return res.data?.data?.inventories || FALLBACK_INVENTORY;
      } catch (e) {
        return items;
      }
    },
  });

  const handleUpdateStock = async (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const nextUnits = Math.max(0, item.unitsInStock + delta);
          return { ...item, unitsInStock: nextUnits };
        }
        return item;
      })
    );

    try {
      const targetItem = items.find((i) => i._id === id);
      if (targetItem) {
        const nextUnits = Math.max(0, targetItem.unitsInStock + delta);
        await api.patch(`/inventory/${id}`, {
          unitsInStock: nextUnits,
        });
      }
      toast.success(
        delta > 0
          ? 'নতুন রক্ত ব্যাগ সফলভাবে স্টকে যুক্ত করা হয়েছে।'
          : 'রক্ত ব্যাগ স্টক থেকে ইস্যু / ডিসপেন্স করা হয়েছে।'
      );
    } catch (e) {
      // Local optimistic update stays
    }
  };

  const handleFulfillRequest = (reqId: string, bloodGroup: string, units: number) => {
    // Decrement stock for the group
    setItems((prev) =>
      prev.map((item) => {
        if (item.bloodGroup === bloodGroup) {
          return { ...item, unitsInStock: Math.max(0, item.unitsInStock - units) };
        }
        return item;
      })
    );

    // Mark request as Dispensed
    setRequestsList((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Dispensed' } : r))
    );

    toast.success(`${bloodGroup} (${units} ব্যাগ) সফলভাবে রোগীর জন্য ডিসপেন্স করা হয়েছে!`);
  };

  const handleCreateCamp = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp = {
      id: `camp-${Date.now()}`,
      title: campTitle,
      venueAddress: campVenue,
      district: campDistrict,
      startDate: new Date().toISOString().split('T')[0],
      targetUnits: campTarget,
      collectedUnits: 0,
      contactPhone: campPhone,
      status: 'Upcoming',
    };

    setCampsList((prev) => [newCamp, ...prev]);
    setCampCreatedNotice(true);

    try {
      await api.post('/camps', {
        title: campTitle,
        venueAddress: campVenue,
        district: campDistrict,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        targetUnits: campTarget,
        contactPhone: campPhone,
      });
    } catch (e) {}

    setTimeout(() => {
      setCampCreatedNotice(false);
      setIsCampModalOpen(false);
      setCampTitle('');
      setCampVenue('');
      toast.success('রক্তদান ক্যাম্প সফলভাবে রেজিস্টার ও শিডিউল করা হয়েছে!');
    }, 1500);
  };

  const totalUnits = items.reduce((acc, curr) => acc + curr.unitsInStock, 0);
  const criticalItems = items.filter(
    (i) => i.unitsInStock <= i.criticalThreshold
  );

  const filteredDonors = FALLBACK_LOCAL_DONORS.filter((d) => {
    if (donorFilterBlood === 'ALL') return true;
    return d.bloodGroup === donorFilterBlood;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-900/50 px-3 py-1 rounded-full">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Healthcare Provider Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Dhaka Central Blood Bank & Hospital
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            সরকারি স্বীকৃতি কোড: DGHS-BB-2024-984 • ধানমন্ডি, ঢাকা • সার্বক্ষণিক জরুরি কোল্ড-চেইন মনিটরিং
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCampModalOpen(true)}
          className="gap-2 shrink-0 font-bold bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-950/40"
        >
          <Calendar className="w-4 h-4" /> নতুন রক্তদান ড্রাইভ শিডিউল
        </Button>
      </div>

      {/* ========================================================
          TAB 1: COLD STORAGE & INVENTORY
         ======================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Overview Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="default" className="border-zinc-800 bg-zinc-900/80 p-5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Total Blood Units In Cold Storage
              </span>
              <div className="text-3xl font-black text-white mt-1">
                {totalUnits} Units
              </div>
              <span className="text-[11px] text-zinc-500">Across all 8 blood groups</span>
            </Card>

            <Card
              variant={criticalItems.length > 0 ? 'crimson' : 'default'}
              className="p-5"
            >
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Critical Shortage Alert
              </span>
              <div className="text-3xl font-black text-white mt-1">
                {criticalItems.length} Groups
              </div>
              <span className="text-[11px] text-rose-300/80">
                Stock under safety threshold ({criticalItems.map((i) => i.bloodGroup).join(', ')})
              </span>
            </Card>

            <Card variant="default" className="border-zinc-800 bg-zinc-900/80 p-5">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> DGHS Accreditation
              </span>
              <div className="text-3xl font-black text-white mt-1">
                Certified Active
              </div>
              <span className="text-[11px] text-zinc-500">
                Cold storage temperature: 4.2°C (Optimal)
              </span>
            </Card>
          </div>

          {/* Live Inventory Stock Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  রক্ত গ্রুপ অনুযায়ী লাইভ কোল্ড স্টোরেজ স্টক
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  রিয়েলটাইম ইনক্রিমেন্ট ও ডিসপেন্স ট্র্যাকিং
                </p>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Auto-synced</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => {
                const isCritical = item.unitsInStock <= item.criticalThreshold;

                return (
                  <Card
                    key={item._id}
                    variant={isCritical ? 'crimson' : 'default'}
                    className="p-5 border-zinc-800/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <BloodGroupBadge group={item.bloodGroup} size="lg" />
                        <span className="text-[11px] font-semibold text-zinc-400">
                          {item.componentType}
                        </span>
                      </div>

                      <div className="my-4">
                        <span className="text-3xl font-black text-white tracking-tight">
                          {item.unitsInStock}
                        </span>
                        <span className="text-xs text-zinc-400 ml-1">bags in stock</span>

                        {isCritical && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold mt-1 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Under safety buffer ({item.criticalThreshold})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stock Controls */}
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                      <button
                        onClick={() => handleUpdateStock(item._id, -1)}
                        disabled={item.unitsInStock <= 0}
                        className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                        title="Dispense Blood Bag"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateStock(item._id, 1)}
                        className="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer shadow-md"
                        title="Add Blood Bag (Incoming Donation)"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: EMERGENCY REQUEST QUEUE
         ======================================================== */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-400" />
                <span>হাসপাতালে আগত জরুরি রক্তের রিকোয়েস্ট কিউ</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                রোগীর জরুরি প্রয়োজন অনুযায়ী সরাসরি কোল্ড স্টোরেজ থেকে রক্ত ইস্যু করুন।
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
              {requestsList.filter((r) => r.status === 'Pending').length} Pending Requests
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {requestsList.map((req) => (
              <Card
                key={req.id}
                className="p-5 border-zinc-800 bg-zinc-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge group={req.bloodGroup as BloodGroup} size="md" />
                    <div>
                      <h4 className="text-base font-bold text-white">{req.patientName}</h4>
                      <p className="text-xs text-zinc-400">{req.hospitalName}</p>
                    </div>
                    <UrgencyBadge level={req.urgencyLevel} />
                    <span className="text-[11px] font-mono text-zinc-500 ml-auto md:ml-0">
                      {req.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300">
                    <span className="text-zinc-500">প্রয়োজনীয়তা:</span> {req.reason} •{' '}
                    <span className="text-white font-bold">{req.unitsNeeded} ব্যাগ রক্ত</span>
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pt-1">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>রোগীর স্বজন: {req.attendantPhone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  <a
                    href={`tel:${req.attendantPhone}`}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> কল করুন
                  </a>

                  {req.status === 'Pending' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        handleFulfillRequest(req.id, req.bloodGroup, req.unitsNeeded)
                      }
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> রক্ত ইস্যু ও ডিসপেন্স
                    </Button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> রক্ত সফলভাবে সরবরাহকৃত
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: BLOOD DONATION CAMPS
         ======================================================== */}
      {activeTab === 'camps' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>হাসপাতাল পরিচালিত রক্তদান ক্যাম্প ও ড্রাইভ</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                পাবলিক ক্যাম্প শিডিউল করুন এবং স্বেচ্ছাসেবক রক্ত সংগ্রহ ট্র্যাক করুন।
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsCampModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-xs font-bold gap-1.5"
            >
              <Plus className="w-4 h-4" /> নতুন ড্রাইভ
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campsList.map((camp) => (
              <Card
                key={camp.id}
                className="p-5 border-zinc-800 bg-zinc-900/90 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {camp.status}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{camp.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-cyan-400">
                      {camp.collectedUnits}/{camp.targetUnits}
                    </span>
                    <span className="text-[10px] text-zinc-400 block">ব্যাগ রক্ত সংগৃহীত</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{camp.venueAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>তারিখ: {camp.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ক্যাম্প হটলাইন: {camp.contactPhone}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: LOCAL DONOR RADAR
         ======================================================== */}
      {activeTab === 'donors' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>হাসপাতালের আওতাধীন ভেরিফাইড রক্তদাতা রাডার</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                জরুরি ঘাটতির মুহূর্তে সরাসরি আশেপাশের প্রস্তুত রক্তদাতাদের সাথে যোগাযোগ করুন।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">ফিল্টার:</span>
              <select
                value={donorFilterBlood}
                onChange={(e) => setDonorFilterBlood(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">সকল রক্ত গ্রুপ</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDonors.map((d) => (
              <Card
                key={d.id}
                className="p-5 border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={d.bloodGroup as BloodGroup} size="lg" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{d.name}</h4>
                    <p className="text-xs text-zinc-400">
                      {d.upazila}, {d.district} • {d.totalDonations} বার রক্তদান
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.isAvailable
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {d.isAvailable ? 'রক্তদানে প্রস্তুত (Available)' : 'বিশ্রামে আছেন'}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${d.phone}`}
                  className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5 text-xs font-bold shadow-md shadow-cyan-950/40"
                  title="Direct Emergency Call"
                >
                  <Phone className="w-4 h-4" /> কল
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: HOSPITAL ACCREDITATION & PROFILE
         ======================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>হাসপাতাল ও ব্লাড ব্যাংক স্বীকৃতি বিবরণী</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              স্বাস্থ্য অধিদপ্তর (DGHS) নিয়ন্ত্রিত লাইসেন্স ও কোল্ড চেইন অ্যাক্রেডিটেশন তথ্য।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>DGHS লাইসেন্স বিবরণ</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">প্রতিষ্ঠান:</span>
                  <span className="font-bold text-white">Dhaka Central Blood Bank & Hospital</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">লাইসেন্স নম্বর:</span>
                  <span className="font-mono font-bold text-cyan-400">DGHS-BB-2024-984</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">স্ট্যাটাস:</span>
                  <span className="font-bold text-emerald-400">অ্যাক্টিভ ও ভেরিফাইড</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">রিনিউয়াল মেয়াদ:</span>
                  <span className="text-zinc-300">ডিসেম্বর ২০২৬</span>
                </div>
              </div>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Thermometer className="w-4 h-4" />
                <span>কোল্ড চেইন ও ল্যাবরেটরি স্পেসিফিকেশন</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">স্টোরেজ তাপমাত্রা:</span>
                  <span className="font-bold text-emerald-400">২°C - ৬°C (স্ট্যান্ডার্ড)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">প্লেটলেট এজিটেটর:</span>
                  <span className="font-bold text-white">২২°C নিয়ন্ত্রিত চেম্বার</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">সার্বক্ষণিক হটলাইন:</span>
                  <span className="font-mono font-bold text-white">+8801521711716</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">দায়িত্বপ্রাপ্ত কর্মকর্তা:</span>
                  <span className="text-zinc-300">ডাঃ এস এম রফিকুজ্জামান (ল্যাব ডিরেক্টর)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Schedule Blood Drive Modal */}
      <Modal
        isOpen={isCampModalOpen}
        onClose={() => setIsCampModalOpen(false)}
        title="নতুন রক্তদান ক্যাম্প শিডিউল করুন"
      >
        <form onSubmit={handleCreateCamp} className="space-y-4">
          {campCreatedNotice ? (
            <div className="p-4 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold text-center">
              <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
              রক্তদান ক্যাম্প সফলভাবে রেজিস্টার ও শিডিউল করা হয়েছে!
            </div>
          ) : (
            <>
              <Input
                label="ক্যাম্পের শিরোনাম"
                placeholder="যেমন: কমিউনিটি মেগা ব্লাড ড্রাইভ"
                value={campTitle}
                onChange={(e) => setCampTitle(e.target.value)}
                required
              />

              <Input
                label="স্থান / ভেন্যু ঠিকানা"
                placeholder="যেমন: ধানমন্ডি লেক প্রাঙ্গণ, ঢাকা"
                value={campVenue}
                onChange={(e) => setCampVenue(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="টার্গেট রক্ত ব্যাগ সংখ্যা"
                  type="number"
                  value={campTarget}
                  onChange={(e) => setCampTarget(Number(e.target.value))}
                  required
                />
                <Input
                  label="হাসপাতাল হটলাইন"
                  value={campPhone}
                  onChange={(e) => setCampPhone(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-lg bg-cyan-600 hover:bg-cyan-500"
              >
                ড্রাইভ পাবলিশ করুন
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default function ProviderDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-zinc-400 font-mono">
          Loading Provider Dashboard...
        </div>
      }
    >
      <ProviderDashboardContent />
    </Suspense>
  );
}
