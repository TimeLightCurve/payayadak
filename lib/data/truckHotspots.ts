/** Hotspots on Madar-style side-elevation camion (viewBox 920×460). */

export type TruckHotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  partId: string;
};

export const truckHotspots: TruckHotspot[] = [
  { id: 'hs-body', x: 28, y: 28, label: 'بدنه', partId: 'p-1007' },
  { id: 'hs-filter', x: 38, y: 38, label: 'فیلتر', partId: 'p-1004' },
  { id: 'hs-fuel', x: 48, y: 40, label: 'سوخت', partId: 'p-1010' },
  { id: 'hs-clutch', x: 64, y: 48, label: 'کلاچ', partId: 'p-1001' },
  { id: 'hs-engine', x: 72, y: 36, label: 'موتور', partId: 'p-1002' },
  { id: 'hs-electrical', x: 78, y: 30, label: 'برق', partId: 'p-1008' },
  { id: 'hs-suspension', x: 26, y: 70, label: 'زیربندی', partId: 'p-1005' },
  { id: 'hs-brake', x: 46, y: 70, label: 'ترمز', partId: 'p-1003' },
];
