'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function HospitalRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    const dest = tab ? `/dashboard/provider?tab=${tab}` : '/dashboard/provider';
    router.replace(dest);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">
      Redirecting to Healthcare Provider Portal...
    </div>
  );
}

export default function HospitalRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">
          Loading Hospital Portal...
        </div>
      }
    >
      <HospitalRedirectInner />
    </Suspense>
  );
}
