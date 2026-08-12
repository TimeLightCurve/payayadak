import Link from 'next/link';
import {
  BadgeCheck,
  Boxes,
  Cog,
  Container,
  Factory,
  Gauge,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { brands } from '@/lib/data/catalog';

const brandIcons: Record<string, LucideIcon> = {
  isuzu: Truck,
  'bahman-diesel': Factory,
  amico: Container,
  hino: Gauge,
  iveco: Cog,
  volvo: ShieldCheck,
  scania: Boxes,
  benz: BadgeCheck,
};

export default function Brands() {
  return (
    <section
      id="brands"
      className="relative isolate overflow-clip font-nian text-white"
    >
      <div
        dir="ltr"
        className="relative mx-auto grid max-w-[1600px] lg:min-h-[62rem] lg:grid-cols-[34%_66%]"
      >
        <header
          dir="rtl"
          className="flex h-fit min-h-80 flex-col justify-center border-white/10 px-5 py-20 text-right sm:px-8 lg:sticky lg:top-20 lg:min-h-[calc(100svh-5rem)] lg:self-start lg:border-r lg:px-10 xl:px-16"
        >
          <p className="mb-5 text-xl font-bold tracking-[0.22em] text-[#ff6248]">
            برندهای معتبر، انتخاب مطمئن
          </p>
          <h2 className="max-w-lg text-4xl font-black leading-[1.35] sm:text-5xl lg:text-[5.4rem]">
            کیفیتی که به آن
            <span className="block text-[#ff6248]">اعتماد دارید</span>
          </h2>
          <p className="mt-7 max-w-md text-base leading-8 text-white/55">
            مجموعه‌ای از برندهای معتبر قطعات خودروهای سنگین و نیمه‌سنگین، برای انتخابی دقیق و مطمئن.
          </p>
        </header>

        <div dir="rtl" className="px-4 pb-20 sm:px-7 lg:px-10 lg:py-20 xl:px-16 xl:py-28">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {brands.map((brand, index) => {
              const BrandIcon = brandIcons[brand.id] ?? Truck;

              return (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.id}`}
                  aria-label={`مشاهده قطعات برند ${brand.name_fa}`}
                  className="group relative flex min-h-64 flex-col overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.055] p-5 text-right shadow-[0_24px_65px_rgba(0,0,0,.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ff6248]/45 hover:bg-white/[0.085] sm:min-h-72 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <span className="text-[11px] tabular-nums text-white/35">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">
                        {brand.name_fa}
                      </h3>
                      <p className="mt-1 text-xs tracking-[0.14em] text-white/40" dir="ltr">
                        {brand.name_en}
                      </p>
                    </div>
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#ff6248] opacity-0 shadow-[0_0_18px_#ff6248] transition group-hover:opacity-100" />
                  </div>

                  <div className="my-4 h-px w-full bg-white/10" />

                  <div className="flex flex-1 items-center justify-center">
                    <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                      <span className="absolute inset-0 rounded-full border border-[#ff6248]/20 transition duration-500 group-hover:scale-110 group-hover:border-[#ff6248]/45" />
                      <span className="absolute inset-3 rounded-full border border-white/10 transition duration-500 group-hover:-rotate-12" />
                      <BrandIcon
                        aria-hidden="true"
                        strokeWidth={1.25}
                        className="relative h-14 w-14 text-white transition duration-300 group-hover:text-[#ff6248] sm:h-16 sm:w-16"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/45">
                    <span>مشاهده قطعات برند</span>
                    <span className="text-lg leading-none text-[#ff6248] transition group-hover:-translate-x-1">←</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
