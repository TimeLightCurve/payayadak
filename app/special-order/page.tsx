'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, PackageSearch, Plane, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const steps = [
  { icon: PackageSearch, title: 'ثبت مشخصات', text: 'مدل خودرو، شماره فنی، تصویر و میزان فوریت را ارسال کنید.' },
  { icon: ShieldCheck, title: 'بررسی کارشناسی', text: 'سازگاری، مسیر تأمین و سطح کیفیت پیش از قیمت‌گذاری بررسی می‌شود.' },
  { icon: Plane, title: 'تأمین و حمل', text: 'پس از تأیید پیش‌فاکتور، تأمین خارجی و حمل هوایی یا عادی برنامه‌ریزی می‌شود.' },
];

export default function SpecialOrderPage() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(232,98,61,.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowRight className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[.88fr_1.12fr]">
            <div>
              <span className="inline-flex items-center gap-2 border border-orange-400/30 bg-orange-400/10 px-3 py-2 text-xs font-bold text-orange-200">
                <Clock3 className="h-4 w-4" />
                مسیر ویژه قطعات کمیاب و فوری
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
                فروش ویژه؛
                <span className="brand-gradient-text block">تأمین خارجی و حمل هوایی</span>
              </h1>
              <p className="mt-5 max-w-xl leading-8 text-white/65">
                برای قطعاتی که در بازار موجود نیستند یا توقف خودرو هزینه بالایی ایجاد می‌کند،
                پایا یدک مسیر کارشناسی، استعلام خارجی و تأمین فوری را مدیریت می‌کند.
              </p>

              <div className="mt-8 space-y-3">
                {steps.map(({ icon: Icon, title, text }, index) => (
                  <div key={title} className="madar-card flex gap-4 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-orange-500/15 text-orange-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{index + 1}. {title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/55">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-strong p-5 sm:p-8">
              {submitted ? (
                <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-16 w-16 text-cyan-300" />
                  <h2 className="mt-5 text-2xl font-extrabold">درخواست نمایشی ثبت شد</h2>
                  <p className="mt-3 max-w-md leading-7 text-white/60">
                    در نسخه عملیاتی، درخواست به CRM تخصیص داده می‌شود و کارشناس با SLA مشخص
                    برای تکمیل اطلاعات و اعلام مسیر تأمین تماس می‌گیرد.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-7 bg-[var(--neon-orange)] px-6 py-3 font-bold">
                    ثبت درخواست دیگر
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold">درخواست تأمین ویژه</h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">فیلدهای ستاره‌دار برای بررسی اولیه ضروری هستند.</p>
                  <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      ['نام و نام خانوادگی *', 'name', 'نام درخواست‌دهنده'],
                      ['شماره تماس *', 'phone', '09...'],
                      ['مدل خودرو *', 'vehicle', 'مثلاً Isuzu NPR'],
                      ['سال ساخت', 'year', 'مثلاً ۱۳۹۹'],
                      ['شماره فنی / OEM', 'partNumber', 'Part number'],
                      ['تعداد مورد نیاز *', 'quantity', '1'],
                    ].map(([label, name, placeholder]) => (
                      <label key={name} className="space-y-2">
                        <span className="text-sm text-white/70">{label}</span>
                        <input
                          required={label.includes('*')}
                          name={name}
                          placeholder={placeholder}
                          className="h-12 w-full border border-white/12 bg-white/5 px-4 text-white outline-none focus:border-orange-400"
                        />
                      </label>
                    ))}
                    <label className="space-y-2 sm:col-span-2">
                      <span className="text-sm text-white/70">میزان فوریت</span>
                      <select name="urgency" className="h-12 w-full border border-white/12 bg-[#071431] px-4 text-white">
                        <option>فوری — توقف خودرو</option>
                        <option>اولویت بالا — کمتر از ۱۴ روز</option>
                        <option>عادی — بهترین قیمت و زمان</option>
                      </select>
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                      <span className="text-sm text-white/70">شماره شاسی، توضیحات و نشانه‌های قطعه</span>
                      <textarea name="details" rows={5} className="w-full border border-white/12 bg-white/5 p-4 text-white outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                      <span className="text-sm text-white/70">تصویر قطعه یا پلاک خودرو</span>
                      <input type="file" multiple accept="image/*,.pdf" className="w-full border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/60" />
                    </label>
                    <button className="min-h-12 bg-[var(--neon-orange)] px-6 font-bold text-white sm:col-span-2">
                      ثبت درخواست و بررسی کارشناسی
                    </button>
                    <p className="text-xs leading-5 text-white/40 sm:col-span-2">
                      نسخه جلسه: ارسال اطلاعات نمایشی است و هنوز به CRM یا درگاه پرداخت متصل نیست.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
