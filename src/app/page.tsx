'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BloodGroup } from '@/types';
import { UrgencyTicker } from '@/components/blood/UrgencyTicker';
import { StatsOverview } from '@/components/blood/StatsOverview';
import { BloodCompatibilityMatrix } from '@/components/blood/BloodCompatibilityMatrix';
import { EligibilityChecker } from '@/components/blood/EligibilityChecker';
import { HospitalAlliance } from '@/components/blood/HospitalAlliance';
import { HeroSection } from '@/components/home/HeroSection';
import { HeroBannerShowcase } from '@/components/home/HeroBannerShowcase';
import { BloodDonationProcessInteractive } from '@/components/home/BloodDonationProcessInteractive';
import { RoleWorkflows } from '@/components/home/RoleWorkflows';
import { EmergencyCtaSection } from '@/components/home/EmergencyCtaSection';

import { ScrollReveal } from '@/components/shared/ScrollReveal';

export default function HomePage() {
  const router = useRouter();
  const [selectedQuickBlood, setSelectedQuickBlood] = useState<BloodGroup>('O+');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/donors?bloodGroup=${encodeURIComponent(selectedQuickBlood)}`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Hero Section with Compact Command Hub & Quick Blood Search */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-16 border-b border-zinc-800/60 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.14),rgba(9,9,11,0))]">
        <div className="relative z-10 w-full max-w-[96%] sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] mx-auto px-2 sm:px-6">
          <HeroSection
            selectedBlood={selectedQuickBlood}
            onSelectBlood={setSelectedQuickBlood}
            onQuickSearch={handleQuickSearch}
          />
          <HeroBannerShowcase />
        </div>
      </section>

      {/* Main Content Area: Harmonized Container */}
      <div className="w-full max-w-[96%] sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] mx-auto space-y-16 sm:space-y-20 py-10 sm:py-14 px-2 sm:px-6">
        {/* 2. Real-time Impact Telemetry Metrics */}
        <ScrollReveal animation="fade-up" duration={800} threshold={0.1}>
          <StatsOverview />
        </ScrollReveal>

        {/* 3. The Real Clinical Blood Donation Journey */}
        <ScrollReveal animation="fade-up" duration={800} threshold={0.1}>
          <BloodDonationProcessInteractive />
        </ScrollReveal>

        {/* 4. Interactive Blood Compatibility Matrix */}
        <ScrollReveal animation="fade-up" duration={800} threshold={0.1}>
          <BloodCompatibilityMatrix />
        </ScrollReveal>

        {/* 5. Medical Pre-Screening Donor Eligibility Quiz */}
        <ScrollReveal animation="fade-up" duration={800} threshold={0.1}>
          <EligibilityChecker />
        </ScrollReveal>

        {/* 6. DGHS Hospital & Blood Bank Network */}
        <ScrollReveal animation="fade-up" duration={800} threshold={0.1}>
          <HospitalAlliance />
        </ScrollReveal>

        {/* 7. Modular Role-Based Workflows */}
        <ScrollReveal animation="fade-up" duration={800} threshold={0.1}>
          <RoleWorkflows />
        </ScrollReveal>

        {/* 8. 24/7 National Emergency Hotline Call-to-Action */}
        <ScrollReveal animation="zoom-in" duration={850} threshold={0.15}>
          <EmergencyCtaSection />
        </ScrollReveal>
      </div>
    </div>
  );
}
