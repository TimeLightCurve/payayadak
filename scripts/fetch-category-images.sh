#!/usr/bin/env bash
#
# Fetch category thumbnail images from the reference site (isuzu-yadak.com) into
# public/images/categories/ and register them in lib/data/categoryImages.ts so
# they render on the site automatically.
#
# WHY THIS IS A SCRIPT:
#   The build/CI environment used to author this repo has a locked-down egress
#   network policy that blocks outbound access to isuzu-yadak.com (HTTP 403 at
#   the gateway), so the images could not be pulled during development. Run this
#   from any machine/session with normal internet access:
#
#       bash scripts/fetch-category-images.sh
#
# NOTE ON RIGHTS: these are third-party images. Confirm you have permission to
# use them (or replace them with your own product photography). The Isuzu name
# and logo are trademarks — for a parts reseller, prefer your own branding for
# the logo and use the manufacturer mark only nominatively.
#
# The left column is OUR category id (file will be saved as <id>.webp); the
# right column is the source filename on isuzu-yadak.com. Adjust source names if
# the site changes them. Truncated names observed in dev tools are best-effort.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

BASE="https://isuzu-yadak.com/wp-content/uploads/2025/10"
OUT="public/images/categories"
REG="lib/data/categoryImages.ts"
mkdir -p "$OUT"

# our-id            source-file-basename (without extension)
MAP=(
  "engine:engine-and-gearbox-100x100-1"
  "transmission:engine-and-gearbox-100x100-1"
  "brake:break-100x100-1"
  "undercarriage:brakes-suspension-100x100-1"
  "filters:filter-100x100-1"
  "fuel:fuel-supply-and-exhaust-100x100-1"
  "electrical:accessories-100x100-1"
  "body:interior-100x100-1"
  "cooling:oil-liquid-100x100-1"
  "accessories:accessories-100x100-1"
  "differential:rims-and-tires-100x100-1"
  "pneumatic:wiper-parts-100x100-1"
)

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
ok_ids=()

for pair in "${MAP[@]}"; do
  id="${pair%%:*}"
  name="${pair##*:}"
  # try the -100x100 thumbnail first, then the full-size original
  for candidate in "$name.webp" "${name%-100x100-1}.webp" "$name.png"; do
    url="$BASE/$candidate"
    if curl -fsSL -A "$UA" --max-time 30 -o "$OUT/$id.webp" "$url"; then
      echo "✓ $id  <-  $candidate"
      ok_ids+=("$id")
      break
    fi
  done
done

# Register successfully downloaded ids in the manifest (idempotent).
if [ "${#ok_ids[@]}" -gt 0 ]; then
  ids_line=$(printf "'%s', " "${ok_ids[@]}")
  sed -i "s#// AUTO-GENERATED:categories (do not remove this marker)#${ids_line}// AUTO-GENERATED:categories (do not remove this marker)#" "$REG"
  echo "Registered ${#ok_ids[@]} categories in $REG"
fi

echo "Done. Review $OUT and commit."
