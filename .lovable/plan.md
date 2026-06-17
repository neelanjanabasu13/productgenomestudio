## Goal
Make the in-Studio phone preview feel like a real product screen, with teal numbered annotations and a matching callout panel that updates live with selection.

## 1. Realistic content sampler (`src/lib/sampleContent.ts`, new)
Pure helpers that produce believable sample copy per industry, keyed by `industry.id`:
- `placesFor(industryId)` — e.g. travel: "Lisbon Loft", "Kyoto Ryokan"; food: "Sunda Thai", "Roman & Co."; ai: "Draft brief", "Refactor util"; shopping: "Linen Shirt — $48", etc.
- `pricesFor(industryId)`, `ratingsFor`, `ctaFor(stage)`, `metricsFor`, `chatFor(industryId)`, `messagesFor`, `categoriesFor`.
- Returns deterministic arrays (no randomness — index by element position) so the preview is stable across re-renders.
- All copy is generic/original (no real brand names beyond what's already in industry.companies as labels).

## 2. Higher-fidelity `WireframeRenderer.tsx` (rewrite)
- Each `screen` builder is now `(ctx) => { node, pins }` where `ctx = { stage, pattern, company, industryId }`.
- Replace skeleton `<Bar>` placeholders with real text: titles, place names, prices, ratings ("4.9 ★ · 312"), prominent CTAs ("Reserve", "Send", "Continue", etc.), labels in JetBrains Mono for chips, Playfair Display for headlines, body in DM Sans.
- Keep palette monochrome (foreground / muted) with `--primary` (teal) for CTAs, badges, key numbers; preserve dark-mode tokens.
- For each screen type, define 2–3 `pins`: `{ n: 1|2|3, x: '12%', y: '34%', label?: 'Hero', emphasis?: 'cta'|'meta'|'trust' }`. Pin coordinates target meaningful elements (e.g. photoGrid → pin 1 on first tile, pin 2 on price chip, pin 3 on heart).
- `WireframeRenderer` returns `{ frame: ReactNode, pins: Pin[] }` (export type `Pin`).
- New export: `getScreenPurpose(screen, screenTypes)` — pulls `meta.screenTypes[screen]` and converts to a one-line "Purpose" sentence (e.g. "Lets people browse visually with quick price/save signals.").

## 3. Pin overlay + callout panel (`studio.$industryId.tsx`)
Phone column layout becomes phone + callout panel side-by-side at wider widths (stacked under phone on narrow).

- Render `<PhoneFrame>` with `WireframeRenderer` inside; on top of the phone screen overlay numbered pins absolutely positioned per pin coords. Pin = small (18px) teal circle with white "1/2/3" in JetBrains Mono, soft halo (ring-2 ring-primary/30), subtle scale-in animation per selection change.
- Callout panel beside (or below) phone, ~290px wide:
  - Header: `font-mono` "ANNOTATION" + chosen `pattern` name.
  - Three rows, each with a leading numbered chip matching the pin and a left-border accent (`border-l-2`):
    1. PURPOSE — teal border. Text: derived purpose from `screenTypes[opt.screen]` (via `getScreenPurpose`); if missing, compose from pattern + traits (e.g. "Emphasizes exploration and emotional pull.").
    2. STRENGTH — teal border. Composed line: purpose + dominant trait → e.g. "Best at fast visual scanning and saving favorites." Built from traits axes (`ex/em/si` highest magnitude) + pattern words.
    3. WEAKNESS — amber border (`border-amber-400/70`, label color `text-amber-400`). Uses `opt.tradeoff` verbatim.
  - Labels (`PURPOSE` / `STRENGTH` / `WEAKNESS — TRADEOFF`) in `font-mono text-[10px] tracking-wider`; body in DM Sans `text-sm leading-snug`.
- When no option is picked yet, callout shows a quiet "Pick a pattern to see how it works." placeholder; no pins rendered.
- All three pieces (phone content, pins, callout) re-render together via React state — already driven by `chosenOption`.

## 4. Helpers
- `composeStrength(opt)` — picks the strongest trait axis (`Math.abs` max of `ex/em/si`) and maps to a short phrase (`ex+` → "rewards exploration", `em-` → "feels precise and transactional", etc.), prepended with "Best at ".
- `composePurpose(opt, screenTypes)` — `screenTypes[opt.screen]` cleaned to a sentence; fallback "Presents the {stage} step as a {pattern.toLowerCase()}."
- Both live in `src/lib/engine.ts` (close to existing scoring helpers) and are pure.

## 5. Scope guardrails
- Frontend-only. No data file edits, no engine scoring changes, no new dependencies.
- Keeps existing PhoneFrame, theme tokens, type scale, and teal accent.
- Mobile: callout stacks below phone; pins remain at same relative coords.

## Files
- New: `src/lib/sampleContent.ts`
- Edited: `src/components/WireframeRenderer.tsx` (rewrite of screens + pin metadata + purpose helper export)
- Edited: `src/lib/engine.ts` (add `composePurpose`, `composeStrength`)
- Edited: `src/routes/studio.$industryId.tsx` (pin overlay + callout panel; pass `ctx`; new layout)
