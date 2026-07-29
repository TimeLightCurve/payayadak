import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe2, PackageSearch, Plane, ShieldCheck } from 'lucide-react';

const capabilities = [
  { icon: PackageSearch, title: 'Technical part matching', text: 'Part-number, vehicle-model and expert-assisted fitment checks for Isuzu commercial vehicles.' },
  { icon: ShieldCheck, title: 'Controlled quality levels', text: 'Clear sourcing, traceability and quality options before a customer commits to purchase.' },
  { icon: Plane, title: 'Special overseas sourcing', text: 'A dedicated route for scarce and urgent parts, including planned air-freight procurement.' },
];

export default function EnglishPage() {
  return (
    <main dir="ltr" className="min-h-screen text-left">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(6,11,39,.9)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/en" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[var(--neon-orange)] font-black">P</span>
            <span><strong className="block">Paya Yadak</strong><small className="text-white/45">International Trading Co.</small></span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/special-order" className="hidden text-white/65 hover:text-white sm:block">Special sourcing</Link>
            <Link href="/" className="border border-white/15 px-3 py-2 font-bold text-white">فارسی</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(58,160,255,.2),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.24em] text-cyan-300">Isuzu commercial vehicle parts</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.05] sm:text-7xl">
              Reliable parts sourcing,
              <span className="brand-gradient-text block">built around correct fitment.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">
              Paya Yadak is developing a specialist supply platform for Isuzu light- and medium-duty
              trucks in Iran, combining verified catalog data, expert support, nationwide fulfillment
              and urgent overseas sourcing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 bg-[var(--neon-orange)] px-6 py-3 font-bold">
                View demo catalog <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="mailto:info@payayadak.com" className="border border-white/20 bg-white/5 px-6 py-3 font-bold">Company inquiry</a>
            </div>
          </div>
          <div className="glass-strong p-7 sm:p-9">
            <Globe2 className="h-10 w-10 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-extrabold">Pilot scope</h2>
            <ul className="mt-6 space-y-4 text-white/65">
              {[
                'Selected Isuzu NKR, NPR, NQR and P700 families',
                '150–300 controlled, high-demand SKUs',
                'Direct sales plus expert-assisted quotation',
                'Workshop and fleet partnership development',
                'Nationwide roadmap beginning with controlled cities',
              ].map((item) => (
                <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[.025] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[.22em] text-white/45">Capabilities</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">More than an online storefront</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, text }) => (
              <article key={title} className="madar-card p-6">
                <Icon className="h-8 w-8 text-orange-300" />
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className="mt-3 leading-7 text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-10 text-center text-sm text-white/45">
        Paya Yadak International Trading Co. — Tehran, Iran — info@payayadak.com
      </footer>
    </main>
  );
}
