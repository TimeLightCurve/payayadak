import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PartCategories from '@/components/PartCategories';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import { ThreeCanvas } from '@/components/ThreeCanvas'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className=" flex w-screen h-screen">
        <ThreeCanvas />
      </div>
      {/* <Hero /> */}
      <PartCategories />
      <Brands />
      <Footer />
    </main>
  );
}
