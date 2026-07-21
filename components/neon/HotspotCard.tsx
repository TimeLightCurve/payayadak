'use client';

import { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { formatToman } from '@/lib/data/sampleParts';

type Props = {
  title: string;
  partNumber: string;
  price: number;
  stock?: number;
  anchorX: number;
  anchorY: number;
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
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {!isMobile && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <line
            x1={`${anchorX}%`}
            y1={`${anchorY}%`}
            x2={`${cardX}%`}
            y2={`${cardY}%`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
        </svg>
      )}

      <div
        role="dialog"
        aria-label={title}
        className={
          isMobile
            ? 'pointer-events-auto madar-card absolute inset-x-3 bottom-2 p-3.5 text-start'
            : 'pointer-events-auto madar-card absolute w-[min(280px,78vw)] p-4 text-start'
        }
        style={
          isMobile
            ? undefined
            : {
                left: `${cardX}%`,
                top: `${cardY}%`,
                transform: 'translate(-8%, 8%)',
              }
        }
      >
        <div className="space-y-1.5 text-sm text-white/90">
          <p className="text-xs tracking-wide text-[var(--neon-orange)]">{partNumber}</p>
          <h3 className="text-[0.95rem] font-semibold leading-snug text-white sm:text-base">
            {title}
          </h3>
          <p className="text-base font-bold text-white sm:text-lg">{formatToman(price)}</p>
          {typeof stock === 'number' && (
            <p className="text-xs text-white/50">موجودی: {stock.toLocaleString('fa-IR')}</p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex min-h-11 items-center gap-1.5 bg-[var(--neon-orange)] px-3 py-2 text-sm font-semibold text-white transition-smooth hover:brightness-110 sm:min-h-9"
          >
            <Plus className="h-4 w-4" />
            افزودن
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-white/80 hover:bg-white/10 sm:h-8 sm:w-8"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
