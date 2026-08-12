import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';

export const metadata = {
  title: 'محصولات | پایا یدک',
  description: 'کاتالوگ قطعات یدکی ایسوزو. جستجو و فیلتر بر اساس دسته و برند.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string }>;
}) {
  const { category, brand } = await searchParams;

  return (
    <main className="min-h-screen font-nian">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h1 className="mb-2 text-3xl font-extrabold text-white md:text-4xl">
            کاتالوگ محصولات
          </h1>
          <p className="text-white/60">قطعات یدکی اصلی ایسوزو، کامیونت و کامیون</p>
        </div>
        <ProductGrid initialCategory={category} initialBrand={brand} />
      </section>
      <Footer />
    </main>
  );
}
