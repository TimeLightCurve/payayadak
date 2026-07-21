'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const navLinks = [
  { href: '/products', label: 'محصولات' },
  { href: '/products', label: 'برندها' },
  { href: '/products', label: 'درباره ما' },
  { href: '/products', label: 'تماس با ما' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled ? 'bg-[rgba(6,11,39,0.92)] backdrop-blur-md' : 'bg-[rgba(6,11,39,0.55)] backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6">
        {/* Madar-style primary CTA */}
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-1 bg-[var(--neon-orange)] px-3 py-2.5 text-xs font-semibold text-white sm:px-4 sm:text-sm"
        >
          شروع کنید
          <ChevronDown className="h-3.5 w-3.5" />
        </Link>

        {/* Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--neon-orange)]">
            <span className="text-sm font-extrabold text-white">پ</span>
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-extrabold tracking-wide text-white sm:text-base">
              پایا یدک
            </span>
            <span className="hidden text-[9px] text-white/55 sm:block">قطعات یدکی ایسوزو</span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
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
        <div className="border-t border-white/10 bg-[rgba(6,11,39,0.98)] px-4 py-4">
          <div className="mx-auto max-w-7xl space-y-1">
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
            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-3 inline-flex bg-[var(--neon-orange)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
