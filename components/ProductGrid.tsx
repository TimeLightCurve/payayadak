'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, PackageCheck, Clock, ArrowLeft } from 'lucide-react';
import { categories, brands } from '@/lib/data/catalog';
import { sampleParts, samplePrices, formatToman } from '@/lib/data/sampleParts';
import CategoryVisual from '@/components/CategoryVisual';

interface Props {
  initialCategory?: string;
  initialBrand?: string;
}

export default function ProductGrid({ initialCategory, initialBrand }: Props) {
  const [category, setCategory] = useState(initialCategory ?? 'all');
  const [brand, setBrand] = useState(initialBrand ?? 'all');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleParts.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (
        q &&
        !p.name_fa.toLowerCase().includes(q) &&
        !p.name_en.toLowerCase().includes(q) &&
        !p.part_number.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [category, brand, query]);

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search + filters */}
      <div className="glass-strong rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام قطعه یا شماره فنی…"
            className="w-full glass rounded-xl py-3 pr-11 pl-4 text-white placeholder:text-white/40 outline-none focus:glass-strong transition-smooth bg-transparent"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="glass rounded-xl py-3 px-4 text-white outline-none focus:glass-strong transition-smooth bg-transparent"
        >
          <option value="all">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_fa}
            </option>
          ))}
        </select>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="glass rounded-xl py-3 px-4 text-white outline-none focus:glass-strong transition-smooth bg-transparent"
        >
          <option value="all">همه برندها</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name_fa}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-white/50 mb-4">{results.length} قطعه یافت شد</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((p) => {
          const cat = categories.find((c) => c.id === p.category);
          return (
            <article
              key={p.id}
              className="glass rounded-2xl overflow-hidden hover:glass-strong transition-smooth flex flex-col"
            >
              <Link
                href={`/products/${p.id}`}
                className="group relative flex h-40 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(58,160,255,.15),transparent_68%)]"
              >
                <div className="absolute inset-x-8 bottom-5 h-px bg-gradient-to-r from-transparent via-[#3aa0ff]/60 to-transparent shadow-[0_0_12px_#3aa0ff]" />
                <CategoryVisual
                  categoryId={p.category}
                  image={p.image_url || cat?.image}
                  className="w-20 h-20 transition duration-300 group-hover:scale-110"
                  iconClassName="w-10 h-10"
                />
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs text-[var(--neon-orange)] font-semibold mb-1">
                  {cat?.name_fa}
                </span>
                <Link
                  href={`/products/${p.id}`}
                  className="mb-1 font-bold leading-snug text-white transition hover:text-[var(--neon-orange)]"
                >
                  {p.name_fa}
                </Link>
                <p className="text-xs text-white/40 mb-3" dir="ltr">
                  {p.part_number}
                </p>

                <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <PackageCheck className="w-3.5 h-3.5" />
                    موجود: {p.stock}
                  </span>
                  {p.lead_time_days ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {p.lead_time_days} روز
                    </span>
                  ) : null}
                </div>

                <div className="mt-auto flex items-end justify-between gap-3">
                  <span className="font-extrabold text-white">
                    {samplePrices[p.id] ? formatToman(samplePrices[p.id]) : 'استعلام قیمت'}
                  </span>
                  <Link
                    href={`/products/${p.id}`}
                    className="inline-flex min-h-10 items-center gap-1 border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-[var(--neon-orange)] hover:text-[var(--neon-orange)]"
                  >
                    جزئیات
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center text-white/50">
          قطعه‌ای با این مشخصات یافت نشد.
        </div>
      )}
    </div>
  );
}
