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
import { ChatBot } from '@/components/shared/ChatBot';

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
    <html lang="bn" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
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
            <ChatBot />
          </ScrollAnimationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
