'use client';

import { useMemo, useState } from 'react';
import { truckHotspots } from '@/lib/data/truckHotspots';
import { sampleParts, samplePrices } from '@/lib/data/sampleParts';
import HotspotCard from './HotspotCard';

type Props = {
  onAddPart?: (partId: string) => void;
};

export default function WireframeTruck({ onAddPart }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = useMemo(
    () => truckHotspots.find((h) => h.id === activeId) ?? null,
    [activeId],
  );

  const part = useMemo(
    () => (active ? sampleParts.find((p) => p.id === active.partId) : null),
    [active],
  );

  const price = active ? samplePrices[active.partId] ?? 0 : 0;

  // Place card opposite the hotspot to avoid clipping
  const cardPos = useMemo(() => {
    if (!active) return { x: 12, y: 18 };
    const flipLeft = active.x > 55;
    return {
      x: flipLeft ? Math.max(8, active.x - 42) : Math.min(60, active.x + 8),
      y: Math.max(6, active.y - 28),
    };
  }, [active]);

  return (
    <div className="relative mx-auto w-full max-w-3xl select-none">
      <svg
        viewBox="0 0 640 320"
        className="h-auto w-full drop-shadow-[0_0_30px_rgba(58,160,255,0.25)]"
        role="img"
        aria-label="کامیون ایسوزو — قطعات تعاملی"
      >
        <defs>
          <linearGradient id="roadGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8623d" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#3aa0ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e8623d" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Ground neon trails */}
        <path
          d="M20 270 C 120 250, 220 290, 320 265 S 520 240, 620 275"
          fill="none"
          stroke="url(#roadGlow)"
          strokeWidth="2.5"
          opacity="0.85"
        />
        <path
          d="M40 290 C 160 275, 260 305, 380 285 S 540 270, 610 295"
          fill="none"
          stroke="#3aa0ff"
          strokeWidth="1.5"
          opacity="0.55"
        />

        {/* Trailer body */}
        <g className="neon-stroke-blue">
          <rect x="70" y="90" width="300" height="110" rx="4" />
          <line x1="70" y1="125" x2="370" y2="125" />
          <line x1="70" y1="160" x2="370" y2="160" />
          <line x1="145" y1="90" x2="145" y2="200" />
          <line x1="220" y1="90" x2="220" y2="200" />
          <line x1="295" y1="90" x2="295" y2="200" />
          {/* roof ribs */}
          <path d="M80 88 L 360 88" />
        </g>

        {/* Cab */}
        <g className="neon-stroke-blue">
          <path d="M370 145 L370 95 L430 95 L470 130 L470 200 L370 200 Z" />
          <path d="M430 95 L430 130 L470 130" />
          <path d="M390 115 L420 115" />
          <rect x="385" y="145" width="55" height="35" rx="2" />
        </g>

        {/* Accent underglow */}
        <g className="neon-stroke-orange">
          <path d="M80 205 L360 205" />
          <path d="M370 205 L465 205" />
          <path d="M470 150 L490 150 L490 175" />
        </g>

        {/* Wheels */}
        <g className="neon-stroke-orange">
          <circle cx="130" cy="220" r="28" />
          <circle cx="130" cy="220" r="12" />
          <circle cx="250" cy="220" r="28" />
          <circle cx="250" cy="220" r="12" />
          <circle cx="420" cy="220" r="28" />
          <circle cx="420" cy="220" r="12" />
        </g>

        {/* Chassis line */}
        <path
          className="neon-stroke-blue"
          d="M70 200 L470 200"
        />
      </svg>

      {/* Hotspots (HTML overlay for hit targets) */}
      {truckHotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          aria-label={h.label}
          onClick={() => setActiveId((cur) => (cur === h.id ? null : h.id))}
          className={`absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition-smooth hover:scale-110 ${
            activeId === h.id ? 'ring-2 ring-[var(--neon-orange)]' : 'hotspot-dot'
          }`}
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
        </button>
      ))}

      {active && part && (
        <HotspotCard
          title={part.name_fa}
          partNumber={part.part_number}
          price={price}
          stock={part.stock}
          anchorX={active.x}
          anchorY={active.y}
          cardX={cardPos.x}
          cardY={cardPos.y}
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
