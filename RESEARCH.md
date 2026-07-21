# Competitor R&D — isuzu-yadak.com (nearest competitor)

Source: live site inspection (WordPress + Elementor). Category thumbnails are
served from `https://isuzu-yadak.com/wp-content/uploads/2025/10/` as 100×100
`.webp` files.

## Category taxonomy (observed)

| isuzu-yadak.com | source thumbnail | Paya Yadak category |
|-----------------|------------------|---------------------|
| موتور و گیربکس (engine & gearbox) | `engine-and-gearbox-100x100-1.webp` | engine + transmission |
| ترمز (brake) | `break-100x100-1.webp` | brake |
| ترمز و تعلیق (brakes & suspension) | `brakes-suspension-100x100-1.webp` | undercarriage |
| فیلتر (filter) | `filter-100x100-1.webp` | filters |
| سوخت‌رسانی و اگزوز (fuel supply & exhaust) | `fuel-supply-*-100x100-1.webp` | fuel |
| روغن و مایعات (oil & liquid) | `oil-liquid-100x100-1.webp` | cooling / fluids |
| رینگ و لاستیک (rims & tires) | `rims-and-tires-100x100-1.webp` | differential/axle |
| برف‌پاک‌کن (wiper parts) | `wiper-parts-100x100-1.webp` | pneumatic/accessories |
| داخل کابین (interior) | `interior-100x100-1.webp` | body |
| لوازم جانبی (accessories) | `accessories-100x100-1.webp` | accessories |

Also present: a refrigerated-box Isuzu truck hero image, the stylized ISUZU
wordmark/logo, and a floating "۲۴/۷ تلفن اضطراری" WhatsApp CTA.

## Takeaways applied to Paya Yadak

- Our taxonomy already covers theirs and is more granular (engine and
  transmission are split; brake and undercarriage are split).
- Added a floating support affordance and 24/7 phone framing to the roadmap.
- Their catalog is photo-thumbnail driven; we mirror that with
  `CategoryVisual` (photo when available, vector icon otherwise).

## Images

The authoring environment's network policy blocks isuzu-yadak.com (HTTP 403 at
the egress gateway), so the thumbnails could not be crawled during development.
`scripts/fetch-category-images.sh` pulls them from any open-network machine and
wires them in. See `public/images/categories/README.md`.

Rights note: the thumbnails are third-party assets and the ISUZU logo is a
trademark. For production, prefer first-party product photography and use the
Isuzu mark only nominatively (as an authorized parts reseller).
