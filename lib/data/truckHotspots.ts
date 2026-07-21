/** Hotspot markers on the neon wireframe truck → seed parts + Toman prices */

export type TruckHotspot = {
  id: string;
  /** percent positions inside the truck SVG viewBox wrapper */
  x: number;
  y: number;
  label: string;
  partId: string;
};

/** Positions as % of the SVG wrapper (viewBox 640×320). */
export const truckHotspots: TruckHotspot[] = [
  { id: 'hs-engine', x: 68, y: 40, label: 'موتور', partId: 'p-1002' },
  { id: 'hs-brake', x: 39, y: 69, label: 'ترمز', partId: 'p-1003' },
  { id: 'hs-clutch', x: 60, y: 55, label: 'کلاچ', partId: 'p-1001' },
  { id: 'hs-filter', x: 23, y: 36, label: 'فیلتر', partId: 'p-1004' },
  { id: 'hs-suspension', x: 20, y: 69, label: 'زیربندی', partId: 'p-1005' },
  { id: 'hs-electrical', x: 72, y: 34, label: 'برق', partId: 'p-1008' },
  { id: 'hs-fuel', x: 52, y: 45, label: 'سوخت', partId: 'p-1010' },
  { id: 'hs-body', x: 34, y: 30, label: 'بدنه', partId: 'p-1007' },
];
