import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductActions from '@/components/ProductActions';
import { categories, brands } from '@/lib/data/catalog';
import { formatToman, sampleParts, samplePrices } from '@/lib/data/sampleParts';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return sampleParts.map((part) => ({ id: part.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const part = sampleParts.find((item) => item.id === id);
  if (!part) return { title: 'قطعه یافت نشد | پایا یدک' };

  return {
    title: `${part.name_fa} | پایا یدک`,
    description: `مشخصات، قیمت و سازگاری ${part.name_fa} با خودروهای ایسوزو.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const part = sampleParts.find((item) => item.id === id);
  if (!part) notFound();

  const category = categories.find((item) => item.id === part.category);
  const brand = brands.find((item) => item.id === part.brand);
  const price = samplePrices[part.id];

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به نتایج
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-start">
            <div className="glass-strong relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/images/hero/truck-neon-road.jpg"
                alt={part.name_fa}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(3,6,24,.72)_100%)]" />
              <span className="absolute right-4 top-4 border border-[#3aa0ff]/30 bg-[#06102b]/80 px-3 py-1 text-xs text-[#8fd4ff] backdrop-blur-md">
                تصویر نمایشی قطعه و خودرو
              </span>
            </div>

            <div className="lg:pt-4">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-[var(--neon-orange)]/15 px-3 py-1 text-[var(--neon-orange)]">
                  {category?.name_fa}
                </span>
                <span className="border border-white/10 px-3 py-1 text-white/55">{brand?.name_fa}</span>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {part.name_fa}
              </h1>
              <p className="mt-2 text-sm text-white/45" dir="ltr">
                {part.name_en}
              </p>

              <div className="mt-6 border-y border-white/10 py-5">
                <p className="text-xs text-white/45">قیمت دمو</p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {price ? formatToman(price) : 'استعلام قیمت'}
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4">
                  <dt className="text-xs text-white/45">شماره فنی</dt>
                  <dd className="mt-1 font-bold text-white" dir="ltr">{part.part_number}</dd>
                </div>
                <div className="glass rounded-xl p-4">
                  <dt className="text-xs text-white/45">شماره OEM</dt>
                  <dd className="mt-1 font-bold text-white" dir="ltr">{part.oem_number ?? 'ندارد'}</dd>
                </div>
                <div className="glass rounded-xl p-4">
                  <dt className="text-xs text-white/45">موجودی</dt>
                  <dd className="mt-1 font-bold text-white">{part.stock.toLocaleString('fa-IR')} عدد</dd>
                </div>
                <div className="glass rounded-xl p-4">
                  <dt className="text-xs text-white/45">زمان ارسال</dt>
                  <dd className="mt-1 font-bold text-white">{part.lead_time_days ?? 1} روز کاری</dd>
                </div>
              </dl>

              <div className="mt-6">
                <ProductActions />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'ضمانت اصالت', text: 'کنترل شماره فنی و بسته‌بندی پیش از ارسال' },
              { icon: PackageCheck, title: 'موجودی شفاف', text: 'اطلاع از موجودی و زمان تأمین قطعه' },
              { icon: Truck, title: 'ارسال سراسری', text: 'ارسال مطمئن به سراسر ایران با امکان پیگیری' },
            ].map((feature) => (
              <article key={feature.title} className="glass rounded-2xl p-5">
                <feature.icon className="h-6 w-6 text-[var(--neon-orange)]" />
                <h2 className="mt-4 font-bold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{feature.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 glass-strong rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">سازگاری با خودرو</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {(part.compatible_models ?? ['npr']).map((model) => (
                <span
                  key={model}
                  className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#5ec8ff]" />
                  ایسوزو {model.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
