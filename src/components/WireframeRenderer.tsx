import { motion } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import type { Preview } from "@/data/genome.types";

export interface Pin {
  n: number;
  x: string;
  y: string;
  label: string;
}

export interface RenderCtx {
  industryId: string;
  stage: string;
  pattern: string;
  company: string;
}

export interface RenderedScreen {
  node: ReactNode;
  pins: Pin[];
}

const Frame = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-2.5 h-full px-3.5 py-3 text-foreground">{children}</div>
);

const StatusBar = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1 gap-2">
    <span className="truncate max-w-[70px]">{title.split(" · ")[0]}</span>
    <span className="tracking-[0.18em] uppercase truncate">{title}</span>
    <span className="truncate max-w-[70px]">{title.split(" · ")[1] ?? title}</span>
  </div>
);

const Chip = ({ children, accent, mono = true }: { children: ReactNode; accent?: boolean; mono?: boolean }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] truncate max-w-full ${mono ? "font-mono" : ""} ${
      accent ? "bg-primary text-primary-foreground" : "bg-foreground/8 text-foreground/70 border border-border/60"
    }`}
  >
    {children}
  </span>
);

const Photo = ({ seed = 0, className = "", children }: { seed?: number; className?: string; children?: ReactNode }) => {
  const hues = [
    "from-foreground/20 to-foreground/5",
    "from-primary/25 to-foreground/5",
    "from-foreground/15 to-foreground/0",
    "from-primary/15 to-foreground/10",
  ];
  return <div className={`bg-gradient-to-br ${hues[seed % hues.length]} ${className}`}>{children}</div>;
};

const CTA = ({ children }: { children: ReactNode }) => (
  <div className="h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[12px] font-medium tracking-wide px-2 text-center truncate">
    {children}
  </div>
);

type Builder = (ctx: RenderCtx, p: Preview) => RenderedScreen;

const safePreview = (p: Preview | undefined, ctx: RenderCtx): Preview => ({
  company: p?.company ?? "",
  pattern: p?.pattern ?? "",
  header: p?.header ?? "",
  metric: p?.metric ?? "",
  rows: p?.rows && p.rows.length ? p.rows : [p?.header ?? "", p?.metric ?? "", p?.cta ?? "", p?.pattern ?? ""],
  cta: p?.cta ?? "",
});

const title = (p: Preview) => p.company;
const row = (p: Preview, i: number) => p.rows[i % p.rows.length];
const detail = (p: Preview, i: number) => [p.metric, p.header, p.cta, p.company][i % 4];

const screens: Record<string, Builder> = {
  photoGrid: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="flex gap-1.5 -mt-1"><Chip accent>{p.metric}</Chip></div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border/60 bg-muted/40 flex flex-col">
              <Photo seed={i} className="aspect-[4/5] relative">
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-background/85 grid place-items-center text-[10px]">♡</div>
              </Photo>
              <div className="p-1.5">
                <div className="text-[10px] font-medium leading-tight truncate">{row(p, i)}</div>
                <div className="text-[9px] text-foreground/55 truncate mt-0.5">{detail(p, i)}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "33%", label: "Visual hero tile" },
      { n: 2, x: "78%", y: "60%", label: "Tile caption" },
      { n: 3, x: "44%", y: "26%", label: "Quick save" },
    ],
  }),

  dealList: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="space-y-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl border border-border/60">
              <Photo seed={i} className="w-10 h-10 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{row(p, i)}</div>
                <div className="text-[9px] text-foreground/55 truncate">{detail(p, i)}</div>
              </div>
              <Chip accent>{p.cta}</Chip>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "82%", y: "26%", label: "Deal badge" },
      { n: 2, x: "44%", y: "40%", label: "Row content" },
      { n: 3, x: "50%", y: "12%", label: "Header" },
    ],
  }),

  searchBox: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex-1 flex flex-col justify-center items-center gap-3 px-2 text-center">
          <div className="font-display text-[22px] leading-tight">{p.header}</div>
          <div className="text-[11px] text-foreground/60 -mt-1 truncate max-w-full">{p.metric}</div>
          <div className="w-full mt-2 space-y-2">
            <div className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 text-[11px] font-mono text-foreground/60 truncate">⌕ {row(p, 0)}</div>
            <div className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 text-[11px] text-foreground/60 truncate">{row(p, 1)}</div>
          </div>
          <div className="w-full"><CTA>{p.cta}</CTA></div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "One-line promise" },
      { n: 2, x: "50%", y: "55%", label: "Primary input" },
      { n: 3, x: "50%", y: "85%", label: "Single CTA" },
    ],
  }),

  filterList: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display text-[16px] truncate">{p.header}</div>
          <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider shrink-0">{p.metric}</div>
        </div>
        <div className="flex gap-1 flex-wrap">{p.rows.slice(0, 3).map((c, i) => <Chip key={i} accent={i === 0}>{c}</Chip>)}</div>
        <div className="space-y-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2 p-2 border border-border/60 rounded-xl">
              <Photo seed={i} className="w-12 h-12 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{row(p, i)}</div>
                <div className="text-[9px] text-foreground/55 truncate">{detail(p, i)}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "11%", label: "Header" },
      { n: 2, x: "50%", y: "21%", label: "Filter chips" },
      { n: 3, x: "50%", y: "55%", label: "Result row" },
    ],
  }),

  mapView: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider truncate">{p.header}</div>
        <div className="relative flex-1 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/0 border border-border/60 overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(transparent 49%, var(--border) 50%, transparent 51%), linear-gradient(90deg, transparent 49%, var(--border) 50%, transparent 51%)", backgroundSize: "32px 32px" }} />
          {[[22, 28], [42, 18], [62, 38], [30, 52]].map(([l, t], i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${l}%`, top: `${t}%` }}>
              <div className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-mono shadow max-w-[80px] truncate">{row(p, i).split(" · ")[0] || row(p, i)}</div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto -mt-px" />
            </div>
          ))}
        </div>
        <div className="p-2 rounded-xl border border-border/60 flex gap-2 items-center">
          <Photo seed={1} className="w-10 h-10 rounded-md shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium truncate">{row(p, 0)}</div>
            <div className="text-[9px] text-foreground/55 truncate">{p.metric}</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "42%", y: "30%", label: "Map pin" },
      { n: 2, x: "50%", y: "82%", label: "Linked card" },
      { n: 3, x: "78%", y: "82%", label: "Metric" },
    ],
  }),

  listRows: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="divide-y divide-border/60 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 items-center py-2">
              <Photo seed={i} className="w-9 h-9 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{row(p, i)}</div>
                <div className="text-[9px] text-foreground/55 truncate">{detail(p, i)}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "10%", label: "Header" },
      { n: 2, x: "44%", y: "40%", label: "Row" },
      { n: 3, x: "82%", y: "40%", label: "Caption" },
    ],
  }),

  scoreBadge: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex flex-col items-center gap-2 pt-3 text-center px-2">
          <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[0_10px_40px_-10px_var(--primary)] overflow-hidden">
            <div className="flex flex-col items-center leading-none">
              <span className="font-display text-[34px] leading-none">{(() => { const m = (p.rows.join(" ").match(/(\d+\.\d)/) || [])[1]; return m || "9.4"; })()}</span>
              <span className="text-[8px] font-mono opacity-80 mt-0.5">/ 10</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-foreground/55 truncate max-w-full">{(() => { const n = ((p.company.length * 137) % 9000) + 1200; return `${n.toLocaleString()} reviews`; })()}</div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/15 border border-destructive/40 text-destructive text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            Only {((p.company.length % 4) + 1)} left at this price
          </div>
          <div className="text-[10px] text-foreground/70 truncate max-w-full">{row(p, 0)}</div>
        </div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Trust score" },
      { n: 2, x: "50%", y: "60%", label: "Urgency cue" },
      { n: 3, x: "50%", y: "90%", label: "Commit CTA" },
    ],
  }),

  profileTrust: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-center gap-3">
          <Photo seed={2} className="w-14 h-14 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-display text-[16px] truncate">{p.header}</div>
            <div className="flex gap-1 mt-0.5"><Chip>{row(p, 0)}</Chip><Chip>{p.cta}</Chip></div>
          </div>
        </div>
        <div className="text-[10px] text-foreground/70 truncate">{p.metric}</div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] w-3 font-mono text-foreground/55">{4 - i}</span>
            <div className="flex-1 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${88 - i * 18}%` }} />
            </div>
            <span className="text-[9px] font-mono text-foreground/55 truncate max-w-[140px]">{row(p, i)}</span>
          </div>
        ))}
      </Frame>
    ),
    pins: [
      { n: 1, x: "60%", y: "18%", label: "Identity + badges" },
      { n: 2, x: "50%", y: "55%", label: "Rating bars" },
      { n: 3, x: "70%", y: "75%", label: "Row signal" },
    ],
  }),

  badgeRow: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { icon: "🛡", label: "Best price guarantee" },
            { icon: "↺", label: "Free cancellation" },
            { icon: "✓", label: "Verified listing" },
            { icon: "☎", label: "24/7 support" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl border border-primary/30 bg-primary/5">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-[12px] shrink-0">{b.icon}</div>
              <div className="text-[10px] font-medium leading-tight truncate">{b.label}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-foreground/60 leading-snug truncate">{p.metric}</div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "35%", label: "Feature badge" },
      { n: 2, x: "70%", y: "55%", label: "Guarantee badge" },
      { n: 3, x: "50%", y: "90%", label: "Commit CTA" },
    ],
  }),

  guestForm: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="space-y-2">
          {p.rows.slice(0, 3).map((l, i) => (
            <div key={i} className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 text-[11px] text-foreground/60 truncate">{l}</div>
          ))}
        </div>
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/40 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-[12px] shrink-0">↺</div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-foreground truncate">Free cancellation</div>
            <div className="text-[9px] text-foreground/65 truncate">No charge until check-in</div>
          </div>
        </div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Minimal fields" },
      { n: 2, x: "50%", y: "62%", label: "Free cancellation" },
      { n: 3, x: "50%", y: "90%", label: "Single CTA" },
    ],
  }),

  oneClick: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="p-3 rounded-xl border border-border/60 flex items-center gap-2">
          <div className="w-9 h-6 rounded bg-foreground/70 shrink-0" />
          <div className="flex-1 text-[11px] truncate">{row(p, 0)}</div>
          <span className="text-[9px] font-mono text-foreground/55 shrink-0 truncate max-w-[80px]">{p.metric}</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 flex items-center gap-2">
          <div className="flex-1 text-[11px] truncate">{row(p, 1)}</div>
        </div>
        <div className="text-[11px] text-foreground/70 truncate">{p.metric}</div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Saved row" },
      { n: 2, x: "82%", y: "30%", label: "Default flag" },
      { n: 3, x: "50%", y: "90%", label: "One-tap commit" },
    ],
  }),

  reassureForm: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] p-2 rounded-lg bg-primary/10 border border-primary/30 text-foreground/80 truncate">You won't be charged yet · {p.metric}</div>
        {p.rows.slice(0, 2).map((l, i) => (
          <div key={i} className={`rounded-xl border border-border bg-background/40 px-3 ${i === 0 ? "h-10 flex items-center" : "h-20 pt-2"} text-[11px] text-foreground/60 truncate`}>{l}</div>
        ))}
        <div className="mt-auto"><CTA>Request to book</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Calm framing" },
      { n: 2, x: "50%", y: "55%", label: "Personal note" },
      { n: 3, x: "50%", y: "90%", label: "Request CTA" },
    ],
  }),

  stampCard: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[11px] text-foreground/70 -mt-1 truncate">{p.metric}</div>
        <div className="grid grid-cols-5 gap-2 pt-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`aspect-square rounded-full grid place-items-center text-[10px] font-mono ${i < 6 ? "bg-primary text-primary-foreground" : "border border-dashed border-border/80 text-foreground/40"}`}>{i < 6 ? "✓" : i + 1}</div>
          ))}
        </div>
        <div className="mt-auto p-2 rounded-xl border border-border/60 text-[10px] text-foreground/70 flex items-center justify-between gap-2">
          <span className="truncate">{row(p, 0)}</span><span className="font-mono text-primary shrink-0">{p.cta}</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Progress headline" },
      { n: 2, x: "50%", y: "48%", label: "Stamp grid" },
      { n: 3, x: "82%", y: "92%", label: "Reward" },
    ],
  }),

  savedGrid: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono text-foreground/55 -mt-1 uppercase tracking-wider truncate">{p.metric}</div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border/60 relative">
              <Photo seed={i} className="aspect-square" />
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-background/80 grid place-items-center text-[10px] text-primary">♥</div>
              <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-medium text-foreground bg-background/70 backdrop-blur px-1.5 py-0.5 rounded truncate">{row(p, i)}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "14%", label: "Personal collection" },
      { n: 2, x: "78%", y: "32%", label: "Saved tile" },
      { n: 3, x: "30%", y: "60%", label: "Label" },
    ],
  }),

  tierList: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono text-foreground/55 -mt-1 truncate">{p.metric}</div>
        <div className="space-y-1.5 flex-1">
          {[
            { name: "Level 1 · Genius", perk: "10% off select stays", active: true, done: true },
            { name: "Level 2 · Genius", perk: "15% off + free breakfast", active: true, done: false },
            { name: "Level 3 · Genius", perk: "20% off + room upgrade", active: false, done: false },
          ].map((t, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border ${t.active ? "border-primary/50 bg-primary/5" : "border-dashed border-border/70 opacity-60"}`}>
              <div className={`w-7 h-7 rounded-full grid place-items-center text-[10px] font-mono shrink-0 ${t.done ? "bg-primary text-primary-foreground" : t.active ? "border border-primary text-primary" : "border border-border text-foreground/50"}`}>
                {t.done ? "✓" : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{t.name}</div>
                <div className="text-[9px] text-foreground/65 truncate">{t.perk}</div>
              </div>
              {t.done && <span className="text-[8px] font-mono text-primary shrink-0">UNLOCKED</span>}
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono text-foreground/55 truncate">2 stays until Level 3</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "30%", label: "Current tier" },
      { n: 2, x: "78%", y: "55%", label: "Unlocked perk" },
      { n: 3, x: "50%", y: "82%", label: "Next-tier hook" },
    ],
  }),

  feedFull: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex-1 flex gap-2">
          <div className="flex-1 rounded-xl bg-gradient-to-b from-foreground/15 to-foreground/40 relative overflow-hidden">
            <div className="absolute top-2 left-2 right-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-background/70 shrink-0" />
              <div className="text-[10px] font-medium text-background truncate">{p.header}</div>
            </div>
            <div className="absolute bottom-3 left-3 right-10">
              <div className="text-[12px] font-medium text-background leading-snug line-clamp-2">{row(p, 0)}</div>
              <div className="text-[10px] text-background/80 mt-0.5 truncate">{p.metric}</div>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-center justify-end pb-3">
            {[["♥", row(p, 1)], ["💬", row(p, 2)], ["↗", ""], ["⋯", ""]].map(([icon, n], idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-foreground/15 grid place-items-center text-sm">{icon}</div>
                {n && <div className="text-[9px] font-mono text-foreground/70 mt-0.5 max-w-[44px] truncate">{n}</div>}
              </div>
            ))}
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "40%", y: "50%", label: "Full-bleed content" },
      { n: 2, x: "85%", y: "35%", label: "Side actions" },
      { n: 3, x: "40%", y: "85%", label: "Caption" },
    ],
  }),

  composer: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex-1 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/0 border border-dashed border-border grid place-items-center text-foreground/50 text-[11px] px-3 text-center">
          {p.header}
        </div>
        <div className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider truncate">{p.metric}</div>
        <div className="flex justify-between gap-1">
          {p.rows.slice(0, 4).map((l, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-foreground/8 border border-border/60 grid place-items-center text-base shrink-0">{["✨", "🎵", "📍", "🏷"][i]}</div>
              <div className="text-[9px] font-mono text-foreground/60 truncate max-w-full">{l}</div>
            </div>
          ))}
        </div>
        <CTA>{p.cta}</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Capture canvas" },
      { n: 2, x: "50%", y: "72%", label: "Tools" },
      { n: 3, x: "50%", y: "92%", label: "Publish CTA" },
    ],
  }),

  chatThread: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-center gap-2 pb-2 border-b border-border/60">
          <Photo seed={1} className="w-7 h-7 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium truncate">{p.header}</div>
            <div className="text-[9px] font-mono text-primary truncate">● {p.metric}</div>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {p.rows.slice(0, 4).map((text, i) => {
            const me = i % 2 === 1;
            return (
              <div key={i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
                <div className={`px-2.5 py-1.5 rounded-2xl text-[11px] leading-snug max-w-[80%] ${me ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-foreground/8 rounded-bl-sm"}`}>
                  {text}
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-9 rounded-full border border-border bg-background/40 flex items-center px-3 text-[11px] text-foreground/50 truncate">{p.cta}</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "10%", label: "Header" },
      { n: 2, x: "70%", y: "48%", label: "Your message" },
      { n: 3, x: "50%", y: "92%", label: "Composer" },
    ],
  }),

  dashboard: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-foreground/5 border border-border/60">
          <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider truncate">{p.header}</div>
          <div className="text-[24px] font-display mt-0.5 leading-none truncate">{p.metric}</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {p.rows.slice(0, 3).map((c, i) => (
            <div key={i} className="aspect-square rounded-xl border border-border/60 bg-card/60 grid place-items-center text-[10px] font-medium text-center px-1 truncate">{c}</div>
          ))}
        </div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Key metric" },
      { n: 2, x: "50%", y: "55%", label: "Quick actions" },
      { n: 3, x: "50%", y: "92%", label: "Primary CTA" },
    ],
  }),

  carousel: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono text-foreground/55 -mt-1 uppercase tracking-wider truncate">{p.metric}</div>
        {[0, 1].map((row_i) => (
          <div key={row_i}>
            <div className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider mb-1.5 truncate">{detail(p, row_i)}</div>
            <div className="flex gap-2 overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-[68px] shrink-0">
                  <Photo seed={i + row_i} className="w-full h-20 rounded-md" />
                  <div className="text-[10px] mt-1 truncate">{row(p, (i + row_i * 2) % p.rows.length)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "26%", label: "Row label" },
      { n: 2, x: "18%", y: "50%", label: "Tile" },
      { n: 3, x: "70%", y: "75%", label: "Second row" },
    ],
  }),

  onboardChecklist: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[11px] text-foreground/60 -mt-1 truncate">{p.metric}</div>
        <div className="space-y-2 mt-2">
          {p.rows.slice(0, 4).map((t, i) => {
            const done = i < 2;
            return (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border ${done ? "border-border/60 bg-foreground/[0.03]" : "border-border"}`}>
                <div className={`w-4 h-4 rounded-full grid place-items-center text-[9px] shrink-0 ${done ? "bg-primary text-primary-foreground" : "border-2 border-border"}`}>{done ? "✓" : ""}</div>
                <div className={`flex-1 text-[11px] truncate ${done ? "line-through text-foreground/50" : ""}`}>{t}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Clear promise" },
      { n: 2, x: "50%", y: "55%", label: "Checklist" },
      { n: 3, x: "82%", y: "62%", label: "Step row" },
    ],
  }),

  insightsCards: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-foreground/55 truncate">{p.metric}</div>
        <div className="grid grid-cols-2 gap-2">
          {p.rows.slice(0, 4).map((c, i) => (
            <div key={i} className="p-2.5 rounded-xl border border-border/60">
              <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 truncate">{detail(p, i)}</div>
              <div className="text-[14px] font-display mt-0.5 leading-tight line-clamp-2">{c}</div>
              <div className="h-5 mt-1.5 flex items-end gap-0.5">
                {[3, 5, 4, 6, 5, 7, 6].map((h, hi) => <div key={hi} className="flex-1 bg-primary/40 rounded-sm" style={{ height: `${h * 12}%` }} />)}
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "26%", y: "30%", label: "Metric card" },
      { n: 2, x: "74%", y: "30%", label: "Second metric" },
      { n: 3, x: "50%", y: "72%", label: "Sparkline" },
    ],
  }),

  playerView: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <Photo seed={2} className="aspect-square rounded-xl relative grid place-items-center">
          <div className="w-14 h-14 rounded-full bg-background/85 grid place-items-center text-2xl text-primary">▶</div>
        </Photo>
        <div className="font-display text-[16px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono text-foreground/55 truncate">{row(p, 0)}</div>
        <div className="space-y-1">
          <div className="h-1 bg-foreground/10 rounded-full"><div className="h-full w-1/3 bg-primary rounded-full" /></div>
          <div className="flex justify-between text-[9px] font-mono text-foreground/55"><span>00:42</span><span className="truncate max-w-[80px]">{p.metric}</span></div>
        </div>
        <div className="flex justify-around items-center mt-1 text-lg text-foreground/70">⏮ <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center text-base">⏯</span> ⏭</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "32%", label: "Big play target" },
      { n: 2, x: "50%", y: "70%", label: "Scrub timeline" },
      { n: 3, x: "50%", y: "90%", label: "Transport" },
    ],
  }),

  lessonCard: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider truncate">{p.metric}</div>
        <div className="rounded-xl border border-border/60 p-3 bg-card/60 flex-1 flex flex-col">
          <div className="font-display text-[16px] leading-tight line-clamp-2">{p.header}</div>
          <div className="mt-3 space-y-1.5">
            {p.rows.slice(0, 4).map((t, i) => {
              const ok = i === 1;
              return (
                <div key={i} className={`px-3 py-2 rounded-lg border text-[11px] truncate ${ok ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background/30 text-foreground/75"}`}>
                  {t}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "14%", label: "Progress crumb" },
      { n: 2, x: "50%", y: "50%", label: "One question" },
      { n: 3, x: "50%", y: "92%", label: "Check answer" },
    ],
  }),

  progressRings: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex gap-4 justify-center pt-1">
          {[80, 60, 100].map((pct, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="relative w-14 h-14 rounded-full" style={{ background: `conic-gradient(var(--primary) ${pct * 3.6}deg, var(--muted) 0)` }}>
                <div className="absolute inset-1.5 rounded-full bg-card grid place-items-center text-[10px] font-mono font-medium">{pct}%</div>
              </div>
              <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider truncate max-w-[60px]">{detail(p, i)}</div>
            </div>
          ))}
        </div>
        <div className="font-display text-[16px] leading-tight mt-2 truncate">{p.header}: {p.metric}</div>
        <div className="space-y-1.5 mt-1">
          {p.rows.slice(0, 3).map((t, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] border-b border-border/40 pb-1 gap-2">
              <span className="truncate">{t}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "78%", y: "20%", label: "Streak ring" },
      { n: 2, x: "50%", y: "50%", label: "Headline" },
      { n: 3, x: "78%", y: "78%", label: "Today's wins" },
    ],
  }),

  kanban: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display text-[16px] leading-tight truncate">Board</div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 truncate shrink-0">{p.metric}</div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 flex-1">
          {[
            { col: "Todo", items: [p.rows[0], p.rows[1]] },
            { col: "In progress", items: [p.rows[2]] },
            { col: "Done", items: [p.rows[3]] },
          ].map((col, i) => (
            <div key={i} className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 truncate flex items-center justify-between">
                <span className="truncate">{col.col}</span>
                <span className="opacity-60">{col.items.length}</span>
              </div>
              {col.items.map((t, i) => (
                <div key={i} className={`rounded-lg border border-border/60 p-1.5 bg-card/70 ${i === 0 ? "ring-1 ring-primary/40" : ""}`}>
                  <div className="text-[10px] font-medium leading-tight line-clamp-3">{t}</div>
                  <div className="text-[8px] font-mono text-foreground/45 mt-0.5">#{(i + 1) * 14}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "20%", label: "Status columns" },
      { n: 2, x: "50%", y: "50%", label: "Card" },
      { n: 3, x: "82%", y: "70%", label: "Done column" },
    ],
  }),

  templateGallery: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono text-foreground/55 -mt-1 uppercase tracking-wider truncate">{p.metric}</div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border/60 flex flex-col">
              <Photo seed={i} className="aspect-[3/4]" />
              <div className="p-1.5">
                <div className="text-[10px] font-medium truncate">{row(p, i)}</div>
                <div className="text-[9px] text-foreground/55 truncate">{detail(p, i)}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "16%", label: "Header" },
      { n: 2, x: "26%", y: "50%", label: "Preview thumb" },
      { n: 3, x: "74%", y: "78%", label: "Tile caption" },
    ],
  }),

  codeCanvas: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-center gap-1">
          {p.rows.slice(0, 3).map((t, i) => (
            <div key={i} className={`px-2 py-0.5 rounded text-[9px] font-mono truncate max-w-[80px] ${i === 1 ? "bg-primary text-primary-foreground" : "text-foreground/55"}`}>{t}</div>
          ))}
        </div>
        <div className="flex-1 rounded-lg border border-border/60 bg-background/40 p-2 font-mono text-[9px] leading-relaxed overflow-hidden">
          <div className="text-foreground/40 truncate">{p.header}</div>
          <div className="truncate text-primary">{row(p, 0)}</div>
          <div className="mt-1 truncate text-foreground/80">{row(p, 1)}</div>
          <div className="pl-3 truncate">{row(p, 2)}</div>
          <div className="truncate">{row(p, 3)}</div>
          <div className="mt-2 text-foreground/40 truncate">{p.metric}</div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-foreground/55 gap-2"><span className="truncate">{p.cta}</span><span className="text-primary shrink-0 truncate max-w-[80px]">{p.company}</span></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Mode toggle" },
      { n: 2, x: "50%", y: "50%", label: "Canvas" },
      { n: 3, x: "82%", y: "92%", label: "Live status" },
    ],
  }),

  sendForm: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider truncate">{p.header}</div>
        <div className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 gap-2">
          <div className="w-6 h-6 rounded-full bg-foreground/20 shrink-0" />
          <div className="text-[11px] flex-1 truncate">{row(p, 0)}</div>
        </div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider truncate">{p.metric}</div>
        <div className="rounded-xl border border-border bg-background/40 px-3 py-3 text-center">
          <div className="font-display text-[24px] leading-none truncate">{p.metric}</div>
          <div className="text-[10px] text-foreground/55 mt-1 truncate">{row(p, 1)}</div>
        </div>
        <div className="h-12 rounded-xl border border-border bg-background/40 px-3 py-2 text-[11px] text-foreground/60 truncate">{row(p, 2)}</div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "26%", label: "Recipient" },
      { n: 2, x: "50%", y: "60%", label: "Amount field" },
      { n: 3, x: "50%", y: "92%", label: "Commit CTA" },
    ],
  }),

  compareGrid: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono text-foreground/55 -mt-1 truncate">Compare · {p.metric}</div>
        <div className="grid grid-cols-[80px_1fr_1fr] gap-x-2 gap-y-1 text-[9px] flex-1">
          <div />
          {p.rows.slice(0, 2).map((r, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-1 rounded-lg bg-primary/5 border border-primary/30">
              <Photo seed={i} className="w-full aspect-[4/3] rounded" />
              <div className="text-[9px] font-medium truncate w-full text-center">{r.split("·")[0]?.trim() || r}</div>
            </div>
          ))}
          {[
            { label: "Price/night", values: ["$240", "$118"] },
            { label: "Rating", values: ["★ 4.9", "★ 4.8"] },
            { label: "Free cancel", values: ["✓", "✓"] },
            { label: "Breakfast", values: ["✓", "—"] },
            { label: "Wi-Fi", values: ["Fast", "Std"] },
          ].map((r, i) => (
            <Fragment key={i}>
              <div className="text-[9px] font-mono text-foreground/55 self-center truncate">{r.label}</div>
              {r.values.map((v, j) => (
                <div key={j} className={`text-[10px] text-center font-medium self-center ${j === 0 ? "text-primary" : ""}`}>{v}</div>
              ))}
            </Fragment>
          ))}
        </div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Compare header" },
      { n: 2, x: "50%", y: "55%", label: "Attribute matrix" },
      { n: 3, x: "50%", y: "92%", label: "Pick winner" },
    ],
  }),

  pointsBundle: (ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="text-[10px] font-mono text-foreground/55 -mt-1 truncate">{p.metric}</div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-between gap-2 shadow-[0_10px_30px_-15px_var(--primary)]">
          <div className="min-w-0">
            <div className="text-[9px] font-mono opacity-80 uppercase tracking-wider">Points balance</div>
            <div className="font-display text-[26px] leading-none mt-0.5">24,580</div>
          </div>
          <div className="text-right text-[9px] font-mono opacity-90 shrink-0">
            <div>+1,420 pending</div>
            <div className="opacity-75">expires Mar 2027</div>
          </div>
        </div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider mt-1">Redeem as bundle</div>
        <div className="space-y-1.5 flex-1">
          {[
            { name: "Flight + Hotel", cost: "18,000 pts", save: "Save $120" },
            { name: "Hotel + Car", cost: "12,500 pts", save: "Save $65" },
            { name: "3-night stay", cost: "9,800 pts", save: "Save $40" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-border/60">
              <div className="w-7 h-7 rounded-md bg-primary/15 text-primary grid place-items-center text-[12px] shrink-0">◆</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{b.name}</div>
                <div className="text-[9px] font-mono text-foreground/55 truncate">{b.cost}</div>
              </div>
              <span className="text-[9px] font-mono text-primary shrink-0">{b.save}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Points balance" },
      { n: 2, x: "50%", y: "60%", label: "Bundle redemption" },
      { n: 3, x: "78%", y: "78%", label: "Bundle savings" },
    ],
  }),
};

// Appended specialized screens
Object.assign(screens, {
  onboardFlow: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[16px] leading-tight truncate">Welcome — let's get going</div>
        <div className="flex items-center gap-1 -mt-1">
          {[0,1,2,3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= 1 ? "bg-primary" : "bg-foreground/15"}`} />
          ))}
        </div>
        <div className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider">Step 2 of 4</div>
        <div className="space-y-2 flex-1">
          {[
            { t: "Name your workspace", v: p.rows[0], done: true },
            { t: "Invite teammates", v: "2 added · alex@, sam@", done: true },
            { t: "Pick a use case", v: "Product roadmap", done: false, active: true },
            { t: "Create first project", v: "Skip for now", done: false },
          ].map((s, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border ${s.active ? "border-primary bg-primary/5" : s.done ? "border-border/50 bg-foreground/[0.03]" : "border-border/40"}`}>
              <div className={`w-5 h-5 rounded-full grid place-items-center text-[9px] shrink-0 ${s.done ? "bg-primary text-primary-foreground" : s.active ? "border-2 border-primary text-primary" : "border border-border text-foreground/50"}`}>{s.done ? "✓" : i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-medium truncate ${s.done ? "text-foreground/60" : ""}`}>{s.t}</div>
                <div className="text-[9px] text-foreground/55 truncate">{s.v}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto"><CTA>Continue → Step 3</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Progress stepper" },
      { n: 2, x: "50%", y: "55%", label: "Current step" },
      { n: 3, x: "50%", y: "92%", label: "Move forward" },
    ],
  })) as Builder,

  richTask: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[15px] leading-tight line-clamp-2">{p.rows[0]}</div>
        <div className="flex gap-1 flex-wrap -mt-1">
          <Chip accent>In progress</Chip>
          <Chip>High</Chip>
          <Chip>Design</Chip>
        </div>
        <div className="space-y-1.5 flex-1">
          {[
            { k: "Assignee", v: "● Sam Patel" },
            { k: "Due date", v: "Fri, Jun 27" },
            { k: "Project", v: p.rows[1] },
            { k: "Dependencies", v: "Blocked by #214" },
            { k: "Estimate", v: "3 d · 60% done" },
            { k: "Custom: Impact", v: "★★★★☆" },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-2 py-1 border-b border-border/40">
              <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 truncate">{f.k}</span>
              <span className="text-[10px] font-medium truncate max-w-[55%] text-right">{f.v}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border/60 p-1.5 text-[10px] text-foreground/65 line-clamp-2">📎 spec.pdf · brief.fig · 4 subtasks</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Task title" },
      { n: 2, x: "50%", y: "55%", label: "Rich field list" },
      { n: 3, x: "50%", y: "92%", label: "Attachments" },
    ],
  })) as Builder,

  databaseRows: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display text-[15px] truncate">Tasks DB</div>
          <div className="text-[9px] font-mono text-foreground/55 truncate shrink-0">Table · Filter · Sort</div>
        </div>
        <div className="grid grid-cols-[1fr_46px_42px_38px] gap-x-1 text-[8px] font-mono uppercase tracking-wider text-foreground/55 border-b border-border/60 pb-1">
          <span className="truncate">Name</span><span className="truncate">Status</span><span className="truncate">Owner</span><span className="truncate">Due</span>
        </div>
        <div className="flex-1 divide-y divide-border/40">
          {[
            { s: "Todo", c: "bg-foreground/15 text-foreground/70", o: "SP", d: "Jun 22" },
            { s: "Doing", c: "bg-primary/20 text-primary", o: "AL", d: "Jun 24" },
            { s: "Review", c: "bg-amber-500/20 text-amber-500", o: "MK", d: "Jun 26" },
            { s: "Blocked", c: "bg-destructive/20 text-destructive", o: "JT", d: "—" },
            { s: "Done", c: "bg-emerald-500/20 text-emerald-500", o: "SP", d: "Jun 18" },
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_46px_42px_38px] gap-x-1 items-center py-1.5">
              <span className="text-[10px] truncate">{p.rows[i % p.rows.length].split("·")[0]?.trim()}</span>
              <span className={`text-[8px] font-mono px-1 py-0.5 rounded text-center truncate ${r.c}`}>{r.s}</span>
              <span className="w-5 h-5 rounded-full bg-foreground/15 grid place-items-center text-[8px] font-mono">{r.o}</span>
              <span className="text-[9px] font-mono text-foreground/65 truncate">{r.d}</span>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono text-foreground/45 truncate">+ New row</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Column headers" },
      { n: 2, x: "50%", y: "55%", label: "Typed rows" },
      { n: 3, x: "30%", y: "92%", label: "Inline add" },
    ],
  })) as Builder,

  mentionsThread: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
          <Photo seed={1} className="w-7 h-7 rounded-md shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium truncate">{p.rows[0]}</div>
            <div className="text-[9px] font-mono text-foreground/55 truncate">4 in thread</div>
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          {[
            { who: "Sam", color: "bg-primary/20 text-primary", text: <><span className="font-medium text-primary">@alex</span> can you take this before Friday? Blocking the launch.</> },
            { who: "Alex", color: "bg-amber-500/20 text-amber-500", text: <>On it. Pulling in <span className="font-medium text-primary">@mira</span> for the copy review.</> },
            { who: "Mira", color: "bg-emerald-500/20 text-emerald-500", text: <>Drafted. <span className="font-medium text-primary">@sam</span> see comment on line 3.</> },
          ].map((m, i) => (
            <div key={i} className="flex gap-2">
              <div className={`w-6 h-6 rounded-full grid place-items-center text-[9px] font-mono shrink-0 ${m.color}`}>{m.who[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-mono text-foreground/55">{m.who} · 2m</div>
                <div className="text-[10px] leading-snug">{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-9 rounded-lg border border-border bg-background/40 flex items-center px-2 text-[10px] text-foreground/55 gap-1">
          <span className="text-primary font-medium">@</span><span className="truncate">Mention someone…</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "12%", label: "Task header" },
      { n: 2, x: "60%", y: "45%", label: "@mention" },
      { n: 3, x: "30%", y: "92%", label: "@-composer" },
    ],
  })) as Builder,

  inlineComments: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[15px] leading-tight truncate">Launch brief</div>
        <div className="space-y-1 text-[10px] leading-snug">
          <p className="text-foreground/85">We're shipping the new onboarding to a 10% cohort on Friday.</p>
          <p className="text-foreground/85">
            Success criteria:{" "}
            <span className="bg-amber-400/25 rounded px-0.5 border-b-2 border-amber-400">activation &gt; 42%</span>
            {" "}within day 3.
          </p>
          <div className="ml-3 pl-2 border-l-2 border-primary bg-primary/5 rounded-r p-1.5 space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-mono text-primary"><span className="w-3 h-3 rounded-full bg-primary text-primary-foreground grid place-items-center text-[7px]">S</span>Sam · just now</div>
            <div className="text-[10px]">Shouldn't this be 45% based on last test?</div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-foreground/55"><span className="w-3 h-3 rounded-full bg-foreground/30 text-background grid place-items-center text-[7px]">A</span>Alex · 1m</div>
            <div className="text-[10px]">42 is the floor — happy to raise.</div>
            <div className="h-6 rounded border border-border bg-background/60 flex items-center px-1.5 text-[9px] text-foreground/50">Reply…</div>
          </div>
          <p className="text-foreground/85">Rollback plan: feature flag <span className="font-mono bg-foreground/10 rounded px-0.5">onb_v3</span> off via dashboard.</p>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "26%", label: "Highlighted passage" },
      { n: 2, x: "55%", y: "55%", label: "Inline thread" },
      { n: 3, x: "55%", y: "78%", label: "Reply in place" },
    ],
  })) as Builder,

  linearIssues: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display text-[15px] truncate">Cycle 24 · active</div>
          <div className="text-[9px] font-mono text-primary truncate shrink-0">12 / 18</div>
        </div>
        <div className="flex gap-1 -mt-1">
          <Chip accent>All</Chip><Chip>Mine</Chip><Chip>Triage</Chip>
        </div>
        <div className="flex-1 divide-y divide-border/40">
          {[
            { id: "ENG-214", t: p.rows[0], s: "In Progress", sc: "text-amber-500", p: "P1", a: "SP" },
            { id: "ENG-218", t: p.rows[1], s: "In Review", sc: "text-primary", p: "P2", a: "AL" },
            { id: "ENG-221", t: p.rows[2], s: "Todo", sc: "text-foreground/60", p: "P1", a: "MK" },
            { id: "ENG-225", t: p.rows[3], s: "Done", sc: "text-emerald-500", p: "P3", a: "JT" },
            { id: "ENG-227", t: "Patch crash on logout", s: "Backlog", sc: "text-foreground/45", p: "P2", a: "SP" },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <span className={`text-[8px] font-mono shrink-0 w-2.5 h-2.5 rounded-full ${r.sc.replace("text-","bg-")}`} />
              <span className="text-[9px] font-mono text-foreground/50 shrink-0">{r.id}</span>
              <span className="text-[10px] flex-1 truncate">{(r.t || "").split("·")[0]?.trim()}</span>
              <span className="text-[8px] font-mono text-foreground/55 shrink-0">{r.p}</span>
              <span className="w-4 h-4 rounded-full bg-foreground/15 grid place-items-center text-[7px] font-mono shrink-0">{r.a}</span>
            </div>
          ))}
        </div>
        <div className="text-[8px] font-mono text-foreground/45 truncate">⌘K · Press . to assign · ⇧E to edit</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Cycle progress" },
      { n: 2, x: "50%", y: "50%", label: "Dense row" },
      { n: 3, x: "50%", y: "92%", label: "Keyboard hints" },
    ],
  })) as Builder,

  speedSignal: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[16px] leading-tight truncate">Built for speed</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Open", v: "42ms" },
            { k: "Search", v: "18ms" },
            { k: "Sync", v: "live" },
          ].map((m, i) => (
            <div key={i} className="p-2 rounded-lg border border-border/60 bg-card/60">
              <div className="text-[9px] font-mono uppercase text-foreground/55 truncate">{m.k}</div>
              <div className="font-display text-[16px] leading-none mt-0.5 text-primary truncate">{m.v}</div>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">Recent actions</div>
        <div className="flex-1 space-y-1">
          {[
            { k: "⌘K", a: "Jump to issue", t: "0.04s" },
            { k: "C", a: "Create issue", t: "0.05s" },
            { k: "⇧S", a: "Change status", t: "0.03s" },
            { k: "⌘/", a: "Toggle sidebar", t: "0.02s" },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-border/40">
              <span className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono text-[9px] shrink-0">{r.k}</span>
              <span className="text-[10px] flex-1 truncate">{r.a}</span>
              <span className="text-[9px] font-mono text-primary shrink-0">{r.t}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden"><div className="h-full w-[92%] bg-primary" /></div>
        <div className="text-[9px] font-mono text-foreground/55 -mt-1 truncate">92nd percentile speed this week</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Latency stats" },
      { n: 2, x: "60%", y: "55%", label: "Shortcut log" },
      { n: 3, x: "50%", y: "92%", label: "Speed percentile" },
    ],
  })) as Builder,

  reminders: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="font-display text-[16px] leading-tight truncate">Reminders</div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 -mt-1">Today · Mon Jun 17</div>
        <div className="space-y-1.5 flex-1">
          {[
            { t: "9:00", k: "📌", a: p.rows[0], s: "in 1h", urg: true },
            { t: "11:30", k: "🔁", a: "Standup with design", s: "recurring", urg: false },
            { t: "14:00", k: "⏰", a: "Review PR #421", s: "snoozed 2×", urg: false },
            { t: "17:00", k: "🔔", a: p.rows[1], s: "due today", urg: true },
          ].map((r, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border ${r.urg ? "border-primary/50 bg-primary/5" : "border-border/50"}`}>
              <div className="w-10 text-[10px] font-mono text-foreground/65 shrink-0">{r.t}</div>
              <div className="text-[14px] shrink-0">{r.k}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{r.a}</div>
                <div className={`text-[9px] font-mono truncate ${r.urg ? "text-primary" : "text-foreground/55"}`}>{r.s}</div>
              </div>
              <button className="text-[9px] font-mono text-foreground/55 shrink-0">Snooze</button>
            </div>
          ))}
        </div>
        <div className="p-2 rounded-lg bg-foreground/[0.04] border border-border/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <div className="text-[10px] truncate">Daily digest at 8:00 · Slack + Email</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "18%", label: "Today timeline" },
      { n: 2, x: "50%", y: "50%", label: "Urgent reminder" },
      { n: 3, x: "50%", y: "92%", label: "Digest channel" },
    ],
  })) as Builder,

  notionPage: ((ctx, p) => ({
    node: (
      <Frame>
        <StatusBar title={title(p)} />
        <div className="text-[8px] font-mono text-foreground/45 truncate">Workspace / Engineering / {p.rows[0]?.split("·")[0]?.trim()}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-[16px]">📘</span>
          <div className="font-display text-[16px] leading-tight truncate flex-1">{p.rows[0]?.split("·")[0]?.trim() || "Project hub"}</div>
        </div>
        <div className="text-[9px] text-foreground/55 -mt-1 truncate">Owner ● Sam · Updated 2m ago</div>
        <div className="space-y-1.5 flex-1 text-[10px] leading-snug">
          <div className="font-medium text-[11px]">Overview</div>
          <p className="text-foreground/80">A single page that links every doc, task, and decision for this initiative.</p>
          <div className="font-medium text-[11px] pt-1">Sub-pages</div>
          {[
            { i: "📄", t: "Spec v2", m: "12 blocks" },
            { i: "🗂", t: "Tasks database", m: "32 rows" },
            { i: "🧭", t: "Decisions log", m: "8 entries" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-border/40">
              <span className="text-[12px] shrink-0">{s.i}</span>
              <span className="flex-1 text-[10px] truncate underline decoration-foreground/30 underline-offset-2">{s.t}</span>
              <span className="text-[9px] font-mono text-foreground/55 shrink-0">{s.m}</span>
            </div>
          ))}
          <div className="font-medium text-[11px] pt-1">Toggle ▸ Backlog</div>
          <div className="text-[10px] text-foreground/55 pl-3 truncate">▸ 14 ideas captured</div>
        </div>
        <div className="text-[8px] font-mono text-foreground/45 truncate">+ Add a block / · type "/" for commands</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "12%", label: "Breadcrumb path" },
      { n: 2, x: "50%", y: "55%", label: "Nested sub-pages" },
      { n: 3, x: "50%", y: "92%", label: "Slash commands" },
    ],
  })) as Builder,
});

// ============= Social Media specialized screens =============
// Each builder renders only neutral, brand-evocative UI. Never echo
// p.company / p.metric / p.pattern — those leak strings like "TikTok · Onboarding".
const PhoneBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

const SAMPLE_USERS = [
  { h: "@maya.makes",     n: "Maya Chen",       sub: "Designer · 12k followers" },
  { h: "@devpatel",       n: "Dev Patel",       sub: "Engineer · 8.2k followers" },
  { h: "@studio.ks",      n: "Studio KS",       sub: "Creative studio · 24k" },
  { h: "@lina.codes",     n: "Lina Park",       sub: "Open source · 4.1k" },
  { h: "@theo",           n: "Theo Whitlock",   sub: "Founder · 18k" },
  { h: "@noor.design",    n: "Noor Hassan",     sub: "Brand designer · 9k" },
];

Object.assign(screens, {
  socialFypFeed: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex-1 flex gap-2">
          <div className="flex-1 rounded-xl bg-gradient-to-b from-foreground/20 to-foreground/50 relative overflow-hidden">
            <div className="absolute top-2 left-2 right-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-background/80 shrink-0" />
              <div className="text-[10px] font-medium text-background truncate">@maya.makes</div>
              <span className="ml-auto text-[9px] font-mono text-background/80 px-1.5 py-0.5 rounded-full bg-background/20">Follow</span>
            </div>
            <div className="absolute bottom-3 left-3 right-12">
              <div className="text-[11px] font-medium text-background leading-snug line-clamp-2">three minutes that change how you think about color theory</div>
              <div className="text-[10px] text-background/80 mt-0.5 truncate">♪ original sound — maya.makes</div>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-center justify-end pb-3">
            {[["♥", "24.1k"], ["💬", "812"], ["↗", "Share"], ["⋯", ""]].map(([i, n], idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-foreground/15 grid place-items-center text-sm">{i}</div>
                {n && <div className="text-[9px] font-mono text-foreground/70 mt-0.5 max-w-[44px] truncate">{n}</div>}
              </div>
            ))}
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "40%", y: "50%", label: "Full-bleed video" },
      { n: 2, x: "85%", y: "40%", label: "Side actions" },
      { n: 3, x: "40%", y: "85%", label: "Caption + sound" },
    ],
  })) as Builder,

  socialInterestGraph: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="font-display text-[15px] leading-tight">What are you into?</div>
        <div className="text-[10px] text-foreground/60 -mt-1">Pick 3+ — we'll tune your For You</div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-foreground/55">
          <div className="flex-1 h-1 rounded-full bg-foreground/15 overflow-hidden"><div className="h-full w-[60%] bg-primary" /></div>
          <span>5 / 3</span>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1 content-start">
          {[
            { l: "Design",       e: "🎨", on: true  },
            { l: "Comedy",       e: "😂", on: false },
            { l: "Cooking",      e: "🍳", on: true  },
            { l: "DIY",          e: "🛠", on: false },
            { l: "Coding",       e: "💻", on: true  },
            { l: "Dance",        e: "💃", on: false },
            { l: "Gaming",       e: "🎮", on: false },
            { l: "Books",        e: "📚", on: true  },
            { l: "Travel",       e: "✈️", on: false },
            { l: "Fitness",      e: "🏋", on: false },
            { l: "Music",        e: "🎧", on: true  },
            { l: "Pets",         e: "🐶", on: false },
            { l: "Fashion",      e: "👗", on: false },
            { l: "Photography",  e: "📷", on: false },
            { l: "ASMR",         e: "🔊", on: false },
            { l: "Storytime",    e: "🎙",  on: false },
          ].map((t, i) => (
            <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] truncate ${t.on ? "bg-primary text-primary-foreground" : "bg-foreground/[0.06] text-foreground/75 border border-border/60"}`}>
              <span className="text-[11px] leading-none">{t.e}</span>{t.l}
              {t.on && <span className="text-[9px] opacity-80">✓</span>}
            </span>
          ))}
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">Because you picked Design</div>
        <div className="flex gap-1.5 overflow-hidden">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-14 shrink-0">
              <Photo seed={i} className="w-full h-16 rounded-md relative">
                <span className="absolute bottom-1 left-1 text-[8px] font-mono text-background bg-background/20 px-1 rounded">▶ {(i+1)*42}k</span>
              </Photo>
              <div className="text-[8px] truncate mt-0.5">#typography</div>
            </div>
          ))}
        </div>
        <CTA>Build my feed</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Pick interests" },
      { n: 2, x: "30%", y: "45%", label: "Selected node" },
      { n: 3, x: "50%", y: "80%", label: "Live preview" },
    ],
  })) as Builder,

  socialFollowSuggest: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="font-display text-[16px] leading-tight">Suggested for you</div>
        <div className="text-[10px] text-foreground/55 -mt-1">Based on accounts you follow</div>
        <div className="space-y-2 flex-1">
          {SAMPLE_USERS.slice(0, 5).map((u, i) => (
            <div key={i} className="flex items-center gap-2">
              <Photo seed={i} className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{u.h}</div>
                <div className="text-[9px] text-foreground/55 truncate">{u.sub}</div>
              </div>
              <button className={`text-[10px] font-medium px-3 py-1 rounded-md shrink-0 ${i === 1 ? "border border-border text-foreground/70" : "bg-primary text-primary-foreground"}`}>
                {i === 1 ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-foreground/55 text-center">See all suggestions</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "16%", label: "Suggestion list" },
      { n: 2, x: "82%", y: "40%", label: "Follow CTA" },
      { n: 3, x: "82%", y: "55%", label: "Following state" },
    ],
  })) as Builder,

  socialBuildProfile: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="font-display text-[15px] leading-tight">Build your profile</div>
        <div className="flex items-center gap-1">
          {[0,1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 1 ? "bg-primary" : "bg-foreground/15"}`} />)}
        </div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">Step 2 of 4 · Headline</div>
        <div className="flex items-center gap-2 p-2 rounded-lg border border-border/60">
          <Photo seed={2} className="w-12 h-12 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium truncate">Jordan Reyes</div>
            <div className="text-[9px] text-foreground/55 truncate">Add a photo · greater reach</div>
          </div>
          <span className="text-[10px] font-mono text-primary shrink-0">Upload</span>
        </div>
        <div className="space-y-1.5 flex-1">
          {[
            { l: "Headline", v: "Product designer building tools for teams", req: true },
            { l: "Current position", v: "Senior Designer · Linework", req: true },
            { l: "Industry", v: "Software · Design", req: false },
            { l: "Location", v: "Lisbon, Portugal", req: false },
          ].map((f, i) => (
            <div key={i} className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">{f.l}</span>
                {f.req && <span className="text-[8px] font-mono text-primary">REQUIRED</span>}
              </div>
              <div className="h-8 rounded-md border border-border bg-background/40 flex items-center px-2 text-[10px] truncate">{f.v}</div>
            </div>
          ))}
        </div>
        <CTA>Save and continue</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Profile stepper" },
      { n: 2, x: "30%", y: "30%", label: "Photo upload" },
      { n: 3, x: "50%", y: "65%", label: "Structured fields" },
    ],
  })) as Builder,

  socialPickCommunities: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="font-display text-[15px] leading-tight">Find your communities</div>
        <div className="text-[10px] text-foreground/55 -mt-1">Pick at least 3 to personalize your feed</div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[
            { n: "r/webdev", m: "1.4M members", j: true,  c: "bg-primary/20 text-primary" },
            { n: "r/design", m: "2.1M members", j: true,  c: "bg-amber-500/20 text-amber-500" },
            { n: "r/productivity", m: "1.0M",   j: false, c: "bg-emerald-500/20 text-emerald-500" },
            { n: "r/uxdesign", m: "640k",       j: true,  c: "bg-sky-500/20 text-sky-500" },
            { n: "r/typography", m: "212k",     j: false, c: "bg-rose-500/20 text-rose-500" },
            { n: "r/SaaS", m: "180k",           j: false, c: "bg-indigo-500/20 text-indigo-500" },
          ].map((cm, i) => (
            <div key={i} className={`p-2 rounded-lg border ${cm.j ? "border-primary/50 bg-primary/5" : "border-border/60"}`}>
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full grid place-items-center text-[10px] font-mono shrink-0 ${cm.c}`}>{cm.n[2]?.toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium truncate">{cm.n}</div>
                  <div className="text-[8px] font-mono text-foreground/55 truncate">{cm.m}</div>
                </div>
              </div>
              <button className={`mt-1.5 w-full text-[9px] font-medium py-1 rounded ${cm.j ? "bg-primary text-primary-foreground" : "border border-border text-foreground/70"}`}>
                {cm.j ? "✓ Joined" : "Join"}
              </button>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono text-foreground/55 text-center">3 of 3 selected</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Community picker" },
      { n: 2, x: "30%", y: "45%", label: "Joined card" },
      { n: 3, x: "70%", y: "45%", label: "Join CTA" },
    ],
  })) as Builder,

  socialGridStories: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex gap-2 overflow-hidden -mt-1">
          {[
            { n: "Your story", new: false, you: true },
            { n: "maya", new: true },
            { n: "dev", new: true },
            { n: "studio", new: false },
            { n: "lina", new: true },
            { n: "theo", new: false },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 shrink-0">
              <div className={`w-12 h-12 rounded-full p-[2px] ${s.new ? "bg-gradient-to-tr from-primary via-rose-500 to-amber-500" : "bg-foreground/15"}`}>
                <div className="w-full h-full rounded-full bg-card grid place-items-center text-[10px] relative">
                  <Photo seed={i} className="w-full h-full rounded-full" />
                  {s.you && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground grid place-items-center text-[9px] border-2 border-card">+</span>}
                </div>
              </div>
              <div className="text-[8px] truncate max-w-[48px]">{s.n}</div>
            </div>
          ))}
        </div>
        <div className="h-px bg-border/60 my-0.5" />
        <div className="grid grid-cols-3 gap-0.5 flex-1">
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <Photo key={i} seed={i} className="aspect-square relative">
              {i === 2 && <span className="absolute top-1 right-1 text-[9px] text-background">▣</span>}
              {i === 5 && <span className="absolute top-1 right-1 text-[9px] text-background">▶</span>}
            </Photo>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "12%", label: "Stories rail" },
      { n: 2, x: "10%", y: "12%", label: "Your story +" },
      { n: 3, x: "50%", y: "60%", label: "Permanent grid" },
    ],
  })) as Builder,

  socialFyToggle: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="grid grid-cols-3 border-b border-border/60 -mt-1">
          {["For you", "Following", "Latest"].map((t, i) => (
            <div key={i} className={`text-center text-[11px] font-medium py-1.5 ${i === 0 ? "text-foreground border-b-2 border-primary" : "text-foreground/55"}`}>{t}</div>
          ))}
        </div>
        <div className="space-y-2 flex-1 overflow-hidden">
          {[
            { u: "Maya Chen", h: "@maya.makes", t: "rebuilt my whole portfolio in a weekend. 12 components, zero plugins. ask me anything.", k: "12m" },
            { u: "Dev Patel", h: "@devpatel",   t: "hot take: tabs vs spaces is decided. the editor wins.", k: "1h" },
            { u: "Theo W.",  h: "@theo",        t: "building in public month 8: $4.2k MRR, 312 paying customers, one very tired founder.", k: "3h" },
          ].map((p, i) => (
            <div key={i} className="flex gap-2 pb-2 border-b border-border/40">
              <Photo seed={i} className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="font-medium truncate">{p.u}</span>
                  <span className="text-foreground/55 truncate">{p.h} · {p.k}</span>
                </div>
                <div className="text-[10px] leading-snug line-clamp-2">{p.t}</div>
                <div className="flex gap-4 mt-1 text-[9px] font-mono text-foreground/55">
                  <span>💬 24</span><span>↻ 8</span><span>♥ 312</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "10%", label: "For you tab" },
      { n: 2, x: "78%", y: "10%", label: "Latest tab" },
      { n: 3, x: "50%", y: "55%", label: "Mixed feed" },
    ],
  })) as Builder,

  socialRankedThreads: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="font-display text-[14px] leading-tight">r/popular</div>
        <div className="flex gap-1 -mt-1 text-[10px] font-mono text-foreground/55">
          <span className="text-primary">▲ Hot</span><span>New</span><span>Top</span><span>Rising</span>
        </div>
        <div className="flex-1 space-y-1">
          {[
            { rank: 1, up: "24.8k", c: "1.2k", t: "What's a small UI detail that immediately tells you the product was made with care?", sub: "r/design" },
            { rank: 2, up: "18.2k", c: "640",  t: "After 3 years remote, I finally figured out how to keep deep work going past lunch", sub: "r/productivity" },
            { rank: 3, up: "9.1k",  c: "412",  t: "Show me one keyboard shortcut you can't live without", sub: "r/webdev" },
            { rank: 4, up: "4.4k",  c: "212",  t: "Hot take: most dashboards would be better as a single sentence", sub: "r/SaaS" },
          ].map((th, i) => (
            <div key={i} className="flex gap-1.5 p-1.5 rounded border border-border/50">
              <div className="flex flex-col items-center w-6 shrink-0">
                <span className="text-[9px] text-primary">▲</span>
                <span className="text-[9px] font-mono font-medium">{th.up}</span>
                <span className="text-[9px] text-foreground/45">▼</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-mono text-foreground/55 truncate">#{th.rank} · {th.sub} · 6h</div>
                <div className="text-[10px] leading-tight line-clamp-2">{th.t}</div>
                <div className="text-[9px] font-mono text-foreground/55 mt-0.5">💬 {th.c} comments</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "12%", y: "30%", label: "Vote arrows" },
      { n: 2, x: "20%", y: "40%", label: "Rank position" },
      { n: 3, x: "60%", y: "55%", label: "Title + community" },
    ],
  })) as Builder,

  socialCameraFilters: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex-1 rounded-xl bg-gradient-to-br from-rose-500/30 via-amber-500/20 to-primary/30 border border-border/60 relative overflow-hidden">
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-background/90 text-[10px] font-mono">
            <span>✕</span><span>1:1 · 4:5 · 9:16</span><span>⟲</span>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-14 h-14 rounded-full border-4 border-background/80 grid place-items-center text-background/80 text-xl">◉</div>
          </div>
        </div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">Filters</div>
        <div className="flex gap-1.5 overflow-hidden">
          {["Normal","Clarendon","Juno","Lark","Reyes","Slumber"].map((f, i) => (
            <div key={i} className="flex flex-col items-center shrink-0">
              <Photo seed={i} className={`w-10 h-10 rounded-md ${i === 1 ? "ring-2 ring-primary" : ""}`} />
              <div className={`text-[8px] font-mono mt-0.5 truncate max-w-[44px] ${i === 1 ? "text-primary" : "text-foreground/55"}`}>{f}</div>
            </div>
          ))}
        </div>
        <CTA>Create</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Viewfinder" },
      { n: 2, x: "50%", y: "75%", label: "Filter strip" },
      { n: 3, x: "50%", y: "92%", label: "Create" },
    ],
  })) as Builder,

  socialEffectsSounds: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex-1 rounded-xl bg-gradient-to-b from-foreground/30 to-foreground/60 relative overflow-hidden">
          <div className="absolute top-2 left-2 right-2 flex justify-between text-background/90 text-[10px] font-mono">
            <span>✕</span><span>60s</span><span>Flip</span>
          </div>
          <div className="absolute right-2 top-12 flex flex-col gap-2 items-center text-background/90 text-[10px]">
            {["✨","⚡","🎭","⏱","🖼"].map((i, k) => (
              <div key={k} className="w-8 h-8 rounded-full bg-background/15 grid place-items-center text-[12px]">{i}</div>
            ))}
          </div>
          <div className="absolute bottom-14 left-2 right-12 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/20 backdrop-blur">
            <span className="text-[12px]">♪</span>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-mono text-background truncate">trending sound · maya.makes</div>
              <div className="h-1 bg-background/30 rounded-full mt-0.5 overflow-hidden"><div className="h-full w-1/3 bg-background/80" /></div>
            </div>
            <span className="text-[9px] font-mono text-background/90 shrink-0">2.4M</span>
          </div>
          <div className="absolute bottom-2 inset-x-0 grid place-items-center">
            <div className="w-14 h-14 rounded-full bg-rose-500 border-4 border-background/80" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-foreground/65 text-center">
          <div>Effects</div><div className="text-primary">Sounds</div><div>Speed</div><div>Timer</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "35%", label: "Effects rail" },
      { n: 2, x: "40%", y: "70%", label: "Trending sound" },
      { n: 3, x: "50%", y: "85%", label: "Record" },
    ],
  })) as Builder,

  socialQuickPost: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex items-center justify-between -mt-1">
          <span className="text-[11px] text-foreground/65">Cancel</span>
          <span className="text-[11px] font-medium">Drafts</span>
        </div>
        <div className="flex gap-2 flex-1">
          <Photo seed={2} className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="text-[12px] leading-snug text-foreground/90">What's happening?</div>
            <div className="text-[10px] text-primary mt-1">@</div>
            <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-1.5">
              <div className="flex gap-3 text-[12px] text-primary">📷 📊 🗓 📍</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-foreground/55">218</span>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
              </div>
            </div>
          </div>
        </div>
        <button className="self-end text-[11px] font-medium px-3 py-1 rounded-full bg-primary text-primary-foreground">Post</button>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Plain text composer" },
      { n: 2, x: "85%", y: "75%", label: "Char counter" },
      { n: 3, x: "85%", y: "92%", label: "Post" },
    ],
  })) as Builder,

  socialMarkdown: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="text-[10px] font-mono text-foreground/55">r/webdev · Post</div>
        <input className="w-full bg-background/40 border border-border rounded-md px-2 py-1.5 text-[12px] font-medium" defaultValue="What's your one-week productivity hack?" readOnly />
        <div className="flex gap-1 text-[10px] font-mono text-foreground/65 bg-foreground/[0.04] rounded-md px-1.5 py-1 overflow-hidden">
          <span className="font-bold">B</span><span className="italic">I</span><span className="underline">U</span>
          <span>H1</span><span>H2</span><span>“ ”</span><span>{"</>"}</span><span>•—</span><span>🔗</span>
        </div>
        <div className="flex-1 rounded-md border border-border/60 bg-background/40 p-2 text-[10px] leading-snug font-mono space-y-1 overflow-hidden">
          <div className="text-[11px] font-bold font-sans">## What worked for me</div>
          <div>I started **batching** all meetings into Tue/Thu so</div>
          <div>Mon/Wed/Fri stay open for deep work.</div>
          <div className="pl-2 text-foreground/65">- 25-min Pomodoro</div>
          <div className="pl-2 text-foreground/65">- One tab rule</div>
          <div className="pl-2 text-foreground/65">- `git commit` every hour</div>
          <div className="text-foreground/55">&gt; "shipping beats polishing"</div>
          <div className="text-primary underline">[full writeup](my.blog/wk)</div>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-foreground/55">
          <span>Markdown · Preview</span><span className="text-primary">Post</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "26%", label: "Markdown toolbar" },
      { n: 2, x: "50%", y: "55%", label: "Structured body" },
      { n: 3, x: "80%", y: "92%", label: "Submit" },
    ],
  })) as Builder,

  socialReplyQuote: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex gap-2 pb-2 border-b border-border/60">
          <Photo seed={2} className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px]">
              <span className="font-medium truncate">Maya Chen</span>
              <span className="text-primary">✔</span>
              <span className="text-foreground/55 truncate">@maya.makes</span>
            </div>
            <div className="text-[11px] leading-snug mt-0.5">unpopular opinion: 80% of dashboards would be a better email.</div>
            <div className="text-[9px] font-mono text-foreground/55 mt-1">2:14 PM · Jun 17, 2026</div>
          </div>
        </div>
        <div className="flex justify-around text-[12px] text-foreground/65 py-1 border-b border-border/60">
          <div className="flex items-center gap-1"><span>💬</span><span className="text-[9px] font-mono">124</span></div>
          <div className="flex items-center gap-1 text-emerald-500"><span>↻</span><span className="text-[9px] font-mono">412</span></div>
          <div className="flex items-center gap-1 text-rose-500"><span>♥</span><span className="text-[9px] font-mono">2.4k</span></div>
          <div className="flex items-center gap-1"><span>📊</span><span className="text-[9px] font-mono">84k</span></div>
          <div className="flex items-center gap-1"><span>↗</span></div>
        </div>
        <div className="space-y-1.5 flex-1 overflow-hidden">
          {[
            { u: "Dev Patel",   h: "@devpatel",  t: "true and the email could be one line",            v: "reply" },
            { u: "Theo W.",     h: "@theo",      t: "quoting this for my next standup",                v: "quote" },
            { u: "Lina Park",   h: "@lina.codes",t: "reposted",                                        v: "repost" },
          ].map((r, i) => (
            <div key={i} className="flex gap-2">
              <Photo seed={i} className="w-7 h-7 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[9px]">
                  <span className="font-medium truncate">{r.u}</span>
                  <span className="text-foreground/55 truncate">{r.h}</span>
                  {r.v === "repost" && <span className="text-emerald-500 text-[8px] font-mono">↻ reposted</span>}
                  {r.v === "quote"  && <span className="text-foreground/55 text-[8px] font-mono">❝ quoted</span>}
                </div>
                <div className="text-[10px] leading-snug truncate">{r.t}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "40%", label: "Action row" },
      { n: 2, x: "55%", y: "40%", label: "Repost icon" },
      { n: 3, x: "60%", y: "70%", label: "Quote thread" },
    ],
  })) as Builder,

  socialUpvote: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="text-[10px] font-mono text-foreground/55">r/productivity · 6h · u/maya</div>
        <div className="font-display text-[12px] leading-tight">After 3 years remote, here's what actually works</div>
        <div className="flex-1 space-y-1 overflow-hidden">
          {[
            { u: "dev_patel",   v: 412,  t: "the 'one tab rule' changed my brain. felt impossible day 1, automatic by day 4." },
            { u: "theo.w",      v: 218,  t: "+1 on batching meetings. moved every sync to Tue/Thu and shipped 2 features in a week." },
            { u: "lina.codes",  v: 84,   t: "what about deep work after lunch? always crash around 2pm." },
            { u: "noor.h",      v: -12,  t: "this only works if you don't have kids tbh" },
          ].map((c, i) => (
            <div key={i} className="flex gap-1.5 py-1 border-b border-border/40">
              <div className="flex flex-col items-center w-5 shrink-0">
                <span className={`text-[10px] leading-none ${i === 0 ? "text-primary" : "text-foreground/45"}`}>▲</span>
                <span className={`text-[9px] font-mono leading-tight ${c.v < 0 ? "text-rose-500" : i === 0 ? "text-primary" : "text-foreground/65"}`}>{c.v}</span>
                <span className={`text-[10px] leading-none ${c.v < 0 ? "text-rose-500" : "text-foreground/45"}`}>▼</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-mono text-foreground/55 truncate">u/{c.u} · {i + 1}h</div>
                <div className="text-[10px] leading-snug line-clamp-2">{c.t}</div>
                <div className="text-[8px] font-mono text-foreground/55 mt-0.5">Reply · Share · Award</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "8%", y: "40%", label: "Upvote arrow" },
      { n: 2, x: "8%", y: "60%", label: "Score column" },
      { n: 3, x: "60%", y: "60%", label: "Threaded comment" },
    ],
  })) as Builder,

  socialLikesDms: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex items-center justify-between -mt-1">
          <div className="font-display text-[15px]">Activity</div>
          <span className="text-[16px] text-foreground/80">✈</span>
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">Today</div>
        <div className="space-y-1.5">
          {[
            { u: "@devpatel",   a: "liked your photo",                   k: "♥", c: "text-rose-500", new: true,  thumb: true },
            { u: "@maya.makes", a: "started following you",              k: "+", c: "text-primary",  new: true,  btn: "Follow back" },
            { u: "@theo",      a: "and 12 others liked your reel",       k: "♥", c: "text-rose-500", new: false, thumb: true },
          ].map((n, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="relative shrink-0">
                <Photo seed={i} className="w-8 h-8 rounded-full" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background grid place-items-center text-[10px] ${n.c}`}>{n.k}</span>
              </div>
              <div className="flex-1 min-w-0 text-[10px] leading-snug">
                <span className="font-medium">{n.u}</span> <span className="text-foreground/70">{n.a}</span>
              </div>
              {n.thumb && <Photo seed={i + 2} className="w-7 h-7 rounded shrink-0" />}
              {n.btn   && <button className="text-[9px] font-medium px-2 py-0.5 rounded bg-primary text-primary-foreground shrink-0">{n.btn}</button>}
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 mt-1">Messages</div>
        <div className="space-y-1.5 flex-1">
          {[
            { u: "Maya Chen",  m: "sent a reel",            t: "now",  unread: true  },
            { u: "Studio KS",  m: "you: thanks!",           t: "2h",   unread: false },
            { u: "Dev Patel",  m: "react to ♥",             t: "1d",   unread: false },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <Photo seed={i + 1} className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{m.u}</div>
                <div className="text-[9px] text-foreground/55 truncate">{m.m} · {m.t}</div>
              </div>
              {m.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "78%", y: "10%", label: "DM paperplane" },
      { n: 2, x: "30%", y: "30%", label: "Like notif" },
      { n: 3, x: "30%", y: "75%", label: "DM thread row" },
    ],
  })) as Builder,

  socialDuet: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="text-[10px] font-mono text-foreground/55 -mt-1">Duet with @maya.makes</div>
        <div className="flex-1 grid grid-cols-2 gap-1 rounded-xl overflow-hidden border border-border/60">
          <div className="bg-gradient-to-b from-primary/30 to-foreground/40 relative">
            <div className="absolute top-1 left-1 text-[8px] font-mono text-background/90 bg-background/20 px-1 rounded">@maya.makes</div>
            <div className="absolute inset-0 grid place-items-center text-background/80 text-2xl">▶</div>
          </div>
          <div className="bg-gradient-to-b from-rose-500/30 to-foreground/40 relative">
            <div className="absolute top-1 left-1 text-[8px] font-mono text-background/90 bg-background/20 px-1 rounded">You</div>
            <div className="absolute inset-0 grid place-items-center text-background/80 text-xl">◉</div>
          </div>
        </div>
        <div className="flex gap-1.5 text-[9px] font-mono text-foreground/65">
          {[
            { l: "Duet",   on: true  },
            { l: "Stitch", on: false },
            { l: "React",  on: false },
            { l: "Reply",  on: false },
          ].map((m, i) => (
            <div key={i} className={`flex-1 text-center py-1 rounded ${m.on ? "bg-primary text-primary-foreground" : "border border-border/60"}`}>{m.l}</div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-foreground/[0.06] text-[9px]">
          <span>♪</span><span className="flex-1 truncate">use original sound · maya.makes</span><span className="text-primary">▼</span>
        </div>
        <CTA>Record duet</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "40%", label: "Original video" },
      { n: 2, x: "70%", y: "40%", label: "Your side" },
      { n: 3, x: "50%", y: "75%", label: "Mode toggle" },
    ],
  })) as Builder,

  socialResume: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="h-10 rounded-t-lg bg-gradient-to-r from-primary/30 to-foreground/10 -mt-1" />
        <div className="flex items-end gap-2 -mt-6 px-1">
          <Photo seed={2} className="w-14 h-14 rounded-full border-4 border-card shrink-0" />
          <div className="flex-1 min-w-0 pb-1">
            <div className="text-[12px] font-medium truncate">Jordan Reyes</div>
            <div className="text-[9px] text-foreground/55 truncate">She/her · 1st</div>
          </div>
          <button className="text-[9px] font-medium px-2 py-1 rounded-full border border-primary text-primary shrink-0">+ Connect</button>
        </div>
        <div className="text-[10px] leading-snug">Senior Product Designer · ex-Linework, ex-Squarefoot</div>
        <div className="text-[9px] text-foreground/55">Lisbon, Portugal · 4,218 followers · 500+ connections</div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 mt-1">About</div>
        <div className="text-[10px] leading-snug text-foreground/80 line-clamp-2">Design systems and onboarding for collaborative tools. Recently shipped a redesign that lifted activation by 38%.</div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 mt-1">Experience</div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary/20 grid place-items-center text-[10px] font-mono shrink-0">L</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium truncate">Senior Designer · Linework</div>
            <div className="text-[9px] text-foreground/55 truncate">2023 — Present · 2 yr 3 mo</div>
          </div>
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 mt-1">Skills</div>
        <div className="flex gap-1 flex-wrap">
          {["Design systems","Onboarding","Prototyping","Figma","Research"].map((s, i) => (
            <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-border/60 bg-foreground/[0.04] truncate">{s}</span>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Cover + headline" },
      { n: 2, x: "50%", y: "45%", label: "Structured about" },
      { n: 3, x: "50%", y: "80%", label: "Skills row" },
    ],
  })) as Builder,

  socialKarma: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 grid place-items-center text-[20px] shrink-0">🦊</div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium truncate">u/silent_pinetree</div>
            <div className="text-[9px] text-foreground/55 truncate">Redditor for 4 yr · she/they</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Post karma",    v: "12,481" },
            { k: "Comment karma", v: "48,210" },
            { k: "Gold",          v: "14" },
          ].map((m, i) => (
            <div key={i} className="p-2 rounded-lg border border-border/60 text-center">
              <div className="text-[9px] font-mono uppercase text-foreground/55 truncate">{m.k}</div>
              <div className="font-display text-[16px] leading-none mt-0.5 text-primary">{m.v}</div>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">Trophies</div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { i: "🏆", l: "4-year club" },
            { i: "🥇", l: "Gilded × 14" },
            { i: "💬", l: "Top commenter" },
            { i: "🔥", l: "Hot post" },
          ].map((b, i) => (
            <div key={i} className="p-1.5 rounded-lg border border-border/60 text-center">
              <div className="text-[16px] leading-none">{b.i}</div>
              <div className="text-[8px] font-mono mt-0.5 text-foreground/65 truncate">{b.l}</div>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">Recent karma</div>
        <div className="space-y-1 flex-1">
          {[
            { v: "+412", t: "r/design · UI detail thread" },
            { v: "+218", t: "r/productivity · batching reply" },
            { v: "−12",  t: "r/webdev · spicy take",  bad: true },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] py-1 border-b border-border/40">
              <span className={`font-mono text-[10px] w-8 shrink-0 ${r.bad ? "text-rose-500" : "text-primary"}`}>{r.v}</span>
              <span className="flex-1 truncate">{r.t}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Karma totals" },
      { n: 2, x: "50%", y: "55%", label: "Trophy case" },
      { n: 3, x: "30%", y: "80%", label: "Recent gain" },
    ],
  })) as Builder,

  socialVerified: ((_ctx, _p) => ({
    node: (
      <Frame>
        <PhoneBar />
        <div className="h-8 rounded-t-lg bg-gradient-to-r from-sky-500/30 to-foreground/10 -mt-1" />
        <div className="flex items-end justify-between -mt-5 px-1">
          <Photo seed={2} className="w-14 h-14 rounded-full border-4 border-card" />
          <button className="text-[10px] font-medium px-3 py-1 rounded-full bg-foreground text-background">Follow</button>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-medium">Maya Chen</span>
            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-background grid place-items-center text-[8px] shrink-0">✓</span>
          </div>
          <div className="text-[10px] text-foreground/55">@maya.makes</div>
        </div>
        <div className="text-[10px] leading-snug">Designer building tools for teams. Words sometimes useful, vibes always.</div>
        <div className="flex gap-3 text-[9px] font-mono text-foreground/55">
          <span>📍 Lisbon</span><span>🔗 maya.dev</span><span>Joined 2019</span>
        </div>
        <div className="flex gap-3 text-[10px]">
          <span><b>248</b> <span className="text-foreground/55">Following</span></span>
          <span><b>12.4k</b> <span className="text-foreground/55">Followers</span></span>
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 mt-1">Verified mentions</div>
        <div className="space-y-1 flex-1">
          {[
            { u: "Dev Patel",   h: "@devpatel",   v: true,  t: "follow @maya.makes she ships" },
            { u: "Theo W.",     h: "@theo",       v: true,  t: "@maya.makes nailed the brief" },
            { u: "noor h.",     h: "@noor.design",v: false, t: "@maya.makes 👏👏" },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] py-1 border-b border-border/40">
              <div className="flex items-center gap-1 shrink-0">
                <span className="font-medium truncate max-w-[60px]">{m.u}</span>
                {m.v && <span className="w-3 h-3 rounded-full bg-sky-500 text-background grid place-items-center text-[7px]">✓</span>}
                <span className="text-foreground/55 truncate max-w-[60px]">{m.h}</span>
              </div>
              <span className="flex-1 truncate text-foreground/80">{m.t}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "55%", y: "30%", label: "Blue check" },
      { n: 2, x: "85%", y: "20%", label: "Follow" },
      { n: 3, x: "40%", y: "80%", label: "Verified mention" },
    ],
  })) as Builder,
});

const fallback: Builder = (ctx, p) => ({
  node: (
    <Frame>
      <StatusBar title={title(p)} />
      <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
      <div className="text-[11px] text-foreground/60 -mt-1 truncate">{p.metric}</div>
      <div className="space-y-2 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-2 items-center p-2 border border-border/60 rounded-xl">
            <Photo seed={i} className="w-10 h-10 rounded-md shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate">{row(p, i)}</div>
              <div className="text-[9px] text-foreground/55 truncate">{detail(p, i)}</div>
            </div>
          </div>
        ))}
      </div>
      <CTA>{p.cta}</CTA>
    </Frame>
  ),
  pins: [
    { n: 1, x: "50%", y: "14%", label: "Header" },
    { n: 2, x: "50%", y: "50%", label: "Primary content" },
    { n: 3, x: "50%", y: "92%", label: "Action" },
  ],
});

// ============= AI Assistants specialized screens =============
// Neutral, brand-evocative UI. Do not echo p.company / p.pattern / p.metric.
const AIBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Meta AI — inbox with pinned AI
  aiMetaInbox: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center justify-between">
          <div className="font-display text-[15px]">Chats</div>
          <div className="w-6 h-6 rounded-full bg-foreground/10 grid place-items-center text-[10px]">✎</div>
        </div>
        <div className="h-7 rounded-full bg-foreground/8 px-2 grid items-center text-[10px] text-foreground/55">Search</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-primary/10 border border-primary/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[11px] text-primary-foreground">✦</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate flex items-center gap-1">Meta AI <span className="text-[8px] text-foreground/50">📌</span></div>
              <div className="text-[9px] text-foreground/55 truncate">Ask me anything · Tap to chat</div>
            </div>
            <div className="text-[8px] font-mono text-foreground/50">now</div>
          </div>
          {[
            ["Anika", "see you tonight 🙂", "2m"],
            ["Family group", "Mom: sent photos", "12m"],
            ["Jordan", "okay sounds good", "1h"],
            ["Dribbble crew", "shipped the update", "3h"],
            ["Sam", "🎉🎉🎉", "yesterday"],
          ].map(([n, m, t], i) => (
            <div key={i} className="flex items-center gap-2 p-1.5">
              <Photo seed={i} className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{n}</div>
                <div className="text-[9px] text-foreground/55 truncate">{m}</div>
              </div>
              <div className="text-[8px] font-mono text-foreground/45">{t}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "AI pinned in inbox" },
      { n: 2, x: "50%", y: "55%", label: "Friends + family" },
      { n: 3, x: "50%", y: "10%", label: "Native messaging chrome" },
    ],
  })) as Builder,

  // 2. ChatGPT — clean centered prompt
  aiChatGPTHome: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center justify-between">
          <div className="w-6 h-6 rounded-full bg-foreground/10 grid place-items-center text-[10px]">≡</div>
          <div className="text-[11px] font-medium">GPT-5</div>
          <div className="w-6 h-6 rounded-full bg-foreground/10 grid place-items-center text-[10px]">⋯</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full border border-foreground/40 grid place-items-center text-[14px]">✦</div>
          <div className="font-display text-[16px] text-center">Ask anything</div>
          <div className="flex flex-col gap-1.5 w-full mt-1">
            {["Plan a 3-day trip to Lisbon", "Explain recursion simply", "Summarize my notes"].map((t, i) => (
              <div key={i} className="text-[10px] px-2.5 py-1.5 rounded-full border border-border/70 text-foreground/70 text-center truncate">{t}</div>
            ))}
          </div>
        </div>
        <div className="h-9 rounded-full bg-foreground/8 border border-border/60 flex items-center px-3 text-[10px] text-foreground/45">
          <span className="flex-1">Message…</span>
          <span className="text-foreground/60">🎤</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "45%", label: "Single open prompt" },
      { n: 2, x: "50%", y: "70%", label: "Example chips" },
      { n: 3, x: "50%", y: "92%", label: "One destination" },
    ],
  })) as Builder,

  // 3. Gemini — Workspace top bar with spark
  aiGeminiWorkspace: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-1.5 h-7 -mx-1 px-1.5 border-b border-border/60">
          <div className="w-5 h-5 rounded grid place-items-center text-[10px] bg-foreground/10">M</div>
          <div className="text-[10px] font-medium">Inbox</div>
          <div className="ml-auto w-6 h-6 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[10px] text-primary-foreground">✦</div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          {[
            ["Quarterly review draft", "Maya · 9:14", true],
            ["Re: brand guidelines", "Theo · 8:02", false],
            ["Invoice #1042", "Stripe · yesterday", false],
            ["Trip planning", "Anika · Mon", false],
          ].map(([s, m, u], i) => (
            <div key={i} className={`flex items-center gap-2 p-1.5 rounded-md ${u ? "bg-foreground/5" : ""}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${u ? "bg-primary" : "bg-foreground/20"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{s as string}</div>
                <div className="text-[9px] text-foreground/55 truncate">{m as string}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px]">✦</div>
          <div className="text-[10px] flex-1">Help me write a reply</div>
          <span className="text-[9px] font-mono text-foreground/55">Gemini</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "12%", label: "Spark in Workspace" },
      { n: 2, x: "50%", y: "50%", label: "Native Gmail/Docs" },
      { n: 3, x: "50%", y: "92%", label: "Embedded assist" },
    ],
  })) as Builder,

  // 4. Manus — agent run console
  aiManusConsole: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="text-[10px] font-mono text-foreground/55 tracking-wider">AGENT · RUN #042</div>
        <div className="h-9 rounded-lg border border-border/60 px-2 flex items-center gap-2">
          <span className="text-[10px] text-foreground/70 flex-1 truncate">Give it a task…</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-foreground/10">▶ Run</span>
        </div>
        <div className="text-[9px] font-mono text-foreground/45 tracking-wider mt-1">RUN LOG</div>
        <div className="flex-1 rounded-md border border-border/60 bg-foreground/[0.03] p-2 overflow-hidden flex flex-col gap-1 text-[9.5px] font-mono">
          {[
            ["✓", "plan → break task into 4 steps"],
            ["✓", "search → 'top SaaS pricing pages 2026'"],
            ["✓", "fetch → notion.so/pricing"],
            ["●", "extract → tiers, features, CTAs"],
            ["○", "compose → draft comparison table"],
            ["○", "export → deliver report.pdf"],
          ].map(([m, t], i) => (
            <div key={i} className="flex gap-1.5">
              <span className={`${m === "✓" ? "text-primary" : m === "●" ? "text-foreground" : "text-foreground/35"}`}>{m}</span>
              <span className="text-foreground/75 truncate">{t}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Give it a task" },
      { n: 2, x: "50%", y: "55%", label: "Autonomous run log" },
      { n: 3, x: "20%", y: "55%", label: "Step status" },
    ],
  })) as Builder,

  // 5. Claude — nuanced structured reply
  aiClaudeReply: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/80 text-primary-foreground grid place-items-center text-[10px]">✱</div>
          <div className="text-[11px] font-medium">Claude</div>
          <span className="ml-auto text-[9px] font-mono text-foreground/55">Sonnet</span>
        </div>
        <div className="self-end max-w-[80%] rounded-2xl rounded-br-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">
          Help me decide between two job offers — one is more pay, one is more aligned.
        </div>
        <div className="self-start w-full rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 p-2.5 text-[10px] flex flex-col gap-1.5">
          <div className="font-medium text-[10.5px]">How I'd think about it</div>
          <ul className="flex flex-col gap-1">
            {[
              "Map a 3-year horizon — money compounds, but so does alignment.",
              "List concrete daily tasks each role implies, not the titles.",
              "Run a quiet pre-mortem: which choice would you regret?",
            ].map((t, i) => (
              <li key={i} className="flex gap-1.5"><span className="text-foreground/40">•</span><span className="text-foreground/75">{t}</span></li>
            ))}
          </ul>
        </div>
        <div className="h-8 rounded-full bg-foreground/8 border border-border/60 flex items-center px-3 text-[10px] text-foreground/45">Reply to Claude…</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "55%", label: "Heading + bullets" },
      { n: 2, x: "50%", y: "30%", label: "Considered tone" },
      { n: 3, x: "50%", y: "92%", label: "Calm chat surface" },
    ],
  })) as Builder,

  // 6. ChatGPT — versatile friendly + follow-ups
  aiChatGPTFriendly: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-foreground/40 grid place-items-center text-[10px]">✦</div>
          <div className="text-[11px] font-medium">ChatGPT</div>
        </div>
        <div className="self-end max-w-[78%] rounded-2xl rounded-br-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">
          What's a good 20-min dinner with chicken and rice?
        </div>
        <div className="self-start max-w-[88%] rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2.5 py-1.5 text-[10px]">
          Easy — try a one-pan lemon chicken rice. Sear seasoned thighs, toss in rice + broth, lid on 18 min. Finish with parsley and a squeeze of lemon. 🍋
        </div>
        <div className="text-[9px] font-mono text-foreground/45 mt-1">Follow up</div>
        <div className="flex flex-wrap gap-1">
          {["Make it spicy", "Vegetarian version", "Add a side"].map((t, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full border border-border/70 text-foreground/75">{t}</span>
          ))}
        </div>
        <div className="h-8 rounded-full bg-foreground/8 border border-border/60 flex items-center px-3 text-[10px] text-foreground/45 mt-auto">Message ChatGPT…</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "45%", label: "Friendly quick answer" },
      { n: 2, x: "50%", y: "75%", label: "Follow-up suggestions" },
      { n: 3, x: "50%", y: "92%", label: "General purpose" },
    ],
  })) as Builder,

  // 7. Gemini — fast answer + sources
  aiGeminiFast: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[10px] text-primary-foreground">✦</div>
          <div className="text-[11px] font-medium">Gemini</div>
          <span className="ml-auto text-[9px] font-mono text-foreground/55">2.5 Flash</span>
        </div>
        <div className="self-end max-w-[78%] rounded-2xl rounded-br-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">Capital of Portugal?</div>
        <div className="self-start max-w-[88%] rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2.5 py-1.5 text-[10px]">
          <div className="font-medium">Lisbon.</div>
          <div className="text-foreground/70 mt-0.5">Largest city and political capital, on the Tagus estuary.</div>
        </div>
        <div className="text-[9px] font-mono text-foreground/45 mt-1">Related · Sources</div>
        <div className="flex flex-col gap-1">
          {[
            ["wikipedia.org", "Lisbon — Wikipedia"],
            ["britannica.com", "Lisbon | History, Population…"],
            ["visitportugal.com", "Discover Lisbon"],
          ].map(([d, t], i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-md border border-border/60">
              <div className="w-5 h-5 rounded bg-foreground/10 grid place-items-center text-[9px]">🔗</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[9px] text-foreground/55 truncate">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "38%", label: "Snappy short answer" },
      { n: 2, x: "50%", y: "70%", label: "Related + sources" },
      { n: 3, x: "85%", y: "12%", label: "Flash model" },
    ],
  })) as Builder,

  // 8. Meta AI — casual emoji bubbles
  aiMetaCasual: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2 pb-1 border-b border-border/60">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[11px] text-primary-foreground">✦</div>
          <div>
            <div className="text-[11px] font-medium leading-tight">Meta AI</div>
            <div className="text-[9px] text-foreground/55">Active now</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          <div className="self-end max-w-[78%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-2.5 py-1.5 text-[10px]">good movies for tonight? 🎬</div>
          <div className="self-start max-w-[78%] rounded-2xl rounded-bl-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">ooh fun! 😄 vibe check — cozy, thrilling, or laugh-til-you-cry?</div>
          <div className="self-end max-w-[78%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-2.5 py-1.5 text-[10px]">cozy 🛋️🍿</div>
          <div className="self-start max-w-[78%] rounded-2xl rounded-bl-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">say no more 💛 try <b>Paddington 2</b> or <b>About Time</b> — both feel like a warm hug 🫂</div>
          <div className="self-end max-w-[40%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-2.5 py-1.5 text-[10px]">🙌</div>
        </div>
        <div className="h-8 rounded-full bg-foreground/8 border border-border/60 flex items-center px-3 text-[10px] text-foreground/45">
          <span className="flex-1">Aa</span>
          <span>😊</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "55%", label: "Emoji-friendly bubbles" },
      { n: 2, x: "50%", y: "20%", label: "Messenger chrome" },
      { n: 3, x: "50%", y: "92%", label: "Light tone" },
    ],
  })) as Builder,

  // 9. Gemini context — Workspace side panel
  aiGeminiWorkspaceContext: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[10px] text-primary-foreground">✦</div>
          <div className="text-[11px] font-medium">Gemini</div>
          <span className="ml-auto text-[9px] font-mono text-foreground/55">@workspace</span>
        </div>
        <div className="flex-1 flex gap-2 min-h-0">
          <div className="w-[38%] flex flex-col gap-1 border border-border/60 rounded-md p-1.5">
            <div className="text-[9px] font-mono text-foreground/45 tracking-wider">CONNECTED</div>
            {[
              ["📄", "Q3 plan.gdoc"],
              ["📨", "Re: brand · Gmail"],
              ["📊", "Pricing.gsheet"],
              ["📁", "/Marketing · Drive"],
              ["📨", "Anika · Trip"],
            ].map(([i, n], k) => (
              <div key={k} className="flex items-center gap-1.5 text-[9.5px] truncate">
                <span>{i}</span><span className="truncate">{n}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <div className="self-end max-w-full rounded-2xl rounded-br-sm bg-foreground/10 px-2 py-1.5 text-[10px]">Pull next steps from my Q3 plan</div>
            <div className="self-start rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2 py-1.5 text-[10px] flex-1">
              From <b>Q3 plan.gdoc</b> + <b>Re: brand</b>:
              <div className="mt-1 text-foreground/70">• Ship landing v2<br/>• Confirm pricing tiers<br/>• Reply to Anika by Fri</div>
            </div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "55%", label: "Connected Workspace" },
      { n: 2, x: "70%", y: "55%", label: "Grounded answer" },
      { n: 3, x: "85%", y: "12%", label: "@workspace context" },
    ],
  })) as Builder,

  // 10. Claude — Projects with attached docs
  aiClaudeProjects: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/80 text-primary-foreground grid place-items-center text-[10px]">✱</div>
          <div className="text-[11px] font-medium truncate">Project · Onboarding rewrite</div>
        </div>
        <div className="flex-1 flex gap-2 min-h-0">
          <div className="w-[42%] flex flex-col gap-1 border border-border/60 rounded-md p-1.5">
            <div className="text-[9px] font-mono text-foreground/45 tracking-wider">KNOWLEDGE</div>
            {[
              ["PDF", "User research v3", "412 pp"],
              ["DOC", "Brand voice guide", "82 pp"],
              ["MD", "Old onboarding spec", "26 pp"],
              ["CSV", "Funnel data Q1-Q3", "—"],
              ["PDF", "Competitor teardown", "118 pp"],
            ].map(([t, n, p], i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="text-[8px] font-mono px-1 py-0.5 rounded bg-foreground/10">{t}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9.5px] font-medium truncate">{n}</div>
                  <div className="text-[8px] text-foreground/55 truncate">{p}</div>
                </div>
              </div>
            ))}
            <div className="text-[9px] text-primary mt-1">+ Add to project</div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <div className="text-[9px] font-mono text-foreground/45 tracking-wider">CHAT</div>
            <div className="self-start rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2 py-1.5 text-[10px]">
              Using your 5 attached docs, the strongest drop-off is step 3. Three things to try…
            </div>
            <div className="h-7 mt-auto rounded-full bg-foreground/8 border border-border/60 flex items-center px-2 text-[9.5px] text-foreground/45">Ask the project…</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "50%", label: "Knowledge sidebar" },
      { n: 2, x: "72%", y: "50%", label: "Project-aware chat" },
      { n: 3, x: "50%", y: "12%", label: "Long-running project" },
    ],
  })) as Builder,

  // 11. ChatGPT — memory + GPTs
  aiChatGPTMemory: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-foreground/40 grid place-items-center text-[10px]">✦</div>
          <div className="text-[11px] font-medium">Personalization</div>
        </div>
        <div className="rounded-lg border border-border/60 p-2 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-medium">Memory</div>
            <div className="w-7 h-4 rounded-full bg-primary relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-background" /></div>
          </div>
          {[
            "Lives in Berlin, prefers metric units",
            "Building a SaaS for small studios",
            "Vegetarian, mild spice",
            "Reply in concise bullets",
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[9.5px] text-foreground/75">
              <span className="text-foreground/40">•</span><span className="truncate flex-1">{t}</span><span className="text-foreground/40 text-[9px]">×</span>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono text-foreground/45 tracking-wider">MY GPTs</div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            ["📝", "Writer"],
            ["💼", "PM Coach"],
            ["🧮", "Tax"],
            ["🍳", "Chef"],
            ["🇫🇷", "French"],
            ["📚", "Tutor"],
            ["🎨", "Brand"],
            ["+", "New"],
          ].map(([i, n], k) => (
            <div key={k} className="flex flex-col items-center gap-0.5">
              <div className="w-9 h-9 rounded-xl bg-foreground/8 grid place-items-center text-[14px]">{i}</div>
              <div className="text-[8.5px] truncate w-full text-center">{n}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Memory panel" },
      { n: 2, x: "50%", y: "78%", label: "Saved custom GPTs" },
      { n: 3, x: "50%", y: "12%", label: "Personalization" },
    ],
  })) as Builder,

  // 12. Manus — live web fetch log
  aiManusWebFetch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="text-[10px] font-mono text-foreground/55 tracking-wider">LIVE WEB · STREAMING</div>
        <div className="self-end max-w-[80%] rounded-2xl rounded-br-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">Latest news on the Mars sample return mission</div>
        <div className="flex-1 flex flex-col gap-1 rounded-md border border-border/60 bg-foreground/[0.03] p-2 overflow-hidden text-[9px] font-mono">
          {[
            ["GET", "nasa.gov/missions/msr", "200"],
            ["GET", "spacenews.com/2026/jun/16", "200"],
            ["READ", "esa.int/Science/Mars_Return", "200"],
            ["GET", "reuters.com/science/mars-…", "200"],
            ["READ", "arstechnica.com/space/2026/…", "200"],
            ["●", "synthesizing answer from 5 sources", ""],
          ].map(([v, u, s], i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <span className="text-primary w-9 shrink-0">{v}</span>
              <span className="flex-1 text-foreground/75 truncate">{u}</span>
              {s && <span className="text-foreground/45">{s}</span>}
            </div>
          ))}
        </div>
        <div className="self-start max-w-[88%] rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2.5 py-1.5 text-[10px]">
          As of today, NASA confirmed the revised architecture…
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "50%", label: "Live URL fetch log" },
      { n: 2, x: "20%", y: "50%", label: "Real-time reads" },
      { n: 3, x: "50%", y: "85%", label: "Grounded answer" },
    ],
  })) as Builder,

  // 13. ChatGPT — voice + image + camera
  aiChatGPTVoice: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-foreground/40 grid place-items-center text-[10px]">✦</div>
          <div className="text-[11px] font-medium">Voice mode</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-foreground/10 grid place-items-center">
            <div className="absolute inset-2 rounded-full border border-primary/40 animate-pulse" />
            <div className="text-[18px]">🎤</div>
          </div>
        </div>
        <div className="flex items-end justify-center gap-0.5 h-10">
          {[6, 14, 22, 10, 28, 18, 32, 20, 12, 26, 16, 24, 8, 18, 14, 22, 10, 6].map((h, i) => (
            <div key={i} className="w-1 rounded-full bg-primary/70" style={{ height: `${h}px` }} />
          ))}
        </div>
        <div className="text-[10px] text-center text-foreground/60">Listening…</div>
        <div className="h-11 rounded-full bg-foreground/8 border border-border/60 flex items-center px-3 gap-2 text-[10px] text-foreground/45">
          <span className="text-base">🎤</span>
          <span className="text-base">🖼️</span>
          <span className="text-base">📷</span>
          <span className="flex-1 truncate">Message…</span>
          <span className="text-base">⤴</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "92%", label: "Mic · Image · Camera" },
      { n: 2, x: "50%", y: "40%", label: "Live voice mode" },
      { n: 3, x: "50%", y: "70%", label: "Waveform" },
    ],
  })) as Builder,

  // 14. Gemini — native multimodal message
  aiGeminiMultimodal: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[10px] text-primary-foreground">✦</div>
          <div className="text-[11px] font-medium">Gemini</div>
          <span className="ml-auto text-[9px] font-mono text-foreground/55">multimodal</span>
        </div>
        <div className="self-end max-w-[88%] rounded-2xl rounded-br-sm bg-foreground/10 p-1.5 text-[10px] flex flex-col gap-1.5">
          <Photo seed={1} className="aspect-[16/10] rounded-lg" />
          <div className="flex items-center gap-2 px-1.5 py-1 rounded-md bg-background/40 border border-border/60">
            <span className="text-[12px]">▶</span>
            <div className="flex-1 flex items-center gap-0.5 h-3">
              {[4, 8, 6, 10, 5, 12, 7, 9, 6, 11, 4, 8].map((h, i) => (
                <div key={i} className="w-0.5 rounded-full bg-foreground/60" style={{ height: `${h}px` }} />
              ))}
            </div>
            <span className="text-[8.5px] font-mono text-foreground/55">0:14</span>
          </div>
          <div className="px-1">What's in this photo and what am I saying?</div>
        </div>
        <div className="self-start max-w-[88%] rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2.5 py-1.5 text-[10px]">
          A street market in Lisbon at dusk. You're asking which stall sells the custard tarts — the blue awning on the left.
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Image + text + audio" },
      { n: 2, x: "50%", y: "82%", label: "Single combined reply" },
      { n: 3, x: "85%", y: "12%", label: "Native multimodal" },
    ],
  })) as Builder,

  // 15. Meta AI — image gen inline
  aiMetaImageGen: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[10px] text-primary-foreground">✦</div>
          <div className="text-[11px] font-medium">Meta AI</div>
        </div>
        <div className="self-end max-w-[80%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-2.5 py-1.5 text-[10px]">
          /imagine a corgi astronaut on Mars, golden hour 🪐
        </div>
        <div className="self-start w-full rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 p-2 text-[10px] flex flex-col gap-1.5">
          <div className="text-foreground/70">Here you go! ✨</div>
          <Photo seed={2} className="aspect-square rounded-xl relative">
            <div className="absolute bottom-1.5 left-1.5 text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-background/80">Imagined with Meta AI</div>
          </Photo>
          <div className="flex gap-1.5">
            <div className="flex-1 text-center text-[9.5px] px-1.5 py-1 rounded-full border border-border/70">Regenerate</div>
            <div className="flex-1 text-center text-[9.5px] px-1.5 py-1 rounded-full border border-border/70">Save</div>
            <div className="flex-1 text-center text-[9.5px] px-1.5 py-1 rounded-full bg-primary text-primary-foreground">Send</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "55%", label: "Generated image inline" },
      { n: 2, x: "50%", y: "20%", label: "Same chat thread" },
      { n: 3, x: "50%", y: "92%", label: "Share to friends" },
    ],
  })) as Builder,

  // 16. Claude — doc + image read
  aiClaudeDocRead: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/80 text-primary-foreground grid place-items-center text-[10px]">✱</div>
          <div className="text-[11px] font-medium">Claude</div>
        </div>
        <div className="self-end max-w-[88%] rounded-2xl rounded-br-sm bg-foreground/10 px-2 py-1.5 text-[10px] flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-background/40 border border-border/60">
            <div className="text-[10px] font-mono px-1 py-0.5 rounded bg-red-500/15 text-red-600">PDF</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium truncate">lease-agreement-2026.pdf</div>
              <div className="text-[8.5px] text-foreground/55">42 pages · 1.8 MB</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-background/40 border border-border/60">
            <Photo seed={3} className="w-8 h-8 rounded-md shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium truncate">scan-page-7.jpg</div>
              <div className="text-[8.5px] text-foreground/55">2.1 MB</div>
            </div>
          </div>
          <div className="px-1">Summarize and flag anything risky.</div>
        </div>
        <div className="self-start w-full rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 p-2 text-[10px] flex flex-col gap-1">
          <div className="font-medium">Read both files. Key points:</div>
          <div className="text-foreground/75">• 12-month term, auto-renews unless 60-day notice.</div>
          <div className="text-foreground/75">• <span className="bg-amber-400/30 px-1 rounded">Clause 9.3</span> shifts repair costs to tenant.</div>
          <div className="text-foreground/75">• Scan p.7 shows landlord signature missing.</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "32%", label: "PDF + image attached" },
      { n: 2, x: "50%", y: "78%", label: "Reads both, summarizes" },
      { n: 3, x: "60%", y: "85%", label: "Flags risk inline" },
    ],
  })) as Builder,

  // 17. Claude — Artifacts split view
  aiClaudeArtifacts: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/80 text-primary-foreground grid place-items-center text-[10px]">✱</div>
          <div className="text-[11px] font-medium">Claude</div>
          <span className="ml-auto text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-foreground/10">Artifact · Live</span>
        </div>
        <div className="flex-1 flex gap-1.5 min-h-0">
          <div className="w-[44%] flex flex-col gap-1 min-w-0">
            <div className="self-end max-w-full rounded-xl rounded-br-sm bg-foreground/10 px-2 py-1 text-[9.5px]">Build a tip calculator</div>
            <div className="self-start rounded-xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2 py-1 text-[9.5px]">Here's a working version — try it →</div>
            <div className="self-end max-w-full rounded-xl rounded-br-sm bg-foreground/10 px-2 py-1 text-[9.5px]">Make it 18% default</div>
            <div className="self-start rounded-xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2 py-1 text-[9.5px]">Updated ✓</div>
          </div>
          <div className="flex-1 rounded-lg border border-border/60 bg-background flex flex-col overflow-hidden min-w-0">
            <div className="px-1.5 py-1 text-[8.5px] font-mono text-foreground/55 border-b border-border/60 flex items-center gap-1">
              <span>● ● ●</span><span className="ml-1 truncate">tip-calc</span>
            </div>
            <div className="flex-1 p-2 flex flex-col gap-1.5 text-[9px]">
              <div className="font-medium text-[10px]">Tip Calculator</div>
              <div className="rounded-md border border-border/60 px-1.5 py-1">Bill <span className="font-mono float-right">$42.00</span></div>
              <div className="flex gap-1">
                {["15%", "18%", "20%"].map((t, i) => (
                  <div key={i} className={`flex-1 text-center px-1 py-0.5 rounded ${i === 1 ? "bg-primary text-primary-foreground" : "border border-border/60"}`}>{t}</div>
                ))}
              </div>
              <div className="rounded-md bg-foreground/[0.04] px-1.5 py-1 mt-auto">Total <span className="font-mono float-right font-medium">$49.56</span></div>
            </div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "55%", label: "Chat on the left" },
      { n: 2, x: "72%", y: "55%", label: "Live artifact right" },
      { n: 3, x: "85%", y: "12%", label: "Updates in place" },
    ],
  })) as Builder,

  // 18. ChatGPT — Canvas with Export
  aiChatGPTCanvas: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-foreground/40 grid place-items-center text-[10px]">✦</div>
          <div className="text-[11px] font-medium truncate">Canvas · Launch memo</div>
          <div className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary text-primary-foreground">Export ↓</div>
        </div>
        <div className="flex-1 rounded-lg border border-border/60 bg-background p-2 flex flex-col gap-1 overflow-hidden">
          <div className="text-[11px] font-medium">Studio launch — June 2026</div>
          <div className="text-[8.5px] font-mono text-foreground/45">Draft · co-edited with ChatGPT</div>
          <div className="text-[10px] font-medium mt-1">Summary</div>
          <div className="text-[9.5px] text-foreground/75 leading-snug">A focused launch around three studios in Lisbon. We lead with the brand film and a private preview night.</div>
          <div className="text-[10px] font-medium mt-1">Goals</div>
          <ul className="text-[9.5px] text-foreground/75 leading-snug">
            <li>• 50 signups from preview night</li>
            <li>• <span className="bg-primary/15">3 press mentions</span> in design weeklies</li>
            <li>• Waitlist of 500 by July 15</li>
          </ul>
          <div className="mt-auto flex items-center gap-1.5 rounded-md bg-foreground/[0.04] px-1.5 py-1 text-[9px] text-foreground/60">
            <span>✦</span><span className="truncate">ChatGPT suggested: tighten the third goal</span>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "50%", label: "Editable canvas" },
      { n: 2, x: "85%", y: "12%", label: "Export button" },
      { n: 3, x: "50%", y: "88%", label: "AI co-edit suggestion" },
    ],
  })) as Builder,

  // 19. Manus — completed deliverables
  aiManusDeliverables: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="text-[10px] font-mono text-foreground/55 tracking-wider">RUN #042 · COMPLETE</div>
        <div className="font-display text-[15px] truncate">Deliverables</div>
        <div className="text-[9.5px] text-foreground/60 -mt-1">Competitor pricing teardown · 6 files ready</div>
        <div className="flex flex-col gap-1.5 flex-1">
          {[
            ["PDF", "report.pdf", "12 pp · 2.1 MB"],
            ["PPTX", "deck.pptx", "18 slides · 8.6 MB"],
            ["XLSX", "pricing-matrix.xlsx", "4 sheets · 240 KB"],
            ["CSV", "raw-data.csv", "1,204 rows"],
            ["MD", "executive-summary.md", "3 min read"],
            ["ZIP", "screenshots.zip", "32 images"],
          ].map(([t, n, s], i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-md border border-border/60">
              <div className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-foreground/10">{t}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
              <div className="text-[9px] font-mono text-primary">↓</div>
            </div>
          ))}
        </div>
        <div className="h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[11px] font-medium">Download all</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "55%", label: "Finished files" },
      { n: 2, x: "85%", y: "55%", label: "Download each" },
      { n: 3, x: "50%", y: "94%", label: "Done-for-you" },
    ],
  })) as Builder,

  // 20. Gemini — Export to Docs
  aiGeminiExportDocs: ((_ctx, _p) => ({
    node: (
      <Frame>
        <AIBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-foreground/40 grid place-items-center text-[10px] text-primary-foreground">✦</div>
          <div className="text-[11px] font-medium">Gemini</div>
        </div>
        <div className="self-start w-full rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2.5 py-1.5 text-[10px]">
          <div className="font-medium">Q3 marketing brief</div>
          <div className="text-foreground/75 mt-0.5 leading-snug">Three priorities, owners, and a 6-week timeline. Drafted from your notes.</div>
        </div>
        <div className="flex gap-1.5">
          <div className="flex items-center gap-1.5 text-[9.5px] px-2 py-1 rounded-full bg-primary text-primary-foreground">
            <span>📄</span><span>Send to Google Docs</span>
          </div>
          <div className="flex items-center gap-1 text-[9.5px] px-2 py-1 rounded-full border border-border/70">Copy</div>
        </div>
        <div className="text-[9px] font-mono text-foreground/45 tracking-wider mt-1">DOCS PREVIEW</div>
        <div className="flex-1 rounded-lg border border-border/60 bg-background p-2 flex flex-col gap-1 overflow-hidden">
          <div className="flex items-center gap-1.5 -mt-0.5">
            <div className="w-4 h-4 rounded bg-blue-500/80 grid place-items-center text-[9px] text-white">D</div>
            <div className="text-[9.5px] truncate">Q3 marketing brief — Google Docs</div>
          </div>
          <div className="h-px bg-border/60" />
          <div className="text-[11px] font-medium">Q3 marketing brief</div>
          <div className="text-[8.5px] text-foreground/55">Maya Chen · just now</div>
          <div className="text-[9.5px] text-foreground/75 leading-snug mt-1">Priorities: brand film, preview night, press push…</div>
          <div className="mt-auto text-[8.5px] text-foreground/45">Saved to Drive ✓</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Send to Google Docs" },
      { n: 2, x: "50%", y: "75%", label: "Docs preview" },
      { n: 3, x: "50%", y: "94%", label: "Saved to Drive" },
    ],
  })) as Builder,
});

// ============================================================
// FOOD DELIVERY — 20 brand-evocative screens
// Neutral copy. Do not echo p.company / p.pattern / p.metric.
// ============================================================
const FoodBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Uber Eats — Imagery carousels
  foodImageryCarousels: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-foreground/60">📍 Mission St</div>
          <div className="w-6 h-6 rounded-full bg-foreground/10 grid place-items-center text-[10px]">👤</div>
        </div>
        <div className="text-[11px] font-medium">Near you</div>
        <div className="flex gap-1.5 overflow-hidden">
          {[0,1,2].map(i => (
            <Photo key={i} seed={i} className="w-[58%] h-16 rounded-lg shrink-0 flex items-end p-1.5">
              <span className="text-[9px] text-foreground/80 bg-background/70 px-1 rounded">Sushi · 4.8</span>
            </Photo>
          ))}
        </div>
        <div className="text-[11px] font-medium">Trending</div>
        <div className="flex gap-1.5 overflow-hidden">
          {[2,0,1].map(i => (
            <Photo key={i} seed={i+1} className="w-[58%] h-16 rounded-lg shrink-0 flex items-end p-1.5">
              <span className="text-[9px] text-foreground/80 bg-background/70 px-1 rounded">Tacos · 4.7</span>
            </Photo>
          ))}
        </div>
        <div className="text-[11px] font-medium">Late night</div>
        <div className="flex gap-1.5 overflow-hidden">
          {[1,2,0].map(i => (
            <Photo key={i} seed={i} className="w-[58%] h-14 rounded-lg shrink-0" />
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Cuisine carousels" },
      { n: 2, x: "50%", y: "55%", label: "Appetizing imagery" },
      { n: 3, x: "50%", y: "85%", label: "Themed rails" },
    ],
  })) as Builder,

  // 2. DoorDash — Popular near you (ranked)
  foodPopularNear: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Popular near you</div>
        <div className="flex gap-1.5 text-[9px]">
          <Chip accent>All</Chip><Chip>Fastest</Chip><Chip>Top rated</Chip>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["1","Pho 88","4.9","20–30 min","$0 fee"],
            ["2","Margherita Pizza","4.8","25–35 min","$1.99"],
            ["3","Pad Thai House","4.8","15–25 min","$0 fee"],
            ["4","Falafel Wrap","4.7","20–30 min","$2.49"],
            ["5","Ramen Ya","4.7","30–40 min","$1.99"],
          ].map(([r,n,rt,t,f],i)=>(
            <div key={i} className="flex items-center gap-2">
              <div className="text-[10px] font-mono text-foreground/50 w-3">{r}</div>
              <Photo seed={i} className="w-9 h-9 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">★ {rt} · {t} · {f}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "10%", y: "30%", label: "Ranked list" },
      { n: 2, x: "70%", y: "50%", label: "Rating + ETA" },
      { n: 3, x: "85%", y: "70%", label: "Delivery fee" },
    ],
  })) as Builder,

  // 3. Grubhub — Local breadth list (many)
  foodBreadthList: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="h-7 rounded-md bg-foreground/8 px-2 grid items-center text-[10px] text-foreground/55">Search 320+ restaurants</div>
        <div className="flex gap-1 overflow-hidden text-[8.5px]">
          {["Pizza","Sushi","Thai","Indian","Vegan","Burgers","Mex"].map((c,i)=>(
            <Chip key={i}>{c}</Chip>
          ))}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          {[
            ["Joe's Pizza","Italian · Pizza","$","25m"],
            ["Sushi Nori","Japanese · Sushi","$$","30m"],
            ["Pad See Ew","Thai · Noodles","$","20m"],
            ["Curry House","Indian · Curry","$$","35m"],
            ["Green Bowl","Vegan · Salads","$","15m"],
            ["Burger Bros","American","$","25m"],
            ["Taco Loco","Mexican · Tacos","$","20m"],
            ["Falafel Wrap","Med · Wraps","$","30m"],
          ].map(([n,c,p,t],i)=>(
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/40">
              <div className="min-w-0">
                <div className="text-[10px] truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{c}</div>
              </div>
              <div className="text-[8.5px] font-mono text-foreground/60">{p} · {t}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Search 320+" },
      { n: 2, x: "50%", y: "25%", label: "Many cuisines" },
      { n: 3, x: "50%", y: "65%", label: "Long breadth list" },
    ],
  })) as Builder,

  // 4. Instacart — Store-first browse (grocery)
  foodStoreFirst: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">Shop stores</div>
          <div className="text-[9px] text-foreground/55">📍 94110</div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ["Safeway","45m"],
            ["Costco","2hr"],
            ["Whole Fds","30m"],
            ["Target","1hr"],
            ["CVS","30m"],
            ["Trader J","1hr"],
          ].map(([n,t],i)=>(
            <div key={i} className="aspect-square rounded-lg border border-border/60 bg-foreground/[0.04] p-1.5 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/30 to-foreground/10 grid place-items-center text-[10px] font-medium">{(n as string)[0]}</div>
              <div>
                <div className="text-[9.5px] font-medium truncate">{n}</div>
                <div className="text-[8px] text-foreground/55">⏱ {t}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Popular brands</div>
        <div className="flex gap-1.5 overflow-hidden">
          {["Coca","Lay's","Oreo","Tide"].map((b,i)=>(
            <div key={i} className="px-2 py-1 rounded-full border border-border/60 text-[9px] shrink-0">{b}</div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Store-first" },
      { n: 2, x: "50%", y: "45%", label: "Grocery grid" },
      { n: 3, x: "50%", y: "85%", label: "Brand shortcuts" },
    ],
  })) as Builder,

  // 5. DoorDash — Popular items first
  foodPopularItems: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="flex items-center gap-1">
          <span className="text-[10px]">←</span>
          <div className="text-[11px] font-medium truncate">Joe's Pizza</div>
        </div>
        <div className="text-[8.5px] text-foreground/55">★ 4.8 · 20–30 min · $</div>
        <div className="rounded-md bg-primary/10 border border-primary/30 px-2 py-1 text-[9.5px] font-medium">🔥 Most ordered</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Margherita","#1 · 312 today","$14"],
            ["Pepperoni","#2 · 248 today","$15"],
            ["Garlic Knots","#3 · 190 today","$6"],
          ].map(([n,o,pr],i)=>(
            <div key={i} className="flex items-center gap-2 p-1 rounded-md border border-border/40">
              <Photo seed={i} className="w-10 h-10 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{o}</div>
              </div>
              <div className="text-[10px] font-mono">{pr}</div>
            </div>
          ))}
          <div className="text-[10px] font-medium mt-1">Menu</div>
          {["Caesar Salad · $9","Tiramisu · $7"].map((t,i)=>(
            <div key={i} className="text-[9.5px] text-foreground/70 py-0.5 border-b border-border/30">{t}</div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Most ordered" },
      { n: 2, x: "50%", y: "45%", label: "Ranked + counts" },
      { n: 3, x: "50%", y: "85%", label: "Rest of menu" },
    ],
  })) as Builder,

  // 6. Deliveroo — Photo menu grid
  foodPhotoMenu: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="flex items-center gap-1">
          <span className="text-[10px]">←</span>
          <div className="text-[11px] font-medium truncate">Ramen Ya</div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Tonkotsu","£14"],
            ["Spicy Miso","£13"],
            ["Shoyu","£12"],
            ["Gyoza 6pc","£7"],
            ["Karaage","£8"],
            ["Matcha Soft","£5"],
          ].map(([n,pr],i)=>(
            <div key={i} className="rounded-lg overflow-hidden border border-border/40 flex flex-col">
              <Photo seed={i} className="flex-1 min-h-[44px]" />
              <div className="px-1.5 py-1">
                <div className="text-[9.5px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55">{pr}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Photo-led menu" },
      { n: 2, x: "30%", y: "50%", label: "Large dish images" },
      { n: 3, x: "70%", y: "80%", label: "Price below" },
    ],
  })) as Builder,

  // 7. Uber Eats — Category tabs sticky
  foodCategoryTabs: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="flex items-center gap-1">
          <span className="text-[10px]">←</span>
          <div className="text-[11px] font-medium truncate">Bistro Lyon</div>
        </div>
        <div className="flex gap-3 text-[10px] border-b border-border/60 -mx-0.5 px-0.5">
          <span className="font-medium border-b-2 border-primary pb-1 -mb-px">Starters</span>
          <span className="text-foreground/55 pb-1">Mains</span>
          <span className="text-foreground/55 pb-1">Sides</span>
          <span className="text-foreground/55 pb-1">Drinks</span>
          <span className="text-foreground/55 pb-1">Desserts</span>
        </div>
        <div className="text-[10px] font-medium">Starters</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Onion Soup","$8"],
            ["Escargots","$11"],
            ["Pâté maison","$9"],
            ["Salade verte","$7"],
          ].map(([n,pr],i)=>(
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/40">
              <div className="text-[10px] truncate pr-2">{n}</div>
              <div className="text-[9.5px] font-mono text-foreground/65">{pr}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Sticky category tabs" },
      { n: 2, x: "20%", y: "22%", label: "Active section" },
      { n: 3, x: "50%", y: "65%", label: "Items in section" },
    ],
  })) as Builder,

  // 8. Instacart — Search items
  foodSearchItems: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="h-8 rounded-md bg-foreground/8 px-2 flex items-center gap-1.5 text-[10px]">
          <span>🔍</span>
          <span className="flex-1">milk</span>
          <span className="text-foreground/45">✕</span>
        </div>
        <div className="text-[9px] text-foreground/55">42 results in Safeway</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Organic Whole Milk","1 gal","$5.49"],
            ["2% Reduced Fat","1 gal","$4.29"],
            ["Oat Milk Original","64 oz","$4.99"],
            ["Almond Milk Unsw.","64 oz","$3.79"],
            ["Lactose-Free 2%","1/2 gal","$4.59"],
          ].map(([n,sz,pr],i)=>(
            <div key={i} className="flex items-center gap-2 p-1 rounded-md border border-border/40">
              <Photo seed={i} className="w-9 h-9 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55">{sz} · {pr}</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-[12px] shrink-0">+</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Item search bar" },
      { n: 2, x: "50%", y: "50%", label: "Item results" },
      { n: 3, x: "90%", y: "50%", label: "Quick add" },
    ],
  })) as Builder,

  // 9. Deliveroo — Live total + mods
  foodLiveTotalMods: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Your basket</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["1× Tonkotsu Ramen","£14.00",["+ Extra chashu £2.00","No green onions"]],
            ["2× Gyoza 6pc","£14.00",["Pan-fried"]],
            ["1× Matcha Soft","£5.00",[]],
          ].map(([n,pr,mods],i)=>(
            <div key={i} className="border-b border-border/40 pb-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="truncate pr-2">{n as string}</span>
                <span className="font-mono">{pr as string}</span>
              </div>
              {(mods as string[]).map((m,j)=>(
                <div key={j} className="text-[8.5px] text-foreground/55 pl-2">↳ {m}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-1.5 text-[9.5px] space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">£35.00</span></div>
          <div className="flex justify-between text-foreground/60"><span>Delivery</span><span className="font-mono">£2.49</span></div>
          <div className="flex justify-between font-medium text-[10.5px] pt-0.5 border-t border-border/40"><span>Total</span><span className="font-mono">£37.49</span></div>
        </div>
        <CTA>Checkout · £37.49</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Item modifiers" },
      { n: 2, x: "50%", y: "75%", label: "Live-updating total" },
      { n: 3, x: "50%", y: "94%", label: "Total in CTA" },
    ],
  })) as Builder,

  // 10. Uber Eats — Upsell add-ons
  foodUpsellAddons: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Cart · 2 items</div>
        <div className="flex flex-col gap-1.5">
          {[
            ["1× Margherita Pizza","$14"],
            ["1× Caesar Salad","$9"],
          ].map(([n,pr],i)=>(
            <div key={i} className="flex items-center justify-between text-[10px] py-1 border-b border-border/40">
              <span className="truncate pr-2">{n}</span>
              <span className="font-mono">{pr}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-primary/40 bg-primary/5 p-1.5">
          <div className="text-[10px] font-medium">Add a drink or dessert?</div>
          <div className="flex gap-1.5 mt-1 overflow-hidden">
            {[
              ["Coke","$3"],
              ["Tiramisu","$7"],
              ["Sparkling","$3"],
              ["Garlic Knot","$6"],
            ].map(([n,pr],i)=>(
              <div key={i} className="rounded-md border border-border/60 bg-background p-1 shrink-0 w-[60px]">
                <Photo seed={i} className="w-full h-8 rounded" />
                <div className="text-[8.5px] mt-0.5 truncate">{n}</div>
                <div className="text-[8.5px] flex items-center justify-between">
                  <span className="font-mono text-foreground/65">{pr}</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground grid place-items-center text-[9px]">+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1" />
        <div className="text-[9.5px] flex justify-between"><span>Subtotal</span><span className="font-mono">$23.00</span></div>
        <CTA>Go to checkout</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "32%", label: "Cart items" },
      { n: 2, x: "50%", y: "55%", label: "Add-on upsell" },
      { n: 3, x: "50%", y: "95%", label: "Checkout" },
    ],
  })) as Builder,

  // 11. DoorDash — Group order
  foodGroupOrder: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">Group order</div>
          <div className="text-[9px] text-foreground/55">4 people</div>
        </div>
        <div className="flex -space-x-1.5">
          {["M","A","J","S"].map((l,i)=>(
            <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-foreground/15 grid place-items-center text-[9px]">{l}</div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Maya",["Margherita Pizza · $14","Coke · $3"],"$17.00"],
            ["Alex",["Pepperoni · $15"],"$15.00"],
            ["Jordan",["Caesar Salad · $9","Sparkling · $3"],"$12.00"],
            ["Sam",["Garlic Knots · $6"],"$6.00"],
          ].map(([who,items,sub],i)=>(
            <div key={i} className="rounded-md border border-border/40 p-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium">{who}</span>
                <span className="font-mono text-foreground/65">{sub as string}</span>
              </div>
              {(items as string[]).map((it,j)=>(
                <div key={j} className="text-[8.5px] text-foreground/60 truncate">· {it}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-medium"><span>Group total</span><span className="font-mono">$50.00</span></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Participants" },
      { n: 2, x: "50%", y: "55%", label: "Split per person" },
      { n: 3, x: "50%", y: "94%", label: "Group total" },
    ],
  })) as Builder,

  // 12. Grubhub — Simple cart
  foodSimpleCart: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Your cart</div>
        <div className="flex flex-col gap-2 flex-1">
          {[
            ["1× Falafel Wrap","$8.00"],
            ["1× Hummus + Pita","$6.00"],
            ["1× Mint Lemonade","$4.00"],
          ].map(([n,pr],i)=>(
            <div key={i} className="flex items-center justify-between text-[10.5px] py-1.5 border-b border-border/40">
              <span className="truncate pr-2">{n}</span>
              <span className="font-mono">{pr}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] font-medium pt-1 border-t border-border/60">
          <span>Subtotal</span><span className="font-mono">$18.00</span>
        </div>
        <CTA>Checkout</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Items" },
      { n: 2, x: "50%", y: "82%", label: "Subtotal" },
      { n: 3, x: "50%", y: "94%", label: "Checkout" },
    ],
  })) as Builder,

  // 13. Uber Eats — One-tap reorder
  foodOneTapReorder: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Checkout</div>
        <div className="rounded-md border border-border/60 p-1.5 flex items-center gap-2">
          <span className="text-[12px]">📍</span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium truncate">Home · 220 Mission St</div>
            <div className="text-[8.5px] text-foreground/55">Leave at door</div>
          </div>
          <span className="text-[9px] text-foreground/55">Change</span>
        </div>
        <div className="rounded-md border border-border/60 p-1.5 flex items-center gap-2">
          <div className="w-8 h-5 rounded bg-foreground/15 grid place-items-center text-[8px]">VISA</div>
          <div className="flex-1 text-[10px]">•••• 4242</div>
          <span className="text-[9px] text-foreground/55">Change</span>
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-1.5 text-[9.5px] space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">$23.00</span></div>
          <div className="flex justify-between font-medium pt-0.5 border-t border-border/40"><span>Total</span><span className="font-mono">$27.49</span></div>
        </div>
        <CTA>Place order · $27.49</CTA>
        <div className="rounded-md border border-dashed border-border/60 p-1.5 flex items-center gap-2">
          <Photo seed={1} className="w-8 h-8 rounded" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] truncate">Reorder Joe's Pizza</div>
            <div className="text-[8.5px] text-foreground/55">Same as last time</div>
          </div>
          <div className="text-[9px] px-2 py-1 rounded-full bg-foreground/10">Reorder</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Saved address" },
      { n: 2, x: "50%", y: "45%", label: "Saved payment" },
      { n: 3, x: "50%", y: "92%", label: "1-tap reorder" },
    ],
  })) as Builder,

  // 14. DoorDash — Saved + DashPass
  foodDashPass: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Checkout</div>
        <div className="rounded-md p-1.5 bg-gradient-to-r from-red-500/20 to-red-500/5 border border-red-500/30 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 text-white grid place-items-center text-[9px] font-bold">DP</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium">DashPass · Free delivery</div>
            <div className="text-[8.5px] text-foreground/60">You saved $4.99 on this order</div>
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-1.5 flex items-center gap-2">
          <span className="text-[12px]">📍</span>
          <div className="flex-1 text-[10px] truncate">Home · 220 Mission St</div>
          <span className="text-[9px] text-foreground/55">Edit</span>
        </div>
        <div className="rounded-md border border-border/60 p-1.5 flex items-center gap-2">
          <div className="w-8 h-5 rounded bg-foreground/15 grid place-items-center text-[8px]">MC</div>
          <div className="flex-1 text-[10px]">•••• 8121</div>
          <span className="text-[9px] text-foreground/55">Edit</span>
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-1.5 text-[9.5px] space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">$28.00</span></div>
          <div className="flex justify-between text-foreground/60"><span>Delivery</span><span className="font-mono line-through">$4.99</span></div>
          <div className="flex justify-between text-green-600"><span>DashPass</span><span className="font-mono">−$4.99</span></div>
          <div className="flex justify-between font-medium pt-0.5 border-t border-border/40"><span>Total</span><span className="font-mono">$30.45</span></div>
        </div>
        <CTA>Place order</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "DashPass banner" },
      { n: 2, x: "50%", y: "45%", label: "Saved details" },
      { n: 3, x: "50%", y: "80%", label: "Delivery waived" },
    ],
  })) as Builder,

  // 15. Deliveroo — Clear fees breakdown
  foodClearFees: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Order summary</div>
        <div className="flex flex-col gap-1 text-[10px]">
          {[
            ["1× Tonkotsu Ramen","£14.00"],
            ["2× Gyoza 6pc","£14.00"],
            ["1× Matcha Soft","£5.00"],
          ].map(([n,pr],i)=>(
            <div key={i} className="flex justify-between py-0.5 border-b border-border/30">
              <span className="truncate pr-2">{n}</span>
              <span className="font-mono">{pr}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Fees</div>
        <div className="rounded-md border border-border/60 p-2 text-[9.5px] space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">£33.00</span></div>
          <div className="flex justify-between"><span>Delivery fee</span><span className="font-mono">£2.49</span></div>
          <div className="flex justify-between"><span>Service fee <span className="text-foreground/45">ⓘ</span></span><span className="font-mono">£1.20</span></div>
          <div className="flex justify-between"><span>Small order fee</span><span className="font-mono">£0.00</span></div>
          <div className="flex justify-between text-foreground/60"><span>VAT included</span><span className="font-mono">£6.10</span></div>
          <div className="flex justify-between pt-1 border-t border-border/40 font-medium text-[10.5px]"><span>Total</span><span className="font-mono">£36.69</span></div>
        </div>
        <div className="text-[8.5px] text-foreground/55">No hidden fees — what you see is what you pay.</div>
        <CTA>Confirm & pay · £36.69</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "55%", label: "Itemized fees" },
      { n: 2, x: "50%", y: "75%", label: "Total breakdown" },
      { n: 3, x: "50%", y: "85%", label: "Transparency note" },
    ],
  })) as Builder,

  // 16. Grubhub — Guest checkout
  foodGuestCheckout: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Checkout as guest</div>
        <div className="text-[9px] text-foreground/55">No account needed</div>
        <div className="flex flex-col gap-1.5 flex-1">
          {[
            ["Name","Maya Chen"],
            ["Email","maya@example.com"],
            ["Phone","(415) 555-0142"],
            ["Address","220 Mission St, SF"],
          ].map(([l,v],i)=>(
            <div key={i}>
              <div className="text-[8.5px] text-foreground/55 uppercase tracking-wider">{l}</div>
              <div className="h-7 rounded border border-border/60 px-2 grid items-center text-[10px]">{v}</div>
            </div>
          ))}
          <div>
            <div className="text-[8.5px] text-foreground/55 uppercase tracking-wider">Card</div>
            <div className="h-7 rounded border border-border/60 px-2 grid items-center text-[10px]">•••• 4242 · 09/28</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-foreground/60">
          <div className="w-3 h-3 rounded border border-border/60" />
          <span>Create account later (optional)</span>
        </div>
        <CTA>Place order · $18.00</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Guest checkout" },
      { n: 2, x: "50%", y: "55%", label: "Just basics" },
      { n: 3, x: "50%", y: "94%", label: "No signup" },
    ],
  })) as Builder,

  // 17. Uber Eats — Reorder shelf
  foodReorderShelf: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Order again</div>
        <div className="text-[9px] text-foreground/55">From your last 30 days</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Joe's Pizza","Margherita + Coke","2 days ago","$17"],
            ["Sushi Nori","Salmon set · 8 pc","1 week ago","$24"],
            ["Pho 88","Beef pho large","2 weeks ago","$14"],
            ["Green Bowl","Quinoa power bowl","3 weeks ago","$13"],
          ].map(([r,o,when,pr],i)=>(
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-md border border-border/40">
              <Photo seed={i} className="w-10 h-10 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{r}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{o} · {when}</div>
              </div>
              <div className="text-[9px] px-2 py-1 rounded-full bg-foreground/10 shrink-0">Reorder · {pr}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Order again shelf" },
      { n: 2, x: "30%", y: "50%", label: "Past orders" },
      { n: 3, x: "85%", y: "50%", label: "One-tap reorder" },
    ],
  })) as Builder,

  // 18. DoorDash — Subscription perks (DashPass)
  foodSubscriptionPerks: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="rounded-lg p-2 bg-gradient-to-br from-red-500/25 to-red-500/5 border border-red-500/30">
          <div className="text-[8.5px] tracking-wider text-red-500 font-medium">DASHPASS</div>
          <div className="font-display text-[15px]">$9.99/mo</div>
          <div className="text-[9px] text-foreground/65">You'd save ~$32/mo at your usage</div>
        </div>
        <div className="text-[10px] font-medium">Member perks</div>
        <div className="flex flex-col gap-1 flex-1">
          {[
            ["🚚","$0 delivery","On eligible orders $12+"],
            ["%","Reduced service fees","Up to 5% lower"],
            ["⭐","Member-only offers","Weekly drops"],
            ["🛒","Grocery + retail","Same perks on Safeway, Petco"],
            ["↩️","Cancel anytime","First 30 days free"],
          ].map(([ic,t,d],i)=>(
            <div key={i} className="flex items-start gap-2 py-1 border-b border-border/30">
              <div className="w-6 h-6 rounded-full bg-foreground/8 grid place-items-center text-[11px] shrink-0">{ic}</div>
              <div className="min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{d}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Start 30-day free trial</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Subscription tier" },
      { n: 2, x: "50%", y: "55%", label: "Member perks" },
      { n: 3, x: "50%", y: "94%", label: "Free trial CTA" },
    ],
  })) as Builder,

  // 19. Grubhub — Points / perks
  foodPointsPerks: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="text-[11px] font-medium">Rewards</div>
        <div className="rounded-lg border border-border/60 p-2">
          <div className="flex items-baseline justify-between">
            <div className="font-display text-[18px]">1,240 <span className="text-[9px] font-normal text-foreground/55">pts</span></div>
            <div className="text-[8.5px] text-foreground/55">260 to next</div>
          </div>
          <div className="h-1.5 mt-1 rounded-full bg-foreground/10 overflow-hidden">
            <div className="h-full w-[82%] bg-primary rounded-full" />
          </div>
          <div className="text-[8.5px] text-foreground/55 mt-1">Earn 10 pts per $1</div>
        </div>
        <div className="text-[10px] font-medium">Redeem</div>
        <div className="flex flex-col gap-1 flex-1">
          {[
            ["Free side","500 pts","Available now"],
            ["Free drink","800 pts","Available now"],
            ["Free entrée","1,500 pts","260 pts away"],
            ["Free delivery x5","2,000 pts","Locked"],
          ].map(([t,p,s],i)=>(
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/30">
              <div className="min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
              <div className="text-[9px] font-mono">{p}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Points balance" },
      { n: 2, x: "50%", y: "38%", label: "Progress to free item" },
      { n: 3, x: "50%", y: "75%", label: "Rewards ladder" },
    ],
  })) as Builder,

  // 20. Deliveroo — Favorites
  foodFavorites: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FoodBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">Favourites</div>
          <div className="text-[9px] text-foreground/55">12 saved</div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Ramen Ya","Japanese","20m"],
            ["Bistro Lyon","French","30m"],
            ["Pad See Ew","Thai","25m"],
            ["Curry House","Indian","35m"],
            ["Sushi Nori","Sushi","25m"],
            ["Green Bowl","Vegan","15m"],
          ].map(([n,c,t],i)=>(
            <div key={i} className="rounded-lg overflow-hidden border border-border/40 flex flex-col">
              <Photo seed={i} className="flex-1 min-h-[36px] flex items-start justify-end p-1">
                <span className="text-[11px]">♥</span>
              </Photo>
              <div className="px-1.5 py-1">
                <div className="text-[9.5px] font-medium truncate">{n}</div>
                <div className="text-[8px] text-foreground/55 truncate">{c} · {t}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Saved favourites" },
      { n: 2, x: "80%", y: "35%", label: "Heart marker" },
      { n: 3, x: "50%", y: "65%", label: "Go-to restaurants" },
    ],
  })) as Builder,
});

// ============================================================
// E-COMMERCE — 20 brand-evocative screens
// ============================================================
const ShopBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Amazon — Forgiving autocomplete
  shopAmazonAutocomplete: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="h-8 rounded-full bg-yellow-400/20 border border-yellow-500/40 px-2 flex items-center gap-1.5 text-[10px]">
          <span>🔍</span>
          <span className="flex-1">blutooth headphns|</span>
          <span className="text-foreground/45">✕</span>
        </div>
        <div className="text-[9px] text-foreground/55 italic">Did you mean <span className="text-primary underline">bluetooth headphones</span>?</div>
        <div className="text-[9px] text-foreground/55 uppercase tracking-wider">Suggestions</div>
        <div className="flex flex-col flex-1">
          {[
            ["bluetooth headphones","in Electronics"],
            ["bluetooth headphones wireless","in Electronics"],
            ["bluetooth headphones with mic","in Electronics"],
            ["bluetooth headphones for kids","in Kids"],
            ["bluetooth earbuds noise cancelling","in Electronics"],
            ["bluetooth speaker portable","in Electronics"],
          ].map(([q,c],i)=>(
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/30 text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-foreground/45">🔍</span>
                <span className="truncate">{q}</span>
              </div>
              <span className="text-[8.5px] text-foreground/50 shrink-0">{c}</span>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] text-foreground/50 text-center">2,418 results match</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Forgiving — did you mean" },
      { n: 2, x: "50%", y: "55%", label: "Scoped suggestions" },
      { n: 3, x: "50%", y: "94%", label: "Never zero results" },
    ],
  })) as Builder,

  // 2. ASOS — Visual scoped search
  shopAsosVisualSearch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="h-8 rounded-md bg-foreground/8 px-2 flex items-center gap-1.5 text-[10px]">
          <span>🔍</span><span className="flex-1">linen dress</span><span>📷</span>
        </div>
        <div className="flex gap-1 overflow-hidden">
          {["Women","Men","Brand","Edit","Sale"].map((c,i)=>(
            <Chip key={i} accent={i===0}>{c}</Chip>
          ))}
        </div>
        <div className="flex gap-1 overflow-hidden">
          {["Mini","Midi","Maxi","Beige","White","XS-XL"].map((c,i)=>(
            <Chip key={i}>{c}</Chip>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Linen Midi","£48"],
            ["Tie-Back Mini","£35"],
            ["Belted Maxi","£62"],
            ["Sleeveless Slip","£28"],
          ].map(([n,pr],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/40 flex flex-col">
              <Photo seed={i} className="flex-1 min-h-[60px]" />
              <div className="px-1.5 py-1">
                <div className="text-[9.5px] truncate">{n}</div>
                <div className="text-[8.5px] font-mono text-foreground/65">{pr}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Search + camera" },
      { n: 2, x: "50%", y: "30%", label: "Scoped pills" },
      { n: 3, x: "50%", y: "70%", label: "Visual grid" },
    ],
  })) as Builder,

  // 3. Sephora — Guided beauty search
  shopSephoraGuided: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="font-display text-[14px]">Find your match</div>
        <div className="text-[9.5px] text-foreground/60">Tell us about your skin</div>
        <div className="text-[9px] text-foreground/55 uppercase tracking-wider">Concern</div>
        <div className="flex gap-1 flex-wrap">
          {["Acne","Dryness","Dullness","Redness","Pores"].map((c,i)=>(
            <Chip key={i} accent={i===1}>{c}</Chip>
          ))}
        </div>
        <div className="text-[9px] text-foreground/55 uppercase tracking-wider">Skin type</div>
        <div className="flex gap-1 flex-wrap">
          {["Oily","Dry","Combo","Sensitive","Normal"].map((c,i)=>(
            <Chip key={i} accent={i===1}>{c}</Chip>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Matched for you · 24</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["Hydrating Serum","98% match · for Dry"],
            ["Barrier Cream","95% match · Sensitive ok"],
            ["Overnight Mask","91% match · Dry"],
          ].map(([n,m],i)=>(
            <div key={i} className="flex items-center gap-2 p-1 rounded-md border border-border/40">
              <Photo seed={i} className="w-8 h-8 rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{m}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Concern" },
      { n: 2, x: "50%", y: "45%", label: "Skin type" },
      { n: 3, x: "50%", y: "80%", label: "Guided matches" },
    ],
  })) as Builder,

  // 4. IKEA — Room / category search
  shopIkeaRooms: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="h-8 rounded-md bg-foreground/8 px-2 flex items-center gap-1.5 text-[10px]">
          <span>🔍</span><span className="flex-1">Shop by room</span>
        </div>
        <div className="text-[10px] font-medium">Browse rooms</div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Living room","248 items"],
            ["Bedroom","312 items"],
            ["Kitchen","186 items"],
            ["Bathroom","94 items"],
            ["Kids","142 items"],
            ["Outdoor","78 items"],
          ].map(([n,c],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/40 flex flex-col">
              <Photo seed={i} className="flex-1 min-h-[44px] flex items-end p-1">
                <span className="text-[9px] bg-background/80 px-1 rounded">{n}</span>
              </Photo>
              <div className="px-1.5 py-1 text-[8.5px] text-foreground/55">{c}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Search by room" },
      { n: 2, x: "30%", y: "55%", label: "Inspirational rooms" },
      { n: 3, x: "70%", y: "80%", label: "Category counts" },
    ],
  })) as Builder,

  // 5. ASOS — Fit/size filters grid
  shopAsosFilters: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">Dresses · 1,248</div>
          <div className="text-[9px] text-foreground/55">Sort</div>
        </div>
        <div className="flex gap-1 overflow-hidden">
          {["Fit: Regular","Size: M","Colour: Beige","+3"].map((c,i)=>(
            <div key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/12 border border-border/60 truncate flex items-center gap-1">
              {c} <span className="text-foreground/45">✕</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Linen Midi","£48","M, L"],
            ["Slip Dress","£32","S, M"],
            ["Belted Maxi","£58","M"],
            ["Tie-Back Mini","£36","S, M, L"],
          ].map(([n,pr,sz],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/40 flex flex-col">
              <Photo seed={i} className="flex-1 min-h-[54px]" />
              <div className="px-1.5 py-1">
                <div className="text-[9.5px] truncate">{n}</div>
                <div className="text-[8.5px] font-mono text-foreground/65">{pr}</div>
                <div className="text-[8px] text-green-600">In your size · {sz}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Fit/size/colour chips" },
      { n: 2, x: "50%", y: "60%", label: "Visual grid" },
      { n: 3, x: "50%", y: "88%", label: "In-your-size flag" },
    ],
  })) as Builder,

  // 6. Amazon — Faceted filters dense
  shopAmazonFacets: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-medium">"laptop stand"</div>
          <div className="text-[9px] text-foreground/55">2,418 results</div>
        </div>
        <div className="flex gap-1.5 flex-1 overflow-hidden">
          <div className="w-[42%] flex flex-col gap-1 text-[8.5px]">
            <div className="font-semibold">Department</div>
            <div>· Office Products</div>
            <div>· Electronics</div>
            <div className="font-semibold mt-0.5">Avg. Customer Review</div>
            <div>★★★★☆ & Up</div>
            <div>★★★☆☆ & Up</div>
            <div className="font-semibold mt-0.5">Price</div>
            <div className="flex gap-1">
              <div className="px-1 border border-border rounded">$0</div>
              <div className="px-1 border border-border rounded">$50</div>
            </div>
            <div className="font-semibold mt-0.5">Brand</div>
            <div>☐ Rain</div>
            <div>☑ Nulaxy</div>
            <div>☐ Roost</div>
            <div className="font-semibold mt-0.5">Material</div>
            <div>☐ Aluminum</div>
            <div>☐ Bamboo</div>
            <div>☐ Steel</div>
            <div className="font-semibold mt-0.5">Prime</div>
            <div>☑ Prime eligible</div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
            {[
              ["Aluminum Riser","$29.99","★★★★☆ 12,481"],
              ["Adjustable Stand","$42.50","★★★★★ 8,902"],
              ["Bamboo Stand","$24.00","★★★★☆ 3,210"],
              ["Foldable Stand","$18.99","★★★★☆ 6,418"],
            ].map(([n,pr,r],i)=>(
              <div key={i} className="flex gap-1.5">
                <Photo seed={i} className="w-9 h-9 rounded shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] truncate">{n}</div>
                  <div className="text-[9px] font-mono">{pr}</div>
                  <div className="text-[8px] text-yellow-600 truncate">{r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "55%", label: "Dense facets" },
      { n: 2, x: "70%", y: "55%", label: "Results list" },
      { n: 3, x: "70%", y: "90%", label: "Ratings + Prime" },
    ],
  })) as Builder,

  // 7. Sephora — Reviews-led grid
  shopSephoraReviews: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="text-[11px] font-medium">Best skincare</div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Glow Serum","★ 4.8","12,481 reviews","$38"],
            ["Barrier Cream","★ 4.9","8,902 reviews","$42"],
            ["Vit-C Drops","★ 4.7","6,210 reviews","$28"],
            ["Night Mask","★ 4.8","9,418 reviews","$45"],
          ].map(([n,r,c,pr],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/40 flex flex-col">
              <Photo seed={i} className="flex-1 min-h-[54px]" />
              <div className="px-1.5 py-1">
                <div className="text-[10px] text-yellow-600 font-medium">{r}</div>
                <div className="text-[8px] text-foreground/55">{c}</div>
                <div className="text-[9.5px] truncate">{n}</div>
                <div className="text-[8.5px] font-mono">{pr}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "55%", label: "Rating leads card" },
      { n: 2, x: "30%", y: "65%", label: "Review count" },
      { n: 3, x: "70%", y: "75%", label: "Name + price below" },
    ],
  })) as Builder,

  // 8. IKEA — Room visualizer grid
  shopIkeaVisualizer: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="text-[11px] font-medium">Sofas — see in a room</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["KIVIK 3-seat","$799","Linen beige"],
            ["EKTORP","$549","Cotton white"],
            ["FRIHETEN sleeper","$649","Velvet teal"],
          ].map(([n,pr,c],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/40 flex">
              <Photo seed={i} className="w-[55%] min-h-[60px] relative flex items-end p-1">
                <span className="text-[8px] bg-background/80 px-1 rounded">In a living room</span>
              </Photo>
              <div className="flex-1 p-1.5">
                <div className="text-[10px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55">{c}</div>
                <div className="text-[9.5px] font-mono mt-1">{pr}</div>
                <div className="text-[8px] text-primary mt-0.5">See in a room ›</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "45%", label: "Room imagery" },
      { n: 2, x: "75%", y: "55%", label: "Product specs" },
      { n: 3, x: "75%", y: "70%", label: "See in a room" },
    ],
  })) as Builder,

  // 9. Sephora — Reviews by skin type PDP
  shopSephoraPdp: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <Photo seed={1} className="h-16 rounded-md" />
        <div>
          <div className="text-[11px] font-medium">Glow Serum</div>
          <div className="text-[9px] text-foreground/55">Drunk Elephant · $38</div>
          <div className="text-[10px] text-yellow-600">★ 4.8 · 12,481</div>
        </div>
        <div className="text-[9px] text-foreground/55 uppercase tracking-wider">Key ingredients</div>
        <div className="flex gap-1 flex-wrap">
          {["Vit C 15%","Niacinamide","Ferulic","Hyaluronic"].map((c,i)=>(
            <Chip key={i}>{c}</Chip>
          ))}
        </div>
        <div className="flex items-center justify-between text-[9.5px]">
          <span className="font-medium">Reviews</span>
          <span className="text-foreground/55">Filter by skin</span>
        </div>
        <div className="flex gap-1">
          {["Dry","Oily","Combo","Sensitive"].map((c,i)=>(
            <Chip key={i} accent={i===0}>{c}</Chip>
          ))}
        </div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["Maya · Dry","★★★★★","Finally hydrated all day."],
            ["Aisha · Dry","★★★★☆","Glows but takes time."],
          ].map(([who,r,t],i)=>(
            <div key={i} className="rounded p-1 border border-border/40">
              <div className="flex items-center justify-between text-[9px]"><span className="font-medium truncate">{who}</span><span className="text-yellow-600">{r}</span></div>
              <div className="text-[8.5px] text-foreground/65 truncate">{t}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Ingredient list" },
      { n: 2, x: "50%", y: "65%", label: "Filter reviews by skin" },
      { n: 3, x: "50%", y: "85%", label: "Same-skin reviews" },
    ],
  })) as Builder,

  // 10. Amazon — Q&A + reviews
  shopAmazonQA: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="flex gap-1.5">
          <Photo seed={0} className="w-12 h-12 rounded shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] font-medium truncate">Echo Dot (5th Gen)</div>
            <div className="text-[9px] text-yellow-600">★★★★☆ 4.6 · 218,402</div>
            <div className="text-[10px] font-mono">$49.99</div>
          </div>
        </div>
        <div className="text-[10px] font-medium">Customer Q&A</div>
        <div className="flex flex-col gap-1">
          {[
            ["Q: Works without Wi-Fi?","A: No, Wi-Fi is required for Alexa. — Tom"],
            ["Q: Multiroom audio?","A: Yes, with other Echo devices. — Priya"],
          ].map(([q,a],i)=>(
            <div key={i} className="rounded p-1 border border-border/40">
              <div className="text-[9px] font-medium truncate">{q}</div>
              <div className="text-[8.5px] text-foreground/65 truncate">{a}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Customer reviews</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["★★★★★","Great sound for the size","Verified Purchase"],
            ["★★★★☆","Setup was easy","Verified Purchase"],
            ["★★★★★","Worth every penny","Verified Purchase"],
          ].map(([r,t,v],i)=>(
            <div key={i} className="rounded p-1 border border-border/30">
              <div className="text-[9px] text-yellow-600">{r}</div>
              <div className="text-[9px] truncate">{t}</div>
              <div className="text-[8px] text-green-600">{v}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Customer Q&A" },
      { n: 2, x: "50%", y: "70%", label: "Long reviews" },
      { n: 3, x: "50%", y: "92%", label: "Verified badge" },
    ],
  })) as Builder,

  // 11. Nike — Story + media PDP
  shopNikeStory: ((_ctx, _p) => ({
    node: (
      <Frame>
        <Photo seed={1} className="h-24 -mx-3.5 -mt-3 flex items-end p-2">
          <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/70 bg-background/70 px-1.5">Air Max · Story</span>
        </Photo>
        <div className="font-display text-[16px] leading-tight">Run with Air.</div>
        <div className="text-[9.5px] text-foreground/65 leading-snug">A new chapter for Air Max. Built for the morning commute and the late-night loop.</div>
        <Photo seed={2} className="h-14 rounded-md" />
        <div className="flex gap-1.5">
          {[0,1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-foreground/15 border border-border/60" />)}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-[12px]">$160</div>
          <div className="text-[9px] text-foreground/55">Free shipping for Members</div>
        </div>
        <CTA>Add to Bag</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Big media hero" },
      { n: 2, x: "50%", y: "38%", label: "Brand story" },
      { n: 3, x: "50%", y: "94%", label: "Light on specs" },
    ],
  })) as Builder,

  // 12. IKEA — AR in your room
  shopIkeaAR: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="relative h-36 rounded-md overflow-hidden border border-border/60 bg-gradient-to-br from-foreground/10 to-foreground/[0.03]">
          <div className="absolute inset-2 border border-dashed border-primary/50 rounded grid place-items-center">
            <Photo seed={1} className="w-2/3 h-2/3 rounded shadow-lg" />
          </div>
          <div className="absolute top-1 left-1 text-[8px] font-mono bg-background/80 px-1 rounded">AR · LIVE</div>
          <div className="absolute bottom-1 right-1 text-[8px] bg-background/80 px-1 rounded">Tap floor to place</div>
        </div>
        <div className="text-[11px] font-medium">POÄNG armchair</div>
        <div className="text-[9px] text-foreground/55">Birch · $179</div>
        <div className="flex gap-1.5">
          <div className="flex-1 h-9 rounded-md bg-primary text-primary-foreground grid place-items-center text-[10px] font-medium">📐 View in your room</div>
          <div className="w-9 h-9 rounded-md border border-border/60 grid place-items-center text-[12px]">♡</div>
        </div>
        <div className="text-[9px] text-foreground/55">See actual size in your space before you buy.</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "AR placed in room" },
      { n: 2, x: "20%", y: "20%", label: "Live AR" },
      { n: 3, x: "50%", y: "75%", label: "View in your room CTA" },
    ],
  })) as Builder,

  // 13. Amazon — 1-click
  shopAmazon1Click: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="flex gap-1.5">
          <Photo seed={0} className="w-14 h-14 rounded shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] truncate">Echo Dot (5th Gen)</div>
            <div className="text-[9px] text-yellow-600">★★★★☆</div>
            <div className="text-[12px] font-mono">$49.99</div>
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-1.5 text-[9.5px]">
          <div>Deliver to: <span className="font-medium">Maya · 220 Mission St</span></div>
          <div className="text-foreground/55">Arrives <span className="text-green-600 font-medium">tomorrow</span> by 8pm</div>
        </div>
        <div className="rounded-md border border-border/60 p-1.5 text-[9.5px]">
          Pay with: <span className="font-medium">Visa •••• 4242</span>
        </div>
        <div className="flex-1" />
        <div className="h-10 rounded-full bg-yellow-400 text-black grid place-items-center text-[12px] font-medium">Buy now — 1-Click</div>
        <div className="h-8 rounded-full border border-border/60 grid place-items-center text-[10px] text-foreground/65">Add to Cart</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Saved address" },
      { n: 2, x: "50%", y: "55%", label: "Saved payment" },
      { n: 3, x: "50%", y: "85%", label: "Single Buy now" },
    ],
  })) as Builder,

  // 14. ASOS — Express wallets
  shopAsosExpress: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="text-[11px] font-medium">Checkout</div>
        <div className="flex flex-col gap-1.5">
          <div className="h-10 rounded-md bg-black text-white grid place-items-center text-[11px]"> Pay</div>
          <div className="h-10 rounded-md bg-yellow-300 text-black grid place-items-center text-[11px] font-medium">PayPal</div>
          <div className="h-10 rounded-md bg-blue-600 text-white grid place-items-center text-[11px] font-medium">Klarna · Pay in 3</div>
        </div>
        <div className="flex items-center gap-2 text-[8.5px] text-foreground/55">
          <div className="flex-1 h-px bg-border/60" />
          <span>or pay with card</span>
          <div className="flex-1 h-px bg-border/60" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          {["Email","Card number","Expiry / CVC"].map((l,i)=>(
            <div key={i}>
              <div className="text-[8px] text-foreground/55 uppercase tracking-wider">{l}</div>
              <div className="h-7 rounded border border-border/60" />
            </div>
          ))}
        </div>
        <CTA>Place order · £62.00</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Express wallets up top" },
      { n: 2, x: "50%", y: "45%", label: "Apple Pay / PayPal" },
      { n: 3, x: "50%", y: "75%", label: "Card fallback below" },
    ],
  })) as Builder,

  // 15. Nike — Member checkout
  shopNikeMember: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="rounded-md bg-foreground/[0.04] border border-border/60 p-1.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-black text-white grid place-items-center text-[10px] font-bold">✓</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium">Member · Maya</div>
            <div className="text-[8.5px] text-foreground/55">Free shipping · 2,480 pts</div>
          </div>
          <div className="text-[8.5px] px-1.5 py-0.5 rounded-full bg-foreground/10">Gold</div>
        </div>
        <div className="rounded-md border border-border/60 p-1.5 text-[10px]">
          <div className="font-medium">Air Max 90 · Size 9</div>
          <div className="text-foreground/55 text-[9px]">In bag · $130</div>
        </div>
        <div className="rounded-md border border-border/60 p-1.5 text-[10px]">220 Mission St · Edit</div>
        <div className="rounded-md border border-border/60 p-1.5 text-[10px]">Visa •••• 4242 · Edit</div>
        <div className="rounded-md bg-foreground/[0.04] p-1.5 text-[9.5px] space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">$130.00</span></div>
          <div className="flex justify-between text-green-600"><span>Member shipping</span><span className="font-mono">FREE</span></div>
          <div className="flex justify-between text-green-600"><span>Points (−$5)</span><span className="font-mono">−$5.00</span></div>
          <div className="flex justify-between font-medium pt-0.5 border-t border-border/40"><span>Total</span><span className="font-mono">$125.00</span></div>
        </div>
        <CTA>Place order</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Member identity + tier" },
      { n: 2, x: "50%", y: "50%", label: "Saved details" },
      { n: 3, x: "50%", y: "80%", label: "Perks + points applied" },
    ],
  })) as Builder,

  // 16. IKEA — Delivery / pickup choice
  shopIkeaFulfil: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="text-[11px] font-medium">How would you like it?</div>
        <div className="rounded-md border-2 border-primary p-2">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary grid place-items-center"><div className="w-2 h-2 rounded-full bg-primary" /></div>
            <div className="flex-1">
              <div className="text-[10.5px] font-medium">Home delivery</div>
              <div className="text-[8.5px] text-foreground/55">Tue, Apr 30 · 9am–1pm</div>
              <div className="text-[8.5px] font-mono">$49.00</div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-border/60" />
            <div className="flex-1">
              <div className="text-[10.5px] font-medium">Store pickup</div>
              <div className="text-[8.5px] text-foreground/55">IKEA Emeryville · ready Sat</div>
              <div className="text-[8.5px] text-green-600">Free</div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-border/60" />
            <div className="flex-1">
              <div className="text-[10.5px] font-medium">Click & collect locker</div>
              <div className="text-[8.5px] text-foreground/55">Nearest: 0.6 mi</div>
              <div className="text-[8.5px] font-mono">$9.00</div>
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <CTA>Continue</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Home delivery" },
      { n: 2, x: "50%", y: "50%", label: "Store pickup option" },
      { n: 3, x: "50%", y: "75%", label: "Locker pickup" },
    ],
  })) as Builder,

  // 17. ASOS — Free paperless returns + QR
  shopAsosReturns: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="font-display text-[14px]">Return — free & easy</div>
        <div className="text-[9.5px] text-foreground/60">No printer. No label. Just scan.</div>
        <div className="aspect-square w-32 self-center my-1 rounded-md bg-foreground p-2 grid place-items-center">
          <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-px">
            {Array.from({length:64}).map((_,i)=>(
              <div key={i} className={(i*7+i%5)%3? "bg-background" : "bg-foreground"} />
            ))}
          </div>
        </div>
        <div className="text-[10px] text-center font-mono">RTN-AB12-9482</div>
        <div className="rounded-md border border-border/60 p-1.5 text-[9.5px] space-y-0.5">
          <div>✓ Free return</div>
          <div>✓ Paperless · just show QR</div>
          <div>✓ Refund in 5 days</div>
        </div>
        <div className="flex-1" />
        <CTA>Find drop-off</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Free & easy" },
      { n: 2, x: "50%", y: "45%", label: "Paperless QR" },
      { n: 3, x: "50%", y: "78%", label: "What you get" },
    ],
  })) as Builder,

  // 18. Amazon — Drop-off network map
  shopAmazonDropoff: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="text-[11px] font-medium">Drop off your return</div>
        <div className="relative h-28 rounded-md overflow-hidden border border-border/60 bg-gradient-to-br from-primary/10 to-foreground/5">
          <div className="absolute inset-0 opacity-50" style={{backgroundImage:"linear-gradient(0deg,transparent 24%,rgba(0,0,0,.05) 25%,rgba(0,0,0,.05) 26%,transparent 27%,transparent 74%,rgba(0,0,0,.05) 75%,rgba(0,0,0,.05) 76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(0,0,0,.05) 25%,rgba(0,0,0,.05) 26%,transparent 27%,transparent 74%,rgba(0,0,0,.05) 75%,rgba(0,0,0,.05) 76%,transparent 77%)",backgroundSize:"24px 24px"}}/>
          {[
            ["30%","30%","UPS"],
            ["60%","45%","Whole Foods"],
            ["45%","70%","Kohl's"],
            ["80%","65%","Amazon Hub"],
          ].map(([x,y,l],i)=>(
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{left:x as string, top:y as string}}>
              <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground grid place-items-center text-[8px] font-bold">{i+1}</div>
            </div>
          ))}
        </div>
        <div className="text-[9px] text-foreground/55">4 locations within 1 mile</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["1","UPS Store","0.3 mi · Open until 7pm","No box, no label"],
            ["2","Whole Foods","0.5 mi · Open 24h","Amazon Hub counter"],
            ["3","Kohl's","0.8 mi · Open until 9pm","No box, no label"],
            ["4","Amazon Hub Locker","1.0 mi · 24h","Self-service"],
          ].map(([n,name,d,e],i)=>(
            <div key={i} className="flex items-center gap-1.5 py-0.5 border-b border-border/30">
              <div className="w-4 h-4 rounded-full bg-primary/15 text-primary grid place-items-center text-[8px] font-bold">{n}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[9.5px] font-medium truncate">{name}</div>
                <div className="text-[8px] text-foreground/55 truncate">{d} · {e}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Drop-off map" },
      { n: 2, x: "50%", y: "65%", label: "Nearby network" },
      { n: 3, x: "85%", y: "70%", label: "No box, no label" },
    ],
  })) as Builder,

  // 19. Sephora — Generous returns
  shopSephoraReturns: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="font-display text-[14px]">Love it or return it</div>
        <div className="text-[9.5px] text-foreground/65">Up to 60 days — even if it's been opened.</div>
        <div className="rounded-md border border-border/60 p-2 flex gap-2 items-center bg-foreground/[0.03]">
          <div className="w-10 h-10 rounded-full bg-primary/15 grid place-items-center text-[18px]">💖</div>
          <div className="text-[9.5px] text-foreground/70">If it's not your match, send it back. We'll refund the original payment.</div>
        </div>
        <div className="text-[10px] font-medium">3 easy steps</div>
        <div className="flex flex-col gap-1.5 flex-1">
          {[
            ["1","Pick the item","From your last 60 days of orders"],
            ["2","Choose a reason","No re-stocking fees"],
            ["3","Drop off or mail back","Free pre-paid label"],
          ].map(([n,t,d],i)=>(
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px] font-bold shrink-0">{n}</div>
              <div className="min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{d}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Start a return</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "60-day window" },
      { n: 2, x: "50%", y: "30%", label: "Even if opened" },
      { n: 3, x: "50%", y: "70%", label: "3 simple steps" },
    ],
  })) as Builder,

  // 20. IKEA — In-store returns
  shopIkeaInStore: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="text-[11px] font-medium">Bring it back to a store</div>
        <div className="rounded-md border border-border/60 overflow-hidden">
          <Photo seed={2} className="h-16" />
          <div className="p-2">
            <div className="text-[10.5px] font-medium">IKEA Emeryville</div>
            <div className="text-[8.5px] text-foreground/55">4400 Shellmound St · 8.2 mi</div>
            <div className="text-[8.5px] text-foreground/55">Returns desk · Door 2</div>
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-2 text-[9.5px]">
          <div className="font-medium mb-1">Store hours</div>
          <div className="flex justify-between"><span>Mon–Fri</span><span className="font-mono">10am – 9pm</span></div>
          <div className="flex justify-between"><span>Sat</span><span className="font-mono">9am – 9pm</span></div>
          <div className="flex justify-between"><span>Sun</span><span className="font-mono">10am – 8pm</span></div>
        </div>
        <div className="rounded-md border border-border/60 p-2 text-[9.5px] space-y-0.5">
          <div>✓ Bring item + receipt or order #</div>
          <div>✓ 365-day return window</div>
          <div>✓ Refund to original payment</div>
        </div>
        <div className="flex gap-1.5">
          <div className="flex-1 h-9 rounded-md bg-primary text-primary-foreground grid place-items-center text-[10px] font-medium">Get directions</div>
          <div className="h-9 px-3 rounded-md border border-border/60 grid place-items-center text-[10px]">Call</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Nearest store" },
      { n: 2, x: "50%", y: "55%", label: "Store hours" },
      { n: 3, x: "50%", y: "92%", label: "Directions / Call" },
    ],
  })) as Builder,
});

export function renderScreen(screen: string | undefined, ctx: RenderCtx, preview?: Preview): RenderedScreen {
  const p = safePreview(preview, ctx);
  const b = (screen && screens[screen]) || fallback;
  return b(ctx, p);
}

export function WireframeRenderer({ screen, ctx, preview }: { screen?: string; ctx: RenderCtx; preview?: Preview }) {
  const { node } = renderScreen(screen, ctx, preview);
  return (
    <motion.div
      key={`${screen}-${ctx.stage}-${ctx.pattern}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      {node}
    </motion.div>
  );
}
