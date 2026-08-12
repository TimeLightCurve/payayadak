'use client';

import { useState } from 'react';
import {
  Cog,
  Settings,
  CircleDot,
  Disc,
  Wind,
  Zap,
  Truck,
  Thermometer,
  Gauge,
  Filter,
  Fuel,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { categoryImage } from '@/lib/data/categoryImages';

// Map each catalog category to a real vector icon (license-safe, no external
// assets). If a real product photo has been placed at
// /images/categories/<id>.webp it is used instead, falling back to the icon.
const iconMap: Record<string, LucideIcon> = {
  engine: Cog,
  transmission: Settings,
  undercarriage: CircleDot,
  brake: Disc,
  pneumatic: Wind,
  electrical: Zap,
  body: Truck,
  cooling: Thermometer,
  differential: Gauge,
  filters: Filter,
  fuel: Fuel,
  accessories: Wrench,
};

interface Props {
  categoryId: string;
  image?: string;
  className?: string;
  iconClassName?: string;
}

export default function CategoryVisual({
  categoryId,
  image,
  className = 'w-28 h-28',
  iconClassName = 'w-28 h-28',
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const Icon = iconMap[categoryId] ?? Wrench;
  const src = image ?? categoryImage(categoryId);

  if (src && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        onError={() => setImgFailed(true)}
        className={`${className} object-contain rounded-2xl`}
      />
    );
  }

  return (
    <span
      className={`${className} inline-flex items-center justify-center rounded-2xl  text-white `}
    >
      <Icon className={iconClassName} strokeWidth={1.75} />
    </span>
  );
}
