
# Product Genome Studio — Build Plan

A polished, editorial-feeling interactive simulator that renders entirely from the supplied dataset, with a pluggable async `dataSource` layer ready for a future live API.

## 1. Asset & data setup
- Copy the uploaded JSON into `src/data/genome.json` (bundled with the app, single source of truth).
- Add `src/data/genome.types.ts` with TypeScript types for `Industry`, `Stage`, `Option`, `Goal`, `Picks`, `Concept`, `Conflict`, `Source`.

## 2. Data layer (`src/lib/dataSource/`)
- `index.ts` exports a singleton `dataSource` chosen by `MODE: 'static' | 'live'` constant. `live` wraps `static` and falls back on any error.
- `static.ts` implements: `listIndustries()`, `getIndustry(id)`, `generateIndustry(name)`, `synthesizeConcept(industryId, picks, goal)`, `addEntry(obj)`, `submitCorrection(obj)`. All async (Promises).
- Merges bundled seed (`source:'seed'`) with `localStorage` entries (`source:'community'|'ai'`) under keys `pgs:industries`, `pgs:corrections`.
- `generateIndustry` in static mode rejects with "coming soon".
- `synthesizeConcept` in static mode delegates to the pure engine.

## 3. Pure engine (`src/lib/engine.ts`)
- `recommendFor(goal, stage)` → option id from `stage.recommend[goal]`.
- `detectConflicts(industry, picks)` → walks each axis `ex|em|si`; flags pairs where one chosen trait ≥ 2 and another ≤ -2, returns plain-language messages ("Explore-heavy browse clashes with precise checkout").
- `score(industry, picks)` → consistency % (100 minus 15 per conflict, floored), goalMatch count vs current goal, trait totals.
- `synthesizeConceptLocal(industry, picks, goal)` → derives product name (industry + dominant trait adjective), positioning sentence, UX direction bullets, critique listing tensions.
- `matchGoalFromText(text, goals)` → keyword scan.

## 4. Routing (TanStack Start, file-based)
- `src/routes/__root.tsx`: shell with header (logo wordmark "Product Genome Studio"), theme toggle, footer showing dataset `disclaimer`.
- `src/routes/index.tsx`: **Home** — search input, industry card grid (emoji, name, "{n} companies"), filter by industry/company name, "✨ Generate with AI" CTA when no match.
- `src/routes/studio.$industryId.tsx`: **Studio**.
- `src/routes/add.tsx`: **Add/Correct** form.
- Each route sets distinct `head()` meta.

## 5. Studio screen (the centerpiece)
Two-column desktop layout, stacks on mobile.

**Left — Phone preview**
- `<PhoneFrame>` (rounded notch, 0.5px border). Renders the currently active stage's chosen option via `<WireframeRenderer screen={...} />`.
- `src/components/wireframes/` — one small component per `screenType` (photoGrid, dealList, searchBox, filterList, mapView, listRows, scoreBadge, profileTrust, badgeRow, guestForm, oneClick, reassureForm, stampCard, savedGrid, tierList, feedFull, composer, chatThread, dashboard, carousel, onboardChecklist, insightsCards, playerView, lessonCard, progressRings, kanban, templateGallery, codeCanvas, sendForm) + `Generic` fallback. Clean placeholder tiles/bars/chips, no logos. Fade/scale transition on change.
- Empty state: "Pick a pattern →".

**Right — Controls**
- Goal bar: text input + chips from `goals[]` + "No goal"; typing maps via keywords.
- Stage tabs with filled dot when chosen.
- Option cards for active stage: pattern + company; star + "Suggested for {goal}" when matches `recommend[goal]`; selecting reveals tradeoff with warning icon.
- "Use suggested set" button (visible when goal set) fills all stages with recommendations.
- **Genome panel**: consistency % progress ring, goal-match count, conflict list.
- When every stage has a pick → **Synthesize concept** button opens a modal/section showing name, positioning, UX direction, critique.

State lives in Studio component via `useReducer`; picks stored as `Record<stageName, optionId>` per industry in `localStorage` key `pgs:picks:{industryId}` so refresh keeps progress.

## 6. Add / Correct
- Form to add an industry: name, emoji, companies (comma list), funnel builder (stage name + options with pattern/company/tradeoff/screen select/traits sliders/goalsServed). Validate, `addEntry({...source:'community'})`.
- "Suggest correction" affordance on any option card in Studio → opens form pre-filled → `submitCorrection`.

## 7. Design system
- Tailwind v4 tokens in `src/styles.css` under `@theme inline` mapped to `:root` variables. Deep-teal accent (`oklch(0.55 0.09 200)` light / brighter in dark). Neutral warm-gray surfaces, 0.5px hairline borders via `--color-border`, generous radii (`--radius: 18px`).
- Typography: load Fraunces (display) + Inter (body) via `<link>` in `__root.tsx`; expose `--font-display`, `--font-sans` in `@theme`.
- Full dark mode via class-based `@custom-variant dark`. Smooth `transition-colors`/`transition-transform` defaults.
- Mobile-first responsive; phone preview centered on small screens, side-by-side ≥ lg.

## 8. Misc
- Footer (every page): small muted text with the dataset `disclaimer`.
- No backend; everything client-side. No Lovable Cloud.

## Technical notes
- Components NEVER import the JSON directly — only `dataSource`.
- `MODE` exported from `src/lib/dataSource/index.ts`; flipping to `'live'` later only requires implementing `live.ts`.
- Engine functions are pure and unit-test-friendly (no I/O).
- All wireframe sub-components are presentational, take no props beyond optional accent, so they render identically for any industry.

## Files (high-level)
```
src/
  data/genome.json
  data/genome.types.ts
  lib/dataSource/{index,static,live}.ts
  lib/engine.ts
  lib/goals.ts
  components/
    PhoneFrame.tsx
    WireframeRenderer.tsx
    wireframes/*.tsx
    IndustryCard.tsx
    GoalBar.tsx
    StageTabs.tsx
    OptionCard.tsx
    GenomePanel.tsx
    ConceptDialog.tsx
    ThemeToggle.tsx
    Footer.tsx
  routes/__root.tsx
  routes/index.tsx
  routes/studio.$industryId.tsx
  routes/add.tsx
  styles.css
```
