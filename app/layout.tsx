import type { Metadata } from 'next';
import { Poppins, Vazirmatn } from 'next/font/google';
import CustomCursor from '@/components/CustomCursor';
import './globals.css';
import localFont from 'next/font/local'

// Persian-first typography. Vazirmatn covers Arabic script well; Latin fallback included.
const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
});


const poppins = Poppins({ subsets: ['latin'], weight: '400' })


const nian = localFont({
  src: [
    {
      path: '../public/fonts/nian/Nian ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/nian/Nian Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/nian/Nian.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/nian/Nian Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/nian/Nian SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },

    {
      path: '../public/fonts/nian/Nian Bold.ttf',
      weight: '700',
      style: 'normal',
    },

    {
      path: '../public/fonts/nian/Nian Black.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-nian-source',
})

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
      <body className={`${vazir.variable} ${poppins.className} ${nian.variable} font-sans antialiased`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
