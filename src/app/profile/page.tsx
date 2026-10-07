'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Droplet } from 'lucide-react';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/login?redirect=/dashboard/donor');
      return;
    }

    const role = user.role?.toLowerCase() || 'donor';
    if (role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (role === 'provider' || role === 'hospital') {
      router.replace('/dashboard/provider');
    } else {
      router.replace('/dashboard/donor');
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center animate-pulse">
          <Droplet className="w-8 h-8 text-rose-500 fill-rose-500 animate-bounce" />
        </div>
        <p className="text-sm font-bold text-zinc-300">
          প্রোফাইলে লোড করা হচ্ছে...
        </p>
      </div>
    </div>
  );
}
