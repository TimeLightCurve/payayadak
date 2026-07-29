'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plane } from 'lucide-react';
import TruckImageShowcase from '@/components/neon/TruckImageShowcase';

export default function Hero() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <section className="hero-night relative flex min-h-[100svh] flex-col overflow-hidden pt-[4.5rem] pb-8 sm:pt-20 sm:pb-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(21,78,141,.26),transparent_43%)]" />

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col px-3 sm:px-6 lg:px-8">
        <div className="mt-2 max-w-2xl text-start sm:mt-4 md:mt-8">
          <p className="mb-2 text-xs tracking-wide text-white/55 sm:mb-3 sm:text-sm">
            شرکت تجارت بین‌المللی پایا یدک
          </p>
          <h1 className="text-[1.85rem] font-extrabold leading-[1.2] sm:text-5xl md:text-6xl">
            <span className="brand-gradient-text">مرجع تخصصی</span>
            <br />
            <span className="text-white">قطعات یدکی ایسوزو</span>
          </h1>
          <p className="mt-3 max-w-lg text-[0.8125rem] leading-relaxed text-white/65 sm:mt-4 sm:text-base">
            قطعه سازگار با کامیونت و کامیون نیمه‌سنگین ایسوزو را پیدا کنید؛ موجودی، کیفیت
            و زمان تحویل را ببینید یا برای قطعات حساس از کارشناس کمک بگیرید.
          </p>
        </div>

        <div className="relative -mx-3 my-4 flex flex-none items-center justify-center sm:mx-0 sm:my-6 sm:min-h-0 sm:flex-1 md:my-8">
          <TruckImageShowcase
            onAddPart={(id) => {
              setToast(`قطعه ${id} به سبد اضافه شد`);
              window.setTimeout(() => setToast(null), 2200);
            }}
          />
        </div>

        <div className="mb-2 flex flex-col items-stretch gap-4 sm:mb-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-[0.8125rem] leading-relaxed text-white/60 sm:text-base">
            نمایندگی و توزیع قطعات اصلی کامیونت و کامیون ایسوزو. اصالت کالا، مشاوره فنی،
            ارسال سریع به سراسر ایران.
          </p>
          <div className="grid shrink-0 grid-cols-1 gap-2.5 sm:flex sm:flex-row sm:gap-3">
            <Link
              href="/products"
              className="group inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--neon-orange)] px-5 py-3 text-sm font-semibold text-white transition-smooth hover:brightness-110"
            >
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/special-order"
              className="inline-flex min-h-11 items-center justify-center gap-1 border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-smooth hover:bg-white/10"
            >
              تأمین ویژه و فوری
              <Plane className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 madar-card px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
