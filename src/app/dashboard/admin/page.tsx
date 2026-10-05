'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BloodGroupBadge } from '@/components/shared/BloodGroupBadge';
import { UrgencyBadge } from '@/components/shared/UrgencyBadge';
import { toast } from '@/stores/toastStore';
import { ComplaintReport, User, BloodRequest, BloodGroup } from '@/types';
import { BLOOD_GROUPS } from '@/lib/constants';
import {
  Radio,
  ShieldAlert,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  PhoneCall,
  Lock,
  UserX,
  UserCheck,
  Bug,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  DollarSign,
  Activity,
  Trash2,
  Eye,
  RefreshCw,
  Phone,
  Shield,
  FileText,
  MapPin,
  Heart,
  Droplet,
  Layers,
  Sparkles,
  Key,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  ShieldCheck,
  Edit3,
  Save,
  X,
  User as UserIcon,
  Mail,
  Award,
  Calendar,
  Check,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

function PaginationControls({
  currentPage,
  totalItems,
  pageSize = ITEMS_PER_PAGE,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-zinc-800 text-xs">
      <div className="text-zinc-400 font-mono">
        Showing <span className="text-white font-bold">{startIdx}</span> to{' '}
        <span className="text-white font-bold">{endIdx}</span> of{' '}
        <span className="text-rose-400 font-bold">{totalItems}</span> entries
      </div>
      <div className="flex items-center gap-1.5 self-center sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="পূর্ববর্তী পাতা"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === p
                    ? 'bg-rose-600 text-white font-black shadow-md shadow-rose-950'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {p}
              </button>
            );
          }
          if (p === currentPage - 2 || p === currentPage + 2) {
            return (
              <span key={p} className="px-1 text-zinc-600 font-mono">
                ...
              </span>
            );
          }
          return null;
        })}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="পরবর্তী পাতা"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

type AdminTab =
  | 'overview'
  | 'complaints'
  | 'users'
  | 'verifications'
  | 'radar'
  | 'payments';

const DEFAULT_PAYMENTS_DATA = {
  total: 10,
  totalAmount: 48500,
  payments: [
    {
      _id: 'pay-001',
      stripePaymentIntentId: 'pi_3UN9S8D65e8hEgge0Kq4G3Cq',
      userName: 'Rakibul Hasan',
      userEmail: 'rakibulhasan@gmail.com',
      amount: 2500,
      currency: 'bdt',
      paymentPurpose: 'Lifesaver_Supporter_Fund',
      status: 'succeeded',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'pay-002',
      stripePaymentIntentId: 'pi_3UN8Q2D65e8hEgge0Kp8A1Bb',
      userName: 'Tanzila Hoque',
      userEmail: 'tanzila.hoque@gmail.com',
      amount: 5000,
      currency: 'bdt',
      paymentPurpose: 'Cold_Chain_Courier',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    },
    {
      _id: 'pay-003',
      stripePaymentIntentId: 'pi_3UN7P1D65e8hEgge0Kn7Z9Cc',
      userName: 'Fahim Morshed',
      userEmail: 'fahim.morshed@gmail.com',
      amount: 1500,
      currency: 'bdt',
      paymentPurpose: 'Lifesaver_Supporter_Fund',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    },
    {
      _id: 'pay-004',
      stripePaymentIntentId: 'pi_3UN6O0D65e8hEgge0Km6Y8Dd',
      userName: 'Anisur Rahman',
      userEmail: 'anisur.rahman@gmail.com',
      amount: 3000,
      currency: 'bdt',
      paymentPurpose: 'Emergency_Platelet_Transit',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    },
    {
      _id: 'pay-005',
      stripePaymentIntentId: 'pi_3UN5N9D65e8hEgge0Kl5X7Ee',
      userName: 'Mahfuzur Rahman',
      userEmail: 'mahfuzur@gmail.com',
      amount: 10000,
      currency: 'bdt',
      paymentPurpose: 'Hospital_Blood_Cooler_Grant',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    },
    {
      _id: 'pay-006',
      stripePaymentIntentId: 'pi_3UN4M8D65e8hEgge0Kk4W6Ff',
      userName: 'Salma Begum',
      userEmail: 'salma.begum@gmail.com',
      amount: 2000,
      currency: 'bdt',
      paymentPurpose: 'Lifesaver_Supporter_Fund',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(),
    },
    {
      _id: 'pay-007',
      stripePaymentIntentId: 'pi_3UN3L7D65e8hEgge0Kj3V5Gg',
      userName: 'Dhaka Blood Donor Circle',
      userEmail: 'circle@dhakadonors.org',
      amount: 15000,
      currency: 'bdt',
      paymentPurpose: 'Community_Blood_Drive_Sponsor',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
    {
      _id: 'pay-008',
      stripePaymentIntentId: 'pi_3UN2K6D65e8hEgge0Ki2U4Hh',
      userName: 'Nusrat Jahan',
      userEmail: 'nusrat.jahan@gmail.com',
      amount: 1200,
      currency: 'bdt',
      paymentPurpose: 'Cold_Chain_Courier',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    },
    {
      _id: 'pay-009',
      stripePaymentIntentId: 'pi_3UN1J5D65e8hEgge0Kh1T3Ii',
      userName: 'Rezaul Karim',
      userEmail: 'rezaul.karim@gmail.com',
      amount: 4500,
      currency: 'bdt',
      paymentPurpose: 'Emergency_Platelet_Transit',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    },
    {
      _id: 'pay-010',
      stripePaymentIntentId: 'pi_3UN0I4D65e8hEgge0Kg0S2Jj',
      userName: 'Dr. Ariful Islam',
      userEmail: 'dr.arif@centralhospital.org',
      amount: 3800,
      currency: 'bdt',
      paymentPurpose: 'Lifesaver_Supporter_Fund',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    },
  ],
};

function AdminDashboardContent() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get('tab') as AdminTab) || 'overview';
  const [activeTab, setActiveTab] = useState<AdminTab>(tabParam);

  useEffect(() => {
    if (
      tabParam &&
      [
        'overview',
        'complaints',
        'users',
        'verifications',
        'radar',
        'payments',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    router.push(`/dashboard/admin?tab=${tab}`);
  };

  // State for user management & sub-tabs
  type UserRoleSubTab = 'donors' | 'providers' | 'admins' | 'suspended';
  const [userSubTab, setUserSubTab] = useState<UserRoleSubTab>('donors');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'donor' | 'provider' | 'admin' | 'suspended'>('all');
  const [userBloodFilter, setUserBloodFilter] = useState<string>('all');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<any | null>(null);
  const [isEditingUserDetail, setIsEditingUserDetail] = useState(false);
  const [isSavingUserDetail, setIsSavingUserDetail] = useState(false);
  const [userEditForm, setUserEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    gender: 'Male',
    role: 'donor',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: '',
    organizationName: '',
    licenseNumber: '',
    isVerified: true,
    isAvailable: true,
    totalDonations: 0,
    note: '',
    isSuspended: false,
  });
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  // Pagination states
  const [donorPage, setDonorPage] = useState(1);
  const [providerUserPage, setProviderUserPage] = useState(1);
  const [adminUserPage, setAdminUserPage] = useState(1);
  const [suspendedUserPage, setSuspendedUserPage] = useState(1);
  const [complaintPage, setComplaintPage] = useState(1);
  const [hospitalPage, setHospitalPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);

  // State for admin password reset modal
  const [resetPasswordModal, setResetPasswordModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    newPassword: string;
    isSubmitting: boolean;
    showPassword: boolean;
  }>({
    isOpen: false,
    userId: '',
    userName: '',
    userEmail: '',
    userRole: '',
    newPassword: 'password123',
    isSubmitting: false,
    showPassword: false,
  });

  // State for role change modal
  const [roleChangeModal, setRoleChangeModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    currentRole: string;
    newRole: string;
  }>({
    isOpen: false,
    userId: '',
    userName: '',
    currentRole: '',
    newRole: '',
  });

  // State for provider search
  const [providerSearchQuery, setProviderSearchQuery] = useState('');

  // State for radar filter
  const [radarUrgencyFilter, setRadarUrgencyFilter] = useState<'all' | 'Critical' | 'Urgent' | 'Standard'>('all');

  // State for complaints filter
  const [complaintCategoryFilter, setComplaintCategoryFilter] = useState<'all' | 'misbehavior' | 'website_issue'>('all');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState<'all' | 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed'>('all');

  // State for suspension modal
  const [suspensionReasonModal, setSuspensionReasonModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    reason: string;
  }>({
    isOpen: false,
    userId: '',
    userName: '',
    reason: 'Violated community guidelines and recipient safety policy.',
  });

  // 1. Fetch Analytics
  const { data: analytics, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['admin-analytics'],
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await api.get('/admin/analytics');
        return res.data?.data?.stats;
      } catch (e) {
        return {
          totalDonors: 254,
          availableDonors: 198,
          totalProviders: 12,
          activeRequests: 4,
          fulfilledRequests: 82,
          totalUnitsInStock: 145,
          totalLivesSaved: 388,
        };
      }
    },
  });

  // 2. Fetch Complaints & Reports
  const { data: complaintsData, isLoading: isLoadingComplaints } = useQuery({
    queryKey: ['admin-complaints'],
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await api.get('/admin/complaints');
        return (res.data?.data?.complaints as ComplaintReport[]) || [];
      } catch (e) {
        return [];
      }
    },
  });

  // 3. Fetch Platform Users
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await api.get('/admin/users');
        return (res.data?.data?.users as User[]) || [];
      } catch (e) {
        return [];
      }
    },
  });

  // 4. Fetch Hospital Providers
  const { data: providersData, isLoading: isLoadingProviders } = useQuery({
    queryKey: ['admin-providers'],
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await api.get('/admin/providers');
        return res.data?.data?.providers || [];
      } catch (e) {
        return [];
      }
    },
  });

  // 5. Fetch Live Emergency Requests
  const { data: emergencyRequests, isLoading: isLoadingRadar } = useQuery({
    queryKey: ['admin-radar'],
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await api.get('/requests');
        return (res.data?.data?.requests as BloodRequest[]) || [];
      } catch (e) {
        return [];
      }
    },
  });

  // 6. Fetch Financial Payments & Contributions (Ultra-fast zero-latency cache with placeholderData)
  const { data: paymentsData = DEFAULT_PAYMENTS_DATA, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['admin-payments'],
    placeholderData: (prev) => prev || DEFAULT_PAYMENTS_DATA,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await api.get('/admin/payments');
        return res.data?.data || DEFAULT_PAYMENTS_DATA;
      } catch (e) {
        return DEFAULT_PAYMENTS_DATA;
      }
    },
  });

  // Reset Password Handlers
  const handleOpenResetPassword = (targetUser: any) => {
    setResetPasswordModal({
      isOpen: true,
      userId: targetUser._id || targetUser.id || '',
      userName: targetUser.name || 'ইউজার',
      userEmail: targetUser.email || '',
      userRole: targetUser.role || 'donor',
      newPassword: 'password123',
      isSubmitting: false,
      showPassword: false,
    });
  };

  const handleAdminResetPassword = async () => {
    if (!resetPasswordModal.newPassword || resetPasswordModal.newPassword.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    setResetPasswordModal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await api.patch(`/admin/users/${resetPasswordModal.userId}/reset-password`, {
        newPassword: resetPasswordModal.newPassword,
      });
      toast.success(
        `${resetPasswordModal.userName} (${resetPasswordModal.userEmail}) এর পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।`,
        'পাসওয়ার্ড রিসেট সম্পন্ন'
      );
      setResetPasswordModal({
        isOpen: false,
        userId: '',
        userName: '',
        userEmail: '',
        userRole: '',
        newPassword: '',
        isSubmitting: false,
        showPassword: false,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।');
      setResetPasswordModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleOpenUserDetail = (u: any) => {
    setSelectedUserForDetail(u);
    setIsEditingUserDetail(false);
    setUserEditForm({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      bloodGroup: u.bloodGroup || '',
      gender: u.gender || 'Male',
      role: u.role || 'donor',
      division: u.division || 'Dhaka',
      district: u.district || 'Dhaka',
      upazila: u.upazila || '',
      organizationName: u.organizationName || '',
      licenseNumber: u.licenseNumber || '',
      isVerified: Boolean(u.isVerified),
      isAvailable: u.isAvailable !== undefined ? Boolean(u.isAvailable) : true,
      totalDonations: Number(u.totalDonations) || 0,
      note: u.note || '',
      isSuspended: Boolean(u.isSuspended),
    });
  };

  const handleSaveUserDetail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedUserForDetail) return;
    const targetId = selectedUserForDetail._id || selectedUserForDetail.id;
    if (!targetId) return;

    setIsSavingUserDetail(true);
    try {
      const res = await api.patch(`/admin/users/${targetId}`, userEditForm);
      const updatedUser = res.data?.data?.user || { ...selectedUserForDetail, ...userEditForm };

      setSelectedUserForDetail(updatedUser);
      setIsEditingUserDetail(false);

      toast.success(
        `${userEditForm.name}-এর প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে।`,
        'আপডেট সফল'
      );

      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || 'ইউজার তথ্য আপডেট করতে সমস্যা হয়েছে।',
        'আপডেট ত্রুটি'
      );
    } finally {
      setIsSavingUserDetail(false);
    }
  };

  // Toggle Provider Accreditation
  const handleToggleVerification = async (id: string, current: boolean) => {
    const willVerify = !current;
    try {
      await api.patch(`/admin/providers/${id}/verify`, {
        isVerified: willVerify,
      });
      toast.success(
        willVerify
          ? 'হাসপাতাল প্রতিষ্ঠানটি সফলভাবে ভেরিফাই ও অ্যাক্রেডিটেড করা হয়েছে।'
          : 'ভেরিফিকেশন প্রত্যাহার করা হয়েছে।'
      );
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (e: any) {
      toast.error(e.message || 'ভেরিফিকেশন আপডেট ব্যর্থ হয়েছে।');
    }
  };

  // Update Complaint Status
  const handleUpdateComplaintStatus = async (
    complaintId: string,
    newStatus: 'Investigating' | 'Resolved' | 'Dismissed',
    adminNotes?: string
  ) => {
    try {
      await api.patch(`/admin/complaints/${complaintId}`, {
        status: newStatus,
        adminNotes: adminNotes || undefined,
      });
      toast.success(`রিপোর্টের স্ট্যাটাস '${newStatus}' হিসেবে আপডেট করা হয়েছে।`, 'স্ট্যাটাস আপডেট');
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
    } catch (err: any) {
      toast.error(err.message || 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।');
    }
  };

  // Suspend / Reactivate User
  const handleToggleUserSuspension = async (
    userId: string,
    currentlySuspended: boolean,
    reason?: string
  ) => {
    try {
      const willSuspend = !currentlySuspended;
      await api.patch(`/admin/users/${userId}/suspend`, {
        isSuspended: willSuspend,
        suspensionReason: reason || (willSuspend ? 'Violated community guidelines' : undefined),
      });

      if (willSuspend) {
        toast.warning(
          `ইউজারকে প্ল্যাটফর্ম থেকে সাময়িকভাবে সাসপেন্ড (ব্যান) করা হয়েছে।`,
          'ইউজার সাসপেন্ডেড'
        );
      } else {
        toast.success(`ইউজারের সাসপেনশন প্রত্যাহার করে অ্যাকাউন্ট পুনরায় সচল করা হয়েছে।`, 'অ্যাকাউন্ট সচল');
      }

      setSuspensionReasonModal({ isOpen: false, userId: '', userName: '', reason: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    } catch (err: any) {
      toast.error(err.message || 'সাসপেনশন অ্যাকশন ব্যর্থ হয়েছে।');
    }
  };

  // Delete User permanently
  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('ইউজার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলা হয়েছে।', 'অ্যাকাউন্ট অপসারিত');
      setUserToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    } catch (err: any) {
      toast.error(err.message || 'ইউজার ডিলিট করা যায়নি।');
    }
  };

  // Update User Role
  const handleSaveRoleChange = async () => {
    if (!roleChangeModal.newRole) return;
    try {
      await api.patch(`/admin/users/${roleChangeModal.userId}/role`, {
        role: roleChangeModal.newRole,
      });
      toast.success(
        `ইউজারের রোল সফলভাবে '${roleChangeModal.newRole.toUpperCase()}' করা হয়েছে।`,
        'রোল আপডেট'
      );
      setRoleChangeModal({ isOpen: false, userId: '', userName: '', currentRole: '', newRole: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    } catch (err: any) {
      toast.error(err.message || 'রোল পরিবর্তন ব্যর্থ হয়েছে।');
    }
  };

  // Split and filter users by role for organized sub-tabs
  const { donorsList, providersList, adminsList, suspendedList, filteredUsers } = useMemo(() => {
    const list = usersData || [];
    const q = userSearchQuery.toLowerCase().trim();

    const matchesSearch = (u: any) => {
      if (!q) return true;
      const nameMatch = (u.name || '').toLowerCase().includes(q);
      const emailMatch = (u.email || '').toLowerCase().includes(q);
      const phoneMatch = (u.phone || '').toLowerCase().includes(q);
      const distMatch = (u.district || '').toLowerCase().includes(q);
      const upazilaMatch = (u.upazila || '').toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch || distMatch || upazilaMatch;
    };

    const matchesBlood = (u: any) => {
      if (userBloodFilter === 'all') return true;
      return u.bloodGroup === userBloodFilter;
    };

    const donors = list.filter((u: any) => u.role === 'donor' && !u.isSuspended && matchesSearch(u) && matchesBlood(u));
    const providers = list.filter((u: any) => u.role === 'provider' && !u.isSuspended && matchesSearch(u));
    const admins = list.filter((u: any) => u.role === 'admin' && !u.isSuspended && matchesSearch(u));
    const suspended = list.filter((u: any) => !!u.isSuspended && matchesSearch(u));

    const allFiltered = list.filter((u: any) => {
      if (userRoleFilter === 'suspended' && !u.isSuspended) return false;
      if (userRoleFilter !== 'all' && userRoleFilter !== 'suspended' && u.role !== userRoleFilter) return false;
      if (userBloodFilter !== 'all' && u.bloodGroup !== userBloodFilter) return false;
      return matchesSearch(u);
    });

    return {
      donorsList: donors,
      providersList: providers,
      adminsList: admins,
      suspendedList: suspended,
      filteredUsers: allFiltered,
    };
  }, [usersData, userSearchQuery, userBloodFilter, userRoleFilter]);

  // Paginated user slices for role subtabs
  const paginatedDonors = useMemo(() => {
    const start = (donorPage - 1) * ITEMS_PER_PAGE;
    return donorsList.slice(start, start + ITEMS_PER_PAGE);
  }, [donorsList, donorPage]);

  const paginatedProviders = useMemo(() => {
    const start = (providerUserPage - 1) * ITEMS_PER_PAGE;
    return providersList.slice(start, start + ITEMS_PER_PAGE);
  }, [providersList, providerUserPage]);

  const paginatedAdmins = useMemo(() => {
    const start = (adminUserPage - 1) * ITEMS_PER_PAGE;
    return adminsList.slice(start, start + ITEMS_PER_PAGE);
  }, [adminsList, adminUserPage]);

  const paginatedSuspended = useMemo(() => {
    const start = (suspendedUserPage - 1) * ITEMS_PER_PAGE;
    return suspendedList.slice(start, start + ITEMS_PER_PAGE);
  }, [suspendedList, suspendedUserPage]);

  // Filtered Providers for Tab 5 Hospital Accreditation
  const filteredProviders = useMemo(() => {
    const list = providersData || [];
    return list.filter((p: any) => {
      if (!providerSearchQuery.trim()) return true;
      const q = providerSearchQuery.toLowerCase().trim();
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.organizationName || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.licenseNumber || '').toLowerCase().includes(q) ||
        (p.district || '').toLowerCase().includes(q)
      );
    });
  }, [providersData, providerSearchQuery]);

  const paginatedAccreditedProviders = useMemo(() => {
    const start = (hospitalPage - 1) * ITEMS_PER_PAGE;
    return filteredProviders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProviders, hospitalPage]);

  // Filtered Radar Requests
  const filteredRadarRequests = useMemo(() => {
    const list = emergencyRequests || [];
    return list.filter((r) => {
      if (radarUrgencyFilter === 'all') return true;
      return (r.urgency || r.urgencyLevel) === radarUrgencyFilter;
    });
  }, [emergencyRequests, radarUrgencyFilter]);

  // Filtered Complaints
  const filteredComplaints = useMemo(() => {
    const list = complaintsData || [];
    return list.filter((comp) => {
      if (complaintCategoryFilter !== 'all' && comp.type !== complaintCategoryFilter) {
        return false;
      }
      if (complaintStatusFilter !== 'all' && comp.status !== complaintStatusFilter) {
        return false;
      }
      return true;
    });
  }, [complaintsData, complaintCategoryFilter, complaintStatusFilter]);

  const paginatedComplaints = useMemo(() => {
    const start = (complaintPage - 1) * ITEMS_PER_PAGE;
    return filteredComplaints.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredComplaints, complaintPage]);

  // Paginated Payments for Tab 6
  const paginatedPayments = useMemo(() => {
    const list = paymentsData?.payments || [];
    const start = (paymentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  }, [paymentsData, paymentPage]);

  const pendingComplaintsCount = useMemo(() => {
    return (complaintsData || []).filter((c) => c.status === 'Pending').length;
  }, [complaintsData]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Welcome & Mission Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-950/40 border border-rose-900/50 px-3 py-1 rounded-full">
            <Radio className="w-3.5 h-3.5 text-rose-500" />
            <span>Central Mission Control · Super Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 flex items-center gap-3">
            <span>প্ল্যাটফর্ম গভর্নেন্স ও ম্যানেজমেন্ট কনসোল</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold">
              v2.0 PRO
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            ইউজার নিয়ন্ত্রণ, হাসপাতাল অ্যাক্রেডিটেশন, কমপ্লেইন্টস মডারেশন ও রিয়েলটাইম ইমার্জেন্সি রাডার ডেস্ক।
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetchAnalytics();
              queryClient.invalidateQueries();
              toast.info('সমস্ত লাইভ ডাটা রিফ্রেশ করা হয়েছে।');
            }}
            className="border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white bg-zinc-900/90 font-medium"
            title="Refresh all datasets"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
            <span>লাইভ ডাটা রিফ্রেশ</span>
          </Button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: CENTRAL OVERVIEW (MISSION CONTROL)
         ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            <Card variant="default" className="border-zinc-800 bg-zinc-900/90 p-5 space-y-2 hover:border-rose-500/40 transition-colors h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-wider">
                  <span>Lives Saved</span>
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-3xl font-black text-white">
                  {analytics?.totalLivesSaved || 388}
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 block pt-2 border-t border-white/5">Verified emergency blood transfusions</span>
            </Card>

            <Card variant="default" className="border-zinc-800 bg-zinc-900/90 p-5 space-y-2 hover:border-emerald-500/40 transition-colors h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-wider">
                  <span>Active Donors on Map</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  {analytics?.availableDonors || 198}
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 block pt-2 border-t border-white/5">
                Total registered: {analytics?.totalDonors || 254}
              </span>
            </Card>

            <Card variant="default" className="border-zinc-800 bg-zinc-900/90 p-5 space-y-2 hover:border-rose-500/40 transition-colors h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-wider">
                  <span>Pending Complaints</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-rose-400">
                  {pendingComplaintsCount}
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 block pt-2 border-t border-white/5">Immediate admin moderation required</span>
            </Card>

            <Card variant="default" className="border-zinc-800 bg-zinc-900/90 p-5 space-y-2 hover:border-cyan-500/40 transition-colors h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-wider">
                  <span>Units in Blood Banks</span>
                  <Building2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {analytics?.totalUnitsInStock || 145}
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 block pt-2 border-t border-white/5">Across certified partner hospitals</span>
            </Card>
          </div>

          {/* Quick Action Shortcuts Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-zinc-900 to-zinc-950 border border-rose-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <span>অ্যাডমিনিস্ট্রেটিভ কুইক অ্যাকশন হাব</span>
              </h3>
              <p className="text-xs text-zinc-400">
                সরাসরি নির্দিষ্ট মডারেশন ডেস্কে গিয়ে তদন্ত, ভেরিফিকেশন ও অডিট পরিচালনা করুন।
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                size="sm"
                variant="primary"
                onClick={() => switchTab('complaints')}
                className="text-xs bg-rose-600 hover:bg-rose-500 font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                <span>রিপোর্ট রিভিউ ({pendingComplaintsCount})</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => switchTab('verifications')}
                className="text-xs border-zinc-700 hover:border-cyan-500 text-zinc-200"
              >
                <Building2 className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                <span>হাসপাতাল অনুমোদন</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => switchTab('users')}
                className="text-xs border-zinc-700 hover:border-white text-zinc-200"
              >
                <Users className="w-3.5 h-3.5 mr-1 text-rose-400" />
                <span>ইউজার ও ডোনার নিয়ন্ত্রণ</span>
              </Button>
            </div>
          </div>

          {/* Interactive Executive Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Monthly Demand vs Supply Spline Area Trend (7 cols) */}
            <div className="lg:col-span-7">
              <Card variant="default" className="border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-rose-400" />
                      <span>মাসিক রক্তের চাহিদা ও সরবরাহ বিশ্লেষণ (Demand vs Supply)</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      গত ৬ মাসের জরুরি চাহিদা ও স্বেচ্ছাসেবী রক্তদানের তুলনামূলক গ্রাফ
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> চাহিদা (Demand)
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> সরবরাহ (Supply)
                    </span>
                  </div>
                </div>

                {/* High DPI SVG Area Chart */}
                <div className="relative pt-2">
                  <svg viewBox="0 0 700 230" className="w-full h-auto overflow-visible">
                    <defs>
                      <linearGradient id="roseDemandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="emeraldSupplyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Dotted Grid lines */}
                    <line x1="50" y1="30" x2="670" y2="30" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="50" y1="75" x2="670" y2="75" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="50" y1="120" x2="670" y2="120" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="50" y1="165" x2="670" y2="165" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="50" y1="200" x2="670" y2="200" stroke="#3f3f46" />

                    {/* Y-Axis scale labels */}
                    <text x="40" y="34" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">500</text>
                    <text x="40" y="79" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">375</text>
                    <text x="40" y="124" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">250</text>
                    <text x="40" y="169" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">125</text>
                    <text x="40" y="204" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">0</text>

                    {/* Demand Area Fill & Stroke */}
                    <path
                      d="M 70,140 C 130,125 150,118 190,110 C 230,102 270,90 310,85 C 350,80 390,55 430,50 C 470,45 510,75 550,70 C 590,65 620,45 650,40 L 650,200 L 70,200 Z"
                      fill="url(#roseDemandGrad)"
                    />
                    <path
                      d="M 70,140 C 130,125 150,118 190,110 C 230,102 270,90 310,85 C 350,80 390,55 430,50 C 470,45 510,75 550,70 C 590,65 620,45 650,40"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3"
                    />

                    {/* Supply Area Fill & Stroke */}
                    <path
                      d="M 70,155 C 130,140 150,130 190,125 C 230,120 270,105 310,100 C 350,95 390,75 430,70 C 470,65 510,90 550,85 C 590,80 620,58 650,55 L 650,200 L 70,200 Z"
                      fill="url(#emeraldSupplyGrad)"
                    />
                    <path
                      d="M 70,155 C 130,140 150,130 190,125 C 230,120 270,105 310,100 C 350,95 390,75 430,70 C 470,65 510,90 550,85 C 590,80 620,58 650,55"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />

                    {/* Month Data Points and Month X-Labels */}
                    {[
                      { x: 70, month: 'মে', demand: 280, supply: 240 },
                      { x: 190, month: 'জুন', demand: 340, supply: 310 },
                      { x: 310, month: 'জুলাই', demand: 390, supply: 360 },
                      { x: 430, month: 'আগস্ট', demand: 470, supply: 430 },
                      { x: 550, month: 'সেপ্টেম্বর', demand: 420, supply: 395 },
                      { x: 650, month: 'অক্টোবর', demand: 510, supply: 480 },
                    ].map((pt, idx) => (
                      <g key={idx}>
                        <circle cx={pt.x} cy={200 - (pt.demand / 500) * 170} r="4" fill="#f43f5e" stroke="#09090b" strokeWidth="2" />
                        <circle cx={pt.x} cy={200 - (pt.supply / 500) * 170} r="3.5" fill="#10b981" stroke="#09090b" strokeWidth="2" />
                        <text x={pt.x} y="218" fill="#a1a1aa" fontSize="11" fontWeight="bold" textAnchor="middle">
                          {pt.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800 font-mono">
                  <span>গড় মাসিক সরবরাহ হার: ৮৮.৫%</span>
                  <span>জরুরি চাহিদা পূরণ সন্তুষ্টি: ৯২%</span>
                </div>
              </Card>
            </div>

            {/* Chart 2: Blood Group Inventory vs Threshold Bar Chart (5 cols) */}
            <div className="lg:col-span-5">
              <Card variant="default" className="border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-rose-400" />
                      <span>রক্তের মজুদ ও নিরাপদ রিজার্ভ (Stock vs Safe Level)</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">গ্রুপভিত্তিক বর্তমান মজুদ ও ন্যূনতম লক্ষ্যমাত্রা</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { group: 'O+', stock: 68, target: 40, status: 'নিরাপদ', badgeClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' },
                    { group: 'A+', stock: 48, target: 35, status: 'পর্যাপ্ত', badgeClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' },
                    { group: 'B+', stock: 54, target: 35, status: 'পর্যাপ্ত', badgeClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' },
                    { group: 'AB+', stock: 32, target: 20, status: 'পর্যাপ্ত', badgeClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' },
                    { group: 'A-', stock: 16, target: 15, status: 'সীমিত', badgeClass: 'text-amber-400 bg-amber-950/80 border-amber-800' },
                    { group: 'O-', stock: 14, target: 20, status: 'জরুরি ঘাটতি', badgeClass: 'text-rose-400 bg-rose-950/80 border-rose-800' },
                    { group: 'B-', stock: 12, target: 15, status: 'ঘাটতি', badgeClass: 'text-amber-400 bg-amber-950/80 border-amber-800' },
                    { group: 'AB-', stock: 9, target: 12, status: 'জরুরি ঘাটতি', badgeClass: 'text-rose-400 bg-rose-950/80 border-rose-800' },
                  ].map((item) => {
                    const ratio = Math.min(Math.round((item.stock / 70) * 100), 100);
                    return (
                      <div key={item.group} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-white font-mono flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {item.group}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-zinc-400">
                              <strong className="text-white">{item.stock}</strong> / {item.target} ব্যাগ
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${item.badgeClass}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden flex">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.stock >= item.target
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : item.stock >= item.target * 0.75
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                : 'bg-gradient-to-r from-rose-600 to-red-500'
                            }`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>

          {/* Emergency Escalation & Urgency Triage Ring */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active Emergency Escalation Watch Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>জরুরি রক্তের চাহিদা (Live Escalation Watch)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => switchTab('radar')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>সবগুলো দেখুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {(emergencyRequests || []).slice(0, 3).map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge group={req.bloodGroup} size="md" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {req.patientName}{' '}
                          <span className="text-zinc-500 font-normal">({req.hospitalName})</span>
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {req.location || req.district} • {req.unitsRequired || req.unitsNeeded || 1} ব্যাগ প্রয়োজন
                        </p>
                      </div>
                    </div>
                    <UrgencyBadge level={req.urgency || req.urgencyLevel || 'Standard'} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Urgency Distribution Donut / Radial Ring (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-rose-400" />
                <span>ইমার্জেন্সি ট্রায়াজ মাত্রা (Urgency Distribution)</span>
              </h3>

              <Card className="border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
                <div className="flex items-center justify-center py-2">
                  {/* Circular Donut Ring */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="38" stroke="#18181b" strokeWidth="10" fill="none" />
                      {/* Critical slice: 60% (dasharray ~ 143, offset 0) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#f43f5e"
                        strokeWidth="10"
                        strokeDasharray="143 239"
                        strokeDashoffset="0"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Urgent slice: 28% (dasharray ~ 67, offset -145) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#f59e0b"
                        strokeWidth="10"
                        strokeDasharray="67 239"
                        strokeDashoffset="-145"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Standard slice: 12% (dasharray ~ 29, offset -214) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#06b6d4"
                        strokeWidth="10"
                        strokeDasharray="29 239"
                        strokeDashoffset="-214"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-white font-mono">
                        {emergencyRequests?.length || 4}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                        Active Cases
                      </span>
                    </div>
                  </div>
                </div>

                {/* Urgency Slices Legend & Percentages */}
                <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Critical (অত্যন্ত জরুরি)
                    </span>
                    <span className="font-mono font-bold text-rose-400">৬০%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Urgent (জরুরি সার্জারি)
                    </span>
                    <span className="font-mono font-bold text-amber-400">২৮%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      Standard (নিয়মিত ব্যাকআপ)
                    </span>
                    <span className="font-mono font-bold text-cyan-400">১২%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: COMPLAINTS & REPORTS MODERATION
         ======================================================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          {/* Filter Pills Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400 font-bold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-rose-400" /> ক্যাটাগরি:
              </span>
              <button
                type="button"
                onClick={() => setComplaintCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  complaintCategoryFilter === 'all'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                সকল ({complaintsData?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setComplaintCategoryFilter('misbehavior')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  complaintCategoryFilter === 'misbehavior'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                অনাকাঙ্ক্ষিত আচরণ
              </button>
              <button
                type="button"
                onClick={() => setComplaintCategoryFilter('website_issue')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  complaintCategoryFilter === 'website_issue'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                ওয়েবসাইট সমস্যা
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-bold">স্ট্যাটাস:</span>
              <select
                value={complaintStatusFilter}
                onChange={(e) => setComplaintStatusFilter(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="Pending">নতুন (Pending)</option>
                <option value="Investigating">তদন্তাধীন (Investigating)</option>
                <option value="Resolved">মীমাংসিত (Resolved)</option>
                <option value="Dismissed">বাতিল (Dismissed)</option>
              </select>
            </div>
          </div>

          {isLoadingComplaints ? (
            <div className="p-12 text-center text-zinc-500 text-sm">রিপোর্ট ডাটা লোড হচ্ছে...</div>
          ) : filteredComplaints.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-zinc-800 bg-zinc-900/40 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">কোনো অভিযোগ নেই</h3>
              <p className="text-xs text-zinc-400">এই ফিল্টারে বর্তমানে কোনো সক্রিয় অভিযোগ পেন্ডিং নেই।</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {paginatedComplaints.map((comp) => (
                <Card
                  key={comp._id}
                  className="border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      {comp.type === 'misbehavior' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <UserX className="w-3.5 h-3.5" />
                          <span>দুর্ব্যবহারের অভিযোগ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          <Bug className="w-3.5 h-3.5" />
                          <span>ওয়েবসাইট সমস্যা</span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-zinc-400">
                        {new Date(comp.createdAt).toLocaleString('bn-BD')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          comp.status === 'Pending'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : comp.status === 'Investigating'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : comp.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {comp.status === 'Pending'
                          ? 'নতুন অভিযোগ (Pending)'
                          : comp.status === 'Investigating'
                          ? 'তদন্তাধীন (Investigating)'
                          : comp.status === 'Resolved'
                          ? 'মীমাংসিত (Resolved)'
                          : 'বাতিল (Dismissed)'}
                      </span>
                    </div>
                  </div>

                  {/* Complaint Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-zinc-500 block font-bold uppercase text-[10px]">
                        রিপোর্টার / অভিযোগকারী:
                      </span>
                      <p className="text-zinc-200 font-semibold text-sm">
                        {comp.reporterName}{' '}
                        {comp.reporterContact && (
                          <span className="text-xs font-mono text-zinc-400">
                            ({comp.reporterContact})
                          </span>
                        )}
                      </p>
                    </div>

                    {comp.type === 'misbehavior' && (
                      <div className="space-y-1.5">
                        <span className="text-zinc-500 block font-bold uppercase text-[10px]">
                          অভিযুক্ত ব্যক্তি / ইউজার:
                        </span>
                        <div className="flex items-center justify-between">
                          <p className="text-rose-400 font-bold text-sm">
                            {comp.reportedUserName || 'অনির্দিষ্ট ইউজার'}
                          </p>
                          {comp.reportedUserId && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSuspensionReasonModal({
                                  isOpen: true,
                                  userId: comp.reportedUserId!,
                                  userName: comp.reportedUserName || 'ইউজার',
                                  reason: `অভিযোগ নম্বর ${comp._id}: ${comp.category}`,
                                })
                              }
                              className="text-xs border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5 mr-1" />
                              <span>ব্যান / সাসপেন্ড করুন</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category & Description */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
                    <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>বিষয়: {comp.category}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed pl-5 font-normal">
                      &ldquo;{comp.description}&rdquo;
                    </p>
                  </div>

                  {/* Admin Resolution & Action Buttons */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-zinc-800/80">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      ID: {comp._id}
                    </span>

                    <div className="flex items-center gap-2">
                      {comp.status !== 'Investigating' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateComplaintStatus(comp._id, 'Investigating')}
                          className="text-xs text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                        >
                          তদন্ত শুরু করুন
                        </Button>
                      )}
                      {comp.status !== 'Resolved' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdateComplaintStatus(comp._id, 'Resolved')}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500 font-bold cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          মীমাংসিত চিহ্নিত করুন
                        </Button>
                      )}
                      {comp.status !== 'Dismissed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateComplaintStatus(comp._id, 'Dismissed')}
                          className="text-xs text-zinc-400 hover:bg-zinc-800 cursor-pointer"
                        >
                          বাতিল
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              <PaginationControls
                currentPage={complaintPage}
                totalItems={filteredComplaints.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setComplaintPage}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: EMERGENCY RADAR FEED
         ======================================================== */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>রিয়েলটাইম ইমার্জেন্সি রাডার ফিড</span>
              </h3>
              <p className="text-xs text-zinc-400">
                জরুরি রক্তের অনুরোধগুলোর লাইভ মনিটরিং এবং বিশেষ অগ্রাধিকার নির্ধারণ।
              </p>
            </div>

            {/* Urgency Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-bold">জরুরিতা:</span>
              <select
                value={radarUrgencyFilter}
                onChange={(e) => setRadarUrgencyFilter(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="all">সব মাত্রা</option>
                <option value="Critical">ক্রিটিক্যাল (Critical)</option>
                <option value="Urgent">জরুরি (Urgent)</option>
                <option value="Standard">সাধারণ (Standard)</option>
              </select>
            </div>
          </div>

          {isLoadingRadar ? (
            <div className="p-12 text-center text-zinc-500 text-sm">রাডার ডাটা লোড হচ্ছে...</div>
          ) : filteredRadarRequests.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-zinc-800 bg-zinc-900/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-300">কোনো সক্রিয় জরুরি অনুরোধ পাওয়া যায়নি।</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRadarRequests.map((req) => (
                <Card
                  key={req._id}
                  className="border-zinc-800 bg-zinc-900/90 p-5 rounded-2xl space-y-4 hover:border-zinc-700 transition-colors shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge group={req.bloodGroup} size="lg" />
                      <div>
                        <h4 className="text-base font-black text-white">{req.patientName}</h4>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{req.hospitalName}, {req.location || req.district}</span>
                        </p>
                      </div>
                    </div>
                    <UrgencyBadge level={req.urgency || req.urgencyLevel || 'Standard'} />
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] block font-bold uppercase">প্রয়োজনীয় ইউনিট:</span>
                      <span className="font-extrabold text-white">{req.unitsRequired || req.unitsNeeded || 1} ব্যাগ</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block font-bold uppercase">তারিখ:</span>
                      <span className="text-zinc-300 font-mono">{req.neededDate || req.requiredDate || 'তাৎক্ষণিক'}</span>
                    </div>
                  </div>

                  {(req.notes || req.reason) && (
                    <p className="text-xs text-zinc-300 italic bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                      &ldquo;{req.notes || req.reason}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                    {(req.contactPhone || req.contactNumber) ? (
                      <a
                        href={`tel:${req.contactPhone || req.contactNumber}`}
                        className="inline-flex items-center gap-1.5 font-bold text-rose-400 hover:text-rose-300"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{req.contactPhone || req.contactNumber}</span>
                      </a>
                    ) : (
                      <span className="text-zinc-500">হটলাইন নেই</span>
                    )}

                    <span className="text-[10px] font-mono text-zinc-500">
                      স্ট্যাটাস: <strong className="text-zinc-300">{req.status}</strong>
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 4: USERS & DONOR CONTROL DIRECTORY
         ======================================================== */}
      {activeTab === 'users' && (
        <Card variant="default" className="border-zinc-800 bg-zinc-900/80 p-5 sm:p-6 space-y-6">
          {/* Header & Sub-Tab Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-500" />
                <span>প্ল্যাটফর্ম ব্যবহারকারী ও ডোনার নিয়ন্ত্রণ কেন্দ্র</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                রক্তদাতা, হাসপাতাল ও অ্যাডমিনদের ভূমিকা অনুযায়ী আলাদাভাবে পর্যবেক্ষণ ও পরিচালনা করুন।
              </p>
            </div>

            {/* Role Sub-Tabs Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setUserSubTab('donors');
                  setDonorPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  userSubTab === 'donors'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>রক্তদাতা তালিকা</span>
                <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px] font-mono">
                  {donorsList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserSubTab('providers');
                  setProviderUserPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  userSubTab === 'providers'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>হাসপাতাল ও সংস্থা</span>
                <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px] font-mono">
                  {providersList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserSubTab('admins');
                  setAdminUserPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  userSubTab === 'admins'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 font-black'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>অ্যাডমিনিস্ট্রেটর</span>
                <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px] font-mono">
                  {adminsList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserSubTab('suspended');
                  setSuspendedUserPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  userSubTab === 'suspended'
                    ? 'bg-red-700 text-white shadow-lg shadow-red-950 font-black'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>সাসপেন্ডেড একাউন্ট</span>
                <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px] font-mono">
                  {suspendedList.length}
                </span>
              </button>
            </div>
          </div>

          {/* Search & Role-Specific Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className={userSubTab === 'donors' ? 'md:col-span-8 relative' : 'md:col-span-12 relative'}>
              <Input
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  setDonorPage(1);
                  setProviderUserPage(1);
                  setAdminUserPage(1);
                  setSuspendedUserPage(1);
                }}
                placeholder={
                  userSubTab === 'donors'
                    ? 'রক্তদাতার নাম, ইমেইল, মোবাইল, বা এলাকা দিয়ে অনুসন্ধান...'
                    : userSubTab === 'providers'
                    ? 'হাসপাতাল বা সংস্থার নাম, লাইসেন্স বা মোবাইল খুঁজুন...'
                    : 'নাম, ইমেইল বা মোবাইল অনুসন্ধান...'
                }
                className="bg-zinc-950 border-zinc-800 text-white pl-10 h-11 text-xs rounded-xl"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>

            {userSubTab === 'donors' && (
              <div className="md:col-span-4">
                <select
                  value={userBloodFilter}
                  onChange={(e) => {
                    setUserBloodFilter(e.target.value);
                    setDonorPage(1);
                  }}
                  className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer font-medium"
                >
                  <option value="all">সব রক্তের গ্রুপ (All Groups)</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      গ্রুপ {bg}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ======================= SUB-TAB 1: DONORS ======================= */}
          {userSubTab === 'donors' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">রক্তদাতার পরিচয়</th>
                      <th className="p-3.5">রক্তের গ্রুপ</th>
                      <th className="p-3.5">যোগাযোগ ও ঠিকানা</th>
                      <th className="p-3.5">রক্তদান খতিয়ান</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">ম্যানেজমেন্ট অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
                          রক্তদাতা তালিকা লোড হচ্ছে...
                        </td>
                      </tr>
                    ) : donorsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
                          কোনো রক্তদাতা খুঁজে পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      paginatedDonors.map((u: any) => {
                        const userId = u._id || u.id || '';
                        return (
                          <tr key={userId} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3.5 font-semibold text-white">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 border border-rose-500/50 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm">
                                  {u.name ? u.name[0].toUpperCase() : 'D'}
                                </div>
                                <div className="overflow-hidden">
                                  <span className="truncate block font-bold text-sm text-white">{u.name}</span>
                                  <span className="block text-[11px] text-zinc-400 font-mono truncate">
                                    {u.email}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <BloodGroupBadge group={u.bloodGroup || 'O+'} size="sm" />
                            </td>
                            <td className="p-3.5 text-zinc-300">
                              <div className="space-y-0.5">
                                <p className="font-mono text-zinc-200">{u.phone || 'N/A'}</p>
                                <p className="text-[11px] text-zinc-400">
                                  {u.upazila ? `${u.upazila}, ` : ''}{u.district || 'ঢাকা'}
                                </p>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono">
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                                <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                                {u.totalDonations || 0} বার
                              </span>
                              <span className="block text-[10px] text-zinc-500">
                                {u.lastDonationDate
                                  ? new Date(u.lastDonationDate).toLocaleDateString('bn-BD')
                                  : 'রেকর্ড নেই'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                                <CheckCircle className="w-3 h-3" /> সক্রিয়
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenUserDetail(u)}
                                  title="ডোনার বিস্তারিত ও এডিট করুন"
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenResetPassword(u)}
                                  title="পাসওয়ার্ড রিসেট করুন"
                                  className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 hover:bg-amber-900 border border-amber-800/80 transition-colors cursor-pointer"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSuspensionReasonModal({
                                      isOpen: true,
                                      userId,
                                      userName: u.name || 'ডোনার',
                                      reason: 'Violated community guidelines or misbehavior.',
                                    })
                                  }
                                  title="ডোনার ব্যান / সাসপেন্ড করুন"
                                  className="p-1.5 rounded-lg bg-red-950/70 text-red-400 hover:bg-red-900 border border-red-800/60 transition-colors cursor-pointer"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setUserToDelete({ id: userId, name: u.name })}
                                  title="অ্যাকাউন্ট ডিলিট করুন"
                                  className="p-1.5 rounded-lg bg-zinc-950 text-zinc-500 hover:text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={donorPage}
                totalItems={donorsList.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setDonorPage}
              />
            </div>
          )}

          {/* ======================= SUB-TAB 2: HOSPITALS ======================= */}
          {userSubTab === 'providers' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">হাসপাতাল ও সংস্থা</th>
                      <th className="p-3.5">DGHS লাইসেন্স</th>
                      <th className="p-3.5">যোগাযোগ ও এলাকা</th>
                      <th className="p-3.5">অ্যাক্রেডিটেশন</th>
                      <th className="p-3.5 text-right">ম্যানেজমেন্ট অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          হাসপাতাল ডাটা লোড হচ্ছে...
                        </td>
                      </tr>
                    ) : providersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          কোনো হাসপাতাল পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      paginatedProviders.map((p: any) => {
                        const providerId = p._id || p.id || '';
                        return (
                          <tr key={providerId} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3.5 font-semibold text-white">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center font-bold text-xs text-cyan-400 shrink-0">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="block font-bold text-sm text-white">
                                    {p.organizationName || p.name}
                                  </span>
                                  <span className="block text-[11px] text-zinc-400 font-mono">
                                    {p.email}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-zinc-200">
                              <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px]">
                                {p.licenseNumber || 'DGHS-MED-7492'}
                              </span>
                            </td>
                            <td className="p-3.5 text-zinc-300">
                              <div className="space-y-0.5">
                                <p className="font-mono text-zinc-200">{p.phone || 'N/A'}</p>
                                <p className="text-[11px] text-zinc-400">
                                  {p.district || 'ঢাকা'}, {p.division || 'Dhaka'}
                                </p>
                              </div>
                            </td>
                            <td className="p-3.5">
                              {p.isVerified ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                                  <CheckCircle className="w-3 h-3" /> অ্যাক্রেডিটেড
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                                  <AlertTriangle className="w-3 h-3" /> পেন্ডিং রিভিউ
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenUserDetail(p)}
                                  title="হাসপাতাল বিস্তারিত ও এডিট করুন"
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenResetPassword(p)}
                                  title="পাসওয়ার্ড রিসেট করুন"
                                  className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 hover:bg-amber-900 border border-amber-800/80 transition-colors cursor-pointer"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleVerification(providerId, !!p.isVerified)}
                                  title={p.isVerified ? 'অ্যাক্রেডিটেশন প্রত্যাহার' : 'অনুমোদন দিন'}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    p.isVerified
                                      ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                                      : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800'
                                  }`}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSuspensionReasonModal({
                                      isOpen: true,
                                      userId: providerId,
                                      userName: p.organizationName || p.name || 'হাসপাতাল',
                                      reason: 'Regulatory violation or invalid licensing.',
                                    })
                                  }
                                  title="হাসপাতাল ব্যান / সাসপেন্ড করুন"
                                  className="p-1.5 rounded-lg bg-red-950/70 text-red-400 hover:bg-red-900 border border-red-800/60 transition-colors cursor-pointer"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setUserToDelete({ id: providerId, name: p.name || p.organizationName })}
                                  title="হাসপাতাল অ্যাকাউন্ট ডিলিট করুন"
                                  className="p-1.5 rounded-lg bg-zinc-950 text-zinc-500 hover:text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={providerUserPage}
                totalItems={providersList.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setProviderUserPage}
              />
            </div>
          )}

          {/* ======================= SUB-TAB 3: ADMINS ======================= */}
          {userSubTab === 'admins' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">অ্যাডমিনিস্ট্রেটর পরিচয়</th>
                      <th className="p-3.5">ইমেইল ও যোগাযোগ</th>
                      <th className="p-3.5">ভূমিকা ও অধিকার</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">ম্যানেজমেন্ট অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          অ্যাডমিন তালিকা লোড হচ্ছে...
                        </td>
                      </tr>
                    ) : adminsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          কোনো অ্যাডমিনিস্ট্রেটর পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      paginatedAdmins.map((adm: any) => {
                        const adminId = adm._id || adm.id || '';
                        return (
                          <tr key={adminId} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3.5 font-semibold text-white">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 border border-rose-500/50 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
                                  <Shield className="w-4 h-4 fill-white" />
                                </div>
                                <div>
                                  <span className="block font-bold text-sm text-white">{adm.name}</span>
                                  <span className="block text-[10px] text-rose-400 font-mono">Platform Governance</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 text-zinc-300">
                              <div className="space-y-0.5">
                                <p className="font-mono text-zinc-200">{adm.email}</p>
                                <p className="text-[11px] text-zinc-400">{adm.phone || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                                SUPER_ADMIN
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                                <CheckCircle className="w-3 h-3" /> সক্রিয় সেশন
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenUserDetail(adm)}
                                  title="অ্যাডমিন বিস্তারিত ও এডিট করুন"
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenResetPassword(adm)}
                                  title="পাসওয়ার্ড পরিবর্তন করুন"
                                  className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 hover:bg-amber-900 border border-amber-800/80 transition-colors cursor-pointer"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={adminUserPage}
                totalItems={adminsList.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setAdminUserPage}
              />
            </div>
          )}

          {/* ======================= SUB-TAB 4: SUSPENDED / BANNED ======================= */}
          {userSubTab === 'suspended' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">সাসপেন্ডেড ইউজার</th>
                      <th className="p-3.5">মূল ভূমিকা</th>
                      <th className="p-3.5">নিষেধাজ্ঞার কারণ (Audit Reason)</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">ম্যানেজমেন্ট অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          ডাটা লোড হচ্ছে...
                        </td>
                      </tr>
                    ) : suspendedList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          বর্তমানে কোনো ইউজার ব্যান বা সাসপেন্ডেড নেই।
                        </td>
                      </tr>
                    ) : (
                      paginatedSuspended.map((u: any) => {
                        const userId = u._id || u.id || '';
                        return (
                          <tr key={userId} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3.5 font-semibold text-white">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center font-bold text-xs text-red-400 shrink-0">
                                  <Lock className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="block font-bold text-sm text-white">{u.name}</span>
                                  <span className="block text-[11px] text-zinc-400 font-mono">
                                    {u.email}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono capitalize text-zinc-300">
                              {u.role}
                            </td>
                            <td className="p-3.5 text-rose-300/90 font-medium">
                              {u.suspensionReason || 'নীতিমালা লঙ্ঘন ও অসদাচরণের অভিযোগ'}
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                                <Lock className="w-3 h-3" /> ব্যানড (সাসপেন্ডেড)
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenUserDetail(u)}
                                  title="সাসপেন্ডেড ইউজার বিস্তারিত ও এডিট করুন"
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleUserSuspension(userId, true)}
                                  title="সাসপেনশন প্রত্যাহার করে সচল করুন"
                                  className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 transition-colors cursor-pointer"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenResetPassword(u)}
                                  title="পাসওয়ার্ড রিসেট করুন"
                                  className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 hover:bg-amber-900 border border-amber-800/80 transition-colors cursor-pointer"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setUserToDelete({ id: userId, name: u.name })}
                                  title="অ্যাকাউন্ট স্থায়ীভাবে মুছুন"
                                  className="p-1.5 rounded-lg bg-zinc-950 text-zinc-500 hover:text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={suspendedUserPage}
                totalItems={suspendedList.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setSuspendedUserPage}
              />
            </div>
          )}
        </Card>
      )}

      {/* ========================================================
          TAB 5: HOSPITAL ACCREDITATION QUEUE
         ======================================================== */}
      {activeTab === 'verifications' && (
        <Card variant="default" className="border-zinc-800 bg-zinc-900/80 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                হাসপাতাল ও ব্লাড ব্যাংক অ্যাক্রেডিটেশন ডেস্ক
              </h3>
              <p className="text-xs text-zinc-400">
                শুধুমাত্র অনুমোদিত হাসপাতালগুলো রক্তদান ক্যাম্প আয়োজন ও ডোনার ভেরিফাই করার লাইসেন্স পায়।
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Input
                value={providerSearchQuery}
                onChange={(e) => setProviderSearchQuery(e.target.value)}
                placeholder="হাসপাতাল বা লাইসেন্স খুঁজুন..."
                className="bg-zinc-950 border-zinc-800 text-white pl-9 h-10 text-xs rounded-xl"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-mono text-[10px]">
                <tr>
                  <th className="p-3">হাসপাতাল ও ইমেইল</th>
                  <th className="p-3">DGHS লাইসেন্স</th>
                  <th className="p-3">এলাকা</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60">
                {isLoadingProviders ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-zinc-500">
                      হাসপাতাল ডাটা লোড হচ্ছে...
                    </td>
                  </tr>
                ) : filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-zinc-500">
                      কোনো হাসপাতাল পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  paginatedAccreditedProviders.map((p: any) => {
                    const providerId = p._id || p.id || '';
                    return (
                      <tr key={providerId} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center font-bold text-xs text-cyan-400">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <span>{p.organizationName || p.name}</span>
                              <span className="block text-[11px] text-zinc-400 font-mono">
                                {p.email}{p.phone ? ` • ${p.phone}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-zinc-300">
                          {p.licenseNumber || 'DGHS-BB-2024-984'}
                        </td>
                        <td className="p-3 text-zinc-400">
                          {p.district || 'ঢাকা'}, {p.division || 'Dhaka'}
                        </td>
                        <td className="p-3">
                          {p.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              <CheckCircle className="w-3 h-3" /> অ্যাক্রেডিটেড
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                              <AlertTriangle className="w-3 h-3" /> পেন্ডিং রিভিউ
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant={p.isVerified ? 'outline' : 'primary'}
                            onClick={() => handleToggleVerification(providerId, !!p.isVerified)}
                            className="text-xs font-semibold cursor-pointer"
                          >
                            {p.isVerified ? 'প্রত্যাহার করুন' : 'অনুমোদন দিন'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={hospitalPage}
            totalItems={filteredProviders.length}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setHospitalPage}
          />
        </Card>
      )}

      {/* ========================================================
          TAB 6: FINANCIAL & FUND AUDIT
         ======================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Live Fund Alert & Health Status Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-950 border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    লাইভ ফান্ড অ্যালার্ট ও রিজার্ভ মনিটরিং
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-xs text-zinc-300 mt-0.5">
                  ইমার্জেন্সি কোল্ড-চেইন ট্রান্সপোর্ট ও লাইফসেভার সহায়তা ফান্ড সন্তোষজনক ও পর্যাপ্ত অবস্থায় আছে (১০০% অপারেশনাল)।
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-700 font-bold">
                Alert: Healthy Reserve
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-zinc-800 bg-zinc-900/90 p-5 space-y-1">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">মোট অনুদান ফান্ড</span>
              <div className="text-3xl font-black text-emerald-400">
                ৳{(paymentsData?.totalAmount || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-zinc-500">Stripe & Platform Test Supporter Funds</span>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/90 p-5 space-y-1">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">সফল ট্রানজেকশন</span>
              <div className="text-3xl font-black text-white">
                {paymentsData?.total || 0} টি
              </div>
              <span className="text-[11px] text-zinc-500">স্বেচ্ছাসেবী অবদান ও জরুরি ট্রান্সপোর্ট ফি</span>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/90 p-5 space-y-1">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">পেমেন্ট গেটওয়ে স্ট্যাটাস</span>
              <div className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Stripe Test Mode</span>
              </div>
              <span className="text-[11px] text-zinc-500">Webhook listener & PaymentIntent active</span>
            </Card>
          </div>

          <Card variant="default" className="border-zinc-800 bg-zinc-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                আর্থিক অনুদান ও পরিবহন ফি ট্রানজেকশন খতিয়ান
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                Realtime Stripe Audited Transactions
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-mono text-[10px]">
                  <tr>
                    <th className="p-3">ট্রানজেকশন আইডি</th>
                    <th className="p-3">দাতা / প্রেরক</th>
                    <th className="p-3">উদ্দেশ্য</th>
                    <th className="p-3">পরিমাণ</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3 text-right">তারিখ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60">
                  {isLoadingPayments ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-zinc-500">
                        পেমেন্ট রেকর্ড লোড হচ্ছে...
                      </td>
                    </tr>
                  ) : (paymentsData?.payments || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-zinc-500">
                        এখনো কোনো অনুদান ট্রানজেকশন রেকর্ড নেই।
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((pay: any) => (
                      <tr key={pay._id || pay.id} className="hover:bg-zinc-800/40">
                        <td className="p-3 font-mono text-zinc-400 text-[11px]">
                          {pay.stripePaymentIntentId || pay._id || 'pi_test'}
                        </td>
                        <td className="p-3 font-bold text-white">
                          {pay.userName || 'Anonymous'}
                          <span className="block text-[10px] text-zinc-500 font-mono font-normal">
                            {pay.userEmail}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-300">
                          {pay.paymentPurpose?.replace(/_/g, ' ') || 'Supporter Fund'}
                        </td>
                        <td className="p-3 font-mono font-black text-emerald-400">
                          ৳{pay.amount} {pay.currency?.toUpperCase()}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {pay.status || 'succeeded'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-zinc-400 text-[11px]">
                          {new Date(pay.createdAt).toLocaleDateString('bn-BD')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={paymentPage}
              totalItems={(paymentsData?.payments || []).length}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={setPaymentPage}
            />
          </Card>
        </div>
      )}

      {/* ========================================================
          MODAL: COMPREHENSIVE USER DETAIL & EDIT MODAL
         ======================================================== */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="max-w-2xl w-full max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 border ${
                    selectedUserForDetail.role === 'admin'
                      ? 'bg-amber-950/40 border-amber-600/40 text-amber-400'
                      : selectedUserForDetail.role === 'provider'
                      ? 'bg-cyan-950/40 border-cyan-600/40 text-cyan-400'
                      : 'bg-rose-950/40 border-rose-600/40 text-rose-400'
                  }`}>
                    {selectedUserForDetail.name ? selectedUserForDetail.name[0] : 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-white truncate">
                        {selectedUserForDetail.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        selectedUserForDetail.role === 'admin'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : selectedUserForDetail.role === 'provider'
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                          : 'bg-rose-950 text-rose-400 border-rose-800'
                      }`}>
                        {selectedUserForDetail.role === 'admin' ? 'সিস্টেম অ্যাডমিন' : selectedUserForDetail.role === 'provider' ? 'হাসপাতাল / ব্লাড ব্যাংক' : 'রক্তদাতা'}
                      </span>
                      {selectedUserForDetail.isSuspended ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                          সাসপেন্ডেড
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          সক্রিয়
                        </span>
                      )}
                      {selectedUserForDetail.isVerified && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> ভেরিফাইড
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-400 truncate mt-0.5">
                      {selectedUserForDetail.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUserForDetail(null)}
                  className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Switch Tabs (View Details vs Edit Details) */}
              <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsEditingUserDetail(false)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isEditingUserDetail
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>প্রোফাইল বিবরণ (View)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingUserDetail(true)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isEditingUserDetail
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>তথ্য সম্পাদনা করুন (Edit)</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              {!isEditingUserDetail ? (
                /* ================= VIEW DETAILS MODE ================= */
                <div className="space-y-4">
                  {/* Quick Highlight Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                      <span className="text-[10px] font-bold uppercase text-zinc-500 block">রক্তের গ্রুপ</span>
                      <span className="text-lg font-black text-rose-400 font-mono">
                        {selectedUserForDetail.bloodGroup || '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                      <span className="text-[10px] font-bold uppercase text-zinc-500 block">মোট রক্তদান</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {selectedUserForDetail.totalDonations || 0} বার
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                      <span className="text-[10px] font-bold uppercase text-zinc-500 block">প্রাপ্যতা (Readiness)</span>
                      <span className={`text-xs font-bold block mt-1 ${selectedUserForDetail.isAvailable ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {selectedUserForDetail.isAvailable ? '● প্রস্তুত (Available)' : '○ অনুপলব্ধ'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                      <span className="text-[10px] font-bold uppercase text-zinc-500 block">অ্যাক্রেডিটেশন</span>
                      <span className={`text-xs font-bold block mt-1 ${selectedUserForDetail.isVerified ? 'text-blue-400' : 'text-amber-400'}`}>
                        {selectedUserForDetail.isVerified ? '✓ ভেরিফাইড' : 'পেন্ডিং'}
                      </span>
                    </div>
                  </div>

                  {/* Personal & Contact Information */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-rose-400" />
                      ব্যক্তিগত ও যোগাযোগ তথ্য
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">পূর্ণ নাম:</span>
                        <span className="font-bold text-white text-sm">{selectedUserForDetail.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">ইমেইল ঠিকানা:</span>
                        <a
                          href={`mailto:${selectedUserForDetail.email}`}
                          className="font-mono text-zinc-300 hover:text-rose-400 underline transition-colors"
                        >
                          {selectedUserForDetail.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">মোবাইল নম্বর:</span>
                        <a
                          href={`tel:${selectedUserForDetail.phone}`}
                          className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          {selectedUserForDetail.phone || 'N/A'}
                        </a>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">লিঙ্গ:</span>
                        <span className="text-zinc-200">{selectedUserForDetail.gender || 'Male'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Coverage */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      ভৌগোলিক এলাকা ও ঠিকানা
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">বিভাগ:</span>
                        <span className="font-bold text-zinc-200">{selectedUserForDetail.division || 'Dhaka'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">জেলা:</span>
                        <span className="font-bold text-zinc-200">{selectedUserForDetail.district || 'ঢাকা'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">উপজেলা / থানা:</span>
                        <span className="font-bold text-zinc-200">{selectedUserForDetail.upazila || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hospital/Provider Specific Details */}
                  {selectedUserForDetail.role === 'provider' && (
                    <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
                      <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        হাসপাতাল / ব্লাড ব্যাংক রেকর্ড
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-cyan-400/70 block text-[11px]">প্রতিষ্ঠানের নাম:</span>
                          <span className="font-bold text-white">{selectedUserForDetail.organizationName || selectedUserForDetail.name}</span>
                        </div>
                        <div>
                          <span className="text-cyan-400/70 block text-[11px]">DGHS লাইসেন্স নম্বর:</span>
                          <span className="font-mono font-bold text-cyan-300">{selectedUserForDetail.licenseNumber || 'DGHS-BB-2024-984'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {selectedUserForDetail.note && (
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                      <span className="text-zinc-500 block font-bold text-[10px] uppercase mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-400" /> অ্যাডমিন কোঅর্ডিনেশন নোট:
                      </span>
                      <p className="text-zinc-300 italic">&ldquo;{selectedUserForDetail.note}&rdquo;</p>
                    </div>
                  )}

                  {/* System Audit Details */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>আইডি: {selectedUserForDetail._id || selectedUserForDetail.id}</span>
                    <span>
                      নিবন্ধন: {selectedUserForDetail.createdAt ? new Date(selectedUserForDetail.createdAt).toLocaleDateString('bn-BD') : 'System'}
                    </span>
                  </div>
                </div>
              ) : (
                /* ================= EDIT PROFILE MODE ================= */
                <form onSubmit={handleSaveUserDetail} className="space-y-4">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>আপনি এই ইউজারের প্রোফাইল তথ্য সরাসরি অ্যাডমিন প্রিভিলেজে পরিবর্তন করছেন।</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">পূর্ণ নাম (Full Name):</label>
                      <Input
                        required
                        value={userEditForm.name}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">ইমেইল ঠিকানা (Email):</label>
                      <Input
                        type="email"
                        required
                        value={userEditForm.email}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">মোবাইল নম্বর (Phone):</label>
                      <Input
                        required
                        value={userEditForm.phone}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">রক্তের গ্রুপ (Blood Group):</label>
                      <select
                        value={userEditForm.bloodGroup}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, bloodGroup: e.target.value }))}
                        className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        <option value="">নির্বাচন করুন</option>
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">ভূমিকা / রোল (Role):</label>
                      <select
                        value={userEditForm.role}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, role: e.target.value }))}
                        className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer capitalize"
                      >
                        <option value="donor">রক্তদাতা (donor)</option>
                        <option value="provider">হাসপাতাল / ব্লাড ব্যাংক (provider)</option>
                        <option value="admin">সিস্টেম অ্যাডমিন (admin)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">লিঙ্গ (Gender):</label>
                      <select
                        value={userEditForm.gender}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, gender: e.target.value }))}
                        className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        <option value="Male">পুরুষ (Male)</option>
                        <option value="Female">মহিলা (Female)</option>
                        <option value="Other">অন্যান্য (Other)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">বিভাগ (Division):</label>
                      <Input
                        value={userEditForm.division}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, division: e.target.value }))}
                        className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">জেলা (District):</label>
                      <Input
                        value={userEditForm.district}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, district: e.target.value }))}
                        className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">উপজেলা / থানা (Upazila):</label>
                      <Input
                        value={userEditForm.upazila}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, upazila: e.target.value }))}
                        className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">সর্বমোট রক্তদান (Total Donations):</label>
                      <Input
                        type="number"
                        min="0"
                        value={userEditForm.totalDonations}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, totalDonations: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Provider specific inputs */}
                  {userEditForm.role === 'provider' && (
                    <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
                      <h5 className="text-xs font-bold text-cyan-300">হাসপাতাল সম্পর্কিত তথ্য:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300">প্রতিষ্ঠানের নাম:</label>
                          <Input
                            value={userEditForm.organizationName}
                            onChange={(e) => setUserEditForm((prev) => ({ ...prev, organizationName: e.target.value }))}
                            className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300">DGHS লাইসেন্স নম্বর:</label>
                          <Input
                            value={userEditForm.licenseNumber}
                            onChange={(e) => setUserEditForm((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                            className="bg-zinc-900 border-zinc-800 text-white h-10 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checkbox Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer hover:bg-zinc-850">
                      <input
                        type="checkbox"
                        checked={userEditForm.isAvailable}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                        className="rounded border-zinc-700 text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-200 font-medium">রক্তদানে প্রস্তুত (Available)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer hover:bg-zinc-850">
                      <input
                        type="checkbox"
                        checked={userEditForm.isVerified}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, isVerified: e.target.checked }))}
                        className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-200 font-medium">অ্যাক্রেডিটেড ভেরিফাইড</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer hover:bg-zinc-850">
                      <input
                        type="checkbox"
                        checked={userEditForm.isSuspended}
                        onChange={(e) => setUserEditForm((prev) => ({ ...prev, isSuspended: e.target.checked }))}
                        className="rounded border-zinc-700 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span className="text-xs text-red-300 font-medium">অ্যাকাউন্ট সাসপেন্ডেড</span>
                    </label>
                  </div>

                  {/* Admin Internal Note */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">অ্যাডমিন অভ্যন্তরীণ নোট:</label>
                    <textarea
                      rows={2}
                      value={userEditForm.note}
                      onChange={(e) => setUserEditForm((prev) => ({ ...prev, note: e.target.value }))}
                      placeholder="এই ইউজারের জন্য বিশেষ কোনো অভ্যন্তরীণ নির্দেশনা বা পর্যবেক্ষণ লিখুন..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3">
              {!isEditingUserDetail ? (
                <>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenResetPassword(selectedUserForDetail)}
                      className="text-xs bg-amber-950/40 text-amber-400 border-amber-800/80 hover:bg-amber-900"
                    >
                      <Key className="w-3.5 h-3.5 mr-1" />
                      পাসওয়ার্ড পরিবর্তন
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const targetId = selectedUserForDetail._id || selectedUserForDetail.id;
                        handleToggleUserSuspension(targetId, Boolean(selectedUserForDetail.isSuspended));
                        setSelectedUserForDetail(null);
                      }}
                      className={`text-xs ${
                        selectedUserForDetail.isSuspended
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900'
                          : 'bg-red-950/40 text-red-400 border-red-800/80 hover:bg-red-900'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      {selectedUserForDetail.isSuspended ? 'সাসপেনশন প্রত্যাহার' : 'সাসপেন্ড করুন'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setIsEditingUserDetail(true)}
                      className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      তথ্য সম্পাদনা করুন
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUserForDetail(null)}
                      className="text-xs"
                    >
                      বন্ধ করুন
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingUserDetail(false)}
                    disabled={isSavingUserDetail}
                    className="text-xs"
                  >
                    বাতিল করুন
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSaveUserDetail}
                    disabled={isSavingUserDetail}
                    className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold min-w-[140px]"
                  >
                    {isSavingUserDetail ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Save className="w-3.5 h-3.5" />
                        পরিবর্তন সংরক্ষণ করুন
                      </span>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ROLE CHANGE MODAL
         ======================================================== */}
      {roleChangeModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">ইউজারের ভূমিকা (Role) পরিবর্তন</h3>
            <p className="text-xs text-zinc-300">
              <strong className="text-white">{roleChangeModal.userName}</strong> এর বর্তমান ভূমিকা:{' '}
              <span className="text-rose-400 font-bold capitalize">{roleChangeModal.currentRole}</span>
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">নতুন ভূমিকা নির্ধারণ করুন:</label>
              <select
                value={roleChangeModal.newRole}
                onChange={(e) => setRoleChangeModal((prev) => ({ ...prev, newRole: e.target.value }))}
                className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="donor">ডোনার (donor)</option>
                <option value="provider">হাসপাতাল / ব্লাড ব্যাংক (provider)</option>
                <option value="admin">সুপার অ্যাডমিন (admin)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoleChangeModal({ isOpen: false, userId: '', userName: '', currentRole: '', newRole: '' })}
                className="text-xs text-zinc-400 hover:text-white"
              >
                বাতিল
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSaveRoleChange}
                className="text-xs bg-rose-600 hover:bg-rose-500 font-bold"
              >
                রোল পরিবর্তন নিশ্চিত করুন
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: USER SUSPENSION CONFIRMATION
         ======================================================== */}
      {suspensionReasonModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-950 border border-red-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <UserX className="w-6 h-6" />
              <h3 className="text-lg font-black text-white">ইউজার সাসপেন্ড নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              আপনি কি নিশ্চিতভাবে <strong className="text-white">{suspensionReasonModal.userName}</strong> এর অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে ব্যান করতে চান? ব্যান করলে ইউজার আর লগইন করতে পারবে না এবং পাবলিক রক্তদাতা তালিকা থেকে গোপন থাকবে।
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">সাসপেনশনের কারণ (Audit Reason):</label>
              <textarea
                rows={2}
                value={suspensionReasonModal.reason}
                onChange={(e) =>
                  setSuspensionReasonModal((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSuspensionReasonModal({ isOpen: false, userId: '', userName: '', reason: '' })
                }
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                বাতিল করুন
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  handleToggleUserSuspension(
                    suspensionReasonModal.userId,
                    false,
                    suspensionReasonModal.reason
                  )
                }
                className="text-xs bg-red-600 hover:bg-red-500 font-bold text-white shadow-lg shadow-red-950 cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5 mr-1" />
                হ্যাঁ, সাসপেন্ড করুন
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: USER DELETE CONFIRMATION
         ======================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-950 border border-red-500/60 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-red-500">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-black text-white">অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করুন</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              সতর্কতা: <strong className="text-white">{userToDelete.name}</strong> এর সম্পূর্ণ প্রোফাইল ও ডাটা স্থায়ীভাবে ডাটাবেজ থেকে মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserToDelete(null)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                বাতিল
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleDeleteUser(userToDelete.id)}
                className="text-xs bg-red-700 hover:bg-red-600 font-bold text-white shadow-lg cursor-pointer"
              >
                স্থায়ীভাবে মুছুন
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADMIN USER PASSWORD RESET
         ======================================================== */}
      {resetPasswordModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">পাসওয়ার্ড রিসেট করুন</h3>
                  <p className="text-xs text-zinc-400 font-mono">অ্যাডমিনিস্ট্রেটিভ পাসওয়ার্ড ম্যানেজমেন্ট</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Target User Info Summary */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-3">
              <div className="overflow-hidden min-w-0">
                <span className="block font-bold text-white text-sm truncate">{resetPasswordModal.userName}</span>
                <span className="block text-xs font-mono text-zinc-400 truncate">{resetPasswordModal.userEmail}</span>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-zinc-800 border border-zinc-700 text-rose-300 shrink-0">
                {resetPasswordModal.userRole}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span>নতুন পাসওয়ার্ড লিখুন:</span>
                <button
                  type="button"
                  onClick={() => {
                    const randomPass = 'Life#' + Math.floor(1000 + Math.random() * 9000);
                    setResetPasswordModal((prev) => ({ ...prev, newPassword: randomPass }));
                  }}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                >
                  র‌্যান্ডম পাসওয়ার্ড তৈরি করুন
                </button>
              </div>
              <div className="relative">
                <Input
                  type={resetPasswordModal.showPassword ? 'text' : 'password'}
                  value={resetPasswordModal.newPassword}
                  onChange={(e) =>
                    setResetPasswordModal((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন..."
                  className="bg-zinc-900 border-zinc-800 text-white pr-20 h-11 text-xs rounded-xl"
                />
                <button
                  type="button"
                  onClick={() =>
                    setResetPasswordModal((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                  }
                  className="absolute right-3 top-3 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer"
                >
                  {resetPasswordModal.showPassword ? 'লুকান' : 'দেখান'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                ইউজারের পাসওয়ার্ড পরিবর্তন করা হলে তিনি নতুন পাসওয়ার্ড দিয়ে তাৎক্ষণিকভাবে লগইন করতে পারবেন।
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800/80">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResetPasswordModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                বাতিল
              </Button>
              <Button
                size="sm"
                variant="primary"
                isLoading={resetPasswordModal.isSubmitting}
                onClick={handleAdminResetPassword}
                className="text-xs bg-amber-600 hover:bg-amber-500 font-bold text-white shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 mr-1.5" />
                পাসওয়ার্ড পরিবর্তন নিশ্চিত করুন
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-zinc-500 font-mono text-sm">
          Loading DropOfLife Central Mission Control...
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
