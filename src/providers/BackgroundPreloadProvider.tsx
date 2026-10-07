'use client';

import React, { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

/**
 * BackgroundPreloadProvider
 * 
 * Speculative Background Cache Priming Architecture:
 * - As soon as a user visits the platform (initial landing), critical data 
 *   (donors directory, emergency requests, blood camps, live stats) is prefetched 
 *   in the background via non-blocking idle callbacks (requestIdleCallback).
 * - Key Next.js routes are pre-cached ahead of user interaction.
 * - Result: When the user navigates between pages or searches donors, the transitions 
 *   are instantaneous (0ms perceived latency, zero loading spinners).
 */
export function BackgroundPreloadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();
  const hasPreloaded = useRef(false);

  useEffect(() => {
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;

    // Use requestIdleCallback or a micro-delay to not compete with critical initial paint
    const runBackgroundPrefetch = () => {
      // 1. Next.js route chunks background prefetch
      try {
        router.prefetch('/donors');
        router.prefetch('/emergency-requests');
        router.prefetch('/camps');
        router.prefetch('/support');
        router.prefetch('/support/checkout');
        router.prefetch('/login');
        router.prefetch('/register');
      } catch (e) {
        // Safe failover
      }

      // 2. React Query background data prefetching
      const prefetchTasks: Promise<any>[] = [];

      // A. Donors Directory
      prefetchTasks.push(
        queryClient.prefetchQuery({
          queryKey: ['donors-directory', user?._id || user?.id],
          queryFn: async () => {
            const params: any = {};
            if (user?._id || user?.id) {
              params.excludeUserId = user._id || user.id;
            }
            const res = await api.get('/donors', { params });
            return res.data?.data?.donors || [];
          },
          staleTime: 5 * 60 * 1000,
        })
      );

      // Also prefetch default unauthenticated donors query
      if (user?._id || user?.id) {
        prefetchTasks.push(
          queryClient.prefetchQuery({
            queryKey: ['donors-directory', undefined],
            queryFn: async () => {
              const res = await api.get('/donors');
              return res.data?.data?.donors || [];
            },
            staleTime: 5 * 60 * 1000,
          })
        );
      }

      // B. Emergency Requests (Default view: ALL, ALL, ALL)
      prefetchTasks.push(
        queryClient.prefetchQuery({
          queryKey: ['requests', 'ALL', 'ALL', 'ALL'],
          queryFn: async () => {
            const res = await api.get('/requests');
            return res.data?.data?.requests || [];
          },
          staleTime: 3 * 60 * 1000,
        })
      );

      // C. Blood Camps
      prefetchTasks.push(
        queryClient.prefetchQuery({
          queryKey: ['camps'],
          queryFn: async () => {
            const res = await api.get('/camps');
            return res.data?.data?.camps || [];
          },
          staleTime: 5 * 60 * 1000,
        })
      );

      // D. Live Platform Stats
      prefetchTasks.push(
        queryClient.prefetchQuery({
          queryKey: ['platform-live-stats'],
          queryFn: async () => {
            const res = await api.get('/stats');
            return res.data?.data || null;
          },
          staleTime: 5 * 60 * 1000,
        })
      );

      // E. Live Urgency Requests (Ticker)
      prefetchTasks.push(
        queryClient.prefetchQuery({
          queryKey: ['live-urgency-requests'],
          queryFn: async () => {
            const res = await api.get('/requests', { params: { status: 'PENDING' } });
            return res.data?.data?.requests || [];
          },
          staleTime: 3 * 60 * 1000,
        })
      );

      // Run prefetch tasks quietly in parallel without rejecting on any individual error
      Promise.allSettled(prefetchTasks).then((results) => {
        if (process.env.NODE_ENV === 'development') {
          const fulfilled = results.filter((r) => r.status === 'fulfilled').length;
          console.log(`[DropOfLife] Background cache primed: ${fulfilled}/${results.length} core datasets loaded.`);
        }
      });
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(runBackgroundPrefetch, { timeout: 1200 });
        return () => (window as any).cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(runBackgroundPrefetch, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [queryClient, router, user]);

  return <>{children}</>;
}
