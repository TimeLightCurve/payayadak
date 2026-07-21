'use client';

import Link from 'next/link';
import { brands } from '@/lib/data/catalog';

export default function Brands() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto glass-strong rounded-3xl golden-padding-xl">
        <div className="text-center mb-8">
          <h2 className="mb-3 text-2xl font-extrabold text-white md:text-4xl">
            برندهای تحت پوشش
          </h2>
          <p className="text-white/60">قطعات اصلی و باکیفیت برای ناوگان سنگین و نیمه‌سنگین</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/products?brand=${b.id}`}
              className="glass rounded-xl py-5 px-4 text-center hover:glass-strong transition-smooth interactive-padding flex flex-col items-center justify-center"
            >
              <span className="text-lg font-bold text-white">{b.name_fa}</span>
              <span className="mt-1 text-xs text-white/45">{b.name_en}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
