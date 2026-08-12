'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, PackageCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import CategoryVisual from '@/components/CategoryVisual';
import { categories } from '@/lib/data/catalog';
import { formatToman, sampleParts, samplePrices } from '@/lib/data/sampleParts';

const initialCategory =
  categories.find((category) =>
    sampleParts.some((part) => part.category === category.id),
  )?.id ?? categories[0]?.id ?? '';

export default function PartCategories() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory);

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? categories[0];

  const products = useMemo(
    () => sampleParts.filter((part) => part.category === selectedCategoryId),
    [selectedCategoryId],
  );

  const categoryCounts = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.id,
          sampleParts.filter((part) => part.category === category.id).length,
        ]),
      ),
    [],
  );

  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-transparent py-16 font-nian text-white md:py-24"
    >
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-right md:mb-14">
          <span className="mb-3 block text-lg font-bold tracking-[0.24em] text-[#ff6248]">
            کاتالوگ قطعات ایسوزو
          </span>
          <h2 className="text-3xl font-extrabold text-[#fff] md:text-5xl">
            دسته‌بندی قطعات
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            دسته موردنظر را انتخاب کنید تا قطعات موجود بدون خروج از صفحه نمایش داده شوند.
          </p>
        </header>

        <div
          dir="ltr"
          className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,34%)] lg:gap-0"
        >
          <div dir="rtl" className="order-2 min-w-0 lg:order-none lg:col-start-1 lg:row-start-1 lg:pr-8 xl:pr-12">
            {/* <div className="mb-5 flex items-end justify-between border-b border-[#10275d]/15 pb-4">
              <div>
                <p className="text-xs font-medium text-[#9aa8c3]">محصولات منتخب</p>
                <h3 className="mt-1 text-2xl font-semibold md:text-3xl text-white">
                  {selectedCategory?.name_fa}
                </h3>
              </div>
              <span className="text-sm tabular-nums text-[#10275d]/50">
                {new Intl.NumberFormat('fa-IR').format(products.length)} محصول
              </span>
            </div> */}

            {products.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="group flex min-h-[29rem] flex-col overflow-hidden rounded-0 bg-[#e9edf3]/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(16,39,93,.13)]"
                  >
                    <div className="px-5 pt-5 md:px-7 md:pt-6">
                      <p className="text-left text-[11px] tracking-[0.14em] text-[#9aa8c3]" dir="ltr">
                        {product.part_number}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        className="mt-1 block text-xl font-semibold leading-8 text-[#fff] transition hover:text-[#ff6248] md:text-2xl"
                      >
                        {product.name_fa}
                      </Link>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      aria-label={`مشاهده ${product.name_fa}`}
                      className="relative flex min-h-52 flex-1 items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-x-[12%] top-5 h-px border-t border-[#10275d]/20" />
                      <div className="absolute bottom-8 h-14 w-44 rounded-[50%] bg-[#3aa0ff]/10 blur-xl transition group-hover:bg-[#ff6248]/10" />
                      <CategoryVisual
                        categoryId={product.category}
                        image={product.image_url || selectedCategory?.image}
                        className="relative h-32 w-32 transition duration-500 group-hover:scale-105 md:h-40 md:w-40"
                        iconClassName="h-24 w-24 text-[#fff] md:h-28 md:w-28"
                      />
                    </Link>

                    <div className="px-5 pb-5 md:px-7 md:pb-6">
                      <p className="mb-4 text-sm text-[#fff]/55" dir="ltr">
                        {product.name_en}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#10275d]/12 pt-4 text-xs text-[#fff]/60">
                        <span className="inline-flex items-center gap-1.5 text-lg">
                          <PackageCheck className="h-6 w-6 text-[#ff6248]" />
                          موجودی {new Intl.NumberFormat('fa-IR').format(product.stock)}
                        </span>
                        {product.lead_time_days ? (
                          <span className="inline-flex items-center gap-1.5 text-lg">
                            <Clock className="h-4 w-4" />
                            ارسال {new Intl.NumberFormat('fa-IR').format(product.lead_time_days)} روزه
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <strong className="text-sm font-extrabold md:text-lg text-[#fff]">
                          {samplePrices[product.id]
                            ? formatToman(samplePrices[product.id])
                            : 'استعلام قیمت'}
                        </strong>
                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex min-h-10 items-center gap-1.5 border-b border-[#10275d]/30 text-xs text-[#fff] font-bold transition hover:border-[#ff6248] hover:text-[#ff6248]"
                        >
                          جزئیات قطعه
                          <ArrowLeft className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[29rem] flex-col items-center justify-center rounded-none border border-[#10275d]/10 bg-[#e9edf3] px-6 text-center">
                <CategoryVisual
                  categoryId={selectedCategoryId}
                  image={selectedCategory?.image}
                  className="mb-6 h-28 w-28"
                  iconClassName="h-20 w-20 text-[#fff]"
                />
                <h3 className="text-xl font-bold">محصولی در این دسته ثبت نشده است</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#fff]/55">
                  برای استعلام موجودی این دسته با کارشناسان ما تماس بگیرید یا کاتالوگ کامل را ببینید.
                </p>
                <Link
                  href={`/products?category=${selectedCategoryId}`}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 bg-[#ff6248] px-5 py-3 text-sm font-bold text-white transition hover:brightness-105"
                >
                  مشاهده کاتالوگ
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          <aside dir="rtl" className="order-1 rounded-none bg-[#e9edf3] p-4 text-[#10275d] sm:p-6 lg:order-none lg:col-start-2 lg:row-start-1 lg:rounded-none lg:p-5 xl:p-7">
            <div className="mb-7 border border-[#10275d] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-[#9aa8c3]">
                  {String(categories.findIndex((item) => item.id === selectedCategoryId) + 1).padStart(2, '0')}
                </span>
                <span className="font-bold">{selectedCategory?.name_fa}</span>
                <span className="mr-auto text-lg leading-none">⌃</span>
              </div>
              <span className="-mb-[13px] mt-3 block h-0.5 w-16 bg-[#ff6248]" />
            </div>

            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-7 lg:gap-x-3 xl:gap-x-7">
              {categories.map((category, index) => {
                const active = category.id === selectedCategoryId;
                const count = categoryCounts.get(category.id) ?? 0;

                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`group min-h-24 border-t px-0 py-4 text-right transition md:min-h-32 ${
                      active
                        ? 'border-[#ff6248] text-[#ff6248]'
                        : 'border-[#10275d]/20 text-[#10275d] hover:border-[#10275d]/60'
                    }`}
                  >
                    <span
                      className={`mb-4 flex items-center justify-between text-sm tabular-nums ${
                        active ? 'text-[#ff6248]' : 'text-[#9aa8c3]'
                      }`}
                    >
                      <span className=' text-lg'>{String(index + 1).padStart(2, '0')}</span>
                      {/* <span className="text-[36px] opacity-70">
                        {new Intl.NumberFormat('fa-IR').format(count)}
                      </span> */}
                    </span>
                    <span className="block text-sm font-bold leading-6 md:text-xl">
                      {category.name_fa}
                    </span>
                    <span className="mt-1 hidden text-[10px] text-[#10275d]/45 xl:block" dir="ltr">
                      {category.name_en}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
