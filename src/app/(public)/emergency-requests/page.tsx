'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BloodRequest, BloodGroup, UrgencyLevel, RequestStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { EmergencyFilterBar } from '@/components/emergency/EmergencyFilterBar';
import { EmergencyRequestCard } from '@/components/emergency/EmergencyRequestCard';
import { CreateEmergencyModal, RequestFormValues } from '@/components/emergency/CreateEmergencyModal';
import { AlertTriangle, Droplet } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';
import { emergencyTranslations } from '@/lib/translations';
import {
  SmartPagination,
  getSmartInitialCount,
} from '@/components/shared/SmartPagination';
import { ScrollReveal } from '@/components/shared/ScrollReveal';


const FALLBACK_REQUESTS: BloodRequest[] = [
  {
    _id: '671000000000000000000001',
    requesterName: 'Tanvir Hossain',
    patientName: 'Kazi Farhana',
    bloodGroup: 'O+',
    unitsNeeded: 2,
    urgencyLevel: 'Critical',
    hospitalName: 'Dhaka Medical College Hospital',
    hospitalAddress: 'Secretariat Road, Ramna, Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    reason: 'Emergency ICU surgery following severe blood loss.',
    contactNumber: '+8801521711716',
    requiredDate: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    status: 'In Progress',
    matchedDonorsCount: 3,
    assignedDonors: ['Tanvir Hossain'],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: '671000000000000000000002',
    requesterName: 'Nusrat Jahan',
    patientName: 'Shabbir Rahman',
    bloodGroup: 'B+',
    unitsNeeded: 1,
    urgencyLevel: 'Urgent',
    hospitalName: 'National Heart Foundation',
    hospitalAddress: 'Plot-4, Section-2, Mirpur, Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    reason: 'Open bypass surgery scheduled for tomorrow morning.',
    contactNumber: '+8801521711716',
    requiredDate: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    status: 'Pending',
    matchedDonorsCount: 2,
    assignedDonors: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: '671000000000000000000003',
    requesterName: 'Dr. Rafiqul Islam',
    patientName: 'Ayesha Siddiqua',
    bloodGroup: 'O-',
    unitsNeeded: 3,
    urgencyLevel: 'Critical',
    hospitalName: 'Rajshahi Medical College Hospital',
    hospitalAddress: 'Laxmipur, Rajshahi',
    district: 'Rajshahi',
    division: 'Rajshahi',
    reason: 'Acute Thalassemia crisis. Rare negative blood group needed immediately.',
    contactNumber: '+8801521711716',
    requiredDate: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    status: 'Pending',
    matchedDonorsCount: 1,
    assignedDonors: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: '671000000000000000000004',
    requesterName: 'Farhad Ahmed',
    patientName: 'Arman Hossain',
    bloodGroup: 'A+',
    unitsNeeded: 1,
    urgencyLevel: 'Standard',
    hospitalName: 'Chattogram Medical College Hospital',
    hospitalAddress: '57 K.B. Fazlul Kader Rd, Chattogram',
    district: 'Chattogram',
    division: 'Chattogram',
    reason: 'Elective orthopedic surgery planned for this weekend.',
    contactNumber: '+8801521711716',
    requiredDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    status: 'Fulfilled',
    matchedDonorsCount: 4,
    assignedDonors: ['Fahim Morshed'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export default function EmergencyRequestsPage() {
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();
  const { addNotification } = useNotificationStore();
  const { user, isAuthenticated } = useAuthStore();
  const t = emergencyTranslations[language];
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Requests
  const { data: requests = FALLBACK_REQUESTS, isLoading } = useQuery({
    queryKey: ['requests', selectedBloodGroup, selectedUrgency, selectedStatus],
    queryFn: async () => {
      try {
        const params: Record<string, string> = {};
        if (selectedBloodGroup !== 'ALL') params.bloodGroup = selectedBloodGroup;
        if (selectedUrgency !== 'ALL') params.urgencyLevel = selectedUrgency;
        if (selectedStatus !== 'ALL') params.status = selectedStatus;

        const res = await api.get('/requests', { params });
        return res.data.data.requests as BloodRequest[];
      } catch (err) {
        return FALLBACK_REQUESTS;
      }
    },
    initialData: FALLBACK_REQUESTS,
  });

  // Create Request Mutation
  const createMutation = useMutation({
    mutationFn: async (values: RequestFormValues) => {
      const res = await api.post('/requests', values);
      return res.data.data.request;
    },
    onSuccess: (newReq) => {
      queryClient.setQueryData(
        ['requests', selectedBloodGroup, selectedUrgency, selectedStatus],
        (old: BloodRequest[] = []) => [newReq, ...old]
      );
      addNotification({
        title:
          language === 'bn'
            ? '🚨 রক্তের আবেদন সফলভাবে সম্প্রচারিত!'
            : '🚨 Blood Request Broadcasted Successfully!',
        body:
          language === 'bn'
            ? `${newReq.patientName}-এর জন্য ${newReq.unitsNeeded} ইউনিট ${newReq.bloodGroup} রক্তের জরুরি আবেদন সফলভাবে সিস্টেমজুড়ে পাঠানো হয়েছে।`
            : `Emergency request for ${newReq.unitsNeeded} units of ${newReq.bloodGroup} for ${newReq.patientName} has been broadcasted.`,
        type: 'success',
        requestId: newReq._id,
      });
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: () => {
      setIsModalOpen(false);
    },
  });

  // Respond / Pledge Mutation (requires authentication)
  const respondMutation = useMutation({
    mutationFn: async (req: BloodRequest) => {
      if (!isAuthenticated || !user) {
        throw new Error('Please log in to pledge for blood donation.');
      }
      const donorIdentifier = user.name || user.email || 'Life Saver Donor';
      const res = await api.patch(`/requests/${req._id}/status`, {
        status: 'In Progress',
        donorName: donorIdentifier,
        action: 'pledge',
      });
      return res.data.data.request;
    },
    onSuccess: (updatedReq) => {
      queryClient.setQueryData(
        ['requests', selectedBloodGroup, selectedUrgency, selectedStatus],
        (old: BloodRequest[] = []) =>
          old.map((r) => (r._id === updatedReq._id ? updatedReq : r))
      );
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  // Cancel Pledge Mutation (requires authentication)
  const cancelPledgeMutation = useMutation({
    mutationFn: async (req: BloodRequest) => {
      if (!isAuthenticated || !user) {
        throw new Error('Please log in to manage your donation pledge.');
      }
      const donorIdentifier = user.name || user.email || 'Life Saver Donor';
      const res = await api.patch(`/requests/${req._id}/status`, {
        donorName: donorIdentifier,
        action: 'cancel',
      });
      return res.data.data.request;
    },
    onSuccess: (updatedReq) => {
      queryClient.setQueryData(
        ['requests', selectedBloodGroup, selectedUrgency, selectedStatus],
        (old: BloodRequest[] = []) =>
          old.map((r) => (r._id === updatedReq._id ? updatedReq : r))
      );
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  // Filter requests locally if fallback is active
  const filteredRequests = requests.filter((r) => {
    if (selectedBloodGroup !== 'ALL' && r.bloodGroup !== selectedBloodGroup) return false;
    if (selectedUrgency !== 'ALL' && r.urgencyLevel !== selectedUrgency) return false;
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    return true;
  });

  const [visibleCount, setVisibleCount] = useState<number>(3);

  // Synchronize visible count with smart 3-grid calculation on filter/data change
  useEffect(() => {
    setVisibleCount(getSmartInitialCount(filteredRequests.length));
  }, [selectedBloodGroup, selectedUrgency, selectedStatus, filteredRequests.length]);

  const initialCount = getSmartInitialCount(filteredRequests.length);
  const visibleRequests = filteredRequests.slice(0, visibleCount);

  return (
    <div className="min-h-screen py-8 sm:py-10">
      <div className="w-full max-w-[96%] sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] mx-auto px-2 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl">
              {t.desc}
            </p>
          </div>
        </div>

        {/* Filter Bar Component */}
        <EmergencyFilterBar
          selectedBloodGroup={selectedBloodGroup}
          onBloodGroupChange={setSelectedBloodGroup}
          selectedUrgency={selectedUrgency}
          onUrgencyChange={setSelectedUrgency}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onOpenCreateModal={() => setIsModalOpen(true)}
          totalRequests={filteredRequests.length}
        />

        {/* Requests Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 border-zinc-800 bg-zinc-900/50 animate-pulse space-y-4">
                <div className="h-6 bg-zinc-800 rounded w-1/3" />
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
                <div className="h-10 bg-zinc-800 rounded" />
              </Card>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-zinc-800 bg-zinc-900/30 space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800/80 text-zinc-500 mx-auto flex items-center justify-center">
              <Droplet className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{t.noRequestsTitle}</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                {t.noRequestsDesc}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {visibleRequests.map((req, index) => (
                <ScrollReveal
                  key={req._id}
                  animation="fade-up"
                  delay={Math.min((index % 6) * 90, 450)}
                  duration={700}
                  className="h-full flex flex-col"
                >
                  <div className="h-full w-full flex flex-col flex-1 revealed-card-hover">
                    <EmergencyRequestCard
                      request={req}
                      onRespond={async (r) => {
                        await respondMutation.mutateAsync(r);
                      }}
                      onCancelPledge={async (r) => {
                        await cancelPledgeMutation.mutateAsync(r);
                      }}
                      isResponding={
                        respondMutation.isPending || cancelPledgeMutation.isPending
                      }
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Smart Progressive Load & View More Pagination */}
            <SmartPagination
              totalItems={filteredRequests.length}
              visibleCount={visibleCount}
              initialCount={initialCount}
              onViewMore={() =>
                setVisibleCount((prev) => {
                  const remaining = filteredRequests.length - prev;
                  if (remaining <= 3) return filteredRequests.length;
                  return prev + 3;
                })
              }
              onShowLess={() => setVisibleCount(initialCount)}
              onViewAll={() => setVisibleCount(filteredRequests.length)}
              itemNameBn="টি জরুরি আবেদন"
              itemNameEn="emergency requests"
            />
          </div>
        )}

        {/* Create Request Modal Component */}
        <CreateEmergencyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(values) => createMutation.mutate(values)}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}
