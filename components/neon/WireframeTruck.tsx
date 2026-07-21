'use client';

import { useMemo, useState } from 'react';
import { truckHotspots } from '@/lib/data/truckHotspots';
import { sampleParts, samplePrices } from '@/lib/data/sampleParts';
import HotspotCard from './HotspotCard';

type Props = {
  onAddPart?: (partId: string) => void;
};

/**
 * 2.5D isometric neon wireframe camion.
 * Depth axis ≈ (+72, −46) so top / side / front faces read clearly on mobile.
 */
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

  const cardPos = useMemo(() => {
    if (!active) return { x: 10, y: 12 };
    const flipLeft = active.x > 52;
    return {
      x: flipLeft ? Math.max(4, Math.min(48, active.x - 38)) : Math.min(58, active.x + 6),
      y: Math.max(4, Math.min(42, active.y - 22)),
    };
  }, [active]);

  return (
    <div className="truck-stage relative mx-auto w-full max-w-[min(100%,42rem)] select-none sm:max-w-3xl">
      <svg
        viewBox="0 0 740 420"
        className="h-auto w-full"
        role="img"
        aria-label="کامیون ایسوزو، قطعات تعاملی"
      >
        <defs>
          <linearGradient id="roadGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8623d" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#3aa0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8623d" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="topFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3aa0ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3aa0ff" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="sideFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3a6e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#060b27" stopOpacity="0.75" />
          </linearGradient>
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#neon)" opacity="0.9">
          <path
            d="M30 355 C 170 310, 300 365, 450 330 S 620 300, 710 340"
            fill="none"
            stroke="url(#roadGlow)"
            strokeWidth="3"
          />
          <path
            d="M50 375 C 190 340, 320 385, 480 355 S 640 330, 720 360"
            fill="none"
            stroke="#3aa0ff"
            strokeWidth="1.7"
            opacity="0.55"
          />
        </g>

        <g filter="url(#neon)" strokeLinejoin="round" strokeLinecap="round">
          {/* Trailer top */}
          <polygon
            points="100,110 390,110 462,64 172,64"
            fill="url(#topFill)"
            stroke="#5ec8ff"
            strokeWidth="2.2"
          />
          {/* Trailer near side */}
          <polygon
            points="100,110 390,110 390,210 100,210"
            fill="url(#sideFill)"
            stroke="#3aa0ff"
            strokeWidth="2.2"
          />
          {/* Trailer rear depth */}
          <polygon
            points="100,110 172,64 172,164 100,210"
            fill="rgba(58,160,255,0.10)"
            stroke="#5ec8ff"
            strokeWidth="1.9"
          />
          <line x1="390" y1="110" x2="462" y2="64" stroke="#5ec8ff" strokeWidth="1.8" />
          <line x1="390" y1="210" x2="462" y2="164" stroke="#3aa0ff" strokeWidth="1.7" opacity="0.75" />
          <line x1="462" y1="64" x2="462" y2="164" stroke="#5ec8ff" strokeWidth="1.7" opacity="0.8" />

          <g stroke="#5ec8ff" strokeWidth="1.15" opacity="0.7" fill="none">
            <line x1="172" y1="140" x2="390" y2="140" />
            <line x1="172" y1="170" x2="390" y2="170" />
            <line x1="195" y1="110" x2="195" y2="210" />
            <line x1="255" y1="110" x2="255" y2="210" />
            <line x1="315" y1="110" x2="315" y2="210" />
          </g>
          <g stroke="#5ec8ff" strokeWidth="1.1" opacity="0.65" fill="none">
            <line x1="150" y1="87" x2="430" y2="87" />
            <line x1="210" y1="64" x2="210" y2="110" />
            <line x1="280" y1="64" x2="280" y2="110" />
            <line x1="350" y1="64" x2="350" y2="110" />
          </g>

          <g stroke="#e8623d" strokeWidth="2.3" fill="none">
            <path d="M100 210 L390 210" />
            <path d="M100 210 L172 164" opacity="0.9" />
            <path d="M390 210 L462 164" opacity="0.9" />
            <path d="M115 222 L375 222" strokeWidth="1.5" opacity="0.7" />
          </g>

          {/* Cab */}
          <polygon
            points="390,120 478,120 550,74 462,74"
            fill="rgba(58,160,255,0.18)"
            stroke="#5ec8ff"
            strokeWidth="2.1"
          />
          <polygon
            points="390,120 478,120 478,210 390,210"
            fill="url(#sideFill)"
            stroke="#3aa0ff"
            strokeWidth="2.1"
          />
          <polygon
            points="478,120 550,74 565,95 540,165 500,185 478,185"
            fill="rgba(58,160,255,0.12)"
            stroke="#5ec8ff"
            strokeWidth="2"
          />
          <polygon
            points="492,128 538,92 538,145 500,162"
            fill="rgba(94,200,255,0.18)"
            stroke="#5ec8ff"
            strokeWidth="1.6"
          />
          <rect
            x="410"
            y="135"
            width="48"
            height="32"
            rx="2"
            fill="none"
            stroke="#5ec8ff"
            strokeWidth="1.4"
            opacity="0.9"
          />
          <rect
            x="410"
            y="172"
            width="48"
            height="28"
            rx="2"
            fill="none"
            stroke="#5ec8ff"
            strokeWidth="1.3"
            opacity="0.75"
          />

          <g stroke="#e8623d" fill="none">
            <path d="M500 185 L540 165" strokeWidth="2.4" />
            <path d="M478 210 L500 185" strokeWidth="2" />
            <circle cx="548" cy="108" r="5" fill="#e8623d" stroke="none" />
            <circle cx="548" cy="108" r="9" strokeWidth="1.4" opacity="0.7" />
          </g>
        </g>

        <g filter="url(#neon)">
          {(
            [
              [168, 258],
              [292, 258],
              [455, 258],
            ] as const
          ).map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <ellipse
                cx={cx - 18}
                cy={cy - 10}
                rx="30"
                ry="17"
                fill="none"
                stroke="#e8623d"
                strokeWidth="1.3"
                opacity="0.4"
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx="36"
                ry="23"
                fill="rgba(6,11,39,0.7)"
                stroke="#e8623d"
                strokeWidth="2.3"
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx="15"
                ry="10"
                fill="none"
                stroke="#e8623d"
                strokeWidth="1.5"
              />
              <line
                x1={cx}
                y1={cy - 23}
                x2={cx}
                y2={210}
                stroke="#3aa0ff"
                strokeWidth="1.2"
                opacity="0.45"
              />
            </g>
          ))}
        </g>
      </svg>

      {truckHotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          aria-label={h.label}
          onClick={() => setActiveId((cur) => (cur === h.id ? null : h.id))}
          className={`absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 backdrop-blur-sm transition-smooth hover:scale-110 sm:h-8 sm:w-8 ${
            activeId === h.id ? 'z-20 ring-2 ring-[var(--neon-orange)]' : 'hotspot-dot'
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
