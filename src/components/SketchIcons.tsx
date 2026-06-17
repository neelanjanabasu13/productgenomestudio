import type { ReactNode } from "react";

// Loose, hand-drawn line icons. Single-stroke friendly so the
// stroke-dasharray draw-in animation feels like sketching.
// viewBox 0 0 100 100, stroke is currentColor.
const ICONS: Record<string, ReactNode> = {
  travel: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 58 L86 44 L78 36 L62 42 L42 28 L36 30 L46 44 L26 50 L18 44 L14 48 Z" />
      <path d="M30 70 L70 66" />
    </g>
  ),
  saas_pm: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="26" width="18" height="50" rx="2" />
      <rect x="41" y="26" width="18" height="36" rx="2" />
      <rect x="64" y="26" width="18" height="44" rx="2" />
      <path d="M22 36 H32 M22 46 H32 M45 36 H55 M68 36 H78 M68 50 H78" />
    </g>
  ),
  social: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 30 Q18 22 28 22 H66 Q76 22 76 32 V52 Q76 60 66 60 H40 L26 72 L28 60 Q18 58 18 50 Z" />
      <path d="M32 38 H58 M32 46 H50" />
    </g>
  ),
  food: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 40 Q50 18 82 40 Z" />
      <path d="M16 48 Q50 56 84 48" />
      <path d="M18 58 H82" />
      <path d="M20 66 Q50 76 80 66" />
    </g>
  ),
  ecommerce: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 34 L24 78 H76 L72 34 Z" />
      <path d="M38 34 Q38 20 50 20 Q62 20 62 34" />
    </g>
  ),
  fintech: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="30" width="72" height="44" rx="4" />
      <path d="M14 42 H86" />
      <path d="M22 60 H40 M50 60 H58 M62 60 H72" />
    </g>
  ),
  streaming: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="28" />
      <path d="M44 38 L62 50 L44 62 Z" />
    </g>
  ),
  mobility: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 60 L20 44 Q24 36 32 36 H68 Q76 36 80 44 L86 60 V70 H14 Z" />
      <circle cx="30" cy="70" r="6" />
      <circle cx="70" cy="70" r="6" />
      <path d="M24 60 H76" />
    </g>
  ),
  dating: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 78 C20 60 16 38 30 28 C40 22 48 28 50 36 C52 28 60 22 70 28 C84 38 80 60 50 78 Z" />
    </g>
  ),
  edtech: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 42 L50 28 L86 42 L50 56 Z" />
      <path d="M28 48 V64 Q50 76 72 64 V48" />
      <path d="M82 44 V62" />
    </g>
  ),
  design: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M70 18 L82 30 L46 66 L30 70 L34 54 Z" />
      <path d="M30 70 L26 78" />
      <path d="M58 30 L70 42" />
    </g>
  ),
  ai: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="22" y="32" width="56" height="40" rx="6" />
      <circle cx="38" cy="52" r="4" />
      <circle cx="62" cy="52" r="4" />
      <path d="M44 64 H56" />
      <path d="M50 32 V22" />
      <circle cx="50" cy="20" r="2" />
      <path d="M22 50 H14 M78 50 H86" />
    </g>
  ),
};

export function SketchIcon({ id }: { id: string }) {
  const icon = ICONS[id] ?? ICONS.design;
  return (
    <svg viewBox="0 0 100 100" className="sketch-svg w-20 h-20 text-foreground/90" aria-hidden>
      {icon}
    </svg>
  );
}