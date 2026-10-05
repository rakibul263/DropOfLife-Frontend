import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Droplet, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 min-h-[65vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 text-rose-500">
        <Droplet className="w-10 h-10" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        The life-saving page or requisition you are looking for does not exist or has been relocated.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary" className="gap-2">
            <Home className="w-4 h-4" /> Return to Home
          </Button>
        </Link>
        <Link href="/donors">
          <Button variant="secondary" className="gap-2">
            <Search className="w-4 h-4" /> Find Donors
          </Button>
        </Link>
      </div>
    </div>
  );
}
