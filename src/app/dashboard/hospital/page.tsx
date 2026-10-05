'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HospitalRedirectPage() {
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
