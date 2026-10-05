'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled App Router Error:', error);
  }, [error]);

  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800/60 mb-5 text-red-400">
        <AlertOctagon className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        {error.message ||
          'An unexpected error occurred while communicating with the emergency network. Please try refreshing or return to homepage.'}
      </p>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => reset()} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
