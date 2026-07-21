# Category images

Real product photos live here as `<category-id>.webp` (ids from
`lib/data/catalog.ts`: engine, transmission, undercarriage, brake, pneumatic,
electrical, body, cooling, differential, filters, fuel, accessories).

Until a photo is present, `components/CategoryVisual.tsx` renders a license-safe
lucide vector icon, so the UI never shows a broken image.

To pull the reference images from isuzu-yadak.com (needs open internet — the
authoring environment blocks it), run from the repo root:

    bash scripts/fetch-category-images.sh

That downloads each file here and registers its id in
`lib/data/categoryImages.ts` so it appears automatically. You can also just drop
your own `<id>.webp` files in and add the ids to that file.
