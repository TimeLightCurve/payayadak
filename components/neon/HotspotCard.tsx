'use client';

import { X, Plus } from 'lucide-react';
import { formatToman } from '@/lib/data/sampleParts';

type Props = {
  title: string;
  partNumber: string;
  price: number;
  stock?: number;
  /** percent origin of hotspot for leader line (relative to card parent) */
  anchorX: number;
  anchorY: number;
  /** card placement (% of parent) */
  cardX: number;
  cardY: number;
  onClose: () => void;
  onAdd: () => void;
};

export default function HotspotCard({
  title,
  partNumber,
  price,
  stock,
  anchorX,
  anchorY,
  cardX,
  cardY,
  onClose,
  onAdd,
}: Props) {
  // Leader line from hotspot to card top-start corner
  const x1 = anchorX;
  const y1 = anchorY;
  const x2 = cardX;
  const y2 = cardY;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <line
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
      </svg>

      <div
        className="pointer-events-auto absolute madar-card w-[min(280px,78vw)] p-4 text-start"
        style={{
          left: `${cardX}%`,
          top: `${cardY}%`,
          transform: 'translate(-8%, 8%)',
        }}
        role="dialog"
        aria-label={title}
      >
        <div className="space-y-2 text-sm text-white/90">
          <p className="text-xs tracking-wide text-[var(--neon-orange)]">{partNumber}</p>
          <h3 className="text-base font-semibold leading-snug text-white">{title}</h3>
          <p className="text-lg font-bold text-white">{formatToman(price)}</p>
          {typeof stock === 'number' && (
            <p className="text-xs text-white/50">موجودی: {stock.toLocaleString('fa-IR')}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 bg-[var(--neon-orange)] px-3 py-2 text-sm font-semibold text-white transition-smooth hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            افزودن
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="inline-flex h-8 w-8 items-center justify-center border border-white/20 text-white/80 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
