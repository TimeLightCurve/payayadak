// Registry of category ids that have a real product photo committed under
// public/images/categories/<id>.webp.
//
// Until a photo exists, <CategoryVisual/> renders a license-safe vector icon,
// so there are no broken-image requests. `scripts/fetch-category-images.sh`
// downloads the isuzu-yadak.com photos and appends the ids here automatically
// (see the AUTO-GENERATED marker below — keep it intact).

export const localCategoryImages = new Set<string>([
  // AUTO-GENERATED:categories (do not remove this marker)
]);

export function categoryImage(id: string): string | undefined {
  return localCategoryImages.has(id) ? `/images/categories/${id}.webp` : undefined;
}
