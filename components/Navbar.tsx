'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search, Languages, Zap } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const navLinks = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/products', label: 'محصولات' },
  { href: '/special-order', label: 'سفارش ویژه و فوری' },
  { href: '/#categories', label: 'دسته‌بندی قطعات' },
  { href: '/contact', label: 'ارتباط با ما' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-90 font-nian transition-smooth ${
        isScrolled ? 'bg-[#060b27eb]/40 backdrop-blur-xl' : 'bg-[#060b278c]/40 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-6">
        {/* Madar-style primary CTA */}
        <Link
          href="/special-order"
          className="inline-flex shrink-0 items-center gap-1  px-3 py-2.5 text-sm font-semibold text-white sm:px-4 sm:text-lg"
        >
          سفارش فوری
          <Zap className="h-3.5 w-3.5" />
        </Link>

        {/* Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--neon-orange)]">
            <span className="text-sm font-extrabold text-white">پ</span>
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-base font-extrabold tracking-wide text-white sm:text-lg">
              پایا یدک
            </span>
            <span className="hidden text-base text-white/55 sm:block">قطعات یدکی ایسوزو</span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/en"
            aria-label="English"
            className="inline-flex items-center gap-1 px-2 py-2 text-lg font-semibold text-white/80 transition-smooth hover:text-[var(--neon-orange)]"
          >
            <Languages className="h-6 w-6" />
            EN
          </Link>
          <Link
            href="/products"
            aria-label="جستجو"
            className="hidden p-2 text-white/80 transition-smooth hover:text-[var(--neon-orange)] sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/cart" aria-label="سبد خرید" className="relative p-2 text-white/80">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link href="/profile" aria-label="پروفایل" className="p-2 text-white/80">
                <User className="h-5 w-5" />
              </Link>
              <span className="hidden text-xs text-white/70 lg:block">
                {user?.name_fa || user?.name_en || 'کاربر'}
              </span>
            </>
          ) : null}

          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="منو"
            className="p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#060b27fa]/20 backdrop-blur-xl px-4 py-5">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs tracking-widest text-white/35">منوی پایا یدک</p>
            <div className="space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block border-b border-white/10 py-3 text-lg text-white transition-smooth hover:text-[var(--neon-orange)]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            {!isAuthenticated && (
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-3 inline-flex bg-[var(--neon-orange)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                درخواست مشاوره
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
