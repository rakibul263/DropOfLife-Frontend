'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
    const role = (user.role || '').toLowerCase();
    if (role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (role === 'provider' || role === 'hospital') {
      router.replace('/dashboard/provider');
    } else {
      router.replace('/dashboard/donor');
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">
      Redirecting to dashboard...
    </div>
  );
}
