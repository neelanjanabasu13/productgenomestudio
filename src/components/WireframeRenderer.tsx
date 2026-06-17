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
