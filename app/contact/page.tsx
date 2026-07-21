import type { Metadata } from 'next';
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'ارتباط با ما | پایا یدک',
  description: 'ارتباط با کارشناسان فروش و مشاوره فنی قطعات یدکی ایسوزو پایا یدک.',
};

const contactItems = [
  {
    icon: Phone,
    title: 'تلفن فروش',
    value: '021-000 000 00',
    href: 'tel:+982100000000',
    dir: 'ltr' as const,
  },
  {
    icon: MessageCircle,
    title: 'واتساپ',
    value: 'پیام مستقیم به کارشناس',
    href: '#contact-form',
  },
  {
    icon: Mail,
    title: 'ایمیل',
    value: 'info@payayadak.com',
    href: 'mailto:info@payayadak.com',
    dir: 'ltr' as const,
  },
  {
    icon: Clock3,
    title: 'ساعات پاسخگویی',
    value: 'شنبه تا پنجشنبه، ۸ تا ۱۸',
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(58,160,255,.15),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[var(--neon-orange)]">ارتباط با پایا یدک</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              برای پیدا کردن قطعه
              <br />
              کنار شما هستیم
            </h1>
            <p className="mt-5 max-w-2xl leading-relaxed text-white/60">
              شماره فنی، مدل خودرو یا تصویر قطعه را ارسال کنید. کارشناسان فروش و فنی برای
              استعلام موجودی و انتخاب قطعه سازگار راهنمایی‌تان می‌کنند.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactItems.map((item) => {
              const content = (
                <>
                  <item.icon className="h-6 w-6 text-[#5ec8ff]" />
                  <h2 className="mt-4 text-sm text-white/45">{item.title}</h2>
                  <p className="mt-1 font-bold text-white" dir={item.dir}>{item.value}</p>
                </>
              );

              return item.href ? (
                <a key={item.title} href={item.href} className="glass rounded-2xl p-5 transition hover:glass-strong">
                  {content}
                </a>
              ) : (
                <article key={item.title} className="glass rounded-2xl p-5">{content}</article>
              );
            })}
          </div>

          <div id="contact-form" className="mt-12 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white">درخواست مشاوره</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  فرم را تکمیل کنید تا درخواست شما برای تیم فروش ثبت شود.
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <MapPin className="h-6 w-6 text-[var(--neon-orange)]" />
                <h3 className="mt-4 font-bold text-white">دفتر مرکزی</h3>
                <p className="mt-2 text-sm text-white/55">تهران، ایران</p>
                <div className="mt-5 h-40 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(58,160,255,.22),transparent_65%),linear-gradient(135deg,#0b1d45,#05091f)]">
                  <div className="flex h-full items-center justify-center">
                    <span className="border border-[#3aa0ff]/30 px-4 py-2 text-xs text-[#8fd4ff]">
                      نقشه در نسخه نهایی
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
