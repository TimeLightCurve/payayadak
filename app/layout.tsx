import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import CustomCursor from '@/components/CustomCursor';
import './globals.css';

// Persian-first typography. Vazirmatn covers Arabic script well; Latin fallback included.
const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
});

export const metadata: Metadata = {
  title: 'پایا یدک | قطعات یدکی ایسوزو',
  description:
    'شرکت تجارت بین‌المللی پایا یدک. تأمین و توزیع قطعات یدکی اصلی کامیونت و کامیون ایسوزو در سراسر ایران.',
  keywords: [
    'قطعات ایسوزو',
    'لوازم یدکی ایسوزو',
    'کامیونت ایسوزو',
    'پایا یدک',
    'Isuzu parts',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} font-sans antialiased`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
