'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BackgroundPreloadProvider } from '@/providers/BackgroundPreloadProvider';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes fresh in-memory data
            gcTime: 1000 * 60 * 30, // 30 minutes garbage-collection cache
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundPreloadProvider>
        {children}
      </BackgroundPreloadProvider>
    </QueryClientProvider>
  );
}
