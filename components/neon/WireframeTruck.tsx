'use client';

import { useMemo, useState } from 'react';
import { truckHotspots } from '@/lib/data/truckHotspots';
import { sampleParts, samplePrices } from '@/lib/data/sampleParts';
import HotspotCard from './HotspotCard';

type Props = {
  onAddPart?: (partId: string) => void;
};

/**
 * 2.5D isometric neon wireframe camion (Madar-style perspective).
 * Hotspots sit on the projected surfaces and open part + Toman cards.
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
    // Keep card inside the frame on narrow screens
    const flipLeft = active.x > 52;
    return {
      x: flipLeft ? Math.max(4, Math.min(48, active.x - 38)) : Math.min(58, active.x + 6),
      y: Math.max(4, Math.min(42, active.y - 22)),
    };
  }, [active]);

  return (
    <div className="truck-stage relative mx-auto w-full max-w-[min(100%,42rem)] select-none sm:max-w-3xl">
      <svg
        viewBox="0 0 720 400"
        className="h-auto w-full drop-shadow-[0_0_28px_rgba(58,160,255,0.28)]"
        role="img"
        aria-label="کامیون ایسوزو، قطعات تعاملی"
      >
        <defs>
          <linearGradient id="roadGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8623d" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#3aa0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8623d" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="faceTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aa0ff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#3aa0ff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="faceSide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3aa0ff" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#060b27" stopOpacity="0.35" />
          </linearGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ground neon trails (perspective sweep) */}
        <g filter="url(#softGlow)" opacity="0.9">
          <path
            d="M40 340 C 160 300, 280 355, 420 320 S 600 290, 690 330"
            fill="none"
            stroke="url(#roadGlow)"
            strokeWidth="2.8"
          />
          <path
            d="M55 360 C 180 330, 300 370, 450 345 S 620 320, 700 350"
            fill="none"
            stroke="#3aa0ff"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <path
            d="M70 375 C 200 350, 320 385, 480 360 S 640 340, 705 365"
            fill="none"
            stroke="#e8623d"
            strokeWidth="1.2"
            opacity="0.45"
          />
        </g>

        {/*
          2.5D isometric projection:
          - Trailer: top parallelogram + left long side + short rear face
          - Cab: extruded box with windshield plane
          Depth axis ≈ (+dx, -dy) with dx=56, dy=36
        */}

        {/* Trailer TOP face */}
        <polygon
          points="118,118 398,118 454,82 174,82"
          fill="url(#faceTop)"
          stroke="#3aa0ff"
          strokeWidth="1.7"
        />

        {/* Trailer SIDE (long face toward viewer) */}
        <polygon
          points="118,118 398,118 398,208 118,208"
          fill="url(#faceSide)"
          stroke="#3aa0ff"
          strokeWidth="1.7"
        />

        {/* Trailer REAR (depth face) */}
        <polygon
          points="118,118 174,82 174,172 118,208"
          fill="rgba(58,160,255,0.06)"
          stroke="#5ec8ff"
          strokeWidth="1.5"
        />

        {/* Trailer front edge (connect to cab) */}
        <line x1="398" y1="118" x2="454" y2="82" stroke="#3aa0ff" strokeWidth="1.5" />
        <line x1="398" y1="208" x2="454" y2="172" stroke="#3aa0ff" strokeWidth="1.4" opacity="0.7" />

        {/* Roof ribs on TOP face */}
        <g stroke="#5ec8ff" strokeWidth="1.1" opacity="0.75" fill="none">
          <line x1="188" y1="100" x2="244" y2="100" />
          <path d="M168,110 L424,110" />
          <path d="M158,128 L414,128" />
          <line x1="210" y1="82" x2="210" y2="118" opacity="0.5" />
          <line x1="270" y1="82" x2="270" y2="118" opacity="0.5" />
          <line x1="330" y1="82" x2="330" y2="118" opacity="0.5" />
          <line x1="160" y1="140" x2="390" y2="140" opacity="0.45" />
          <line x1="160" y1="168" x2="390" y2="168" opacity="0.45" />
          <line x1="200" y1="118" x2="200" y2="208" opacity="0.4" />
          <line x1="260" y1="118" x2="260" y2="208" opacity="0.4" />
          <line x1="320" y1="118" x2="320" y2="208" opacity="0.4" />
        </g>

        {/* Chassis / underglow (orange) */}
        <g stroke="#e8623d" strokeWidth="2" fill="none" filter="url(#softGlow)">
          <path d="M118 208 L398 208" />
          <path d="M118 208 L174 172" opacity="0.85" />
          <path d="M398 208 L454 172" opacity="0.85" />
          <path d="M130 218 L385 218" strokeWidth="1.4" opacity="0.7" />
        </g>

        {/* Cab TOP */}
        <polygon
          points="398,118 470,118 526,82 454,82"
          fill="rgba(58,160,255,0.12)"
          stroke="#3aa0ff"
          strokeWidth="1.7"
        />

        {/* Cab SIDE */}
        <polygon
          points="398,118 470,118 470,208 398,208"
          fill="rgba(10,20,56,0.45)"
          stroke="#3aa0ff"
          strokeWidth="1.7"
        />

        {/* Cab FRONT (depth + nose) */}
        <polygon
          points="470,118 526,82 526,155 490,175 470,175 470,118"
          fill="rgba(58,160,255,0.08)"
          stroke="#5ec8ff"
          strokeWidth="1.6"
        />

        {/* Windshield plane */}
        <polygon
          points="478,128 512,100 512,148 478,160"
          fill="rgba(94,200,255,0.12)"
          stroke="#5ec8ff"
          strokeWidth="1.4"
        />

        {/* Door + window on cab side */}
        <g stroke="#5ec8ff" strokeWidth="1.25" fill="none" opacity="0.85">
          <rect x="412" y="132" width="42" height="28" rx="2" />
          <rect x="412" y="168" width="42" height="28" rx="2" />
          <line x1="433" y1="132" x2="433" y2="196" opacity="0.5" />
        </g>

        {/* Bumper / lights (orange accents) */}
        <g stroke="#e8623d" strokeWidth="1.8" fill="none" filter="url(#softGlow)">
          <path d="M490 175 L526 155" />
          <path d="M470 208 L490 175" />
          <path d="M505 160 L518 152" strokeWidth="2.4" />
          <circle cx="512" cy="158" r="3.5" fill="#e8623d" stroke="none" />
        </g>

        {/* Exhaust / detail */}
        <path
          d="M455 175 L455 205"
          stroke="#3aa0ff"
          strokeWidth="1.3"
          opacity="0.7"
        />

        {/* Wheels as perspective ellipses (2.5D) */}
        <g filter="url(#softGlow)">
          {/* Rear trailer wheel */}
          <ellipse cx="175" cy="248" rx="34" ry="22" fill="rgba(6,11,39,0.55)" stroke="#e8623d" strokeWidth="2" />
          <ellipse cx="175" cy="248" rx="14" ry="9" fill="none" stroke="#e8623d" strokeWidth="1.4" />
          <ellipse cx="158" cy="238" rx="28" ry="16" fill="none" stroke="#e8623d" strokeWidth="1.2" opacity="0.45" />

          {/* Mid trailer wheel */}
          <ellipse cx="290" cy="248" rx="34" ry="22" fill="rgba(6,11,39,0.55)" stroke="#e8623d" strokeWidth="2" />
          <ellipse cx="290" cy="248" rx="14" ry="9" fill="none" stroke="#e8623d" strokeWidth="1.4" />
          <ellipse cx="273" cy="238" rx="28" ry="16" fill="none" stroke="#e8623d" strokeWidth="1.2" opacity="0.45" />

          {/* Cab wheel */}
          <ellipse cx="440" cy="248" rx="34" ry="22" fill="rgba(6,11,39,0.55)" stroke="#e8623d" strokeWidth="2" />
          <ellipse cx="440" cy="248" rx="14" ry="9" fill="none" stroke="#e8623d" strokeWidth="1.4" />
          <ellipse cx="423" cy="238" rx="28" ry="16" fill="none" stroke="#e8623d" strokeWidth="1.2" opacity="0.45" />
        </g>

        {/* Axle hints */}
        <g stroke="#3aa0ff" strokeWidth="1.1" opacity="0.5">
          <line x1="175" y1="208" x2="175" y2="226" />
          <line x1="290" y1="208" x2="290" y2="226" />
          <line x1="440" y1="208" x2="440" y2="226" />
        </g>
      </svg>

      {/* Hotspots */}
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
