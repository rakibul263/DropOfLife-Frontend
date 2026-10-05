'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Download, Heart } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { supportTranslations, formatTaka } from '@/lib/translations';

interface PaymentSuccessReceiptProps {
  receipt: any;
  finalAmount: number;
  onReset: () => void;
}

export function PaymentSuccessReceipt({
  receipt,
  finalAmount,
  onReset,
}: PaymentSuccessReceiptProps) {
  const { language } = useLanguageStore();
  const t = supportTranslations[language];

  const handlePrint = () => {
    window.print();
  };

  const purposeLabel =
    receipt?.paymentPurpose === 'Cold_Chain_Courier'
      ? t.courierTitle
      : t.subsidyTitle;

  return (
    <Card className="p-8 sm:p-12 text-center border-emerald-500/50 bg-gradient-to-b from-zinc-900 via-zinc-900 to-emerald-950/40 space-y-6 shadow-2xl ring-1 ring-emerald-500/20">
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/40">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.receiptTitle}
        </h2>
        <p className="text-zinc-200 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          {t.receiptDesc}
        </p>
      </div>

      {/* Official Transaction Receipt Breakdown */}
      <div className="bg-zinc-950 border border-zinc-700/80 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 font-mono text-xs sm:text-sm shadow-xl">
        <div className="flex justify-between border-b border-zinc-800 pb-2.5">
          <span className="text-zinc-300 font-semibold">{t.receiptAmount}</span>
          <span className="text-white font-extrabold text-base">
            {formatTaka(finalAmount, language)}
          </span>
        </div>
        <div className="flex justify-between border-b border-zinc-800 pb-2.5">
          <span className="text-zinc-300 font-semibold">{t.receiptTrxId}</span>
          <span className="text-zinc-100 font-bold truncate max-w-[200px]">
            {receipt?.stripePaymentIntentId || `trx_bdt_${Date.now()}`}
          </span>
        </div>
        <div className="flex justify-between border-b border-zinc-800 pb-2.5">
          <span className="text-zinc-300 font-semibold">{t.receiptPurpose}</span>
          <span className="text-rose-400 font-extrabold">{purposeLabel}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-zinc-300 font-semibold">{t.receiptStatus}</span>
          <span className="text-emerald-400 font-extrabold uppercase">
            {t.receiptStatusVal}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        >
          <Download className="w-4 h-4 mr-2" />
          {t.printBtn}
        </Button>
        <Button
          onClick={onReset}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
        >
          <Heart className="w-4 h-4 mr-2" />
          {t.againBtn}
        </Button>
      </div>
    </Card>
  );
}
