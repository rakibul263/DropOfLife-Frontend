import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { AmbientBackground } from '@/components/shared/AmbientBackground';
import { TermsModal } from '@/components/shared/TermsModal';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { LiquidToastContainer } from '@/components/shared/LiquidToast';
import { ScrollAnimationProvider } from '@/providers/ScrollAnimationProvider';

export const metadata: Metadata = {
  title: 'DropOfLife — জীবনের এক ফোঁটা | Emergency Blood Donation Platform',
  description:
    'Real-time emergency blood donation, blood bank inventory tracking, and volunteer network saving lives across Bangladesh.',
  keywords: [
    'Blood Donation',
    'Emergency Blood',
    'Blood Bank',
    'DropOfLife',
    'Bangladesh Blood Donors',
    'Life Saver',
  ],
  authors: [{ name: 'DropOfLife Engineering Team' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-rose-600 selection:text-white relative"
      >
        <AmbientBackground />
        <QueryProvider>
          <ScrollAnimationProvider>
            <TermsModal />
            <Navbar />
            <main className="flex-1 flex flex-col relative z-10">{children}</main>
            <Footer />
            <NotificationBell />
            <LiquidToastContainer />
          </ScrollAnimationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
