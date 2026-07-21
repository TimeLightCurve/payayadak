/** Hotspot markers on the 2.5D neon camion → seed parts + Toman prices */

export type TruckHotspot = {
  id: string;
  /** percent positions inside the truck SVG wrapper (viewBox 720×400) */
  x: number;
  y: number;
  label: string;
  partId: string;
};

/** Spaced for mobile (390px) so 36–44px targets do not stack. */
export const truckHotspots: TruckHotspot[] = [
  { id: 'hs-body', x: 28, y: 24, label: 'بدنه', partId: 'p-1007' },
  { id: 'hs-filter', x: 36, y: 34, label: 'فیلتر', partId: 'p-1004' },
  { id: 'hs-fuel', x: 47, y: 36, label: 'سوخت', partId: 'p-1010' },
  { id: 'hs-clutch', x: 56, y: 46, label: 'کلاچ', partId: 'p-1001' },
  { id: 'hs-engine', x: 67, y: 40, label: 'موتور', partId: 'p-1002' },
  { id: 'hs-electrical', x: 74, y: 27, label: 'برق', partId: 'p-1008' },
  { id: 'hs-suspension', x: 24, y: 63, label: 'زیربندی', partId: 'p-1005' },
  { id: 'hs-brake', x: 41, y: 63, label: 'ترمز', partId: 'p-1003' },
];
