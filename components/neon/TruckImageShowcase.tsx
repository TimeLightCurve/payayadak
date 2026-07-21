'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { sampleParts, samplePrices } from '@/lib/data/sampleParts';
import HotspotCard from './HotspotCard';

type Props = {
  onAddPart?: (partId: string) => void;
};

const imageHotspots = [
  { id: 'electrical', x: 19, y: 36, label: 'سیستم برق', partId: 'p-1008' },
  { id: 'engine', x: 25, y: 53, label: 'موتور', partId: 'p-1002' },
  { id: 'body', x: 56, y: 32, label: 'بدنه', partId: 'p-1007' },
  { id: 'fuel', x: 49, y: 61, label: 'سوخت‌رسانی', partId: 'p-1010' },
  { id: 'suspension', x: 58, y: 73, label: 'زیربندی', partId: 'p-1005' },
  { id: 'brake', x: 80, y: 72, label: 'ترمز', partId: 'p-1003' },
] as const;

export default function TruckImageShowcase({ onAddPart }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(
    () => imageHotspots.find((hotspot) => hotspot.id === activeId) ?? null,
    [activeId],
  );
  const part = useMemo(
    () => (active ? sampleParts.find((item) => item.id === active.partId) : null),
    [active],
  );

  const cardPosition = active
    ? {
        x: active.x > 55 ? Math.max(8, active.x - 36) : Math.min(62, active.x + 8),
        y: Math.max(5, active.y - 30),
      }
    : { x: 10, y: 12 };

  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl">
      <div className="truck-image-composite absolute inset-0">
        <Image
          src="/images/hero/truck-neon-road.jpg"
          alt="کامیون ایسوزو با نمایش شبکه‌ای قطعات"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 900px"
          className="truck-image-art object-cover object-center"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-[8%] bottom-[8%] h-px bg-gradient-to-r from-transparent via-[#3aa0ff]/70 to-transparent shadow-[0_0_16px_#3aa0ff]" />

      {imageHotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          aria-label={hotspot.label}
          onClick={() => setActiveId((current) => (current === hotspot.id ? null : hotspot.id))}
          className={`absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#0b153c]/55 backdrop-blur-md transition duration-300 hover:scale-110 sm:h-9 sm:w-9 ${
            activeId === hotspot.id
              ? 'z-20 ring-2 ring-[var(--neon-orange)]'
              : 'hotspot-dot'
          }`}
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_#fff]" />
        </button>
      ))}

      {active && part && (
        <HotspotCard
          title={part.name_fa}
          partNumber={part.part_number}
          price={samplePrices[part.id] ?? 0}
          stock={part.stock}
          anchorX={active.x}
          anchorY={active.y}
          cardX={cardPosition.x}
          cardY={cardPosition.y}
          onClose={() => setActiveId(null)}
          onAdd={() => {
            onAddPart?.(part.id);
            setActiveId(null);
          }}
        />
      )}
    </div>
  );
}
