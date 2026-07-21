import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PartCategories from '@/components/PartCategories';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PartCategories />
      <Brands />
      <Footer />
    </main>
  );
}
