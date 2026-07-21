'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/10 bg-[rgba(3,6,24,0.85)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center bg-[var(--neon-orange)]">
                <span className="text-lg font-extrabold text-white">پ</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold text-white">پایا یدک</span>
                <span className="text-[10px] text-white/50">قطعات یدکی ایسوزو</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              تأمین و توزیع قطعات یدکی اصلی ایسوزو برای کامیونت و کامیون در سراسر ایران.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">دسترسی سریع</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'صفحه اصلی' },
                { href: '/products', label: 'محصولات' },
                { href: '/#categories', label: 'دسته‌بندی‌ها' },
                { href: '/contact', label: 'ارتباط با ما' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-smooth hover:text-[var(--neon-orange)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">خدمات</h3>
            <ul className="space-y-2">
              {[
                { href: '/products', label: 'درخواست قیمت' },
                { href: '/products?category=engine', label: 'قطعات موتور' },
                { href: '/products?category=brake', label: 'قطعات ترمز' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-smooth hover:text-[var(--neon-orange)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 text-[var(--neon-orange)]" />
                <span dir="ltr">021-000 000 00</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 text-[var(--neon-orange)]" />
                <span dir="ltr">info@payayadak.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-[var(--neon-orange)]" />
                <span>تهران، ایران</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/50">© ۱۴۰۴ پایا یدک. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
