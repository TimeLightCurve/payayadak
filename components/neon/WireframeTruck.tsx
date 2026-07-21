'use client';

import { useMemo, useState } from 'react';
import { truckHotspots } from '@/lib/data/truckHotspots';
import { sampleParts, samplePrices } from '@/lib/data/sampleParts';
import HotspotCard from './HotspotCard';

type Props = {
  onAddPart?: (partId: string) => void;
};

/** Madar-style neon wireframe wheel: tire + rim + hub + spokes (+ optional dual). */
function NeonWheel({
  cx,
  cy,
  r = 34,
  dual = false,
}: {
  cx: number;
  cy: number;
  r?: number;
  dual?: boolean;
}) {
  const spokes = 8;
  const rim = r * 0.62;
  const hub = r * 0.22;
  const boltR = r * 0.38;

  const wheel = (ox: number, opacity = 1) => (
    <g opacity={opacity} filter="url(#wheelGlow)">
      {/* Tire mass */}
      <circle cx={cx + ox} cy={cy} r={r} fill="rgba(4,10,32,0.85)" stroke="#4db3ff" strokeWidth="2.4" />
      <circle cx={cx + ox} cy={cy} r={r - 3} fill="none" stroke="#1a4a7a" strokeWidth="5" />
      {/* Rim ring */}
      <circle cx={cx + ox} cy={cy} r={rim} fill="rgba(10,28,60,0.55)" stroke="#7ec8ff" strokeWidth="1.8" />
      <circle cx={cx + ox} cy={cy} r={rim - 4} fill="none" stroke="#3aa0ff" strokeWidth="1.1" opacity="0.7" />
      {/* Spokes */}
      {Array.from({ length: spokes }, (_, i) => {
        const a = (i / spokes) * Math.PI * 2 - Math.PI / 2;
        const x2 = cx + ox + Math.cos(a) * rim;
        const y2 = cy + Math.sin(a) * rim;
        return (
          <line
            key={i}
            x1={cx + ox}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="#5ec8ff"
            strokeWidth="1.15"
            opacity="0.85"
          />
        );
      })}
      {/* Lug bolts */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <circle
            key={`b-${i}`}
            cx={cx + ox + Math.cos(a) * boltR}
            cy={cy + Math.sin(a) * boltR}
            r="2.1"
            fill="#9ad4ff"
            stroke="none"
          />
        );
      })}
      {/* Hub */}
      <circle cx={cx + ox} cy={cy} r={hub} fill="rgba(20,50,90,0.9)" stroke="#e8623d" strokeWidth="1.6" />
      <circle cx={cx + ox} cy={cy} r={hub * 0.45} fill="#e8623d" stroke="none" opacity="0.9" />
    </g>
  );

  return (
    <g>
      {dual && wheel(-11, 0.55)}
      {wheel(0, 1)}
      {/* Mudguard arc */}
      <path
        d={`M ${cx - r - 6} ${cy - 4} Q ${cx} ${cy - r - 14} ${cx + r + 6} ${cy - 4}`}
        fill="none"
        stroke="#3aa0ff"
        strokeWidth="1.5"
        opacity="0.75"
      />
    </g>
  );
}

/**
 * Designer rebuild of the Madar hero camion:
 * side-elevation semi with slight 2.5D depth, dense trailer grid,
 * detailed neon wheels, cab glass, tanks, bumper, fifth-wheel.
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
      y: Math.max(4, Math.min(40, active.y - 24)),
    };
  }, [active]);

  return (
    <div className="truck-stage relative mx-auto w-full max-w-[min(100%,48rem)] select-none sm:max-w-4xl">
      <svg
        viewBox="0 0 920 460"
        className="h-auto w-full"
        role="img"
        aria-label="کامیون ایسوزو، قطعات تعاملی"
      >
        <defs>
          <linearGradient id="roadGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8623d" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#3aa0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8623d" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a4d8c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#061028" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="glassFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8fd4ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1a3a6e" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aa0ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#060b27" stopOpacity="0" />
          </linearGradient>
          <filter id="neon" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wheelGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Neon highway trails (Madar ground) */}
        <g filter="url(#neon)" opacity="0.95">
          <path
            d="M20 390 C 180 350, 320 410, 500 370 S 720 340, 900 385"
            fill="none"
            stroke="url(#roadGlow)"
            strokeWidth="3.2"
          />
          <path
            d="M40 410 C 200 375, 360 430, 540 395 S 760 365, 905 405"
            fill="none"
            stroke="#3aa0ff"
            strokeWidth="1.8"
            opacity="0.55"
          />
          <path
            d="M60 425 C 240 400, 400 445, 600 415 S 800 390, 900 420"
            fill="none"
            stroke="#e8623d"
            strokeWidth="1.3"
            opacity="0.4"
          />
        </g>

        {/* Soft ground reflection under truck */}
        <ellipse cx="460" cy="355" rx="340" ry="28" fill="url(#groundFade)" />

        <g filter="url(#neon)" strokeLinejoin="round" strokeLinecap="round">
          {/* ===== TRAILER (slight 2.5D: top strip + side) ===== */}
          {/* Top bevel (depth strip) */}
          <polygon
            points="70,118 520,118 548,92 98,92"
            fill="rgba(58,160,255,0.16)"
            stroke="#7ec8ff"
            strokeWidth="1.8"
          />
          {/* Main side box */}
          <rect
            x="70"
            y="118"
            width="450"
            height="150"
            fill="url(#bodyFill)"
            stroke="#4db3ff"
            strokeWidth="2.2"
          />
          {/* Rear depth face */}
          <polygon
            points="70,118 98,92 98,242 70,268"
            fill="rgba(30,80,140,0.25)"
            stroke="#5ec8ff"
            strokeWidth="1.6"
          />
          {/* Front of trailer (doors edge) */}
          <line x1="520" y1="118" x2="520" y2="268" stroke="#5ec8ff" strokeWidth="1.8" />
          <line x1="520" y1="118" x2="548" y2="92" stroke="#7ec8ff" strokeWidth="1.5" />
          <line x1="520" y1="268" x2="548" y2="242" stroke="#3aa0ff" strokeWidth="1.4" opacity="0.7" />

          {/* Dense Madar-style grid on trailer side */}
          <g stroke="#5ec8ff" fill="none" opacity="0.72">
            {/* horizontal ribs */}
            {[145, 172, 198, 225, 250].map((y) => (
              <line key={y} x1="78" y1={y} x2="512" y2={y} strokeWidth="1.05" />
            ))}
            {/* vertical bays */}
            {[130, 175, 220, 265, 310, 355, 400, 445, 490].map((x) => (
              <line key={x} x1={x} y1="124" x2={x} y2="262" strokeWidth="1.05" />
            ))}
          </g>

          {/* Roof rails */}
          <g stroke="#7ec8ff" strokeWidth="1.2" opacity="0.65" fill="none">
            <line x1="110" y1="92" x2="520" y2="92" />
            <line x1="150" y1="100" x2="150" y2="118" />
            <line x1="250" y1="100" x2="250" y2="118" />
            <line x1="350" y1="100" x2="350" y2="118" />
            <line x1="450" y1="100" x2="450" y2="118" />
          </g>

          {/* Orange undercarriage rail */}
          <path d="M70 268 L520 268" stroke="#e8623d" strokeWidth="2.4" fill="none" />
          <path d="M78 278 L510 278" stroke="#e8623d" strokeWidth="1.3" opacity="0.65" fill="none" />

          {/* ===== CAB (tractor) ===== */}
          {/* Cab body */}
          <path
            d="M560 175
               L560 118
               L620 118
               L690 155
               L710 175
               L710 268
               L560 268 Z"
            fill="url(#bodyFill)"
            stroke="#4db3ff"
            strokeWidth="2.2"
          />
          {/* Cab roof depth */}
          <polygon
            points="560,118 620,118 648,96 588,96"
            fill="rgba(58,160,255,0.18)"
            stroke="#7ec8ff"
            strokeWidth="1.7"
          />
          {/* Windshield */}
          <path
            d="M628 128 L682 158 L682 200 L628 188 Z"
            fill="url(#glassFill)"
            stroke="#9ad4ff"
            strokeWidth="1.7"
          />
          {/* Side window */}
          <rect
            x="575"
            y="135"
            width="48"
            height="38"
            rx="3"
            fill="url(#glassFill)"
            stroke="#7ec8ff"
            strokeWidth="1.5"
          />
          {/* Door seam */}
          <line x1="598" y1="175" x2="598" y2="255" stroke="#5ec8ff" strokeWidth="1.2" opacity="0.7" />
          <circle cx="605" cy="210" r="3" fill="none" stroke="#e8623d" strokeWidth="1.3" />

          {/* Bumper */}
          <path
            d="M710 250 L745 250 L745 268 L710 268 Z"
            fill="rgba(232,98,61,0.15)"
            stroke="#e8623d"
            strokeWidth="2"
          />
          {/* Headlight */}
          <ellipse cx="738" cy="210" rx="8" ry="12" fill="#e8623d" opacity="0.85" />
          <ellipse cx="738" cy="210" rx="12" ry="16" fill="none" stroke="#e8623d" strokeWidth="1.4" />

          {/* Side mirror */}
          <path d="M555 145 L540 140 L540 165 L555 160 Z" fill="none" stroke="#7ec8ff" strokeWidth="1.5" />

          {/* Exhaust stack */}
          <rect x="548" y="70" width="10" height="55" rx="2" fill="none" stroke="#5ec8ff" strokeWidth="1.5" />
          <ellipse cx="553" cy="70" rx="7" ry="3" fill="none" stroke="#7ec8ff" strokeWidth="1.3" />

          {/* Fuel tanks under cab */}
          <ellipse cx="600" cy="278" rx="42" ry="16" fill="rgba(10,30,60,0.7)" stroke="#3aa0ff" strokeWidth="1.6" />
          <ellipse cx="600" cy="278" rx="28" ry="9" fill="none" stroke="#5ec8ff" strokeWidth="1" opacity="0.6" />

          {/* Fifth-wheel / coupler */}
          <path
            d="M520 240 L560 240 L560 255 L520 255 Z"
            fill="rgba(232,98,61,0.12)"
            stroke="#e8623d"
            strokeWidth="1.6"
          />
          <circle cx="540" cy="248" r="5" fill="none" stroke="#e8623d" strokeWidth="1.4" />

          {/* Front chassis orange accent */}
          <path d="M560 268 L710 268" stroke="#e8623d" strokeWidth="2.2" fill="none" />
        </g>

        {/* ===== WHEELS (Madar-grade detail) ===== */}
        {/* Trailer duals */}
        <NeonWheel cx={145} cy={318} r={36} dual />
        <NeonWheel cx={235} cy={318} r={36} dual />
        <NeonWheel cx={420} cy={318} r={36} dual />
        {/* Drive / steer */}
        <NeonWheel cx={620} cy={318} r={36} />
        <NeonWheel cx={700} cy={318} r={34} />

        {/* Axle lines */}
        <g stroke="#3aa0ff" strokeWidth="1.2" opacity="0.45">
          <line x1="145" y1="268" x2="145" y2="282" />
          <line x1="235" y1="268" x2="235" y2="282" />
          <line x1="420" y1="268" x2="420" y2="282" />
          <line x1="620" y1="268" x2="620" y2="282" />
          <line x1="700" y1="268" x2="700" y2="282" />
        </g>
      </svg>

      {truckHotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          aria-label={h.label}
          onClick={() => setActiveId((cur) => (cur === h.id ? null : h.id))}
          className={`absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition-smooth hover:scale-110 sm:h-8 sm:w-8 ${
            activeId === h.id ? 'z-20 ring-2 ring-[var(--neon-orange)]' : 'hotspot-dot'
          }`}
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)]" />
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
