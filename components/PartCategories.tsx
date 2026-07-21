'use client';

import { useState } from 'react';
import Link from 'next/link';
import { categories } from '@/lib/data/catalog';
import CategoryVisual from '@/components/CategoryVisual';

export default function PartCategories() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-3xl font-extrabold text-white md:text-5xl">
            دسته‌بندی قطعات
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60 md:text-xl">
            طیف کاملی از قطعات یدکی موتوری، انتقال قدرت و بدنه ایسوزو
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              className="group glass rounded-2xl golden-padding-lg hover:glass-strong transition-smooth text-center interactive-padding flex flex-col items-center"
            >
              <div className="mb-3 transform group-hover:scale-110 transition-transform">
                <CategoryVisual
                  categoryId={c.id}
                  image={c.image}
                  className="w-16 h-16"
                  iconClassName="w-8 h-8"
                />
              </div>
              <h3 className="mb-1 text-base font-bold text-white md:text-lg">{c.name_fa}</h3>
              <p className="text-xs text-white/45 md:text-sm">{c.name_en}</p>
              <div
                className={`mt-3 h-1 rounded-full brand-gradient transition-all duration-300 ${
                  hovered === c.id ? 'w-12' : 'w-0'
                }`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
