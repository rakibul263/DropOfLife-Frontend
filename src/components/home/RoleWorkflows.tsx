'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Droplet, Building2, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { homeTranslations } from '@/lib/translations';
import { ScrollReveal } from '@/components/shared/ScrollReveal';


export function RoleWorkflows() {
  const { language } = useLanguageStore();
  const t = homeTranslations[language].roles;

  const roles = [
    {
      role: t.donorRole,
      icon: Droplet,
      iconColor: 'text-rose-400 bg-rose-950/80 border-rose-700/60 shadow-md shadow-rose-950/50',
      title: t.donorTitle,
      description: t.donorDesc,
      features: [t.donorF1, t.donorF2, t.donorF3],
      ctaText: t.donorCta,
      ctaLink: '/register',
    },
    {
      role: t.providerRole,
      icon: Building2,
      iconColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-700/60 shadow-md shadow-cyan-950/50',
      title: t.providerTitle,
      description: t.providerDesc,
      features: [t.providerF1, t.providerF2, t.providerF3],
      ctaText: t.providerCta,
      ctaLink: '/register?role=provider',
    },
    {
      role: t.recipientRole,
      icon: AlertTriangle,
      iconColor: 'text-amber-400 bg-amber-950/80 border-amber-700/60 shadow-md shadow-amber-950/50',
      title: t.recipientTitle,
      description: t.recipientDesc,
      features: [t.recipientF1, t.recipientF2, t.recipientF3],
      ctaText: t.recipientCta,
      ctaLink: '/emergency-requests',
    },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs uppercase font-extrabold tracking-widest text-rose-400">
          {t.badge}
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
          {t.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {roles.map((item, index) => {
          const Icon = item.icon;
          return (
            <ScrollReveal
              key={item.role}
              animation="fade-up"
              delay={index * 140}
              duration={750}
              className="h-full flex flex-col"
            >
              <Card
                variant="default"
                hoverEffect
                className="p-5 sm:p-8 lg:p-9 h-full flex flex-col justify-between group shadow-2xl transition-all duration-300 revealed-card-hover"
              >
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${item.iconColor} mb-6`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                        {item.role}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 group-hover:text-rose-400 transition-colors line-clamp-2 min-h-[56px] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-200 mt-3 leading-relaxed font-normal min-h-[84px] line-clamp-4">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-zinc-800/80 min-h-[120px]">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-auto border-t border-zinc-800/80 shrink-0">
                  <Link href={item.ctaLink} className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-center group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 font-extrabold text-xs sm:text-sm py-3 transition-all"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
