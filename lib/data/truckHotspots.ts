/** Hotspot markers on the 2.5D neon camion → seed parts + Toman prices */

export type TruckHotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  partId: string;
};

/** Percent of viewBox 740×420, spaced for 390px mobile. */
export const truckHotspots: TruckHotspot[] = [
  { id: 'hs-body', x: 26, y: 22, label: 'بدنه', partId: 'p-1007' },
  { id: 'hs-filter', x: 34, y: 33, label: 'فیلتر', partId: 'p-1004' },
  { id: 'hs-fuel', x: 45, y: 35, label: 'سوخت', partId: 'p-1010' },
  { id: 'hs-clutch', x: 54, y: 45, label: 'کلاچ', partId: 'p-1001' },
  { id: 'hs-engine', x: 66, y: 38, label: 'موتور', partId: 'p-1002' },
  { id: 'hs-electrical', x: 73, y: 26, label: 'برق', partId: 'p-1008' },
  { id: 'hs-suspension', x: 23, y: 62, label: 'زیربندی', partId: 'p-1005' },
  { id: 'hs-brake', x: 40, y: 62, label: 'ترمز', partId: 'p-1003' },
];
