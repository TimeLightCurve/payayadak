# پایا یدک — فروشگاه اینترنتی قطعات یدکی ایسوزو (Frontend)

Storefront and landing site for **Paya Yadak International Trading Co. Ltd.**
(شرکت تجارت بین‌المللی پایا یدک) — a specialized distributor of genuine **Isuzu**
truck and light-truck spare parts in Iran.

Built on the same design system and architecture as the GarmFelez platform,
rebranded for the automotive spare-parts domain.

## Stack

- **Next.js 16** (App Router, standalone output)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** with a custom liquid-glass design system
- **next-intl** — Persian (default), Arabic, English; RTL-first
- **Zustand** for client state, **Axios** for the API layer
- **Vazirmatn** Persian webfont

## Design system

- Madar-inspired deep navy + neon orange/blue palette
- WebGPU neon light-trail hero (Canvas2D fallback)
- SVG wireframe Isuzu camion with interactive part hotspots
- Liquid-glass surfaces on dark backgrounds
- Fitts's-Law touch targets (44px minimum) — mobile-first
- Vazirmatn Persian webfont; RTL-first

## Getting started

```bash
cp .env.example .env.local   # leave NEXT_PUBLIC_API_URL empty for landing demo
npm install --legacy-peer-deps
npm run dev             # http://localhost:3000
```

Landing demo runs without a backend. Set `NEXT_PUBLIC_API_URL` only after the API exists.

### Docker

```bash
docker compose up payayadak-front-dev            # dev
docker compose --profile production up --build   # prod
```

## Structure

```
app/
  layout.tsx           # RTL root, Vazirmatn font, metadata
  page.tsx             # landing (Hero, categories, brands)
  products/page.tsx    # catalog with search + filters
  globals.css          # design tokens + glass utilities
components/            # Navbar, Hero, PartCategories, Brands, ProductGrid, Footer
lib/
  api/                 # axios client + typed catalog/pricing/order services
  store/               # zustand stores (auth, parts)
  data/                # catalog taxonomy + seed parts
messages/              # fa.json (primary), ar.json, en.json
i18n/request.ts        # next-intl config (locales, defaultLocale, rtlLocales)
```

## Localization roadmap

Persian is the primary locale and ships first. Arabic and English message
catalogs are in place (`messages/ar.json`, `messages/en.json`) for the
locale-routing rollout.

## Notes

Product images use category glyph placeholders. Replace `image_url` on each
part (and the seed data in `lib/data/sampleParts.ts`) with real product
photography before launch. The seed catalog is served client-side until the
Landing demo uses sample catalog data. Wire `NEXT_PUBLIC_API_URL` only when a backend exists.
