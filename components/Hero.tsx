'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import NeonTrails from '@/components/neon/NeonTrails';
import WireframeTruck from '@/components/neon/WireframeTruck';

export default function Hero() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden pt-20 pb-10">
      <NeonTrails />

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {/* Madar-style headline */}
        <div className="mt-4 max-w-xl text-start md:mt-8">
          <p className="mb-3 text-sm tracking-wide text-white/55">
            شرکت تجارت بین‌المللی پایا یدک
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.15] sm:text-5xl md:text-6xl">
            <span className="brand-gradient-text">مرجع تخصصی</span>
            <br />
            <span className="text-white">قطعات یدکی ایسوزو</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
            روی نقاط درخشان کامیون بزنید — نام قطعه، شماره فنی و قیمت به تومان را ببینید و
            مستقیم به سبد اضافه کنید.
          </p>
        </div>

        {/* Interactive neon camion */}
        <div className="relative my-6 flex flex-1 items-center justify-center md:my-8">
          <WireframeTruck
            onAddPart={(id) => {
              setToast(`قطعه ${id} به سبد اضافه شد`);
              window.setTimeout(() => setToast(null), 2200);
            }}
          />
        </div>

        {/* CTAs + supporting line */}
        <div className="mb-4 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-end">
          <p className="max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            نمایندگی و توزیع قطعات اصلی کامیونت و کامیون ایسوزو — اصالت کالا، مشاوره فنی،
            ارسال سریع به سراسر ایران.
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 bg-[var(--neon-orange)] px-5 py-3 text-sm font-semibold text-white transition-smooth hover:brightness-110"
            >
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-1 border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-smooth hover:bg-white/10"
            >
              شروع کنید
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 madar-card px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
