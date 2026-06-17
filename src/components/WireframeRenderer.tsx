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
            { label: "Breakfast", values: ["✓", "-"] },
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
        <div className="font-display text-[16px] leading-tight truncate">Welcome - let's get going</div>
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
            { s: "Blocked", c: "bg-destructive/20 text-destructive", o: "JT", d: "-" },
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
            <div className="text-[10px]">42 is the floor - happy to raise.</div>
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
// p.company / p.metric / p.pattern - those leak strings like "TikTok · Onboarding".
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
              <div className="text-[10px] text-background/80 mt-0.5 truncate">♪ original sound - maya.makes</div>
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
        <div className="text-[10px] text-foreground/60 -mt-1">Pick 3+ - we'll tune your For You</div>
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
          <span>H1</span><span>H2</span><span>“ ”</span><span>{"</>"}</span><span>•-</span><span>🔗</span>
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
            <div className="text-[9px] text-foreground/55 truncate">2023 - Present · 2 yr 3 mo</div>
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
  // 1. Meta AI - inbox with pinned AI
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

  // 2. ChatGPT - clean centered prompt
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

  // 3. Gemini - Workspace top bar with spark
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

  // 4. Manus - agent run console
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

  // 5. Claude - nuanced structured reply
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
          Help me decide between two job offers - one is more pay, one is more aligned.
        </div>
        <div className="self-start w-full rounded-2xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 p-2.5 text-[10px] flex flex-col gap-1.5">
          <div className="font-medium text-[10.5px]">How I'd think about it</div>
          <ul className="flex flex-col gap-1">
            {[
              "Map a 3-year horizon - money compounds, but so does alignment.",
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

  // 6. ChatGPT - versatile friendly + follow-ups
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
          Easy - try a one-pan lemon chicken rice. Sear seasoned thighs, toss in rice + broth, lid on 18 min. Finish with parsley and a squeeze of lemon. 🍋
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

  // 7. Gemini - fast answer + sources
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
            ["wikipedia.org", "Lisbon - Wikipedia"],
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

  // 8. Meta AI - casual emoji bubbles
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
          <div className="self-start max-w-[78%] rounded-2xl rounded-bl-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">ooh fun! 😄 vibe check - cozy, thrilling, or laugh-til-you-cry?</div>
          <div className="self-end max-w-[78%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-2.5 py-1.5 text-[10px]">cozy 🛋️🍿</div>
          <div className="self-start max-w-[78%] rounded-2xl rounded-bl-sm bg-foreground/10 px-2.5 py-1.5 text-[10px]">say no more 💛 try <b>Paddington 2</b> or <b>About Time</b> - both feel like a warm hug 🫂</div>
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

  // 9. Gemini context - Workspace side panel
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

  // 10. Claude - Projects with attached docs
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
              ["CSV", "Funnel data Q1-Q3", "-"],
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

  // 11. ChatGPT - memory + GPTs
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

  // 12. Manus - live web fetch log
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

  // 13. ChatGPT - voice + image + camera
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

  // 14. Gemini - native multimodal message
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
          A street market in Lisbon at dusk. You're asking which stall sells the custard tarts - the blue awning on the left.
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Image + text + audio" },
      { n: 2, x: "50%", y: "82%", label: "Single combined reply" },
      { n: 3, x: "85%", y: "12%", label: "Native multimodal" },
    ],
  })) as Builder,

  // 15. Meta AI - image gen inline
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

  // 16. Claude - doc + image read
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

  // 17. Claude - Artifacts split view
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
            <div className="self-start rounded-xl rounded-bl-sm bg-foreground/[0.04] border border-border/60 px-2 py-1 text-[9.5px]">Here's a working version - try it →</div>
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

  // 18. ChatGPT - Canvas with Export
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
          <div className="text-[11px] font-medium">Studio launch - June 2026</div>
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

  // 19. Manus - completed deliverables
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

  // 20. Gemini - Export to Docs
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
            <div className="text-[9.5px] truncate">Q3 marketing brief - Google Docs</div>
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
// FOOD DELIVERY - 20 brand-evocative screens
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
  // 1. Uber Eats - Imagery carousels
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

  // 2. DoorDash - Popular near you (ranked)
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

  // 3. Grubhub - Local breadth list (many)
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

  // 4. Instacart - Store-first browse (grocery)
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

  // 5. DoorDash - Popular items first
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

  // 6. Deliveroo - Photo menu grid
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

  // 7. Uber Eats - Category tabs sticky
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

  // 8. Instacart - Search items
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

  // 9. Deliveroo - Live total + mods
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

  // 10. Uber Eats - Upsell add-ons
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

  // 11. DoorDash - Group order
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

  // 12. Grubhub - Simple cart
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

  // 13. Uber Eats - One-tap reorder
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

  // 14. DoorDash - Saved + DashPass
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

  // 15. Deliveroo - Clear fees breakdown
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
        <div className="text-[8.5px] text-foreground/55">No hidden fees - what you see is what you pay.</div>
        <CTA>Confirm & pay · £36.69</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "55%", label: "Itemized fees" },
      { n: 2, x: "50%", y: "75%", label: "Total breakdown" },
      { n: 3, x: "50%", y: "85%", label: "Transparency note" },
    ],
  })) as Builder,

  // 16. Grubhub - Guest checkout
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

  // 17. Uber Eats - Reorder shelf
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

  // 18. DoorDash - Subscription perks (DashPass)
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

  // 19. Grubhub - Points / perks
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

  // 20. Deliveroo - Favorites
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
// E-COMMERCE - 20 brand-evocative screens
// ============================================================
const ShopBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Amazon - Forgiving autocomplete
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
      { n: 1, x: "50%", y: "20%", label: "Forgiving - did you mean" },
      { n: 2, x: "50%", y: "55%", label: "Scoped suggestions" },
      { n: 3, x: "50%", y: "94%", label: "Never zero results" },
    ],
  })) as Builder,

  // 2. ASOS - Visual scoped search
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

  // 3. Sephora - Guided beauty search
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

  // 4. IKEA - Room / category search
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

  // 5. ASOS - Fit/size filters grid
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

  // 6. Amazon - Faceted filters dense
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

  // 7. Sephora - Reviews-led grid
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

  // 8. IKEA - Room visualizer grid
  shopIkeaVisualizer: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="text-[11px] font-medium">Sofas - see in a room</div>
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

  // 9. Sephora - Reviews by skin type PDP
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

  // 10. Amazon - Q&A + reviews
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
            ["Q: Works without Wi-Fi?","A: No, Wi-Fi is required for Alexa. - Tom"],
            ["Q: Multiroom audio?","A: Yes, with other Echo devices. - Priya"],
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

  // 11. Nike - Story + media PDP
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

  // 12. IKEA - AR in your room
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

  // 13. Amazon - 1-click
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
        <div className="h-10 rounded-full bg-yellow-400 text-black grid place-items-center text-[12px] font-medium">Buy now - 1-Click</div>
        <div className="h-8 rounded-full border border-border/60 grid place-items-center text-[10px] text-foreground/65">Add to Cart</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Saved address" },
      { n: 2, x: "50%", y: "55%", label: "Saved payment" },
      { n: 3, x: "50%", y: "85%", label: "Single Buy now" },
    ],
  })) as Builder,

  // 14. ASOS - Express wallets
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

  // 15. Nike - Member checkout
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

  // 16. IKEA - Delivery / pickup choice
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

  // 17. ASOS - Free paperless returns + QR
  shopAsosReturns: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="font-display text-[14px]">Return - free & easy</div>
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

  // 18. Amazon - Drop-off network map
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

  // 19. Sephora - Generous returns
  shopSephoraReturns: ((_ctx, _p) => ({
    node: (
      <Frame>
        <ShopBar />
        <div className="font-display text-[14px]">Love it or return it</div>
        <div className="text-[9.5px] text-foreground/65">Up to 60 days - even if it's been opened.</div>
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

  // 20. IKEA - In-store returns
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

// ============================================================
// FINTECH - 20 brand-evocative screens
// ============================================================
const FinBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Monzo - Human KYC
  finMonzoKyc: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FF4F40] grid place-items-center text-white text-[11px] font-bold">M</div>
          <div className="text-[10px] text-foreground/55">Hey Maya 👋</div>
        </div>
        <div className="font-display text-[15px] leading-tight">Let's get you set up - takes about 3 minutes.</div>
        <div className="flex items-center gap-1.5 text-[8.5px] text-foreground/60">
          <span>Step 2 of 4</span>
          <div className="flex-1 h-1 rounded-full bg-foreground/10 overflow-hidden">
            <div className="h-full w-[50%] bg-[#FF4F40] rounded-full" />
          </div>
          <span>50%</span>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          {[
            ["✓","Tell us about you","30s"],
            ["●","Snap your ID","Now - front + back"],
            ["○","Take a quick selfie","20s"],
            ["○","Pick a card colour","Almost there"],
          ].map(([m,t,d],i)=>(
            <div key={i} className={`flex items-center gap-2 p-1.5 rounded-md ${i===1?"bg-[#FF4F40]/10 border border-[#FF4F40]/40":"border border-border/40"}`}>
              <div className={`w-5 h-5 rounded-full grid place-items-center text-[10px] shrink-0 ${i===0?"bg-green-500 text-white":i===1?"bg-[#FF4F40] text-white":"bg-foreground/10"}`}>{m}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{d}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Snap your ID</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Warm progress bar" },
      { n: 2, x: "50%", y: "55%", label: "Friendly steps" },
      { n: 3, x: "50%", y: "94%", label: "One step at a time" },
    ],
  })) as Builder,

  // 2. Revolut - Quick multi-step
  finRevolutMultiStep: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex gap-1">
          {[1,1,1,0,0].map((on,i)=>(
            <div key={i} className={`flex-1 h-1 rounded-full ${on?"bg-foreground":"bg-foreground/15"}`} />
          ))}
        </div>
        <div className="text-[8.5px] text-foreground/55">Step 3 of 5</div>
        <div className="font-display text-[16px] leading-tight">Pick your home currency</div>
        <div className="flex flex-col gap-1">
          {[
            ["GBP","£ British Pound",true],
            ["EUR","€ Euro",false],
            ["USD","$ US Dollar",false],
            ["CHF","Fr Swiss Franc",false],
          ].map(([c,n,sel],i)=>(
            <div key={i} className={`flex items-center gap-2 p-1.5 rounded-md ${sel?"bg-foreground text-background":"border border-border/60"}`}>
              <div className="text-[10px] font-mono">{c}</div>
              <div className="text-[10px] flex-1 truncate">{n}</div>
              {sel && <div className="text-[10px]">✓</div>}
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-gradient-to-br from-foreground/10 to-foreground/5 border border-border/60 p-2 mt-1">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Up next</div>
          <div className="text-[10.5px] font-medium">Hold 30+ currencies</div>
          <div className="text-[8.5px] text-foreground/55">Exchange at the real rate</div>
        </div>
        <div className="flex-1" />
        <CTA>Continue</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Multi-step progress" },
      { n: 2, x: "50%", y: "50%", label: "Quick choice step" },
      { n: 3, x: "50%", y: "78%", label: "Feature highlight between steps" },
    ],
  })) as Builder,

  // 3. Cash App - Minimal signup
  finCashAppMinimal: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-3">
          <div className="w-12 h-12 rounded-xl bg-green-500 grid place-items-center text-white text-[18px] font-bold">$</div>
          <div className="font-display text-[16px] text-center">Sign up for Cash App</div>
          <div className="w-full">
            <div className="h-10 rounded-lg border border-border/60 px-3 grid items-center text-[12px] text-foreground/55">+1 (555) 123-4567</div>
          </div>
          <div className="w-full">
            <div className="h-10 rounded-lg border border-border/60 px-3 grid items-center text-[12px] text-foreground/55">$cashtag</div>
          </div>
          <div className="text-[8.5px] text-foreground/50 text-center">By continuing you agree to our Terms.</div>
        </div>
        <div className="h-11 rounded-full bg-green-500 text-white grid place-items-center text-[12px] font-semibold">Continue</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Single screen" },
      { n: 2, x: "50%", y: "55%", label: "Phone + $cashtag only" },
      { n: 3, x: "50%", y: "94%", label: "One CTA" },
    ],
  })) as Builder,

  // 4. Wise - Transparent setup
  finWiseTransparent: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#9FE870] grid place-items-center text-[10px] font-bold">W</div>
          <div className="text-[11px] font-medium">Wise Account</div>
        </div>
        <div className="font-display text-[14px]">No surprises. Here's exactly what you'll pay.</div>
        <div className="rounded-md border border-border/60 p-2 space-y-1 text-[9.5px]">
          <div className="flex justify-between"><span>Open account</span><span className="font-mono text-green-600">Free</span></div>
          <div className="flex justify-between"><span>Hold 50+ currencies</span><span className="font-mono text-green-600">Free</span></div>
          <div className="flex justify-between"><span>Send £1,000 → EUR</span><span className="font-mono">£3.65</span></div>
          <div className="flex justify-between text-foreground/55"><span>Mid-market rate</span><span className="font-mono">1.1742</span></div>
          <div className="flex justify-between"><span>Debit card (one-time)</span><span className="font-mono">£7.00</span></div>
        </div>
        <div className="rounded-md bg-[#9FE870]/15 border border-[#9FE870]/40 p-2 text-[9.5px]">
          <div className="font-medium">You'll always see fees before you pay.</div>
          <div className="text-foreground/60 text-[8.5px]">No hidden markup on exchange rates.</div>
        </div>
        <div className="flex-1" />
        <CTA>Create my account</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Fees up front" },
      { n: 2, x: "50%", y: "55%", label: "Mid-market rate" },
      { n: 3, x: "50%", y: "78%", label: "Transparency promise" },
    ],
  })) as Builder,

  // 5. Revolut - Balance + quick actions
  finRevolutDash: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 rounded-full bg-foreground text-background grid place-items-center text-[10px] font-bold">R</div>
          <div className="flex gap-1 text-[9px]">
            <Chip>GBP</Chip><Chip>EUR</Chip><Chip>USD</Chip>
          </div>
        </div>
        <div>
          <div className="text-[8.5px] text-foreground/55 uppercase tracking-wider">Personal · GBP</div>
          <div className="font-display text-[22px] leading-none">£4,218.<span className="text-[14px]">52</span></div>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            ["↑","Send"],["+","Add"],["⇄","Exchange"],["↗","Invest"],
          ].map(([ic,l],i)=>(
            <div key={i} className="aspect-square rounded-lg bg-foreground/8 border border-border/60 flex flex-col items-center justify-center gap-0.5">
              <div className="text-[14px]">{ic}</div>
              <div className="text-[8.5px]">{l}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          {[
            ["Stocks","+2.4%","#0080FF"],
            ["Crypto","BTC £52k","#F7931A"],
            ["Vaults","£820 saved","#22c55e"],
            ["Insurance","Active","#a855f7"],
          ].map(([t,s,c],i)=>(
            <div key={i} className="rounded-lg border border-border/40 p-1.5">
              <div className="w-4 h-4 rounded" style={{background:c as string}} />
              <div className="text-[10px] font-medium mt-1 truncate">{t}</div>
              <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Balance header" },
      { n: 2, x: "50%", y: "45%", label: "Quick-action tiles" },
      { n: 3, x: "50%", y: "78%", label: "Feature cards" },
    ],
  })) as Builder,

  // 6. Monzo - Balance + Pots
  finMonzoDash: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-center justify-between">
          <div className="text-[10px]">Hey Maya 👋</div>
          <div className="w-7 h-7 rounded-full bg-[#FF4F40] grid place-items-center text-white text-[10px] font-bold">M</div>
        </div>
        <div>
          <div className="text-[8.5px] text-foreground/55 uppercase tracking-wider">Current account</div>
          <div className="font-display text-[22px] leading-none">£2,184.<span className="text-[14px]">07</span></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-medium">Pots</div>
          <div className="text-[8.5px] text-foreground/55">£3,420 saved</div>
        </div>
        <div className="flex gap-1.5 overflow-hidden">
          {[
            ["Holiday","£820","🏖️","#FFD23F"],
            ["Rainy day","£1,400","☔","#5BB0FF"],
            ["New bike","£600","🚲","#22c55e"],
            ["Emergency","£600","🆘","#FF4F40"],
          ].map(([n,a,e,c],i)=>(
            <div key={i} className="w-[28%] shrink-0 rounded-xl p-2 text-foreground" style={{background:`${c}22`,border:`1px solid ${c}55`}}>
              <div className="text-[14px]">{e}</div>
              <div className="text-[9px] font-medium truncate">{n}</div>
              <div className="text-[9px] font-mono">{a}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium">Recent</div>
        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
          {[
            ["☕","Pret","−£3.40"],
            ["🛒","Sainsbury's","−£28.10"],
            ["💸","From Jordan","+£20.00"],
          ].map(([e,n,a],i)=>(
            <div key={i} className="flex items-center gap-2 py-0.5 text-[10px]">
              <span>{e}</span><span className="flex-1 truncate">{n}</span><span className="font-mono">{a}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Balance" },
      { n: 2, x: "50%", y: "55%", label: "Pots savings" },
      { n: 3, x: "50%", y: "85%", label: "Friendly feed" },
    ],
  })) as Builder,

  // 7. Cash App - Big send button
  finCashAppDash: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-medium">$maya</div>
          <div className="flex gap-1.5 text-[12px]">⚙️ 🔔</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/55">Cash balance</div>
          <div className="font-display text-[34px] leading-none">$124<span className="text-[20px]">.50</span></div>
          <div className="flex gap-1.5 mt-1">
            <Chip>Add Cash</Chip><Chip>Cash Out</Chip>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-12 rounded-full bg-green-500 text-white grid place-items-center text-[13px] font-semibold">Pay</div>
          <div className="h-12 rounded-full border border-green-500 text-green-600 grid place-items-center text-[13px] font-semibold">Request</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "45%", label: "Balance dominates" },
      { n: 2, x: "50%", y: "90%", label: "Big Pay button" },
      { n: 3, x: "50%", y: "10%", label: "$cashtag header" },
    ],
  })) as Builder,

  // 8. Robinhood - Portfolio first
  finRobinhoodDash: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div>
          <div className="text-[8.5px] text-foreground/55 uppercase tracking-wider">Investing</div>
          <div className="font-display text-[22px] leading-none">$12,840.<span className="text-[14px]">22</span></div>
          <div className="text-[10px] text-green-500">▲ $241.18 (+1.92%) today</div>
        </div>
        <div className="relative h-20 rounded-md overflow-hidden">
          <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 L20,55 L40,58 L60,42 L80,48 L100,35 L120,28 L140,32 L160,18 L180,22 L200,10" fill="none" stroke="rgb(34,197,94)" strokeWidth="1.5" />
            <path d="M0,60 L20,55 L40,58 L60,42 L80,48 L100,35 L120,28 L140,32 L160,18 L180,22 L200,10 L200,80 L0,80 Z" fill="rgba(34,197,94,0.12)" />
          </svg>
        </div>
        <div className="flex gap-1 text-[8.5px] justify-between text-foreground/55">
          {["1D","1W","1M","3M","1Y","ALL"].map((p,i)=>(
            <span key={i} className={i===0?"text-green-500 font-medium":""}>{p}</span>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Holdings</div>
        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
          {[
            ["AAPL","12 sh","$2,184","+1.4%","up"],
            ["TSLA","4 sh","$890","−0.8%","down"],
            ["VTI","18 sh","$4,210","+0.6%","up"],
            ["BTC","0.04","$2,624","+2.1%","up"],
          ].map(([s,sh,v,c,d],i)=>(
            <div key={i} className="flex items-center text-[10px] py-0.5 border-b border-border/30">
              <div className="w-12 font-semibold">{s}</div>
              <div className="flex-1 text-foreground/55 text-[8.5px]">{sh}</div>
              <div className="w-14 text-right font-mono">{v}</div>
              <div className={`w-12 text-right font-mono ${d==="up"?"text-green-500":"text-red-500"}`}>{c}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Portfolio value" },
      { n: 2, x: "50%", y: "45%", label: "Performance chart" },
      { n: 3, x: "50%", y: "80%", label: "Holdings list" },
    ],
  })) as Builder,

  // 9. Cash App - $cashtag send
  finCashAppSend: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="text-[10px] text-center text-foreground/55">To $jordan</div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="font-display text-[42px] leading-none">$24</div>
          <div className="text-[9px] text-foreground/55">For coffee ☕</div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k,i)=>(
            <div key={i} className="h-9 rounded-md bg-foreground/[0.04] grid place-items-center text-[14px] font-medium">{k}</div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-10 rounded-full bg-green-500 text-white grid place-items-center text-[12px] font-semibold">Pay</div>
          <div className="h-10 rounded-full border border-green-500 text-green-600 grid place-items-center text-[12px] font-semibold">Request</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "10%", label: "$cashtag recipient" },
      { n: 2, x: "50%", y: "30%", label: "Big amount" },
      { n: 3, x: "50%", y: "62%", label: "Keypad" },
    ],
  })) as Builder,

  // 10. Wise - Transparent FX
  finWiseFx: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="text-[11px] font-medium">You send</div>
        <div className="rounded-md border border-border/60 p-2 flex items-center justify-between">
          <div className="font-display text-[18px]">1,000.00</div>
          <div className="text-[11px] font-mono">🇬🇧 GBP</div>
        </div>
        <div className="text-[8.5px] text-foreground/55 px-1 space-y-0.5">
          <div className="flex justify-between"><span>− Fee</span><span className="font-mono">3.65 GBP</span></div>
          <div className="flex justify-between"><span>= 996.35 GBP × rate</span><span className="font-mono">1.17420</span></div>
        </div>
        <div className="text-[11px] font-medium">Recipient gets</div>
        <div className="rounded-md border border-[#9FE870] bg-[#9FE870]/15 p-2 flex items-center justify-between">
          <div className="font-display text-[18px]">1,169.91</div>
          <div className="text-[11px] font-mono">🇪🇺 EUR</div>
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-2 text-[9.5px] space-y-0.5">
          <div className="flex justify-between"><span>Mid-market rate</span><span className="font-mono">1.17420</span></div>
          <div className="flex justify-between"><span>Arrives</span><span className="font-medium">in ~22 min</span></div>
          <div className="flex justify-between text-green-600"><span>You save vs banks</span><span className="font-mono">£11.40</span></div>
        </div>
        <CTA>Continue · £1,000 → €1,169.91</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "32%", label: "Real rate shown" },
      { n: 2, x: "50%", y: "55%", label: "Recipient amount" },
      { n: 3, x: "50%", y: "80%", label: "Arrival + savings" },
    ],
  })) as Builder,

  // 11. Revolut - Multi-currency
  finRevolutMulti: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="text-[11px] font-medium">Exchange</div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[8.5px] text-foreground/55">From</div>
          <div className="flex items-center justify-between">
            <div className="font-display text-[18px]">£ 500.00</div>
            <div className="text-[10px] font-mono">GBP · £4,218</div>
          </div>
        </div>
        <div className="text-center text-[14px]">⇅</div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[8.5px] text-foreground/55">To</div>
          <div className="flex items-center justify-between">
            <div className="font-display text-[18px]">€ 587.10</div>
            <div className="text-[10px] font-mono">EUR · €120</div>
          </div>
        </div>
        <div className="text-[10px] font-medium mt-1">Your currencies</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["GBP","🇬🇧","£4,218.52"],
            ["EUR","🇪🇺","€120.00"],
            ["USD","🇺🇸","$840.10"],
            ["CHF","🇨🇭","Fr 60.00"],
            ["JPY","🇯🇵","¥18,400"],
          ].map(([c,f,b],i)=>(
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/30 text-[10px]">
              <span>{f} {c}</span>
              <span className="font-mono text-foreground/75">{b}</span>
            </div>
          ))}
        </div>
        <CTA>Exchange · 1 GBP = 1.1742 EUR</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "From currency" },
      { n: 2, x: "50%", y: "40%", label: "To currency" },
      { n: 3, x: "50%", y: "75%", label: "All balances" },
    ],
  })) as Builder,

  // 12. Monzo - Split & request
  finMonzoSplit: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="text-[11px] font-medium">Split the bill</div>
        <div className="rounded-md border border-border/60 p-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-foreground/10 grid place-items-center text-[14px]">🍝</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium truncate">Trattoria San - dinner</div>
            <div className="text-[8.5px] text-foreground/55">Last night · 4 people</div>
          </div>
          <div className="font-mono text-[12px]">£96.00</div>
        </div>
        <div className="text-[10px] font-medium">Request from</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["Jordan","✓","£24.00"],
            ["Aisha","✓","£24.00"],
            ["Sam","✓","£24.00"],
            ["Maya (you)","-","£24.00"],
          ].map(([n,s,a],i)=>(
            <div key={i} className="flex items-center gap-2 p-1.5 border border-border/40 rounded-md">
              <div className="w-7 h-7 rounded-full bg-foreground/10 grid place-items-center text-[10px]">{(n as string)[0]}</div>
              <div className="flex-1 text-[10px] truncate">{n}</div>
              <div className={`w-5 h-5 rounded-full grid place-items-center text-[10px] ${s==="✓"?"bg-[#FF4F40] text-white":"bg-foreground/10 text-foreground/55"}`}>{s}</div>
              <div className="font-mono text-[10px] w-12 text-right">{a}</div>
            </div>
          ))}
        </div>
        <CTA>Send 3 requests · £72.00</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Bill to split" },
      { n: 2, x: "50%", y: "55%", label: "Contacts" },
      { n: 3, x: "50%", y: "94%", label: "Request money" },
    ],
  })) as Builder,

  // 13. Monzo - Auto-categorized + Pots
  finMonzoInsights: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-baseline justify-between">
          <div className="text-[11px] font-medium">Spending · April</div>
          <div className="text-[9px] text-foreground/55">£1,284 of £1,800</div>
        </div>
        <div className="h-2 rounded-full bg-foreground/10 overflow-hidden flex">
          <div className="h-full w-[28%] bg-[#FF4F40]" />
          <div className="h-full w-[18%] bg-[#FFD23F]" />
          <div className="h-full w-[14%] bg-[#5BB0FF]" />
          <div className="h-full w-[10%] bg-[#22c55e]" />
          <div className="h-full w-[8%] bg-[#a855f7]" />
        </div>
        <div className="flex flex-col gap-1">
          {[
            ["🍔","Eating out","£360","#FF4F40"],
            ["🛒","Groceries","£228","#FFD23F"],
            ["🚌","Transport","£180","#5BB0FF"],
            ["🎬","Entertainment","£130","#22c55e"],
            ["🛍️","Shopping","£100","#a855f7"],
          ].map(([e,n,a,c],i)=>(
            <div key={i} className="flex items-center gap-2 text-[10px] py-0.5 border-b border-border/30">
              <div className="w-5 h-5 rounded-full grid place-items-center text-[11px]" style={{background:`${c}22`}}>{e}</div>
              <span className="flex-1 truncate">{n}</span>
              <span className="font-mono">{a}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Pots</div>
        <div className="flex gap-1.5 overflow-hidden">
          {[["Holiday","£820","🏖️"],["Rainy","£1,400","☔"],["Bike","£600","🚲"]].map(([n,a,e],i)=>(
            <div key={i} className="flex-1 rounded-lg p-1.5 bg-foreground/[0.04] border border-border/40">
              <div className="text-[12px]">{e}</div>
              <div className="text-[9px] truncate">{n}</div>
              <div className="text-[9px] font-mono">{a}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Auto stacked bar" },
      { n: 2, x: "50%", y: "55%", label: "By merchant type" },
      { n: 3, x: "50%", y: "88%", label: "Pots beside spend" },
    ],
  })) as Builder,

  // 14. Revolut - Analytics charts
  finRevolutAnalytics: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-baseline justify-between">
          <div className="font-display text-[16px]">£1,284.<span className="text-[11px]">20</span></div>
          <div className="text-[8.5px] text-foreground/55">Apr · vs Mar −8%</div>
        </div>
        <div className="flex items-end gap-1 h-16">
          {[40,55,30,62,48,72,35,58,44,68,50,42].map((h,i)=>(
            <div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`,background:i===5?"hsl(var(--primary))":"hsl(var(--foreground)/0.15)"}} />
          ))}
        </div>
        <div className="text-[8.5px] text-foreground/55 flex justify-between"><span>Mon</span><span>Sun</span></div>
        <div className="text-[10px] font-medium">By category</div>
        <div className="relative w-20 h-20 self-center">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--foreground)/0.1)" strokeWidth="6" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#FF4F40" strokeWidth="6" strokeDasharray="22 88" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#5BB0FF" strokeWidth="6" strokeDasharray="18 88" strokeDashoffset="-22" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="14 88" strokeDashoffset="-40" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#a855f7" strokeWidth="6" strokeDasharray="10 88" strokeDashoffset="-54" />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
          {[["#FF4F40","Eating","25%"],["#5BB0FF","Transport","20%"],["#22c55e","Shopping","16%"],["#a855f7","Other","11%"]].map(([c,n,p],i)=>(
            <div key={i} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{background:c}} />
              <span className="flex-1 truncate">{n}</span><span className="font-mono">{p}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Daily spend chart" },
      { n: 2, x: "50%", y: "62%", label: "Category donut" },
      { n: 3, x: "50%", y: "90%", label: "Breakdown" },
    ],
  })) as Builder,

  // 15. Wise - Fee breakdown
  finWiseFees: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="text-[11px] font-medium">Transfer breakdown</div>
        <div className="text-[9px] text-foreground/55">£1,000.00 → EUR · Apr 12</div>
        <div className="rounded-md border border-border/60 p-2 text-[10px] space-y-1.5">
          <div className="flex justify-between"><span>You send</span><span className="font-mono">£1,000.00</span></div>
          <div className="flex justify-between text-foreground/60"><span>Fixed fee</span><span className="font-mono">£1.50</span></div>
          <div className="flex justify-between text-foreground/60"><span>Variable fee (0.21%)</span><span className="font-mono">£2.15</span></div>
          <div className="flex justify-between pt-1 border-t border-border/40"><span>Total fee</span><span className="font-mono">£3.65</span></div>
          <div className="flex justify-between text-foreground/60"><span>Amount converted</span><span className="font-mono">£996.35</span></div>
          <div className="flex justify-between text-foreground/60"><span>× Mid-market rate</span><span className="font-mono">1.17420</span></div>
          <div className="flex justify-between font-medium pt-1 border-t border-border/40"><span>Recipient gets</span><span className="font-mono">€1,169.91</span></div>
        </div>
        <div className="rounded-md bg-[#9FE870]/15 border border-[#9FE870]/40 p-2 text-[9.5px]">
          <div className="flex justify-between"><span>Bank would charge</span><span className="font-mono line-through">£15.05</span></div>
          <div className="flex justify-between text-green-700 font-medium"><span>You saved</span><span className="font-mono">£11.40</span></div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Itemized fees" },
      { n: 2, x: "50%", y: "68%", label: "Mid-market rate" },
      { n: 3, x: "50%", y: "90%", label: "Bank comparison" },
    ],
  })) as Builder,

  // 16. Robinhood - Gain/loss focus
  finRobinhoodGains: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div>
          <div className="text-[8.5px] text-foreground/55 uppercase tracking-wider">Total return</div>
          <div className="font-display text-[24px] leading-none text-green-500">+$1,842.18</div>
          <div className="text-[10px] text-green-500">+16.7% all time</div>
        </div>
        <div className="rounded-md border border-border/60 p-2 flex gap-2 text-[10px]">
          <div className="flex-1">
            <div className="text-foreground/55 text-[8.5px]">Today</div>
            <div className="text-green-500 font-mono">+$24.18</div>
          </div>
          <div className="flex-1">
            <div className="text-foreground/55 text-[8.5px]">Week</div>
            <div className="text-red-500 font-mono">−$58.42</div>
          </div>
          <div className="flex-1">
            <div className="text-foreground/55 text-[8.5px]">Month</div>
            <div className="text-green-500 font-mono">+$312.10</div>
          </div>
        </div>
        <div className="text-[10px] font-medium">Best & worst</div>
        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
          {[
            ["NVDA","+$842","+42.1%","up"],
            ["AAPL","+$218","+11.4%","up"],
            ["VTI","+$120","+3.8%","up"],
            ["TSLA","−$98","−4.2%","down"],
            ["META","−$42","−2.1%","down"],
          ].map(([s,v,p,d],i)=>(
            <div key={i} className="flex items-center text-[10px] py-1 border-b border-border/30">
              <div className={`w-1 h-5 rounded-full ${d==="up"?"bg-green-500":"bg-red-500"}`} />
              <div className="w-12 font-semibold pl-2">{s}</div>
              <div className={`flex-1 text-right font-mono ${d==="up"?"text-green-500":"text-red-500"}`}>{v}</div>
              <div className={`w-14 text-right font-mono ${d==="up"?"text-green-500":"text-red-500"}`}>{p}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Total return" },
      { n: 2, x: "50%", y: "42%", label: "Day/week/month" },
      { n: 3, x: "50%", y: "75%", label: "Red/green movers" },
    ],
  })) as Builder,

  // 17. Monzo - Goals & nudges
  finMonzoGoals: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="text-[11px] font-medium">Savings goals</div>
        <div className="flex flex-col gap-1.5">
          {[
            ["🏖️","Holiday in Lisbon","£820","£1,500","#FFD23F",55],
            ["🚲","New road bike","£600","£900","#22c55e",67],
            ["☔","Rainy day fund","£1,400","£2,000","#5BB0FF",70],
          ].map(([e,n,c,t,col,pct],i)=>(
            <div key={i} className="rounded-lg p-2 border border-border/40">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full grid place-items-center text-[14px]" style={{background:`${col}22`}}>{e}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium truncate">{n}</div>
                  <div className="text-[8.5px] text-foreground/55">{c} of {t}</div>
                </div>
                <div className="text-[9px] font-mono">{pct}%</div>
              </div>
              <div className="h-1.5 rounded-full bg-foreground/10 mt-1 overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${pct}%`,background:col as string}} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md bg-[#FF4F40]/10 border border-[#FF4F40]/30 p-2 mt-1">
          <div className="text-[10px] font-medium">Add £40 to hit Lisbon by July 🎉</div>
          <div className="text-[8.5px] text-foreground/60">Round-ups would get you there in 6 weeks.</div>
        </div>
        <div className="flex-1" />
        <CTA>Add to a goal</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Goal progress" },
      { n: 2, x: "50%", y: "70%", label: "Goal stack" },
      { n: 3, x: "50%", y: "85%", label: "Gentle nudge" },
    ],
  })) as Builder,

  // 18. Revolut - Tiers & perks
  finRevolutTiers: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="text-[11px] font-medium">Your plan</div>
        <div className="flex flex-col gap-1.5 flex-1">
          {[
            ["Standard","Free","Free FX up to £1k/mo","#9ca3af",false],
            ["Premium","£6.99/mo","Unlimited FX · travel insurance","#3b82f6",true],
            ["Metal","£12.99/mo","1% cashback · metal card · lounge","#1f2937",false],
            ["Ultra","£45/mo","Concierge · best rates · airport lounges","#c9a84c",false],
          ].map(([t,p,pe,c,cur],i)=>(
            <div key={i} className={`rounded-lg p-2 ${cur?"border-2":"border"} border-border/60 relative`} style={cur?{borderColor:c as string}:{}}>
              {cur && <div className="absolute -top-1.5 right-2 text-[7.5px] px-1.5 py-0.5 rounded-full text-white" style={{background:c as string}}>CURRENT</div>}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-semibold">{t}</div>
                  <div className="text-[8.5px] text-foreground/55 truncate">{pe}</div>
                </div>
                <div className="text-[10px] font-mono" style={{color:c as string}}>{p}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Upgrade to Metal</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Tier ladder" },
      { n: 2, x: "50%", y: "55%", label: "Current tier" },
      { n: 3, x: "50%", y: "94%", label: "Upgrade path" },
    ],
  })) as Builder,

  // 19. Cash App - Boosts
  finCashAppBoosts: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">Boosts</div>
          <div className="text-[8.5px] text-foreground/55">1 active</div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-green-500/25 to-green-500/5 border border-green-500/40 p-2">
          <div className="text-[8.5px] text-green-600 uppercase tracking-wider">Active boost</div>
          <div className="text-[12px] font-semibold mt-0.5">15% off at Starbucks ☕</div>
          <div className="text-[8.5px] text-foreground/60">Up to $7 off · expires in 4 days</div>
        </div>
        <div className="text-[10px] font-medium mt-1">Pick a boost</div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["10% off","Chipotle","🌯","#A81612"],
            ["$1 off","DoorDash","🥡","#FF3008"],
            ["5% back","Whole Foods","🥬","#00674B"],
            ["15% off","Spotify","🎧","#1DB954"],
            ["$2 off","Uber","🚗","#000000"],
            ["8% back","Lyft","🚕","#FF00BF"],
          ].map(([d,b,e,c],i)=>(
            <div key={i} className="rounded-lg p-1.5 border border-border/40 flex flex-col gap-0.5">
              <div className="w-6 h-6 rounded-md grid place-items-center text-[12px]" style={{background:`${c}22`}}>{e}</div>
              <div className="text-[9.5px] font-semibold">{d}</div>
              <div className="text-[8.5px] text-foreground/55 truncate">at {b}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Active boost" },
      { n: 2, x: "50%", y: "65%", label: "Boost grid" },
      { n: 3, x: "50%", y: "85%", label: "Cashback offers" },
    ],
  })) as Builder,

  // 20. Robinhood - Streaks & alerts
  finRobinhoodAlerts: ((_ctx, _p) => ({
    node: (
      <Frame>
        <FinBar />
        <div className="rounded-lg p-2 bg-gradient-to-br from-green-500/25 to-green-500/5 border border-green-500/40">
          <div className="text-[8.5px] uppercase tracking-wider text-green-600">Streak</div>
          <div className="flex items-baseline gap-2">
            <div className="font-display text-[22px]">12</div>
            <div className="text-[9px] text-foreground/65">days logged in 🔥</div>
          </div>
          <div className="flex gap-1 mt-1">
            {Array.from({length:7}).map((_,i)=>(
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i<5?"bg-green-500":"bg-foreground/15"}`} />
            ))}
          </div>
        </div>
        <div className="text-[10px] font-medium mt-1">Market alerts</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["🔔","NVDA hit $850 target","2m ago","up"],
            ["📈","S&P 500 +1.2% today","12m ago","up"],
            ["📉","TSLA down 5% - your alert","1h ago","down"],
            ["💰","Earnings: AAPL after close","3h ago","neutral"],
            ["🔔","BTC crossed $52k","yesterday","up"],
          ].map(([e,t,when,d],i)=>(
            <div key={i} className="flex items-start gap-2 p-1.5 rounded-md border border-border/40">
              <div className="w-6 h-6 rounded-full bg-foreground/8 grid place-items-center text-[11px] shrink-0">{e}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55">{when}</div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${d==="up"?"bg-green-500":d==="down"?"bg-red-500":"bg-foreground/30"}`} />
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Login streak" },
      { n: 2, x: "50%", y: "55%", label: "Market alerts" },
      { n: 3, x: "90%", y: "55%", label: "Up/down dot" },
    ],
  })) as Builder,
});

// ============================================================
// STREAMING - 20 brand-evocative screens
// ============================================================
const StreamBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Netflix - Pick titles
  streamNetflixPickTitles: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="font-display text-[14px] text-red-600">Pick 3 you love</div>
        <div className="text-[9px] text-foreground/60">We'll build your recommendations.</div>
        <div className="grid grid-cols-3 gap-1.5 flex-1 overflow-hidden">
          {Array.from({length:9}).map((_,i)=>(
            <div key={i} className={`relative rounded overflow-hidden border ${i===0||i===4||i===7?"border-red-600 border-2":"border-border/40"}`}>
              <Photo seed={i} className="w-full h-full min-h-[44px]" />
              <div className="absolute bottom-0 inset-x-0 bg-background/80 text-[8px] px-1 truncate">{["Stranger Things","The Crown","Squid Game","Wednesday","Bridgerton","Witcher","Dark","Ozark","Mindhunter"][i]}</div>
              {(i===0||i===4||i===7) && <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] grid place-items-center">✓</div>}
            </div>
          ))}
        </div>
        <div className="text-[9px] text-center text-foreground/55">3 of 3 selected</div>
        <CTA>Continue</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Pick favourites" },
      { n: 2, x: "50%", y: "50%", label: "Poster grid" },
      { n: 3, x: "50%", y: "82%", label: "Counter" },
    ],
  })) as Builder,

  // 2. Spotify - Pick artists
  streamSpotifyArtists: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="font-display text-[14px] text-[#1DB954]">Tap 5 artists you like</div>
        <div className="h-7 rounded-full bg-foreground/8 px-2 grid items-center text-[10px] text-foreground/55">Search artists</div>
        <div className="grid grid-cols-3 gap-2 flex-1 overflow-hidden">
          {[
            "Radiohead","Frank Ocean","Tame Impala","SZA","Mac DeMarco",
            "Phoebe Bridgers","Caroline P.","Big Thief","Beach House","Khruangbin",
            "Mitski","Bon Iver"
          ].map((n,i)=>{
            const sel = [0,2,5,8,10].includes(i);
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className={`relative w-12 h-12 rounded-full overflow-hidden ${sel?"ring-2 ring-[#1DB954]":""}`}>
                  <Photo seed={i} className="w-full h-full" />
                  {sel && <div className="absolute inset-0 bg-[#1DB954]/40 grid place-items-center text-white text-[14px]">✓</div>}
                </div>
                <div className="text-[8.5px] truncate w-full text-center">{n}</div>
              </div>
            );
          })}
        </div>
        <CTA>Done · 5 picked</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Pick artists" },
      { n: 2, x: "50%", y: "55%", label: "Artist circles" },
      { n: 3, x: "20%", y: "55%", label: "Tap to select" },
    ],
  })) as Builder,

  // 3. YouTube - Infer from history
  streamYouTubeInfer: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded grid place-items-center bg-red-600 text-white text-[11px]">▶</div>
          <div className="text-[11px] font-medium">Setting up your feed</div>
        </div>
        <div className="text-[9.5px] text-foreground/65">We'll learn from what you watch - no quiz needed.</div>
        <div className="rounded-md bg-foreground/[0.04] border border-border/60 p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Detected from watch history</div>
          <div className="flex gap-1 flex-wrap mt-1">
            {["Web dev","Lo-fi","Cooking","F1","Standup","Synth"].map((c,i)=>(
              <Chip key={i} accent={i<3}>{c}</Chip>
            ))}
          </div>
        </div>
        <div className="text-[10px] font-medium mt-1">Recommended for you</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Build a TanStack app","Theo · 12 min","320K"],
            ["Lo-fi study mix","Chillhop · 1:02:14","2.4M"],
            ["30-min weeknight dinner","Bon Appétit · 8:42","890K"],
          ].map(([t,ch,v],i)=>(
            <div key={i} className="flex gap-1.5">
              <Photo seed={i} className="w-14 h-9 rounded shrink-0" />
              <div className="min-w-0">
                <div className="text-[9.5px] truncate">{t}</div>
                <div className="text-[8px] text-foreground/55 truncate">{ch} · {v} views</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Looks good</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "No quiz needed" },
      { n: 2, x: "50%", y: "40%", label: "Inferred topics" },
      { n: 3, x: "50%", y: "75%", label: "Recommendations live" },
    ],
  })) as Builder,

  // 4. Disney+ - Brand hubs
  streamDisneyHubs: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="font-display text-[15px]">What do you love?</div>
        <div className="text-[9px] text-foreground/55">Pick brand hubs to follow.</div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Disney","#0066CC","castle"],
            ["Pixar","#FFCC00","lamp"],
            ["Marvel","#EC1D24","★"],
            ["Star Wars","#000000","✦"],
            ["National Geographic","#FFCC00","◧"],
            ["Star","#1A1A2E","✷"],
          ].map(([n,c,ic],i)=>(
            <div key={i} className="relative rounded-lg overflow-hidden flex flex-col items-center justify-center gap-1 text-white aspect-[3/2]" style={{background:`linear-gradient(135deg, ${c}, ${c}88)`}}>
              <div className="text-[18px]">{ic}</div>
              <div className="font-display text-[11px] tracking-wider uppercase">{n}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Brand hubs" },
      { n: 2, x: "30%", y: "55%", label: "Pixar/Marvel etc" },
      { n: 3, x: "70%", y: "80%", label: "Tap to follow" },
    ],
  })) as Builder,

  // 5. Netflix - Personalized rows
  streamNetflixRows: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center justify-between -mx-3.5 -mt-3 px-3.5 py-1.5">
          <div className="text-red-600 font-display text-[13px] tracking-wider">NETFLIX</div>
          <div className="flex gap-2 text-[9px] text-foreground/70">TV · Movies · My List</div>
        </div>
        <Photo seed={1} className="h-20 -mx-3.5 flex items-end p-2">
          <div>
            <div className="font-display text-[14px] text-white drop-shadow">Stranger Things 5</div>
            <div className="text-[8.5px] text-white/80">▶ Play · + My List</div>
          </div>
        </Photo>
        <div className="text-[10px] font-medium">Because you watched Dark</div>
        <div className="flex gap-1 overflow-hidden">
          {[0,1,2,3,4].map(i=>(
            <Photo key={i} seed={i} className="w-12 h-16 rounded shrink-0" />
          ))}
        </div>
        <div className="text-[10px] font-medium">Trending now</div>
        <div className="flex gap-1 overflow-hidden">
          {[2,3,4,0,1].map((s,i)=>(
            <div key={i} className="relative">
              <Photo seed={s} className="w-12 h-16 rounded" />
              <div className="absolute -bottom-1 -left-1 font-display text-[20px] text-foreground/80 drop-shadow">{i+1}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium">Critically acclaimed dramas</div>
        <div className="flex gap-1 overflow-hidden">
          {[1,3,2,4,0].map((s,i)=>(
            <Photo key={i} seed={s} className="w-12 h-16 rounded shrink-0" />
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Hero billboard" },
      { n: 2, x: "50%", y: "55%", label: "Because you watched…" },
      { n: 3, x: "50%", y: "78%", label: "Top 10 ranks" },
    ],
  })) as Builder,

  // 6. Spotify - Named playlists
  streamSpotifyPlaylists: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="font-display text-[14px]">Good evening</div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["Discover Weekly","#7873F5"],
            ["Daily Mix 1","#1DB954"],
            ["Daylist · sunset","#FF6B6B"],
            ["Release Radar","#F472B6"],
          ].map(([n,c],i)=>(
            <div key={i} className="h-9 rounded-md overflow-hidden flex items-center gap-1.5 pr-2 bg-foreground/[0.04]">
              <div className="w-9 h-9" style={{background:`linear-gradient(135deg, ${c}, ${c}55)`}} />
              <div className="text-[9.5px] font-medium truncate">{n}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Made for Maya</div>
        <div className="flex gap-1.5 overflow-hidden flex-1">
          {[
            ["Discover Weekly","Your weekly mixtape","#7873F5"],
            ["Daylist · golden hour","Indie · mellow","#F59E0B"],
            ["Release Radar","New from artists you follow","#F472B6"],
            ["Mix · Phoebe Bridgers","Indie folk","#1DB954"],
          ].map(([n,d,c],i)=>(
            <div key={i} className="w-[42%] shrink-0 rounded-md overflow-hidden">
              <div className="aspect-square w-full" style={{background:`linear-gradient(135deg, ${c}, ${c}33)`}}>
                <div className="p-1.5 font-display text-[10px] text-white leading-tight">{n}</div>
              </div>
              <div className="text-[8.5px] text-foreground/55 mt-0.5 truncate">{d}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Named playlists" },
      { n: 2, x: "50%", y: "70%", label: "Cover art" },
      { n: 3, x: "50%", y: "85%", label: "Made for you" },
    ],
  })) as Builder,

  // 7. Disney+ - Franchise tiles
  streamDisneyFranchise: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="font-display text-[13px]">Browse by universe</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Marvel Cinematic Universe","33 films · 12 series","#EC1D24","★"],
            ["Star Wars Galaxy","11 films · 8 series","#000000","✦"],
            ["Pixar Vault","27 features · 18 shorts","#FFCC00","💡"],
            ["Walt Disney Animation","60+ classics","#0066CC","🏰"],
          ].map(([t,c,col,ic],i)=>(
            <div key={i} className="relative rounded-lg overflow-hidden h-12 flex items-center p-2 gap-2 text-white" style={{background:`linear-gradient(90deg, ${col}, ${col}66)`}}>
              <div className="text-[18px]">{ic}</div>
              <div className="min-w-0">
                <div className="font-display text-[11px] tracking-wider uppercase truncate">{t}</div>
                <div className="text-[8px] opacity-80 truncate">{c}</div>
              </div>
              <div className="ml-auto text-[14px]">›</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Franchise tiles" },
      { n: 2, x: "50%", y: "55%", label: "Browse by universe" },
      { n: 3, x: "85%", y: "55%", label: "Drill in" },
    ],
  })) as Builder,

  // 8. Twitch - Live now
  streamTwitchLive: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#9146FF]" />
          <div className="text-[11px] font-medium">Live now</div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["pokimane","Just Chatting","42.1K"],
            ["shroud","Valorant","28.7K"],
            ["xqc","GTA RP","61.3K"],
            ["sodapoppin","Among Us","14.2K"],
            ["lirik","Helldivers 2","19.8K"],
            ["amouranth","IRL","22.5K"],
          ].map(([who,cat,v],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/40 flex flex-col">
              <Photo seed={i} className="flex-1 min-h-[44px] relative">
                <div className="absolute top-1 left-1 bg-red-600 text-white text-[7.5px] font-bold px-1 rounded">● LIVE</div>
                <div className="absolute bottom-1 left-1 bg-background/80 text-[8px] px-1 rounded">👥 {v}</div>
              </Photo>
              <div className="px-1.5 py-1">
                <div className="text-[9.5px] font-medium truncate">{who}</div>
                <div className="text-[8px] text-foreground/55 truncate">{cat}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "30%", label: "LIVE badge" },
      { n: 2, x: "30%", y: "50%", label: "Viewer count" },
      { n: 3, x: "70%", y: "75%", label: "Streamer + game" },
    ],
  })) as Builder,

  // 9. YouTube - Predictive at scale
  streamYouTubeSearch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="h-8 rounded-full bg-foreground/8 px-2 flex items-center gap-1.5 text-[10px]">
          <span>🔍</span><span className="flex-1">how to make </span><span className="text-foreground/45">🎤</span>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          {[
            ["how to make sourdough bread","48M results"],
            ["how to make sourdough starter","12M results"],
            ["how to make pizza dough","21M results"],
            ["how to make a tanstack start app","320K results"],
            ["how to make money online","98M results"],
            ["how to make pasta from scratch","8.4M results"],
            ["how to make cold brew coffee","3.2M results"],
            ["how to make ramen","6.1M results"],
          ].map(([q,r],i)=>(
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/30 text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-foreground/45">🔍</span>
                <span className="truncate"><b>how to make </b>{q.replace('how to make ','')}</span>
              </div>
              <span className="text-[8px] text-foreground/45 shrink-0">{r}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Predictive bar" },
      { n: 2, x: "50%", y: "50%", label: "Huge catalog" },
      { n: 3, x: "85%", y: "50%", label: "Result counts" },
    ],
  })) as Builder,

  // 10. Netflix - Title + genre
  streamNetflixSearch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="h-8 rounded-md bg-foreground/8 px-2 flex items-center gap-1.5 text-[10px]">
          <span>🔍</span><span className="flex-1">Search titles, people, genres</span>
        </div>
        <div className="flex gap-1 overflow-hidden">
          {["Thrillers","Comedy","K-drama","Sci-Fi","Anime","Docs"].map((g,i)=>(
            <Chip key={i} accent={i===0}>{g}</Chip>
          ))}
        </div>
        <div className="text-[10px] font-medium">Top searches</div>
        <div className="grid grid-cols-3 gap-1 flex-1 overflow-hidden">
          {Array.from({length:9}).map((_,i)=>(
            <div key={i} className="relative">
              <Photo seed={i} className="w-full h-full min-h-[36px] rounded" />
              <div className="absolute inset-x-0 bottom-0 text-[8px] bg-background/80 px-1 truncate">{["Wednesday","Dark","Ozark","The Crown","Bridgerton","Witcher","Squid Game","Beef","Mindhunter"][i]}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Search bar" },
      { n: 2, x: "50%", y: "22%", label: "Genre chips" },
      { n: 3, x: "50%", y: "65%", label: "Top searches" },
    ],
  })) as Builder,

  // 11. Spotify - Songs + podcasts tabs
  streamSpotifySearch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="h-8 rounded-md bg-foreground/8 px-2 flex items-center gap-1.5 text-[10px]">
          <span>🔍</span><span className="flex-1">phoebe bridgers</span>
        </div>
        <div className="flex gap-3 text-[10px] border-b border-border/60">
          {["Top","Songs","Artists","Albums","Podcasts","Playlists"].map((t,i)=>(
            <span key={i} className={i===1?"font-medium border-b-2 border-[#1DB954] pb-1 -mb-px":"text-foreground/55 pb-1"}>{t}</span>
          ))}
        </div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["♪","Motion Sickness","Phoebe Bridgers · 4:03"],
            ["♪","Kyoto","Phoebe Bridgers · 3:04"],
            ["♪","Scott Street","Phoebe Bridgers · 5:11"],
            ["🎙️","The Phoebe Pod","Podcast · 42 ep"],
            ["♪","I Know The End","Phoebe Bridgers · 5:43"],
            ["♪","Funeral","Phoebe Bridgers · 4:11"],
          ].map(([ic,t,d],i)=>(
            <div key={i} className="flex items-center gap-2 py-0.5">
              <div className="w-8 h-8 rounded bg-foreground/10 grid place-items-center text-[12px]">{ic}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{d}</div>
              </div>
              <span className="text-[12px] text-foreground/50">⋯</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Songs/podcasts tabs" },
      { n: 2, x: "30%", y: "22%", label: "Active tab" },
      { n: 3, x: "50%", y: "60%", label: "Mixed results" },
    ],
  })) as Builder,

  // 12. Twitch - Categories / games
  streamTwitchCategories: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="text-[11px] font-medium">Browse</div>
        <div className="flex gap-1 overflow-hidden">
          {["Categories","Streams","Esports"].map((c,i)=>(
            <Chip key={i} accent={i===0}>{c}</Chip>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Just Chatting","248K viewers"],
            ["League of Legends","182K viewers"],
            ["Valorant","138K viewers"],
            ["GTA V","98K viewers"],
            ["Fortnite","76K viewers"],
            ["Minecraft","54K viewers"],
          ].map(([g,v],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/40 flex">
              <Photo seed={i} className="w-10 h-14 shrink-0" />
              <div className="p-1.5 min-w-0 flex-1">
                <div className="text-[9.5px] font-medium truncate">{g}</div>
                <div className="text-[8px] text-foreground/55 truncate">👥 {v}</div>
                <div className="flex gap-0.5 mt-0.5">
                  <Chip>FPS</Chip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Browse by category" },
      { n: 2, x: "30%", y: "55%", label: "Game tiles" },
      { n: 3, x: "70%", y: "75%", label: "Viewer counts" },
    ],
  })) as Builder,

  // 13. YouTube - Speed / captions / PiP
  streamYouTubePlayer: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="relative -mx-3.5 -mt-3 aspect-video bg-foreground/90 grid place-items-center">
          <div className="text-background text-[24px]">▶</div>
          <div className="absolute top-1.5 right-1.5 flex gap-1 text-background text-[10px]">
            <div className="w-5 h-5 rounded grid place-items-center bg-foreground/60">⊟</div>
            <div className="w-5 h-5 rounded grid place-items-center bg-foreground/60">CC</div>
            <div className="w-5 h-5 rounded grid place-items-center bg-foreground/60">⚙</div>
          </div>
          <div className="absolute bottom-0 inset-x-0 px-1.5 pb-1">
            <div className="h-0.5 bg-red-600 w-[40%]" />
            <div className="h-0.5 bg-foreground/30" />
          </div>
        </div>
        <div className="text-[10.5px] font-medium mt-1">Build a TanStack Start app from scratch</div>
        <div className="text-[8.5px] text-foreground/55">Theo · 320K views · 2 days ago</div>
        <div className="rounded-md border border-border/60 p-2 text-[9.5px] space-y-1">
          <div className="flex justify-between"><span>Speed</span><span className="font-medium">1.5×</span></div>
          <div className="flex justify-between"><span>Captions</span><span className="font-medium">English (auto)</span></div>
          <div className="flex justify-between"><span>Quality</span><span className="font-medium">1080p</span></div>
          <div className="flex justify-between"><span>Picture-in-picture</span><span className="font-medium">On</span></div>
        </div>
        <div className="text-[10px] font-medium mt-1">Up next</div>
        <div className="flex gap-1.5">
          <Photo seed={2} className="w-14 h-9 rounded shrink-0" />
          <div className="text-[9px] truncate">Server functions deep dive · Theo</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "15%", label: "Speed/CC/PiP" },
      { n: 2, x: "50%", y: "55%", label: "Player controls" },
      { n: 3, x: "50%", y: "85%", label: "Up next" },
    ],
  })) as Builder,

  // 14. Netflix - Autoplay next
  streamNetflixAutoplay: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="relative -mx-3.5 -mt-3 aspect-video bg-foreground/90 grid place-items-center">
          <div className="text-background text-[22px]">▶</div>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600 w-[97%]" />
          <div className="absolute bottom-2 right-2 bg-background/95 rounded-md p-1.5 flex items-center gap-1.5 max-w-[58%]">
            <Photo seed={2} className="w-9 h-12 rounded shrink-0" />
            <div className="min-w-0">
              <div className="text-[7px] text-foreground/55 uppercase tracking-wider">Up next in 8s</div>
              <div className="text-[9px] font-medium truncate">E04 · The Vanishing</div>
              <div className="flex gap-1 mt-0.5">
                <div className="text-[7px] px-1 py-0.5 rounded bg-foreground text-background">Play now</div>
                <div className="text-[7px] px-1 py-0.5 rounded border border-border">Cancel</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[10.5px] font-medium mt-1">Stranger Things · S5 E03</div>
        <div className="text-[8.5px] text-foreground/55">The Disappearance of Will Byers</div>
        <div className="text-[10px] font-medium mt-1">Episodes</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["E03 · The Disappearance","48m","now"],
            ["E04 · The Vanishing","52m","next"],
            ["E05 · The Flea & the Acrobat","49m","-"],
          ].map(([t,d,s],i)=>(
            <div key={i} className={`flex items-center gap-2 p-1 rounded border ${i===0?"border-red-600":"border-border/30"}`}>
              <Photo seed={i} className="w-12 h-7 rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[9.5px] truncate">{t}</div>
                <div className="text-[8px] text-foreground/55">{d} · {s}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "70%", y: "25%", label: "Autoplay overlay" },
      { n: 2, x: "85%", y: "30%", label: "Countdown" },
      { n: 3, x: "50%", y: "85%", label: "Episode queue" },
    ],
  })) as Builder,

  // 15. Spotify - Queue + now playing
  streamSpotifyQueue: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <Photo seed={2} className="w-32 h-32 rounded self-center" />
        <div className="text-center">
          <div className="font-display text-[14px]">Motion Sickness</div>
          <div className="text-[9px] text-foreground/55">Phoebe Bridgers · Stranger in the Alps</div>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono text-foreground/55">
          <span>1:42</span>
          <div className="flex-1 h-0.5 rounded-full bg-foreground/15 relative">
            <div className="absolute inset-y-0 left-0 w-[42%] bg-[#1DB954] rounded-full" />
            <div className="absolute -top-1 left-[42%] w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
          </div>
          <span>4:03</span>
        </div>
        <div className="flex justify-center gap-4 text-[14px] text-foreground/75">⤺ ⏮ <span className="text-[20px]">⏯</span> ⏭ ⤻</div>
        <div className="rounded-md border border-border/60 p-1.5 text-[9px]">
          <div className="flex justify-between text-foreground/55"><span>Crossfade</span><span>6s</span></div>
        </div>
        <div className="text-[10px] font-medium">Queue · Next up</div>
        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
          {[
            ["Kyoto","Phoebe Bridgers"],
            ["Scott Street","Phoebe Bridgers"],
            ["I Know The End","Phoebe Bridgers"],
          ].map(([t,a],i)=>(
            <div key={i} className="flex items-center gap-2 py-0.5 text-[9.5px]">
              <span className="text-foreground/45">≡</span>
              <span className="flex-1 truncate">{t}</span>
              <span className="text-foreground/55 text-[8.5px] truncate">{a}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Now playing" },
      { n: 2, x: "50%", y: "70%", label: "Crossfade" },
      { n: 3, x: "50%", y: "88%", label: "Queue" },
    ],
  })) as Builder,

  // 16. Twitch - Live chat overlay
  streamTwitchChat: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="relative -mx-3.5 -mt-3 aspect-video bg-foreground/90 grid place-items-center">
          <div className="text-background text-[20px]">▶</div>
          <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">● LIVE</div>
          <div className="absolute top-1.5 right-1.5 bg-background/70 text-foreground text-[8px] px-1.5 py-0.5 rounded">👥 42.1K</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#9146FF]" />
          <div className="text-[10px] font-medium truncate flex-1">pokimane</div>
          <div className="text-[8.5px] px-1.5 py-0.5 rounded bg-[#9146FF] text-white">Follow</div>
        </div>
        <div className="text-[9px] text-foreground/55 truncate">Just Chatting · 4 hrs</div>
        <div className="rounded-md border border-border/60 flex-1 flex flex-col overflow-hidden">
          <div className="text-[8.5px] px-2 py-1 border-b border-border/40 font-medium">Stream chat</div>
          <div className="flex-1 px-2 py-1 flex flex-col gap-0.5 overflow-hidden text-[9px]">
            {[
              ["maya_92","#FF4F40","PogChamp"],
              ["jordan.k","#5BB0FF","first time here, love this"],
              ["aisha","#22c55e","LULW LULW"],
              ["sam","#a855f7","KEKW"],
              ["chillvibes","#F472B6","poki when stream tonight?"],
              ["xrunner","#FFD23F","Kappa Kappa Kappa"],
              ["mod_bot","#9146FF","Welcome to the stream!"],
            ].map(([u,c,m],i)=>(
              <div key={i} className="truncate">
                <span className="font-semibold" style={{color:c}}>{u}</span>
                <span className="text-foreground/65">: {m}</span>
              </div>
            ))}
          </div>
          <div className="h-6 border-t border-border/40 px-2 grid items-center text-[9px] text-foreground/45">Send a message…</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Live video" },
      { n: 2, x: "50%", y: "65%", label: "Live chat" },
      { n: 3, x: "50%", y: "92%", label: "Send message" },
    ],
  })) as Builder,

  // 17. Netflix - New & Popular
  streamNetflixNewRow: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-2">
          <div className="text-red-600 font-display text-[12px] tracking-wider">NETFLIX</div>
          <div className="text-[9.5px] font-medium">New & Popular</div>
        </div>
        <div className="flex gap-2 text-[9px] text-foreground/70 border-b border-border/60">
          <span className="font-medium border-b-2 border-white pb-1 -mb-px">Coming soon</span>
          <span className="pb-1 text-foreground/55">Everyone's watching</span>
          <span className="pb-1 text-foreground/55">Top 10</span>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Apr 28","Wednesday S2","Mystery · Comedy"],
            ["May 02","Bridgerton S4","Drama · Romance"],
            ["May 10","Squid Game S3","Thriller"],
            ["May 15","Stranger Things 5","Sci-fi · Drama"],
          ].map(([d,t,g],i)=>(
            <div key={i} className="flex gap-2">
              <div className="w-10 text-center">
                <div className="text-[8px] text-foreground/55 uppercase">{(d as string).split(' ')[0]}</div>
                <div className="font-display text-[16px] leading-none">{(d as string).split(' ')[1]}</div>
              </div>
              <Photo seed={i} className="w-20 h-12 rounded shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{g}</div>
                <div className="text-[8px] text-red-600 mt-0.5">🔔 Remind me</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "New & Popular tab" },
      { n: 2, x: "50%", y: "55%", label: "Fresh releases" },
      { n: 3, x: "75%", y: "75%", label: "Remind me" },
    ],
  })) as Builder,

  // 18. Spotify - Wrapped & daylist
  streamSpotifyWrapped: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="rounded-xl p-3 -mx-1 bg-gradient-to-br from-[#7873F5] via-[#F472B6] to-[#FFD23F] text-white flex-1 flex flex-col gap-2">
          <div className="text-[8.5px] uppercase tracking-[0.2em]">Your 2024 Wrapped</div>
          <div className="font-display text-[24px] leading-none">You listened to <br/>42,180 mins</div>
          <div className="rounded-lg bg-white/15 backdrop-blur p-2 text-[10px]">
            <div className="opacity-80 text-[8.5px] uppercase tracking-wider">Top artist</div>
            <div className="font-display text-[14px]">Phoebe Bridgers</div>
            <div className="text-[8.5px] opacity-80">You're in her top 0.1%</div>
          </div>
          <div className="rounded-lg bg-white/15 backdrop-blur p-2 text-[10px]">
            <div className="opacity-80 text-[8.5px] uppercase tracking-wider">Top song</div>
            <div className="font-display text-[14px]">Motion Sickness</div>
            <div className="text-[8.5px] opacity-80">Played 142 times</div>
          </div>
          <div className="mt-auto rounded-lg bg-black/30 p-1.5 text-[9px] flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-[#FF6B6B]" />
            <div className="min-w-0">
              <div className="text-[8px] uppercase tracking-wider opacity-80">Today's daylist</div>
              <div className="font-medium truncate">sunset indie folk mellow</div>
            </div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Wrapped recap" },
      { n: 2, x: "50%", y: "50%", label: "Top artist/song" },
      { n: 3, x: "50%", y: "88%", label: "Daylist tie-in" },
    ],
  })) as Builder,

  // 19. YouTube - Subscriptions feed
  streamYouTubeSubs: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded grid place-items-center bg-red-600 text-white text-[9px]">▶</div>
          <div className="text-[11px] font-medium">Subscriptions</div>
        </div>
        <div className="flex gap-1.5 overflow-hidden">
          {["All","Theo","Fireship","BA","MKBHD","NPR"].map((c,i)=>(
            <div key={i} className="flex flex-col items-center gap-0.5 shrink-0">
              <div className={`w-8 h-8 rounded-full ${i===0?"bg-foreground/15":"bg-foreground/10"} border ${i===0?"border-foreground":"border-border/40"}`} />
              <div className="text-[7.5px] truncate w-10 text-center">{c}</div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] text-foreground/55">Today</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["TanStack Start v2 first look","Theo","12 min · 1h ago","120K"],
            ["100 seconds of Rust","Fireship","2:12 · 4h ago","240K"],
            ["30-min weeknight pasta","Bon Appétit","8:42 · 6h ago","98K"],
            ["The iPad Pro M5 review","MKBHD","14:30 · 8h ago","1.2M"],
          ].map(([t,ch,meta,v],i)=>(
            <div key={i} className="flex gap-1.5">
              <Photo seed={i} className="w-16 h-10 rounded shrink-0" />
              <div className="min-w-0">
                <div className="text-[9.5px] truncate">{t}</div>
                <div className="text-[8px] text-foreground/55 truncate">{ch} · {v} views</div>
                <div className="text-[8px] text-foreground/45 truncate">{meta}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Channel avatars" },
      { n: 2, x: "50%", y: "55%", label: "New uploads" },
      { n: 3, x: "50%", y: "85%", label: "From your subs" },
    ],
  })) as Builder,

  // 20. Twitch - Subs & emotes
  streamTwitchSubs: ((_ctx, _p) => ({
    node: (
      <Frame>
        <StreamBar />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#9146FF]" />
          <div className="min-w-0">
            <div className="text-[11px] font-medium truncate">pokimane</div>
            <div className="text-[8.5px] text-foreground/55">9.2M followers</div>
          </div>
          <div className="ml-auto text-[8.5px] px-2 py-0.5 rounded bg-[#9146FF] text-white">Following</div>
        </div>
        <div className="font-display text-[13px]">Subscribe to pokimane</div>
        <div className="flex flex-col gap-1.5">
          {[
            ["Tier 1","$4.99/mo","Ad-free · 1 emote slot · sub badge","#9146FF",true],
            ["Tier 2","$9.99/mo","All tier 1 perks · extra emotes","#7d3eff",false],
            ["Tier 3","$24.99/mo","All perks · exclusive emotes · gold badge","#5b1ec4",false],
          ].map(([t,p,pe,c,cur],i)=>(
            <div key={i} className={`rounded-md p-2 border ${cur?"border-2":""}`} style={cur?{borderColor:c as string}:{borderColor:"hsl(var(--border))"}}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold">{t}</div>
                  <div className="text-[8.5px] text-foreground/55 truncate max-w-[140px]">{pe}</div>
                </div>
                <div className="text-[10px] font-mono" style={{color:c as string}}>{p}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-medium mt-1">Sub emotes</div>
        <div className="grid grid-cols-6 gap-1">
          {["pokiHi","pokiW","pokiL","pokiH","pokiP","pokiS","pokiK","pokiR","pokiT","pokiM","pokiG","pokiB"].map((e,i)=>(
            <div key={i} className="aspect-square rounded bg-foreground/8 grid place-items-center text-[7px] font-mono text-foreground/65">{e}</div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Sub tiers" },
      { n: 2, x: "50%", y: "55%", label: "Tier perks" },
      { n: 3, x: "50%", y: "88%", label: "Sub emotes" },
    ],
  })) as Builder,
});

// ============================================================
// MOBILITY - 20 brand-evocative screens
// ============================================================
const MobBar = ({ accent = "text-foreground/50" }: { accent?: string }) => (
  <div className={`flex items-center justify-between text-[9px] font-mono ${accent} -mt-1`}>
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

const MapBg = ({ tint = "from-emerald-500/15 to-sky-500/10" }: { tint?: string }) => (
  <div className={`absolute inset-0 bg-gradient-to-br ${tint}`}>
    <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0 30 L40 35 L55 60 L100 70" stroke="currentColor" strokeWidth="0.6" fill="none" />
      <path d="M20 0 L25 50 L60 55 L70 100" stroke="currentColor" strokeWidth="0.4" fill="none" />
      <path d="M0 80 L100 20" stroke="currentColor" strokeWidth="0.3" fill="none" strokeDasharray="2 2" />
    </svg>
  </div>
);

Object.assign(screens, {
  // 1. Uber - Predicted places
  mobUberPredicted: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="font-display text-[14px]">Where to?</div>
        <div className="h-8 rounded-md bg-foreground/[0.06] border border-border/60 px-2 grid items-center text-[10px] text-foreground/55">📍 Current location</div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Suggested · Tue 8:42 AM</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["🏠","Home","221 Baker St · usual 8:50 AM","12 min"],
            ["💼","Work","Tech Park · usual weekday","18 min"],
            ["🛫","SFO Airport","Recent","32 min"],
            ["☕","Blue Bottle","Saturdays","6 min"],
          ].map(([e,t,s,m],i)=>(
            <div key={i} className={`flex items-center gap-2 p-1.5 rounded-md ${i<2?"bg-foreground/[0.05]":""}`}>
              <div className="w-7 h-7 rounded-full bg-foreground/10 grid place-items-center text-[11px]">{e}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
              <div className="text-[9px] text-foreground/55">{m}</div>
            </div>
          ))}
        </div>
        <CTA>Confirm pickup</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Time-aware suggestion" },
      { n: 2, x: "50%", y: "42%", label: "Home pinned top" },
      { n: 3, x: "50%", y: "52%", label: "Work pinned next" },
    ],
  })) as Builder,

  // 2. Lyft - Saved + recent
  mobLyftSaved: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="font-display text-[14px] text-[#FF00BF]">Where to?</div>
        <div className="h-8 rounded-full bg-foreground/[0.06] border border-border/60 px-3 grid items-center text-[10px] text-foreground/55">Search address</div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Saved</div>
        <div className="flex flex-col gap-1">
          {[["🏠","Home","221 Baker St"],["💼","Work","Tech Park"],["⭐","Mom's","42 Elm Ave"]].map(([e,t,s],i)=>(
            <div key={i} className="flex items-center gap-2 py-1">
              <div className="w-6 h-6 rounded-full bg-[#FF00BF]/15 text-[#FF00BF] grid place-items-center text-[10px]">{e}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55 mt-1">Recent</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[["🕐","Trader Joe's","Sun 2:14 PM"],["🕐","SFO Term 2","Fri"],["🕐","The Fillmore","Last week"]].map(([e,t,s],i)=>(
            <div key={i} className="flex items-center gap-2 py-1">
              <div className="w-6 h-6 rounded-full bg-foreground/10 grid place-items-center text-[10px]">{e}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Saved places" },
      { n: 2, x: "50%", y: "62%", label: "Recent trips" },
      { n: 3, x: "12%", y: "35%", label: "Friendly icons" },
    ],
  })) as Builder,

  // 3. Citymapper - Multimodal plan
  mobCitymapperPlan: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-[#0099CC] grid place-items-center text-white text-[10px]">C</div>
          <div className="text-[11px] font-medium">Mission St → SFO</div>
        </div>
        <div className="text-[8.5px] text-foreground/55">Compare routes · Tue 8:42</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["🚇","BART + walk","38 min","$4.40","Fastest transit"],
            ["🚲","Bike + train","44 min","$2.95","Greenest"],
            ["🚗","Uber/Lyft","26 min","$24-31","Fastest"],
            ["🚶","Walk + bus","58 min","$2.50","Cheapest"],
            ["🛴","Lime + BART","41 min","$6.20","Mixed"],
          ].map(([e,t,m,c,tag],i)=>(
            <div key={i} className={`flex items-center gap-2 p-1.5 rounded-md border ${i===2?"border-[#0099CC] bg-[#0099CC]/8":"border-border/60"}`}>
              <div className="w-8 h-8 rounded-md bg-foreground/8 grid place-items-center text-[12px]">{e}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{tag}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono">{m}</div>
                <div className="text-[8.5px] text-foreground/55">{c}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Go with Uber · 26 min</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Trip planner" },
      { n: 2, x: "50%", y: "50%", label: "Modes compared" },
      { n: 3, x: "85%", y: "50%", label: "Time & cost" },
    ],
  })) as Builder,

  // 4. Bolt - Quick entry
  mobBoltQuick: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-[#34D186] grid place-items-center text-white text-[11px] font-bold">⚡</div>
          <div className="text-[11px] font-medium">Bolt</div>
        </div>
        <div className="flex-1 grid place-items-center">
          <div className="w-full space-y-2">
            <div className="font-display text-[18px] text-center">Where to?</div>
            <div className="h-11 rounded-xl bg-foreground/[0.06] border-2 border-[#34D186]/60 px-3 grid items-center text-[12px] text-foreground/55">📍 Enter destination</div>
            <div className="flex gap-1.5 justify-center">
              <Chip>🏠 Home</Chip>
              <Chip>💼 Work</Chip>
            </div>
          </div>
        </div>
        <CTA>Find a ride</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "One big input" },
      { n: 2, x: "50%", y: "55%", label: "Minimal shortcuts" },
      { n: 3, x: "50%", y: "88%", label: "Single CTA" },
    ],
  })) as Builder,

  // 5. Uber - Tiers price + ETA
  mobUberTiers: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative h-16 rounded-md overflow-hidden border border-border/60">
          <MapBg tint="from-foreground/15 to-foreground/5" />
          <div className="absolute inset-x-2 bottom-1 text-[8.5px] text-foreground/60">Mission St → SFO · 18 mi</div>
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Choose a ride</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["UberX","4 seats","3 min","$24.18"],
            ["Comfort","Newer cars","5 min","$31.40"],
            ["UberXL","6 seats","6 min","$38.90"],
            ["Black","Luxury","8 min","$58.25"],
          ].map(([t,s,eta,p],i)=>(
            <div key={i} className={`flex items-center gap-2 p-1.5 rounded-md ${i===0?"bg-foreground/[0.06] border border-foreground/30":""}`}>
              <div className="w-9 h-7 rounded bg-foreground/10 grid place-items-center text-[12px]">🚗</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t} · {eta}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
              <div className="text-[11px] font-mono font-semibold">{p}</div>
            </div>
          ))}
        </div>
        <CTA>Confirm UberX</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Tier list" },
      { n: 2, x: "85%", y: "50%", label: "Price each" },
      { n: 3, x: "55%", y: "50%", label: "ETA inline" },
    ],
  })) as Builder,

  // 6. Bolt - Cheapest first
  mobBoltCheapest: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium">Choose a ride</div>
          <Chip accent>↓ Cheapest</Chip>
        </div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["Bolt","4 min","€6.20","Cheapest"],
            ["Economy","6 min","€7.40",""],
            ["XL","9 min","€11.80",""],
            ["Comfort","5 min","€12.50",""],
          ].map(([t,eta,p,tag],i)=>(
            <div key={i} className={`flex items-center gap-2 p-1.5 rounded-md border ${i===0?"border-[#34D186] bg-[#34D186]/8":"border-border/60"}`}>
              <div className="w-9 h-7 rounded bg-foreground/10 grid place-items-center text-[12px]">🚗</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{eta} · {tag}</div>
              </div>
              <div className={`text-[12px] font-mono font-bold ${i===0?"text-[#34D186]":""}`}>{p}</div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] text-center text-foreground/55">Save €1.20 vs. nearest competitor</div>
        <CTA>Book Bolt · €6.20</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "82%", y: "15%", label: "Sorted by price" },
      { n: 2, x: "85%", y: "32%", label: "Lowest first" },
      { n: 3, x: "50%", y: "82%", label: "Savings nudge" },
    ],
  })) as Builder,

  // 7. Lyft - Friendly tiers
  mobLyftTiers: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="text-[11px] font-medium text-[#FF00BF]">Choose your Lyft</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Lyft","Everyday ride","3 min","$22","🚗"],
            ["Lyft XL","Up to 6 friends","6 min","$36","🚙"],
            ["Lux","Treat yourself","8 min","$54","✨"],
          ].map(([t,s,eta,p,e],i)=>(
            <div key={i} className={`p-2 rounded-xl border ${i===0?"border-[#FF00BF] bg-[#FF00BF]/8":"border-border/60"}`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-foreground/8 grid place-items-center text-[16px]">{e}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold truncate">{t}</div>
                  <div className="text-[8.5px] text-foreground/60 truncate">{s} · {eta} away</div>
                </div>
                <div className="text-[13px] font-display">{p}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Request Lyft</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Warm tone" },
      { n: 2, x: "50%", y: "40%", label: "Card tiers" },
      { n: 3, x: "50%", y: "60%", label: "Personality copy" },
    ],
  })) as Builder,

  // 8. Citymapper - Compare modes
  mobCitymapperCompare: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="text-[11px] font-medium">Mission → SFO</div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ["🚗","Ride","26m","$24","#0099CC"],
            ["🚇","Transit","38m","$4.40","#22C55E"],
            ["🚲","Bike","44m","$2.95","#F59E0B"],
          ].map(([e,t,m,c,col],i)=>(
            <div key={i} className={`p-1.5 rounded-md border ${i===0?"border-2":"border"} `} style={{borderColor: i===0 ? col as string : undefined}}>
              <div className="text-[14px] text-center">{e}</div>
              <div className="text-[9px] font-medium text-center">{t}</div>
              <div className="text-[10px] font-mono text-center" style={{color: col as string}}>{m}</div>
              <div className="text-[8.5px] text-foreground/55 text-center">{c}</div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Step-by-step (Ride)</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden text-[9.5px]">
          <div>🚶 Walk 2 min to pickup</div>
          <div>🚗 Uber 22 min via US-101</div>
          <div>🚶 Walk 2 min to Term 2</div>
        </div>
        <CTA>Compare in detail</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "30%", label: "Ride mode" },
      { n: 2, x: "50%", y: "30%", label: "Transit mode" },
      { n: 3, x: "80%", y: "30%", label: "Bike mode" },
    ],
  })) as Builder,

  // 9. Lyft - Warm match + ETA
  mobLyftMatch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative h-24 rounded-md overflow-hidden border border-border/60 text-[#FF00BF]">
          <MapBg tint="from-[#FF00BF]/15 to-foreground/5" />
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#FF00BF]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-foreground grid place-items-center text-[9px] text-background">🚗</div>
        </div>
        <div className="rounded-xl border border-[#FF00BF]/40 bg-[#FF00BF]/8 p-2 flex items-center gap-2">
          <Photo seed={2} className="w-10 h-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold truncate">Maria is on the way!</div>
            <div className="text-[8.5px] text-foreground/60 truncate">★ 4.97 · 1,204 rides · Toyota Prius · 6KCD382</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-display text-[#FF00BF]">3</div>
            <div className="text-[7.5px] text-foreground/55">min</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <Chip>💬 Message</Chip>
          <Chip>📞 Call</Chip>
          <Chip>📍 Share</Chip>
        </div>
        <div className="flex-1" />
        <CTA>Say hi to Maria</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "45%", label: "Friendly driver card" },
      { n: 2, x: "85%", y: "45%", label: "ETA badge" },
      { n: 3, x: "50%", y: "85%", label: "Warm CTA" },
    ],
  })) as Builder,

  // 10. Uber - Live map track
  mobUberLiveMap: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative flex-1 rounded-md overflow-hidden border border-border/60 text-foreground/70">
          <MapBg tint="from-foreground/15 to-foreground/5" />
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
          <div className="absolute bottom-6 right-6 w-5 h-5 rounded-md bg-foreground grid place-items-center text-[10px] text-background rotate-12">🚗</div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M10 12 Q40 30 75 78" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
          </svg>
          <div className="absolute top-2 right-2 bg-background/90 rounded-md px-1.5 py-0.5 text-[9px] font-mono">ETA 3 min</div>
        </div>
        <div className="rounded-md bg-foreground text-background p-2 flex items-center gap-2">
          <Photo seed={1} className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold truncate">Sam · Toyota Camry</div>
            <div className="text-[8.5px] opacity-70 truncate">★ 4.92 · Plate 7ABC123 · Silver</div>
          </div>
          <div className="text-[11px] font-mono">0.4 mi</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Live map" },
      { n: 2, x: "78%", y: "55%", label: "Car approaching" },
      { n: 3, x: "78%", y: "20%", label: "ETA badge" },
    ],
  })) as Builder,

  // 11. Bolt - Basic match
  mobBoltMatch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative h-20 rounded-md overflow-hidden border border-border/60 text-[#34D186]">
          <MapBg tint="from-[#34D186]/15 to-foreground/5" />
          <div className="absolute bottom-3 right-3 w-4 h-4 rounded bg-foreground grid place-items-center text-[9px] text-background">🚗</div>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Driver on the way</div>
          <div className="flex items-center justify-between mt-1">
            <div>
              <div className="text-[11px] font-semibold">Andrei P.</div>
              <div className="text-[8.5px] text-foreground/55">VW Passat · Black</div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-display text-[#34D186]">4 min</div>
            </div>
          </div>
          <div className="mt-1.5 inline-block px-2 py-0.5 bg-foreground text-background text-[11px] font-mono tracking-wider rounded">AB 123 CD</div>
        </div>
        <div className="flex-1" />
        <div className="grid grid-cols-2 gap-2">
          <Chip>📞 Call</Chip>
          <Chip>✕ Cancel</Chip>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "55%", label: "Plate · ETA" },
      { n: 2, x: "85%", y: "50%", label: "Just the basics" },
      { n: 3, x: "50%", y: "88%", label: "Two actions" },
    ],
  })) as Builder,

  // 12. Lime - Unlock nearby
  mobLimeUnlock: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative flex-1 rounded-md overflow-hidden border border-border/60 text-[#00DD00]">
          <MapBg tint="from-[#00DD00]/15 to-foreground/5" />
          {[["20%","30%","🛴"],["55%","45%","🚲"],["35%","65%","🛴"],["72%","25%","🛴"],["80%","70%","🚲"]].map(([x,y,e],i)=>(
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#00DD00] text-white text-[11px] grid place-items-center shadow" style={{left:x as string, top:y as string}}>{e}</div>
          ))}
          <div className="absolute bottom-2 left-2 bg-background/90 rounded px-1.5 py-0.5 text-[8.5px] font-mono">5 nearby</div>
        </div>
        <div className="rounded-md border border-border/60 p-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#00DD00]/15 text-[#00DD00] grid place-items-center text-[14px]">🛴</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-medium">Scooter · 42m away</div>
            <div className="text-[8.5px] text-foreground/55">Battery 78% · $1 to unlock</div>
          </div>
        </div>
        <CTA>Scan to unlock</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Nearby vehicles" },
      { n: 2, x: "50%", y: "72%", label: "Selected vehicle" },
      { n: 3, x: "50%", y: "92%", label: "Unlock action" },
    ],
  })) as Builder,

  // 13. Uber - Share + safety kit
  mobUberSafety: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative h-24 rounded-md overflow-hidden border border-border/60 text-foreground/70">
          <MapBg tint="from-foreground/15 to-foreground/5" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M15 80 Q40 60 85 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="absolute top-2 right-2 bg-background/90 rounded-md px-1.5 py-0.5 text-[9px] font-mono">14 min to SFO</div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-border/60 p-1.5 flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-500/15 text-blue-600 grid place-items-center text-[14px]">📍</div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium">Share trip</div>
              <div className="text-[8px] text-foreground/55 truncate">Live to contacts</div>
            </div>
          </div>
          <div className="rounded-md border border-blue-500 bg-blue-500/8 p-1.5 flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white grid place-items-center text-[14px]">🛡️</div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-blue-700">Safety</div>
              <div className="text-[8px] text-blue-600 truncate">911 · RideCheck</div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-2 flex-1">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Safety toolkit</div>
          <div className="text-[9.5px] mt-1">📞 Emergency assistance · 🎙 Audio recording · 👮 Share with police</div>
        </div>
        <CTA>End trip</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "25%", y: "48%", label: "Share trip" },
      { n: 2, x: "75%", y: "48%", label: "Safety toolkit" },
      { n: 3, x: "50%", y: "72%", label: "Toolkit actions" },
    ],
  })) as Builder,

  // 14. Lyft - Trip share
  mobLyftShare: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative h-28 rounded-md overflow-hidden border border-border/60 text-[#FF00BF]">
          <MapBg tint="from-[#FF00BF]/15 to-foreground/5" />
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#FF00BF]" />
          <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-foreground" />
          <div className="absolute top-2 right-2 bg-background/90 rounded-md px-1.5 py-0.5 text-[9px] font-mono text-foreground">12 min left</div>
        </div>
        <div className="rounded-xl border border-[#FF00BF]/40 bg-[#FF00BF]/8 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF00BF] text-white grid place-items-center text-[14px]">💗</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] font-semibold">Let someone know</div>
              <div className="text-[8.5px] text-foreground/60">They'll see your live location until you arrive.</div>
            </div>
          </div>
          <div className="flex gap-1 mt-1.5">
            <Chip>Mom</Chip>
            <Chip>Sam</Chip>
            <Chip>+ Add</Chip>
          </div>
        </div>
        <div className="flex-1" />
        <CTA>Share status</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Trip in progress" },
      { n: 2, x: "50%", y: "60%", label: "Share prompt" },
      { n: 3, x: "50%", y: "90%", label: "Caring CTA" },
    ],
  })) as Builder,

  // 15. Citymapper - Step navigation
  mobCitymapperSteps: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="rounded-md bg-[#0099CC] text-white p-2">
          <div className="text-[8.5px] uppercase tracking-wider opacity-80">Next</div>
          <div className="text-[14px] font-semibold leading-tight">Board J Church at Powell</div>
          <div className="text-[9.5px] opacity-90">In 3 min · Platform 2</div>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          {[
            ["🚶","Walk to Powell St","4 min","done"],
            ["🚇","J Church · 6 stops","14 min","now"],
            ["🚶","Walk to bus stop","2 min",""],
            ["🚌","8 Bayshore · 4 stops","11 min",""],
            ["🚶","Walk to gate","3 min",""],
          ].map(([e,t,d,st],i)=>(
            <div key={i} className="flex gap-2 items-start py-1">
              <div className={`w-6 h-6 rounded-full grid place-items-center text-[12px] shrink-0 ${st==="done"?"bg-foreground/15 text-foreground/40":st==="now"?"bg-[#0099CC] text-white":"bg-foreground/8"}`}>{e}</div>
              <div className="flex-1 min-w-0 border-b border-border/40 pb-1">
                <div className={`text-[10px] truncate ${st==="done"?"text-foreground/40 line-through":"font-medium"}`}>{t}</div>
                <div className="text-[8.5px] text-foreground/55">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Next step banner" },
      { n: 2, x: "12%", y: "55%", label: "Step-by-step" },
      { n: 3, x: "12%", y: "45%", label: "Mixed modes" },
    ],
  })) as Builder,

  // 16. Lime - Ride timer
  mobLimeTimer: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="relative h-20 rounded-md overflow-hidden border border-border/60 text-[#00DD00]">
          <MapBg tint="from-[#00DD00]/20 to-foreground/5" />
          <div className="absolute bottom-3 left-3 w-5 h-5 rounded-full bg-[#00DD00] text-white grid place-items-center text-[12px]">🛴</div>
        </div>
        <div className="rounded-xl border-2 border-[#00DD00]/40 bg-[#00DD00]/8 p-3 text-center">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/60">Ride in progress</div>
          <div className="font-display text-[28px] text-[#00DD00] leading-none mt-1">08:42</div>
          <div className="text-[11px] font-mono mt-1">$3.65 so far</div>
          <div className="text-[8.5px] text-foreground/55">$1.00 unlock + $0.32/min · Battery 64%</div>
        </div>
        <div className="flex-1" />
        <div className="h-12 rounded-xl bg-foreground text-background grid place-items-center text-[12px] font-semibold">End ride</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "45%", label: "Live timer" },
      { n: 2, x: "50%", y: "58%", label: "Cost so far" },
      { n: 3, x: "50%", y: "90%", label: "End ride" },
    ],
  })) as Builder,

  // 17. Uber - Invisible auto-charge
  mobUberAutoCharge: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="flex-1 grid place-items-center">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 grid place-items-center text-[28px] mx-auto">✓</div>
            <div className="font-display text-[16px]">You've arrived</div>
            <div className="text-[10px] text-foreground/60">Charged $24.18 to Visa •• 4242</div>
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-2 space-y-1 text-[9.5px]">
          <div className="flex justify-between"><span className="text-foreground/55">Fare</span><span className="font-mono">$21.40</span></div>
          <div className="flex justify-between"><span className="text-foreground/55">Booking + tolls</span><span className="font-mono">$2.78</span></div>
          <div className="flex justify-between font-semibold border-t border-border/60 pt-1"><span>Total</span><span className="font-mono">$24.18</span></div>
          <div className="text-[8.5px] text-foreground/55">Receipt sent to sam@email.com</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Chip>Rate driver</Chip>
          <Chip>Help</Chip>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "32%", label: "Auto-charged" },
      { n: 2, x: "50%", y: "70%", label: "Instant receipt" },
      { n: 3, x: "50%", y: "92%", label: "No checkout" },
    ],
  })) as Builder,

  // 18. Lyft - Auto + tip prompt
  mobLyftTip: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="text-center pt-1">
          <Photo seed={2} className="w-12 h-12 rounded-full mx-auto" />
          <div className="text-[11px] font-semibold mt-1">How was your ride with Maria?</div>
          <div className="text-[14px] mt-1">★ ★ ★ ★ ★</div>
        </div>
        <div className="rounded-xl border border-[#FF00BF]/40 bg-[#FF00BF]/8 p-2">
          <div className="text-[10px] font-semibold text-center mb-1.5">Add a tip for Maria</div>
          <div className="grid grid-cols-4 gap-1">
            {["$2","$3","$5","Other"].map((t,i)=>(
              <div key={i} className={`h-9 rounded-md grid place-items-center text-[11px] font-medium ${i===1?"bg-[#FF00BF] text-white":"bg-background border border-border/60"}`}>{t}</div>
            ))}
          </div>
          <div className="text-[8.5px] text-foreground/55 text-center mt-1">100% goes to your driver</div>
        </div>
        <div className="rounded-md border border-border/60 p-2 text-[9.5px] flex justify-between">
          <span className="text-foreground/55">Charged to Apple Pay</span>
          <span className="font-mono font-semibold">$22.40</span>
        </div>
        <div className="flex-1" />
        <CTA>Submit · $25.40</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Rate driver" },
      { n: 2, x: "50%", y: "50%", label: "Tip prompt" },
      { n: 3, x: "50%", y: "70%", label: "Auto-charged" },
    ],
  })) as Builder,

  // 19. Bolt - Cash / card
  mobBoltCash: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="text-[11px] font-medium">Payment method</div>
        <div className="text-[8.5px] text-foreground/55">Estimated fare €6.20</div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="rounded-xl border-2 border-[#34D186] bg-[#34D186]/8 p-2.5 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#34D186] text-white grid place-items-center text-[16px]">💵</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold">Cash</div>
              <div className="text-[8.5px] text-foreground/60">Pay driver in person · Most popular</div>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-[#34D186] bg-[#34D186] grid place-items-center text-white text-[9px]">✓</div>
          </div>
          <div className="rounded-xl border border-border/60 p-2.5 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-foreground/8 grid place-items-center text-[16px]">💳</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold">Visa •• 8821</div>
              <div className="text-[8.5px] text-foreground/60">Auto-charge after ride</div>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-border" />
          </div>
          <div className="rounded-xl border border-dashed border-border/60 p-2 text-[10px] text-foreground/55 text-center">+ Add new card</div>
        </div>
        <CTA>Confirm · Cash €6.20</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "32%", label: "Cash option" },
      { n: 2, x: "50%", y: "55%", label: "Card option" },
      { n: 3, x: "50%", y: "92%", label: "Confirm" },
    ],
  })) as Builder,

  // 20. Lime - Per-minute receipt
  mobLimeReceipt: ((_ctx, _p) => ({
    node: (
      <Frame>
        <MobBar />
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-[#00DD00]/15 text-[#00DD00] grid place-items-center text-[20px] mx-auto">✓</div>
          <div className="font-display text-[14px] mt-1">Thanks for riding Lime</div>
          <div className="text-[8.5px] text-foreground/55">8 min 42 sec · 1.2 mi</div>
        </div>
        <div className="rounded-md border border-border/60 p-2 flex-1 overflow-hidden">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55 mb-1">Receipt</div>
          <div className="space-y-0.5 text-[9.5px]">
            <div className="flex justify-between"><span>Unlock fee</span><span className="font-mono">$1.00</span></div>
            <div className="flex justify-between"><span>8 min × $0.32</span><span className="font-mono">$2.56</span></div>
            <div className="flex justify-between text-foreground/55"><span className="pl-2">min 1-3</span><span className="font-mono">$0.96</span></div>
            <div className="flex justify-between text-foreground/55"><span className="pl-2">min 4-6</span><span className="font-mono">$0.96</span></div>
            <div className="flex justify-between text-foreground/55"><span className="pl-2">min 7-8</span><span className="font-mono">$0.64</span></div>
            <div className="flex justify-between"><span>Tax</span><span className="font-mono">$0.09</span></div>
            <div className="flex justify-between font-semibold border-t border-border/60 pt-1 mt-1"><span>Total</span><span className="font-mono text-[#00DD00]">$3.65</span></div>
          </div>
        </div>
        <CTA>Email receipt</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Trip summary" },
      { n: 2, x: "50%", y: "55%", label: "Per-minute breakdown" },
      { n: 3, x: "85%", y: "72%", label: "Running total" },
    ],
  })) as Builder,
});

// ============================================================
// DATING - 20 brand-evocative screens
// ============================================================
const DateBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Hinge - Prompt-based profile
  dateHingePrompts: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center gap-2">
          <Photo seed={0} className="w-10 h-10 rounded-full" />
          <div>
            <div className="text-[12px] font-semibold">Olivia · 28</div>
            <div className="text-[9px] text-foreground/55">Brooklyn · 2 mi</div>
          </div>
          <div className="ml-auto w-6 h-6 rounded-full bg-foreground/8 grid place-items-center text-[12px]">♡</div>
        </div>
        <div className="rounded-xl bg-foreground/[0.05] border border-border/60 p-2 relative">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">My simple pleasures</div>
          <div className="text-[11px] font-display leading-tight mt-0.5">A perfectly ripe peach in July, no notes.</div>
          <div className="absolute -bottom-2 right-2 w-7 h-7 rounded-full bg-pink-600 text-white grid place-items-center text-[13px]">♡</div>
        </div>
        <Photo seed={2} className="h-20 rounded-lg" />
        <div className="rounded-xl bg-foreground/[0.05] border border-border/60 p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">My most controversial opinion</div>
          <div className="text-[11px] font-display leading-tight mt-0.5">Pineapple absolutely belongs on pizza.</div>
        </div>
        <div className="flex-1" />
        <CTA>Comment on a prompt</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Prompt answer" },
      { n: 2, x: "85%", y: "38%", label: "Like a detail" },
      { n: 3, x: "50%", y: "70%", label: "Photos interleave" },
    ],
  })) as Builder,

  // 2. OkCupid - Question depth
  dateOkcQuestions: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center gap-2">
          <Photo seed={1} className="w-10 h-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold truncate">Jordan · 31</div>
            <div className="text-[9px] text-foreground/55">Answered 412 questions</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-display text-[#FF3A57]">94%</div>
            <div className="text-[7.5px] text-foreground/55">match</div>
          </div>
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Compatibility breakdown</div>
        <div className="space-y-1">
          {[["Politics",96],["Lifestyle",91],["Religion",88],["Sex",82]].map(([l,v],i)=>(
            <div key={i}>
              <div className="flex justify-between text-[9px]"><span>{l}</span><span className="font-mono">{v}%</span></div>
              <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden"><div className="h-full bg-[#FF3A57]" style={{width:`${v}%`}} /></div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55 mt-1">A question you both answered</div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[10px] font-medium">"Could you date a messy person?"</div>
          <div className="text-[8.5px] text-foreground/60 mt-1">You: No · Jordan: No · ✓ Match</div>
        </div>
        <div className="flex-1" />
        <CTA>Message Jordan</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "15%", label: "Match %" },
      { n: 2, x: "50%", y: "45%", label: "Compatibility bars" },
      { n: 3, x: "50%", y: "75%", label: "Shared answers" },
    ],
  })) as Builder,

  // 3. Tinder - Photo-first
  dateTinderPhoto: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="relative flex-1 rounded-2xl overflow-hidden">
          <Photo seed={3} className="absolute inset-0" />
          <div className="absolute top-2 left-2 right-2 flex gap-1">
            {[1,2,3,4,5].map(i=>(<div key={i} className={`h-0.5 flex-1 rounded-full ${i===2?"bg-white":"bg-white/40"}`} />))}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="text-[18px] font-display">Mia, 26</div>
            <div className="text-[10px] opacity-90">📍 3 miles away</div>
            <div className="text-[10px] opacity-75 mt-0.5">Designer · loves bouldering 🧗</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-full bg-background border border-border/60 grid place-items-center text-[14px]">↺</div>
          <div className="w-11 h-11 rounded-full bg-background border-2 border-red-500 grid place-items-center text-red-500 text-[18px]">✕</div>
          <div className="w-9 h-9 rounded-full bg-background border-2 border-blue-500 grid place-items-center text-blue-500 text-[14px]">★</div>
          <div className="w-11 h-11 rounded-full bg-background border-2 border-emerald-500 grid place-items-center text-emerald-500 text-[18px]">♡</div>
          <div className="w-9 h-9 rounded-full bg-background border border-border/60 grid place-items-center text-[14px]">⚡</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "45%", label: "Full-bleed photo" },
      { n: 2, x: "50%", y: "70%", label: "Minimal text" },
      { n: 3, x: "50%", y: "90%", label: "Swipe controls" },
    ],
  })) as Builder,

  // 4. Bumble - Guided profile
  dateBumbleGuided: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-[#FFC629]">Build your hive</div>
          <div className="text-[9px] text-foreground/60">Step 4 of 6</div>
        </div>
        <div className="h-1 bg-foreground/10 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-[#FFC629]" /></div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0,1,2,3,4,5].map(i=>(
            <div key={i} className={`aspect-square rounded-lg overflow-hidden border ${i<3?"border-[#FFC629]":"border-dashed border-border/60"}`}>
              {i<3 ? <Photo seed={i} className="w-full h-full" /> : <div className="w-full h-full grid place-items-center text-foreground/40 text-[16px]">+</div>}
            </div>
          ))}
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Badges</div>
        <div className="flex gap-1 flex-wrap">
          {["♀ She/her","🍷 Drinks sometimes","🚭 Non-smoker","💪 Active","🐕 Has a dog"].map((b,i)=>(
            <Chip key={i} accent={i<3}>{b}</Chip>
          ))}
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[8.5px] text-foreground/55">Prompt 1 of 3 · suggested</div>
          <div className="text-[10px] font-medium">"My greenest flag is…"</div>
        </div>
        <div className="flex-1" />
        <CTA>Continue</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "16%", label: "Stepper" },
      { n: 2, x: "50%", y: "38%", label: "Photo slots" },
      { n: 3, x: "50%", y: "62%", label: "Badges" },
    ],
  })) as Builder,

  // 5. Tinder - Swipe deck
  dateTinderSwipe: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="relative flex-1">
          <div className="absolute inset-x-3 top-3 bottom-3 rounded-2xl bg-foreground/5 border border-border/40" />
          <div className="absolute inset-x-1.5 top-1.5 bottom-1.5 rounded-2xl bg-foreground/10 border border-border/60" />
          <div className="absolute inset-0 rounded-2xl overflow-hidden rotate-[-3deg] shadow-lg">
            <Photo seed={2} className="absolute inset-0" />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded border-2 border-emerald-400 text-emerald-400 text-[14px] font-bold rotate-[-12deg]">LIKE</div>
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="text-[16px] font-display">Alex, 29</div>
              <div className="text-[10px] opacity-90">5 mi away · 1 of 6</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-full bg-background border-2 border-red-500 grid place-items-center text-red-500 text-[18px]">✕</div>
          <div className="w-9 h-9 rounded-full bg-background border-2 border-blue-500 grid place-items-center text-blue-500 text-[14px]">★</div>
          <div className="w-11 h-11 rounded-full bg-background border-2 border-emerald-500 grid place-items-center text-emerald-500 text-[18px]">♡</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Card stack" },
      { n: 2, x: "25%", y: "30%", label: "Swipe label" },
      { n: 3, x: "50%", y: "90%", label: "Like / Nope" },
    ],
  })) as Builder,

  // 6. Hinge - Likes you (curated)
  dateHingeLikes: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-semibold">Likes You</div>
          <Chip accent>23 new</Chip>
        </div>
        <div className="text-[8.5px] text-foreground/55">They liked something specific about you.</div>
        <div className="grid grid-cols-2 gap-2 flex-1 overflow-hidden">
          {[
            ["Sara, 27","liked your photo"],
            ["Tom, 30","liked your prompt"],
            ["Lee, 26","commented '😂'"],
            ["Ana, 28","liked your photo"],
          ].map(([n,s],i)=>(
            <div key={i} className="rounded-xl overflow-hidden border border-border/60 relative">
              <Photo seed={i} className="aspect-[3/4]" />
              <div className="absolute top-1.5 left-1.5 right-1.5 rounded-md bg-background/95 px-1.5 py-1">
                <div className="text-[8.5px] uppercase tracking-wider text-pink-600">💬 {s}</div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white p-1.5">
                <div className="text-[10px] font-medium truncate">{n}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>See who liked you</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Likes you" },
      { n: 2, x: "50%", y: "40%", label: "What they liked" },
      { n: 3, x: "50%", y: "60%", label: "Curated grid" },
    ],
  })) as Builder,

  // 7. Coffee Meets Bagel - Daily curated
  dateCmbDaily: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-center">
          <div className="text-[10px] text-foreground/55">Your daily bagels · 🥯</div>
          <div className="font-display text-[14px]">Today's curated 5</div>
          <div className="text-[8.5px] text-foreground/55">Resets in 4h 22m</div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Priya, 29","Designer · Friend of Maya","94%"],
            ["Devon, 32","Architect · 2 mi","88%"],
            ["Hana, 27","Photographer · Loves hiking","85%"],
            ["Lin, 30","PM · Bookworm","82%"],
            ["Eli, 28","Chef · 3 mi","80%"],
          ].map(([n,s,m],i)=>(
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-md border border-border/60">
              <Photo seed={i} className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-medium truncate">{n}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
              <div className="text-[10px] font-mono text-[#995E3F]">{m}</div>
              <div className="w-6 h-6 rounded-full bg-[#995E3F]/15 text-[#995E3F] grid place-items-center text-[12px]">♡</div>
            </div>
          ))}
        </div>
        <CTA>Open today's batch</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Daily batch" },
      { n: 2, x: "50%", y: "22%", label: "Reset timer" },
      { n: 3, x: "50%", y: "55%", label: "Quality over quantity" },
    ],
  })) as Builder,

  // 8. Bumble - Swipe + filters
  dateBumbleSwipe: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-[#FFC629]">Bumble Date</div>
          <div className="flex items-center gap-1 text-[9px]"><span>⚙</span><span>Filters · 4</span></div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {["25-32","≤10 mi","Non-smoker","Wants kids"].map((f,i)=>(<Chip key={i} accent>{f}</Chip>))}
        </div>
        <div className="relative flex-1 rounded-2xl overflow-hidden">
          <Photo seed={1} className="absolute inset-0" />
          <div className="absolute top-2 right-2 bg-[#FFC629] text-black text-[9px] px-1.5 py-0.5 rounded">Matches filters</div>
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="text-[16px] font-display">Riley, 28</div>
            <div className="text-[10px] opacity-90">8 mi · Wants kids someday</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-background border-2 border-foreground/40 grid place-items-center text-[16px]">✕</div>
          <div className="w-10 h-10 rounded-full bg-[#FFC629] text-black grid place-items-center text-[16px]">♡</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "78%", y: "13%", label: "Filters" },
      { n: 2, x: "50%", y: "24%", label: "Active filter chips" },
      { n: 3, x: "78%", y: "42%", label: "Filter badge" },
    ],
  })) as Builder,

  // 9. Hinge - Like a detail
  dateHingeMatch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-pink-600">It's a match</div>
          <div className="font-display text-[16px]">You & Olivia liked each other</div>
        </div>
        <div className="rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-300/50 p-2 relative">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Olivia liked your prompt</div>
          <div className="text-[11px] font-display leading-tight mt-0.5">"My simple pleasures - a perfectly ripe peach in July."</div>
          <div className="text-[8.5px] mt-1 text-pink-600">💬 "Okay this is dangerously specific."</div>
        </div>
        <div className="flex items-center justify-center gap-3 py-1">
          <Photo seed={0} className="w-14 h-14 rounded-full border-2 border-pink-500" />
          <div className="text-pink-500 text-[20px]">♡</div>
          <Photo seed={2} className="w-14 h-14 rounded-full border-2 border-pink-500" />
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[8.5px] text-foreground/55">Reply to start</div>
          <div className="text-[10px] text-foreground/70">Type your reply…</div>
        </div>
        <div className="flex-1" />
        <CTA>Send reply</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "What they liked" },
      { n: 2, x: "50%", y: "33%", label: "Their comment" },
      { n: 3, x: "50%", y: "72%", label: "Reply inline" },
    ],
  })) as Builder,

  // 10. Bumble - Mutual + 24h timer
  dateBumbleTimer: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-center">
          <div className="font-display text-[16px] text-[#FFC629]">You matched with Riley!</div>
        </div>
        <div className="flex items-center justify-center gap-3 py-2">
          <Photo seed={0} className="w-16 h-16 rounded-full border-2 border-[#FFC629]" />
          <div className="text-[#FFC629] text-[22px]">⬢</div>
          <Photo seed={1} className="w-16 h-16 rounded-full border-2 border-[#FFC629]" />
        </div>
        <div className="rounded-xl bg-[#FFC629]/15 border-2 border-[#FFC629]/60 p-2 text-center">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/60">Time left to say hi</div>
          <div className="font-display text-[24px] text-[#FFC629] leading-none">23 : 47 : 12</div>
          <div className="text-[8.5px] text-foreground/60 mt-1">Riley makes the first move on Bumble.</div>
        </div>
        <div className="flex-1" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-md border border-border/60 grid place-items-center text-[10px]">Extend 24h</div>
          <div className="h-9 rounded-md bg-[#FFC629] text-black grid place-items-center text-[10px] font-semibold">Wait for Riley</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Mutual match" },
      { n: 2, x: "50%", y: "58%", label: "24h countdown" },
      { n: 3, x: "50%", y: "72%", label: "First-move rule" },
    ],
  })) as Builder,

  // 11. Tinder - Instant match
  dateTinderMatch: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-red-500/10 to-orange-400/20 pointer-events-none" />
        <DateBar />
        <div className="text-center pt-2">
          <div className="font-display text-[28px] bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent leading-none">It's a Match!</div>
          <div className="text-[10px] text-foreground/60 mt-1">You and Mia liked each other.</div>
        </div>
        <div className="relative flex items-center justify-center gap-3 py-3">
          <Photo seed={3} className="w-20 h-20 rounded-full border-4 border-background shadow-lg rotate-[-6deg]" />
          <Photo seed={1} className="w-20 h-20 rounded-full border-4 border-background shadow-lg rotate-[6deg] -ml-3" />
          <div className="absolute inset-x-0 -bottom-1 text-center text-[14px]">✨ 💖 ✨</div>
        </div>
        <div className="flex-1" />
        <div className="h-11 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white grid place-items-center text-[12px] font-semibold">Send a message</div>
        <div className="h-10 rounded-full border border-border/60 grid place-items-center text-[10px]">Keep swiping</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Big celebration" },
      { n: 2, x: "50%", y: "45%", label: "Two avatars" },
      { n: 3, x: "50%", y: "82%", label: "Message or keep swiping" },
    ],
  })) as Builder,

  // 12. Coffee Meets Bagel - Curated intro
  dateCmbIntro: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-center">
          <div className="text-[10px] text-[#995E3F]">🥯 Your bagel today</div>
          <div className="font-display text-[14px]">Meet Priya</div>
        </div>
        <Photo seed={2} className="h-24 rounded-xl" />
        <div className="rounded-xl border border-[#995E3F]/40 bg-[#995E3F]/8 p-2 space-y-1">
          <div className="text-[8.5px] uppercase tracking-wider text-[#995E3F]">Why we picked Priya for you</div>
          <div className="text-[10px]">• Both love modernist design and Sunday hikes</div>
          <div className="text-[10px]">• You're 1 mutual friend apart (Maya)</div>
          <div className="text-[10px]">• Similar values on family + ambition</div>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center text-[8.5px]">
          <div className="rounded-md bg-foreground/5 py-1">Designer</div>
          <div className="rounded-md bg-foreground/5 py-1">Brooklyn</div>
          <div className="rounded-md bg-foreground/5 py-1">29</div>
        </div>
        <div className="flex-1" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-full border border-border/60 grid place-items-center text-[11px]">Pass</div>
          <div className="h-10 rounded-full bg-[#995E3F] text-white grid place-items-center text-[11px] font-semibold">Like Priya</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Today's pick" },
      { n: 2, x: "50%", y: "55%", label: "Why we matched you" },
      { n: 3, x: "50%", y: "92%", label: "One careful choice" },
    ],
  })) as Builder,

  // 13. Bumble - Women first, 24h chat
  dateBumbleChat: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center gap-2">
          <Photo seed={0} className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold">Riley</div>
            <div className="text-[8.5px] text-[#FFC629]">⬢ 23h 47m to make a move</div>
          </div>
          <div className="text-[10px] text-foreground/55">⋯</div>
        </div>
        <div className="flex-1 rounded-md bg-foreground/[0.03] border border-border/40 p-2 grid place-items-center">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-[#FFC629]/20 grid place-items-center text-[20px] mx-auto">⬢</div>
            <div className="text-[11px] font-semibold">Your turn to break the ice</div>
            <div className="text-[9px] text-foreground/55 max-w-[200px] mx-auto">On Bumble, women say hi first. If you don't, the match expires.</div>
          </div>
        </div>
        <div className="rounded-full bg-foreground/[0.06] border border-border/60 px-3 h-9 grid items-center text-[10px] text-foreground/55">Say something…</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "17%", label: "Live countdown" },
      { n: 2, x: "50%", y: "50%", label: "Women-first rule" },
      { n: 3, x: "50%", y: "90%", label: "Open with hi" },
    ],
  })) as Builder,

  // 14. Hinge - Comment to start
  dateHingeComment: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-[11px] font-semibold">Like Olivia's…</div>
        <div className="rounded-xl bg-foreground/[0.05] border-2 border-pink-500 p-2 relative">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">My simple pleasures</div>
          <div className="text-[11px] font-display leading-tight mt-0.5">A perfectly ripe peach in July, no notes.</div>
          <div className="absolute -bottom-2 right-2 px-2 py-0.5 rounded-full bg-pink-600 text-white text-[8.5px]">Selected</div>
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Add a comment</div>
        <div className="rounded-md border border-border/60 p-2 bg-foreground/[0.03]">
          <div className="text-[10px]">Okay this is dangerously specific. Donut peach or yellow?</div>
          <div className="text-[8.5px] text-foreground/55 mt-1">52 / 200</div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {["Same!","Tell me more","Bold take 🔥"].map((s,i)=>(<Chip key={i}>{s}</Chip>))}
        </div>
        <div className="flex-1" />
        <CTA>Send like + comment</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Liked detail" },
      { n: 2, x: "50%", y: "55%", label: "Comment to open" },
      { n: 3, x: "50%", y: "90%", label: "Send like+comment" },
    ],
  })) as Builder,

  // 15. Tinder - Open chat
  dateTinderChat: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center gap-2">
          <Photo seed={3} className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold">Mia</div>
            <div className="text-[8.5px] text-foreground/55">Matched 2 days ago</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          <div className="self-start max-w-[75%] rounded-2xl rounded-bl-sm bg-foreground/10 px-2 py-1 text-[10px]">Heyy! Loved your bouldering pic 🧗</div>
          <div className="self-end max-w-[75%] rounded-2xl rounded-br-sm bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 text-[10px]">Thanks! You climb?</div>
          <div className="self-start max-w-[75%] rounded-2xl rounded-bl-sm bg-foreground/10 px-2 py-1 text-[10px]">A bit. Mostly V2-V3 vibes 😅</div>
          <div className="self-end max-w-[75%] rounded-2xl rounded-br-sm bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 text-[10px]">Same! Brooklyn Boulders this weekend?</div>
          <div className="self-start text-[8.5px] text-foreground/50">Mia is typing…</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 rounded-full bg-foreground/[0.06] border border-border/60 px-3 h-8 grid items-center text-[10px] text-foreground/55">Message</div>
          <div className="w-8 h-8 rounded-full bg-foreground/8 grid place-items-center text-[12px]">😊</div>
          <div className="w-8 h-8 rounded-full bg-foreground/8 grid place-items-center text-[12px]">🎁</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Open thread" },
      { n: 2, x: "30%", y: "75%", label: "Typing indicator" },
      { n: 3, x: "50%", y: "92%", label: "Composer" },
    ],
  })) as Builder,

  // 16. OkCupid - Compatibility chat
  dateOkcChat: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="flex items-center gap-2">
          <Photo seed={1} className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold">Jordan</div>
            <div className="text-[8.5px] text-foreground/55">Active 2m ago</div>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-[#FF3A57] text-white text-[10px] font-mono">94% match</div>
        </div>
        <div className="rounded-md bg-[#FF3A57]/10 border border-[#FF3A57]/30 p-1.5 text-[8.5px]">
          You agree on 312 of 412 questions · Top: Politics, Lifestyle
        </div>
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          <div className="self-start max-w-[75%] rounded-md bg-foreground/10 px-2 py-1 text-[10px]">Hey, your answer on "long-distance" caught my eye.</div>
          <div className="self-end max-w-[75%] rounded-md bg-[#FF3A57] text-white px-2 py-1 text-[10px]">Ha - yours too. Coffee this week?</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 rounded-md bg-foreground/[0.06] border border-border/60 px-2 h-8 grid items-center text-[10px] text-foreground/55">Message Jordan</div>
          <div className="w-8 h-8 rounded-md bg-[#FF3A57] text-white grid place-items-center text-[11px]">➤</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "15%", label: "Match % badge" },
      { n: 2, x: "50%", y: "27%", label: "Compatibility recap" },
      { n: 3, x: "50%", y: "55%", label: "Thread" },
    ],
  })) as Builder,

  // 17. Bumble - Verify + detect
  dateBumbleSafety: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-[11px] font-semibold text-[#FFC629]">Safety tools</div>
        <div className="rounded-xl border-2 border-[#FFC629] bg-[#FFC629]/10 p-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#FFC629] text-black grid place-items-center text-[14px]">✓</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] font-semibold">Photo verified</div>
              <div className="text-[8.5px] text-foreground/60">Selfie matches your profile photos.</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 p-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-foreground/8 grid place-items-center text-[14px]">🛡️</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] font-semibold">Private Detector</div>
              <div className="text-[8.5px] text-foreground/60">Auto-blurs lewd images sent to you.</div>
            </div>
            <div className="w-8 h-4 rounded-full bg-[#FFC629] relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" /></div>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 p-2">
          <div className="text-[10.5px] font-semibold">Deception Detector</div>
          <div className="text-[8.5px] text-foreground/60">Flags spam/scam patterns automatically.</div>
        </div>
        <div className="flex-1" />
        <CTA>Manage safety</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Photo verified" },
      { n: 2, x: "50%", y: "48%", label: "Private detector" },
      { n: 3, x: "85%", y: "48%", label: "Toggle on" },
    ],
  })) as Builder,

  // 18. Hinge - Report + block
  dateHingeReport: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-[11px] font-semibold">Olivia · Safety</div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-xl border-2 border-red-500/60 bg-red-500/8 p-2 text-center">
            <div className="text-[18px]">🚫</div>
            <div className="text-[10px] font-semibold text-red-600">Block</div>
            <div className="text-[8px] text-foreground/55">Hide from each other</div>
          </div>
          <div className="rounded-xl border-2 border-orange-500/60 bg-orange-500/8 p-2 text-center">
            <div className="text-[18px]">⚑</div>
            <div className="text-[10px] font-semibold text-orange-600">Report</div>
            <div className="text-[8px] text-foreground/55">Tell us what happened</div>
          </div>
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Why are you reporting?</div>
        <div className="flex flex-col gap-1">
          {["Inappropriate messages","Fake profile","Underage","Spam or scam","Harassment"].map((r,i)=>(
            <div key={i} className="flex items-center justify-between p-1.5 rounded-md border border-border/60 text-[10px]">
              <span>{r}</span><span className="text-foreground/40">›</span>
            </div>
          ))}
        </div>
        <div className="flex-1" />
        <CTA>Submit report</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "25%", y: "22%", label: "Block" },
      { n: 2, x: "75%", y: "22%", label: "Report" },
      { n: 3, x: "50%", y: "55%", label: "Clear reasons" },
    ],
  })) as Builder,

  // 19. Tinder - Photo verify
  dateTinderVerify: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-center">
          <div className="font-display text-[14px]">Verify your photo</div>
          <div className="text-[9px] text-foreground/55">Pose to match the prompt. Stays private.</div>
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-blue-500/60 bg-blue-500/5">
          <div className="absolute inset-6 rounded-full border-2 border-blue-500/60" />
          <div className="absolute inset-x-0 top-3 text-center text-[9px] text-blue-600 font-medium">Look up, touch your nose</div>
          <div className="absolute inset-x-0 bottom-3 text-center text-[8.5px] text-foreground/55">3 of 3 poses</div>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/8 p-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white grid place-items-center text-[14px]">✓</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-semibold text-emerald-600">Verified badge unlocked</div>
            <div className="text-[8.5px] text-foreground/55">Adds a blue ✓ to your profile.</div>
          </div>
        </div>
        <div className="flex-1" />
        <CTA>Take photo</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Pose prompt" },
      { n: 2, x: "50%", y: "50%", label: "Selfie match" },
      { n: 3, x: "50%", y: "72%", label: "Verified badge" },
    ],
  })) as Builder,

  // 20. OkCupid - Privacy controls
  dateOkcPrivacy: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DateBar />
        <div className="text-[11px] font-semibold text-[#FF3A57]">Privacy & visibility</div>
        <div className="rounded-md border border-border/60 divide-y divide-border/60">
          {[
            ["Profile visibility","Public",true],
            ["Hide from coworkers","On",true],
            ["Show online status","Off",false],
            ["Incognito Mode","Premium",false],
            ["Read receipts","On",true],
            ["Distance shown","Approximate",true],
          ].map(([l,v,on],i)=>(
            <div key={i} className="flex items-center justify-between p-1.5">
              <div className="min-w-0">
                <div className="text-[10px] font-medium truncate">{l as string}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{v as string}</div>
              </div>
              <div className={`w-8 h-4 rounded-full relative ${on?"bg-[#FF3A57]":"bg-foreground/15"}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white ${on?"right-0.5":"left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-1.5 text-[8.5px] text-foreground/60">Granular controls - choose exactly who sees what.</div>
        <div className="flex-1" />
        <CTA>Save changes</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Privacy hub" },
      { n: 2, x: "85%", y: "40%", label: "Per-setting toggle" },
      { n: 3, x: "50%", y: "80%", label: "Granular" },
    ],
  })) as Builder,
});

// ============================================================
// EDTECH - 20 brand-evocative screens
// ============================================================
const EduBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

Object.assign(screens, {
  // 1. Duolingo - Goal + first lesson
  eduDuoGoal: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-center">
          <div className="text-[28px]">🦉</div>
          <div className="font-display text-[14px] text-[#58CC02]">Why are you learning Spanish?</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {[["🎓","Boost my education"],["🌎","Prep for travel",true],["🧠","Just for fun"],["💼","Career"]].map(([e,t,sel],i)=>(
            <div key={i} className={`flex items-center gap-2 p-2 rounded-xl border-2 ${sel?"border-[#58CC02] bg-[#58CC02]/8":"border-border/60"}`}>
              <div className="text-[16px]">{e}</div>
              <div className="text-[10.5px] font-semibold">{t}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[#58CC02]/10 border border-[#58CC02]/40 p-2 text-center">
          <div className="text-[8.5px] uppercase tracking-wider text-[#58CC02]">Your first lesson</div>
          <div className="text-[10.5px] font-semibold mt-0.5">Order a coffee in Spanish ☕</div>
          <div className="text-[8.5px] text-foreground/55">3 min · 5 XP</div>
        </div>
        <div className="flex-1" />
        <CTA>Let's go!</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Pick a goal" },
      { n: 2, x: "50%", y: "50%", label: "Friendly options" },
      { n: 3, x: "50%", y: "75%", label: "Jump into lesson 1" },
    ],
  })) as Builder,

  // 2. Coursera - Goal + path
  eduCourseraPath: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[10px] text-foreground/55">Your goal</div>
        <div className="text-[12px] font-semibold">Become a Data Analyst</div>
        <div className="rounded-md bg-[#0056D2]/10 border border-[#0056D2]/40 p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-[#0056D2]">Google Data Analytics</div>
          <div className="text-[10px] font-medium">Professional Certificate · 6 months</div>
          <div className="text-[8.5px] text-foreground/60">8 courses · 4.8★ · 1.2M enrolled</div>
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Your learning path</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["1","Foundations","in progress","#0056D2"],
            ["2","Ask Questions w/ Data","",""],
            ["3","Prepare Data","",""],
            ["4","Process Data","",""],
            ["5","Analyze + Visualize","",""],
            ["6","Capstone Project","",""],
          ].map(([n,t,s,c],i)=>(
            <div key={i} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full grid place-items-center text-[10px] font-semibold ${i===0?"bg-[#0056D2] text-white":"bg-foreground/8 text-foreground/60"}`}>{n}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                {s && <div className="text-[8.5px] text-[#0056D2]">{s}</div>}
              </div>
              {i<5 && <div className="text-foreground/30 text-[10px]">→</div>}
            </div>
          ))}
        </div>
        <CTA>Start path</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Outcome goal" },
      { n: 2, x: "50%", y: "32%", label: "Specialization" },
      { n: 3, x: "50%", y: "60%", label: "Structured path" },
    ],
  })) as Builder,

  // 3. Khan - Diagnostic
  eduKhanDiagnostic: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-[#14BF96]">Quick check</div>
          <div className="text-[9px] text-foreground/55">Q 4 of 8</div>
        </div>
        <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden"><div className="h-full w-1/2 bg-[#14BF96]" /></div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55 mt-1">Algebra · Equations</div>
        <div className="text-[12px] font-medium leading-snug">If 3x + 5 = 20, what is x?</div>
        <div className="grid grid-cols-2 gap-1.5">
          {[["A","3"],["B","5",true],["C","7"],["D","15"]].map(([k,v,sel],i)=>(
            <div key={i} className={`p-2 rounded-md border ${sel?"border-2 border-[#14BF96] bg-[#14BF96]/8":"border-border/60"}`}>
              <div className="text-[8.5px] text-foreground/55">{k}</div>
              <div className="text-[12px] font-display">{v}</div>
            </div>
          ))}
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-1.5 text-[8.5px] text-foreground/60">No grade - we'll place you at the right level.</div>
        <div className="flex-1" />
        <CTA>Next question</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "13%", label: "Diagnostic progress" },
      { n: 2, x: "50%", y: "35%", label: "Placement question" },
      { n: 3, x: "50%", y: "75%", label: "No-stakes copy" },
    ],
  })) as Builder,

  // 4. MasterClass - Inspire reel
  eduMcReel: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/5 to-background pointer-events-none" />
        <EduBar />
        <div className="relative flex-1 rounded-lg overflow-hidden">
          <Photo seed={2} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute top-2 left-2 text-[10px] uppercase tracking-[0.2em] text-white/90 font-display">MasterClass</div>
          <div className="absolute inset-x-3 bottom-3 text-white">
            <div className="text-[8.5px] uppercase tracking-wider opacity-80">Featured</div>
            <div className="font-display text-[18px] leading-tight">Aaron Sorkin teaches Screenwriting</div>
            <div className="text-[9px] opacity-80 mt-0.5">35 lessons · 6 hours · 4K cinematic</div>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-12 h-12 rounded-full bg-white/95 grid place-items-center text-black text-[18px]">▶</div>
          </div>
        </div>
        <div className="text-[9px] text-center text-foreground/60">100+ instructors · From $10/mo</div>
        <div className="h-11 rounded-md bg-foreground text-background grid place-items-center text-[12px] font-semibold tracking-wide">Watch intro reel</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Cinematic still" },
      { n: 2, x: "50%", y: "60%", label: "Star instructor" },
      { n: 3, x: "50%", y: "92%", label: "Play reel" },
    ],
  })) as Builder,

  // 5. Coursera - Outcome filters
  eduCourseraFilters: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[11px] font-semibold">Find your course</div>
        <div className="h-7 rounded-md bg-foreground/[0.06] border border-border/60 px-2 grid items-center text-[10px] text-foreground/55">Search 7,000+ courses</div>
        <div className="flex gap-1 flex-wrap">
          {["Skill: SQL","Credential","4★+","Beginner"].map((f,i)=>(<Chip key={i} accent={i<2}>{f}</Chip>))}
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["IBM Data Science","Professional Certificate","4.6★ · 142k","Earn credential"],
            ["Google UX Design","Professional Certificate","4.8★ · 89k","Earn credential"],
            ["Excel to MySQL","Specialization · Duke","4.6★ · 24k","Skill: SQL"],
          ].map(([t,k,r,o],i)=>(
            <div key={i} className="flex gap-2 p-1.5 rounded-md border border-border/60">
              <Photo seed={i} className="w-10 h-10 rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{k} · {r}</div>
                <div className="text-[8.5px] text-[#0056D2] mt-0.5">{o}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Apply filters</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Outcome filters" },
      { n: 2, x: "50%", y: "55%", label: "Credentialed courses" },
      { n: 3, x: "85%", y: "55%", label: "Ratings + scale" },
    ],
  })) as Builder,

  // 6. Udemy - Ratings + sales
  eduUdemyDeals: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold">Top courses</div>
          <Chip accent>🔥 Flash sale</Chip>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["The Complete Web Dev Bootcamp","Dr. Angela Yu","4.7","312,841","$84.99","$13.99"],
            ["Python for Data Science","Jose Portilla","4.6","198,432","$94.99","$15.99"],
            ["UX/UI Figma Masterclass","Daniel W.","4.7","42,109","$74.99","$11.99"],
            ["AWS Certified Solutions","Stéphane M.","4.7","256,712","$94.99","$13.99"],
          ].map(([t,a,r,n,old,sale],i)=>(
            <div key={i} className="flex gap-2 p-1.5 rounded-md border border-border/60">
              <Photo seed={i} className="w-12 h-9 rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{a}</div>
                <div className="flex items-center gap-1 text-[8.5px]">
                  <span className="text-amber-500">★ {r}</span>
                  <span className="text-foreground/55">({n})</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#A435F0]">{sale}</div>
                <div className="text-[8.5px] text-foreground/40 line-through">{old}</div>
                <div className="text-[7.5px] text-red-600">85% off</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] text-center text-foreground/55">Ends in 2 days · Sale price</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "82%", y: "12%", label: "Flash sale" },
      { n: 2, x: "82%", y: "42%", label: "Sale price" },
      { n: 3, x: "50%", y: "42%", label: "Ratings + reviews" },
    ],
  })) as Builder,

  // 7. MasterClass - Star instructors
  eduMcInstructors: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[10px] uppercase tracking-[0.2em] font-display">Instructors</div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Gordon Ramsay","Cooking"],
            ["Serena Williams","Tennis"],
            ["Aaron Sorkin","Writing"],
            ["Neil deGrasse Tyson","Science"],
          ].map(([n,c],i)=>(
            <div key={i} className="relative rounded-md overflow-hidden border border-border/60">
              <Photo seed={i} className="aspect-[3/4]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <div className="absolute inset-x-1.5 bottom-1.5 text-white">
                <div className="text-[8px] uppercase tracking-wider opacity-80">{c}</div>
                <div className="font-display text-[11px] leading-tight">{n}</div>
              </div>
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/95 text-black grid place-items-center text-[10px]">▶</div>
            </div>
          ))}
        </div>
        <div className="h-10 rounded-md bg-foreground text-background grid place-items-center text-[11px] font-semibold tracking-wide">Browse all 200+</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "25%", y: "40%", label: "Famous instructor" },
      { n: 2, x: "75%", y: "40%", label: "Cinematic card" },
      { n: 3, x: "50%", y: "92%", label: "Browse all" },
    ],
  })) as Builder,

  // 8. Khan - Subject tree
  eduKhanTree: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[11px] font-semibold text-[#14BF96]">Math</div>
        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden text-[10px]">
          <div className="font-semibold py-1">▾ Algebra 1</div>
          <div className="pl-4 py-0.5 text-foreground/70">▾ Solving equations</div>
          <div className="pl-8 py-0.5 flex items-center justify-between"><span>One-step equations</span><span className="text-[#14BF96] text-[8.5px]">✓ Mastered</span></div>
          <div className="pl-8 py-0.5 flex items-center justify-between"><span>Two-step equations</span><span className="text-amber-500 text-[8.5px]">In progress</span></div>
          <div className="pl-8 py-0.5 flex items-center justify-between text-foreground/60"><span>Multi-step equations</span><span className="text-[8.5px]">Locked</span></div>
          <div className="pl-4 py-0.5 text-foreground/70">▸ Linear functions</div>
          <div className="pl-4 py-0.5 text-foreground/70">▸ Inequalities</div>
          <div className="font-semibold py-1">▸ Geometry</div>
          <div className="font-semibold py-1">▸ Algebra 2</div>
          <div className="font-semibold py-1">▸ Trigonometry</div>
          <div className="font-semibold py-1">▸ Calculus</div>
        </div>
        <div className="rounded-md bg-[#14BF96]/10 border border-[#14BF96]/40 p-1.5 text-[8.5px] text-foreground/65">Structured K-12 tree · learn at your pace</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "40%", label: "Subject tree" },
      { n: 2, x: "80%", y: "32%", label: "Mastery state" },
      { n: 3, x: "50%", y: "88%", label: "Self-paced" },
    ],
  })) as Builder,

  // 9. Duolingo - Bite-size interactive
  eduDuoLesson: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="flex items-center gap-2">
          <div className="text-[14px]">✕</div>
          <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden"><div className="h-full w-2/5 bg-[#58CC02]" /></div>
          <div className="text-[11px]">❤ 5</div>
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Translate this sentence</div>
        <div className="rounded-xl bg-foreground/[0.04] border border-border/60 p-2.5">
          <div className="flex items-center gap-2">
            <div className="text-[24px]">🦉</div>
            <div className="text-[13px] font-display">"Yo bebo agua."</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {["I","drink","water"].map((w,i)=>(
            <div key={i} className="px-2 py-1 rounded-md border-2 border-[#58CC02] bg-[#58CC02]/8 text-[11px] font-semibold">{w}</div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {["eat","you","milk","they"].map((w,i)=>(
            <div key={i} className="px-2 py-1 rounded-md border-b-4 border-border bg-background text-[11px]">{w}</div>
          ))}
        </div>
        <div className="rounded-md bg-[#58CC02]/15 border border-[#58CC02]/50 p-1.5 text-[10px] text-[#58CC02] font-semibold">✓ Excellent! +10 XP</div>
        <div className="flex-1" />
        <div className="h-10 rounded-xl bg-[#58CC02] text-white grid place-items-center text-[12px] font-bold">CONTINUE</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Hearts + progress" },
      { n: 2, x: "50%", y: "40%", label: "Bite-size exercise" },
      { n: 3, x: "50%", y: "70%", label: "Instant feedback" },
    ],
  })) as Builder,

  // 10. Khan - Video + practice
  eduKhanVideo: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="relative aspect-video rounded-md overflow-hidden bg-foreground/10 border border-border/60">
          <Photo seed={1} className="absolute inset-0" />
          <div className="absolute inset-0 grid place-items-center"><div className="w-10 h-10 rounded-full bg-white/95 grid place-items-center text-black text-[14px]">▶</div></div>
          <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center gap-1.5 text-white text-[8.5px]">
            <span>4:12</span><div className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-[#14BF96]" /></div><span>12:48</span>
          </div>
        </div>
        <div className="text-[10.5px] font-semibold">Solving two-step equations</div>
        <div className="text-[8.5px] text-foreground/55">Sal Khan · 12 min</div>
        <div className="rounded-md border-2 border-[#14BF96]/40 bg-[#14BF96]/8 p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-[#14BF96]">Now: Practice</div>
          <div className="text-[10.5px] font-medium mt-0.5">Solve: 2x + 4 = 14</div>
          <div className="grid grid-cols-2 gap-1 mt-1.5">
            {["x = 3","x = 5","x = 7","x = 9"].map((a,i)=>(
              <div key={i} className={`text-center py-1 rounded border text-[10px] ${i===1?"border-[#14BF96] bg-[#14BF96]/10 font-semibold":"border-border/60"}`}>{a}</div>
            ))}
          </div>
        </div>
        <div className="flex-1" />
        <CTA>Check answer</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Video lesson" },
      { n: 2, x: "50%", y: "65%", label: "Pair with practice" },
      { n: 3, x: "50%", y: "92%", label: "Check answer" },
    ],
  })) as Builder,

  // 11. Coursera - Lecture + quiz
  eduCourseraLecture: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="relative aspect-video rounded-md overflow-hidden bg-foreground/15 border border-border/60">
          <Photo seed={3} className="absolute inset-0" />
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#0056D2] text-white text-[8px]">Week 3 · Lecture 4</div>
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1.5 text-white text-[8.5px]">
            <span>▶</span><span>10:24 / 18:02</span><div className="flex-1" /><span>1.25×</span><span>CC</span>
          </div>
        </div>
        <div className="text-[10.5px] font-semibold">Regression in Practice</div>
        <div className="text-[8.5px] text-foreground/55">Prof. M. Chen · Duke University</div>
        <div className="rounded-md border border-[#0056D2]/40 bg-[#0056D2]/5 p-2">
          <div className="flex items-center justify-between">
            <div className="text-[8.5px] uppercase tracking-wider text-[#0056D2]">Up next: Quiz</div>
            <div className="text-[8.5px] text-foreground/55">5 questions · graded</div>
          </div>
          <div className="text-[10.5px] font-medium mt-0.5">Module 3 Quiz</div>
          <div className="h-1 bg-foreground/10 rounded-full mt-1 overflow-hidden"><div className="h-full w-1/4 bg-[#0056D2]" /></div>
        </div>
        <div className="flex-1" />
        <CTA>Start graded quiz</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "University lecture" },
      { n: 2, x: "50%", y: "65%", label: "Graded quiz after" },
      { n: 3, x: "50%", y: "92%", label: "Continue to quiz" },
    ],
  })) as Builder,

  // 12. MasterClass - Cinematic video
  eduMcVideo: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="relative flex-1 rounded-md overflow-hidden">
          <Photo seed={0} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
          <div className="absolute top-2 left-2 text-white">
            <div className="text-[8px] uppercase tracking-[0.2em] opacity-80 font-display">MasterClass</div>
            <div className="text-[10px] opacity-90">Lesson 4 of 35</div>
          </div>
          <div className="absolute inset-0 grid place-items-center"><div className="w-14 h-14 rounded-full bg-white/95 grid place-items-center text-black text-[20px]">▶</div></div>
          <div className="absolute inset-x-3 bottom-3 text-white">
            <div className="font-display text-[15px] leading-tight">Crafting the Opening Scene</div>
            <div className="text-[8.5px] opacity-80">Aaron Sorkin · 14:22 · 4K</div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[8.5px]">
              <span>03:14</span>
              <div className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"><div className="h-full w-1/5 bg-white" /></div>
              <span>14:22</span>
            </div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Cinematic shot" },
      { n: 2, x: "50%", y: "70%", label: "Famous instructor" },
      { n: 3, x: "85%", y: "70%", label: "4K production" },
    ],
  })) as Builder,

  // 13. Duolingo - Streaks + XP
  eduDuoStreak: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-center">
          <div className="text-[36px]">🔥</div>
          <div className="font-display text-[28px] text-[#FF9600] leading-none">142</div>
          <div className="text-[10px] text-foreground/60">day streak</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["M","T","W","T","F","S","S"].map((d,i)=>(
            <div key={i} className="text-center">
              <div className="text-[8.5px] text-foreground/55">{d}</div>
              <div className={`mx-auto mt-0.5 w-6 h-6 rounded-full grid place-items-center text-[11px] ${i<5?"bg-[#FF9600] text-white":"bg-foreground/8"}`}>{i<5?"🔥":""}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-border/60 p-1.5 text-center">
            <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">XP today</div>
            <div className="font-display text-[16px] text-[#58CC02]">85</div>
          </div>
          <div className="rounded-md border border-border/60 p-1.5 text-center">
            <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">League</div>
            <div className="font-display text-[12px]">💎 Diamond</div>
            <div className="text-[8.5px] text-foreground/55">Rank 4 of 30</div>
          </div>
        </div>
        <div className="flex-1" />
        <CTA>Earn XP now</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Streak counter" },
      { n: 2, x: "50%", y: "45%", label: "Daily flame grid" },
      { n: 3, x: "75%", y: "70%", label: "League rank" },
    ],
  })) as Builder,

  // 14. Coursera - Certificates
  eduCourseraCerts: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[11px] font-semibold">Your credentials</div>
        <div className="text-[8.5px] text-foreground/55">3 earned · share on LinkedIn</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Google Data Analytics","Professional Certificate","Issued Mar 2026","#0056D2"],
            ["Meta Front-End Developer","Professional Certificate","Issued Jan 2026","#0056D2"],
            ["Excel to MySQL","Specialization · Duke","Issued Oct 2025","#0056D2"],
          ].map(([t,k,d,c],i)=>(
            <div key={i} className="rounded-md border-2 border-[#0056D2]/30 bg-gradient-to-br from-[#0056D2]/8 to-transparent p-2">
              <div className="flex items-start gap-2">
                <div className="w-8 h-10 rounded bg-[#0056D2] text-white grid place-items-center text-[12px]">🎓</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] font-semibold truncate">{t}</div>
                  <div className="text-[8.5px] text-foreground/55 truncate">{k}</div>
                  <div className="text-[8.5px] text-[#0056D2] mt-0.5">{d}</div>
                </div>
                <div className="text-[8.5px] text-[#0056D2]">Share</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Add to LinkedIn</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Credentials earned" },
      { n: 2, x: "50%", y: "50%", label: "Certificate card" },
      { n: 3, x: "50%", y: "92%", label: "Share to LinkedIn" },
    ],
  })) as Builder,

  // 15. Khan - Mastery bars
  eduKhanMastery: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[11px] font-semibold text-[#14BF96]">Algebra 1 mastery</div>
        <div className="rounded-md bg-[#14BF96]/10 border border-[#14BF96]/40 p-2 text-center">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/60">Course mastery</div>
          <div className="font-display text-[22px] text-[#14BF96]">68%</div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Solving equations",95,"Mastered"],
            ["Linear functions",78,"Proficient"],
            ["Inequalities",55,"Familiar"],
            ["Systems of equations",30,"Attempted"],
            ["Functions",10,"Not started"],
          ].map(([t,v,lbl],i)=>(
            <div key={i}>
              <div className="flex justify-between text-[9.5px]"><span>{t}</span><span className="text-foreground/55 text-[8.5px]">{lbl}</span></div>
              <div className="h-2 bg-foreground/10 rounded-full overflow-hidden mt-0.5 flex">
                <div className="h-full bg-[#14BF96]" style={{width:`${v}%`}} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] text-foreground/55 text-center">Mastery grows as you practice</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Course mastery" },
      { n: 2, x: "50%", y: "55%", label: "Per-skill bars" },
      { n: 3, x: "80%", y: "50%", label: "Mastery levels" },
    ],
  })) as Builder,

  // 16. Udemy - Completion %
  eduUdemyProgress: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[11px] font-semibold">My learning</div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Web Dev Bootcamp","Angela Yu","68",185,"of 65 hours"],
            ["Python for DS","Jose Portilla","32",95,"of 22 hours"],
            ["Figma Masterclass","Daniel W.","100",100,"of 14 hours"],
          ].map(([t,a,pct,n,u],i)=>(
            <div key={i} className="p-2 rounded-md border border-border/60">
              <div className="flex items-start gap-2">
                <Photo seed={i} className="w-10 h-7 rounded shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium truncate">{t}</div>
                  <div className="text-[8.5px] text-foreground/55 truncate">{a} · {u}</div>
                </div>
                <div className="text-[12px] font-mono text-[#A435F0]">{pct}%</div>
              </div>
              <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden mt-1.5"><div className="h-full bg-[#A435F0]" style={{width:`${pct}%`}} /></div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] text-foreground/55 text-center">Pick up where you left off</div>
        <CTA>Resume course</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "32%", label: "% complete" },
      { n: 2, x: "50%", y: "42%", label: "Progress bar" },
      { n: 3, x: "50%", y: "92%", label: "Resume" },
    ],
  })) as Builder,

  // 17. Duolingo - Streak reminder
  eduDuoReminder: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="rounded-2xl bg-gradient-to-br from-[#FF9600]/20 to-foreground/[0.03] border-2 border-[#FF9600]/40 p-3 text-center">
          <div className="text-[48px] leading-none">🔥</div>
          <div className="font-display text-[14px] text-[#FF9600]">Don't lose your streak!</div>
          <div className="text-[9px] text-foreground/65">You're 1 lesson away from saving your 142-day streak.</div>
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-foreground/5 text-[9px]"><span>⏱</span>Expires in 2h 18m</div>
        </div>
        <div className="rounded-md border border-border/60 p-2 text-[9.5px] flex items-center gap-2">
          <div className="text-[16px]">🦉</div>
          <div>"Hey, this is your owl. I'm watching you."</div>
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Quickest save</div>
          <div className="text-[10px] font-medium">Greetings · 2 min · 5 XP</div>
        </div>
        <div className="flex-1" />
        <div className="h-10 rounded-xl bg-[#58CC02] text-white grid place-items-center text-[12px] font-bold">SAVE MY STREAK</div>
        <div className="text-[9px] text-center text-foreground/40">No thanks</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Streak in jeopardy" },
      { n: 2, x: "50%", y: "35%", label: "Countdown" },
      { n: 3, x: "50%", y: "85%", label: "One-tap save" },
    ],
  })) as Builder,

  // 18. Coursera - Deadlines
  eduCourseraDeadlines: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold">Upcoming</div>
          <Chip accent>2 overdue</Chip>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Today","Module 3 Quiz","Data Analytics","red"],
            ["Thu","Peer review · 3 due","UX Design","amber"],
            ["Sun","Capstone draft","Data Analytics","amber"],
            ["Apr 28","Final exam","ML Specialization",""],
            ["May 4","Project submission","Front-End",""],
          ].map(([d,t,c,col],i)=>(
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-md border border-border/60">
              <div className={`w-10 text-center rounded p-1 text-[8.5px] font-mono ${col==="red"?"bg-red-500/15 text-red-600":col==="amber"?"bg-amber-500/15 text-amber-600":"bg-foreground/8 text-foreground/65"}`}>{d}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{c}</div>
              </div>
              <div className="text-foreground/40 text-[12px]">›</div>
            </div>
          ))}
        </div>
        <CTA>Sync to Google Calendar</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "82%", y: "13%", label: "Overdue alert" },
      { n: 2, x: "15%", y: "32%", label: "Due dates" },
      { n: 3, x: "50%", y: "92%", label: "Sync schedule" },
    ],
  })) as Builder,

  // 19. MasterClass - New classes
  eduMcNew: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="text-[10px] uppercase tracking-[0.2em] font-display">New this month</div>
        <div className="relative h-24 rounded-md overflow-hidden">
          <Photo seed={2} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] uppercase tracking-wider">New</div>
          <div className="absolute inset-x-2 bottom-2 text-white">
            <div className="text-[8px] uppercase tracking-wider opacity-80">Cinema</div>
            <div className="font-display text-[13px] leading-tight">Christopher Nolan: Filmmaking</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Just released","Hans Zimmer · Scoring II"],
            ["Coming Apr 28","Issa Rae · Writing for TV"],
            ["Back catalog","Wolfgang Puck · Cooking"],
          ].map(([tag,t],i)=>(
            <div key={i} className="flex gap-2 items-center">
              <Photo seed={i+1} className="w-12 h-10 rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">{tag}</div>
                <div className="text-[10px] font-medium truncate">{t}</div>
              </div>
              <div className="text-[10px]">▶</div>
            </div>
          ))}
        </div>
        <div className="h-10 rounded-md bg-foreground text-background grid place-items-center text-[11px] font-semibold">Watch what's new</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "28%", label: "Fresh release" },
      { n: 2, x: "15%", y: "27%", label: "NEW badge" },
      { n: 3, x: "50%", y: "65%", label: "Re-engage list" },
    ],
  })) as Builder,

  // 20. Udemy - Sales emails / promo
  eduUdemySale: ((_ctx, _p) => ({
    node: (
      <Frame>
        <EduBar />
        <div className="rounded-xl bg-gradient-to-br from-[#A435F0] to-[#5d1690] text-white p-3 text-center">
          <div className="text-[8.5px] uppercase tracking-[0.2em] opacity-80">Flash sale · 48 hours</div>
          <div className="font-display text-[22px] leading-tight">Courses from $9.99</div>
          <div className="text-[10px] opacity-90 mt-0.5">Up to 85% off · today only</div>
          <div className="mt-2 inline-flex gap-1 font-mono text-[12px]">
            <span className="px-1.5 py-0.5 rounded bg-white/15">02</span>:
            <span className="px-1.5 py-0.5 rounded bg-white/15">14</span>:
            <span className="px-1.5 py-0.5 rounded bg-white/15">38</span>
          </div>
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Picked for you</div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {[
            ["Web Dev Bootcamp","$84.99","$9.99"],
            ["Python Bootcamp","$94.99","$11.99"],
            ["React - The Complete Guide","$84.99","$9.99"],
          ].map(([t,old,sale],i)=>(
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-md border border-border/60">
              <Photo seed={i} className="w-10 h-7 rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] truncate">{t}</div>
              </div>
              <div className="text-right">
                <div className="text-[10.5px] font-semibold text-[#A435F0]">{sale}</div>
                <div className="text-[8px] text-foreground/40 line-through">{old}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Claim the discount</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Big promo" },
      { n: 2, x: "50%", y: "35%", label: "Countdown" },
      { n: 3, x: "85%", y: "62%", label: "Slashed prices" },
    ],
  })) as Builder,
});

// ============================================================
// DESIGN TOOLS - 20 brand-evocative screens
// ============================================================
const DesBar = () => (
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em]">●●●</span>
    <span>100%</span>
  </div>
);

const TrafficLights = () => (
  <div className="flex gap-1 items-center">
    <span className="w-2 h-2 rounded-full bg-red-500" />
    <span className="w-2 h-2 rounded-full bg-amber-400" />
    <span className="w-2 h-2 rounded-full bg-emerald-500" />
  </div>
);

Object.assign(screens, {
  // 1. Canva - Template-first
  desCanvaTemplates: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00C4CC] to-[#7D2AE8] grid place-items-center text-white text-[9px] font-bold">C</div>
          <div className="text-[11px] font-semibold">What will you design?</div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {["Insta post","Story","Presentation","Resume","Poster","Logo"].map((t,i)=>(
            <div key={i} className={`p-1 rounded-md border text-center ${i===0?"border-[#7D2AE8] bg-[#7D2AE8]/8":"border-border/60"}`}>
              <Photo seed={i} className="aspect-square rounded mb-0.5" />
              <div className="text-[8.5px] truncate">{t}</div>
            </div>
          ))}
        </div>
        <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Start from a template</div>
        <div className="grid grid-cols-3 gap-1 flex-1 overflow-hidden">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/60 relative">
              <Photo seed={i+2} className="aspect-square" />
              {i===2 && <div className="absolute top-0.5 right-0.5 text-[7.5px] bg-amber-400 text-black rounded px-1">Pro</div>}
            </div>
          ))}
        </div>
        <CTA>Browse all templates</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Pick a format" },
      { n: 2, x: "50%", y: "55%", label: "Template gallery" },
      { n: 3, x: "50%", y: "92%", label: "Start instantly" },
    ],
  })) as Builder,

  // 2. Figma - Blank + tutorial
  desFigmaBlank: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1.5 -mt-1">
          <TrafficLights />
          <div className="flex gap-0.5 ml-1">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <div className="w-3 h-3 rounded-sm bg-purple-500" />
          </div>
          <div className="text-[9px] font-mono text-foreground/55 ml-auto">Untitled</div>
        </div>
        <div className="flex gap-1 flex-1">
          <div className="w-12 rounded-md border border-border/60 p-1 text-[8.5px] space-y-0.5">
            <div className="text-foreground/55">Layers</div>
            <div>▸ Page 1</div>
          </div>
          <div className="relative flex-1 rounded-md border border-border/60 bg-[radial-gradient(circle,_currentColor_0.5px,_transparent_0.5px)] [background-size:8px_8px] text-foreground/20">
            <div className="absolute inset-4 rounded-lg border-2 border-dashed border-foreground/25 grid place-items-center text-foreground/40 text-[10px]">Empty canvas</div>
            <div className="absolute bottom-2 right-2 w-32 rounded-md bg-foreground text-background p-1.5 shadow-lg text-[8.5px]">
              <div className="font-semibold mb-0.5">👋 Welcome to Figma</div>
              <div className="opacity-80">Press R to draw a rectangle, T for text.</div>
              <div className="mt-1 flex gap-1"><span className="px-1 rounded bg-white/15">1 of 5</span><span className="ml-auto">Next →</span></div>
            </div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "40%", label: "Blank canvas" },
      { n: 2, x: "78%", y: "75%", label: "Tutorial overlay" },
      { n: 3, x: "78%", y: "85%", label: "Step 1 of 5" },
    ],
  })) as Builder,

  // 3. Framer - Site template
  desFramerSite: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="text-[11px] font-semibold">Start a site</div>
        <div className="flex gap-1 flex-wrap">
          {["All","Portfolio","SaaS","Agency","Blog"].map((c,i)=>(<Chip key={i} accent={i===2}>{c}</Chip>))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["Vapor","SaaS · Animated"],
            ["Atelier","Portfolio · Mono"],
            ["Linear-ish","Startup"],
            ["Editorial","Magazine"],
          ].map(([n,t],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/60 relative">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-foreground/15 to-foreground/5">
                <Photo seed={i} className="absolute inset-0" />
                <div className="absolute inset-x-1 bottom-1 bg-background/95 rounded px-1 py-0.5">
                  <div className="text-[9px] font-semibold truncate">{n}</div>
                  <div className="text-[8px] text-foreground/55 truncate">{t}</div>
                </div>
                <div className="absolute top-1 right-1 text-[7.5px] bg-foreground text-background rounded px-1">⚡ Responsive</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Start with Vapor</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Site templates" },
      { n: 2, x: "82%", y: "40%", label: "Responsive badge" },
      { n: 3, x: "50%", y: "92%", label: "Launch in editor" },
    ],
  })) as Builder,

  // 4. Sketch - Mac-native start
  desSketchStart: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1.5 -mt-1">
          <TrafficLights />
          <div className="text-[9px] font-mono text-foreground/60 ml-1">Sketch - New Document</div>
        </div>
        <div className="flex gap-1 flex-1">
          <div className="w-16 rounded-md bg-foreground/[0.04] border border-border/60 p-1 text-[8.5px] space-y-0.5">
            <div className="text-foreground/55 uppercase tracking-wider text-[7.5px]">Recent</div>
            <div className="rounded bg-foreground/8 px-1 py-0.5">Recents</div>
            <div className="px-1 py-0.5">Cloud</div>
            <div className="px-1 py-0.5">Templates</div>
            <div className="px-1 py-0.5">Trash</div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Start a new document</div>
            <div className="grid grid-cols-3 gap-1">
              {[["iPhone 15","393×852"],["MacBook","1440×900"],["A4","595×842"],["iPad","1024×1366"],["Apple Watch","176×216"],["Custom","-"]].map(([n,s],i)=>(
                <div key={i} className="rounded-md border border-border/60 p-1 text-center bg-background">
                  <div className="h-7 grid place-items-center text-foreground/40 text-[14px]">▭</div>
                  <div className="text-[8px] font-medium truncate">{n}</div>
                  <div className="text-[7px] text-foreground/55 font-mono">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1">
          <div className="text-[9px] px-2 py-1 rounded border border-border/60">Open…</div>
          <div className="text-[9px] px-2 py-1 rounded bg-blue-500 text-white">Create</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "12%", y: "12%", label: "Mac chrome" },
      { n: 2, x: "55%", y: "50%", label: "Native sizes" },
      { n: 3, x: "82%", y: "90%", label: "Create" },
    ],
  })) as Builder,

  // 5. Canva - Huge library
  desCanvaLibrary: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="h-8 rounded-full bg-foreground/[0.06] border border-border/60 px-3 grid items-center text-[10px] text-foreground/55">🔔 Search 1M+ templates</div>
        <div className="flex gap-1 overflow-hidden">
          {["All","Social","Docs","Video","Print","Marketing","Edu"].map((c,i)=>(<Chip key={i} accent={i===1}>{c}</Chip>))}
        </div>
        <div className="grid grid-cols-3 gap-1 flex-1 overflow-hidden">
          {Array.from({length:9}).map((_,i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/60 relative">
              <Photo seed={i} className="aspect-[3/4]" />
              {i%3===0 && <div className="absolute top-0.5 left-0.5 text-[7px] bg-amber-400 text-black rounded px-1">Pro</div>}
              {i%4===1 && <div className="absolute top-0.5 left-0.5 text-[7px] bg-emerald-500 text-white rounded px-1">Free</div>}
            </div>
          ))}
        </div>
        <div className="text-[8.5px] text-center text-foreground/55">1,284,512 results · 9 of many</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "15%", label: "Search millions" },
      { n: 2, x: "50%", y: "55%", label: "Vast library" },
      { n: 3, x: "50%", y: "92%", label: "Result count" },
    ],
  })) as Builder,

  // 6. Adobe - Stock + assets
  desAdobeStock: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-red-600 grid place-items-center text-white text-[9px] font-bold">St</div>
          <div className="text-[11px] font-semibold">Adobe Stock</div>
        </div>
        <div className="h-7 rounded bg-foreground/[0.06] border border-border/60 px-2 grid items-center text-[10px] text-foreground/55">"mountain sunset"</div>
        <div className="flex gap-1">
          {["Photos","Vectors","Videos","Templates","3D"].map((c,i)=>(<Chip key={i} accent={i===0}>{c}</Chip>))}
        </div>
        <div className="grid grid-cols-2 gap-1 flex-1 overflow-hidden">
          {Array.from({length:4}).map((_,i)=>(
            <div key={i} className="rounded overflow-hidden border border-border/60 relative">
              <Photo seed={i+1} className="aspect-[4/3]" />
              <div className="absolute top-0.5 left-0.5 text-[7px] bg-black/70 text-white rounded px-1 font-mono">5K</div>
              <div className="absolute bottom-0 inset-x-0 bg-background/95 px-1 py-0.5 flex justify-between text-[8px]">
                <span className="truncate">Mountain #4218</span>
                <span className="text-red-600 font-semibold">License</span>
              </div>
            </div>
          ))}
        </div>
        <CTA>License selected · 1 credit</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Stock browser" },
      { n: 2, x: "20%", y: "55%", label: "Resolution badge" },
      { n: 3, x: "85%", y: "70%", label: "License" },
    ],
  })) as Builder,

  // 7. Framer - Responsive kits
  desFramerKits: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="text-[11px] font-semibold">Component kits</div>
        <div className="flex justify-center gap-1 text-[9px] text-foreground/55">
          <span className="px-1.5 py-0.5 rounded bg-foreground/8">📱</span>
          <span className="px-1.5 py-0.5 rounded bg-foreground text-background">💻</span>
          <span className="px-1.5 py-0.5 rounded bg-foreground/8">🖥</span>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {[
            ["Hero - Centered","Mobile · Tablet · Desktop"],
            ["Pricing - 3 tier","Responsive grid"],
            ["Nav - Sticky","Auto-collapses"],
            ["Testimonial carousel","Touch + arrows"],
          ].map(([t,s],i)=>(
            <div key={i} className="p-1.5 rounded-md border border-border/60">
              <div className="flex justify-between items-center">
                <div className="min-w-0">
                  <div className="text-[10px] font-medium truncate">{t}</div>
                  <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
                </div>
                <div className="flex gap-0.5 text-[8px] text-foreground/55"><span>📱</span><span>💻</span><span>🖥</span></div>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1">
                <Photo seed={i} className="aspect-video rounded" />
                <Photo seed={i+1} className="aspect-video rounded col-span-2" />
              </div>
            </div>
          ))}
        </div>
        <CTA>Insert into site</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Device toggles" },
      { n: 2, x: "82%", y: "40%", label: "Breakpoint icons" },
      { n: 3, x: "50%", y: "55%", label: "Responsive previews" },
    ],
  })) as Builder,

  // 8. Figma - Community files
  desFigmaCommunity: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="text-[11px] font-semibold">Figma Community</div>
        <div className="h-7 rounded bg-foreground/[0.06] border border-border/60 px-2 grid items-center text-[10px] text-foreground/55">Search files & plugins</div>
        <div className="flex gap-1">
          {["Files","Plugins","Widgets","Templates"].map((c,i)=>(<Chip key={i} accent={i===0}>{c}</Chip>))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {[
            ["iOS 17 UI Kit","Apple · 42k 🤍"],
            ["Wireframe Kit v3","Mozilla · 28k 🤍"],
            ["Design System Starter","Vercel · 18k 🤍"],
            ["Icon Set 8 - Free","Sara K. · 9k 🤍"],
          ].map(([t,a],i)=>(
            <div key={i} className="rounded-md overflow-hidden border border-border/60">
              <Photo seed={i} className="aspect-video" />
              <div className="p-1">
                <div className="text-[9px] font-medium truncate">{t}</div>
                <div className="text-[8px] text-foreground/55 truncate">{a}</div>
              </div>
            </div>
          ))}
        </div>
        <CTA>Open in Figma</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Community browse" },
      { n: 2, x: "30%", y: "55%", label: "File card" },
      { n: 3, x: "50%", y: "70%", label: "Author + likes" },
    ],
  })) as Builder,

  // 9. Figma - Precise vector
  desFigmaCanvas: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1.5 -mt-1">
          <TrafficLights />
          <div className="flex gap-0.5 ml-1">{["V","K","T","O","P"].map((k,i)=>(<div key={i} className={`w-4 h-4 rounded grid place-items-center text-[8px] font-mono ${i===0?"bg-blue-500 text-white":"bg-foreground/8"}`}>{k}</div>))}</div>
          <div className="text-[8.5px] font-mono text-foreground/55 ml-auto">100%</div>
        </div>
        <div className="flex gap-1 flex-1">
          <div className="w-14 rounded-md border border-border/60 p-1 text-[8px] space-y-0.5">
            <div className="text-foreground/55 uppercase tracking-wider text-[7px]">Layers</div>
            <div>▾ Frame</div>
            <div className="pl-2 bg-blue-500/15 text-blue-600 rounded px-0.5">▸ Card</div>
            <div className="pl-4">○ Icon</div>
            <div className="pl-4">T Title</div>
            <div className="pl-2">▸ Button</div>
          </div>
          <div className="relative flex-1 rounded-md border border-border/60 bg-[radial-gradient(circle,_currentColor_0.5px,_transparent_0.5px)] [background-size:8px_8px] text-foreground/15">
            <div className="absolute left-4 top-4 right-6 bottom-6 rounded-lg border-2 border-blue-500 bg-background">
              <div className="absolute inset-2 grid place-items-center text-foreground/40 text-[9px]">Card</div>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-blue-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-blue-500" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-blue-500" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-blue-500" />
            </div>
            <div className="absolute top-1 right-1 text-[7.5px] font-mono text-blue-600 bg-background/90 px-1 rounded">240 × 160</div>
          </div>
          <div className="w-14 rounded-md border border-border/60 p-1 text-[8px] space-y-0.5">
            <div className="text-foreground/55 uppercase tracking-wider text-[7px]">Design</div>
            <div>W 240</div>
            <div>H 160</div>
            <div>R 8</div>
            <div>Fill ⬜</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "12%", y: "40%", label: "Layers panel" },
      { n: 2, x: "50%", y: "45%", label: "Vector canvas" },
      { n: 3, x: "85%", y: "40%", label: "Inspector" },
    ],
  })) as Builder,

  // 10. Sketch - Native precision
  desSketchCanvas: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1.5 -mt-1">
          <TrafficLights />
          <div className="text-[9px] font-mono text-foreground/55 ml-1">Untitled.sketch</div>
          <div className="ml-auto flex gap-0.5">{["R","O","T","V","M"].map((k,i)=>(<div key={i} className="w-4 h-4 rounded-sm grid place-items-center bg-foreground/8 text-[8px] font-mono">{k}</div>))}</div>
        </div>
        <div className="flex gap-1 flex-1">
          <div className="w-12 rounded-md border border-border/60 p-1 text-[8px] space-y-0.5">
            <div className="text-foreground/55 text-[7px]">Layers</div>
            <div>▾ Page</div>
            <div className="pl-2">▾ Group</div>
            <div className="pl-4">▸ Rect</div>
          </div>
          <div className="relative flex-1 rounded-md border border-border/60 bg-foreground/[0.02]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-24 h-16 bg-foreground/8 border-2 border-orange-500 relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-orange-500" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-orange-500" />
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-orange-500" />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-orange-500" />
              </div>
            </div>
            <div className="absolute bottom-1 left-1 text-[7px] font-mono text-foreground/55">x 24 · y 18 · 1×</div>
          </div>
          <div className="w-16 rounded-md border border-border/60 p-1 text-[8px] space-y-1">
            <div className="text-foreground/55 text-[7px]">Inspector</div>
            <div>X <span className="font-mono">24</span></div>
            <div>Y <span className="font-mono">18</span></div>
            <div>W <span className="font-mono">120</span></div>
            <div>H <span className="font-mono">80</span></div>
            <div className="border-t border-border/60 pt-0.5">Radius 4</div>
            <div>Fill ⬛</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "45%", label: "Pixel-aligned shape" },
      { n: 2, x: "85%", y: "45%", label: "Numeric inspector" },
      { n: 3, x: "20%", y: "92%", label: "Native chrome" },
    ],
  })) as Builder,

  // 11. Canva - Drag simple
  desCanvaDrag: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="flex gap-1 flex-1">
          <div className="w-14 rounded-md bg-gradient-to-b from-[#00C4CC]/15 to-[#7D2AE8]/10 p-1 space-y-1 text-[8px] text-center">
            {[["📐","Templates"],["🅰","Text"],["🖼","Photos"],["🎨","Elements"],["🎬","Video"],["☁","Uploads"]].map(([e,t],i)=>(
              <div key={i} className={`rounded p-0.5 ${i===1?"bg-white/80 dark:bg-foreground/15":""}`}>
                <div className="text-[12px]">{e}</div>
                <div className="text-[7px]">{t}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 grid place-items-center rounded-md border border-border/60 bg-foreground/[0.03] relative">
            <div className="w-32 h-44 rounded shadow-md bg-gradient-to-br from-pink-400 to-purple-500 text-white grid place-items-center text-[11px] font-display tracking-wide p-2 text-center">SUMMER<br/>SALE</div>
            <div className="absolute top-1 left-1 text-[7px] font-mono text-foreground/55">Instagram Post</div>
            <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-[#7D2AE8] grid place-items-center text-white text-[8px]" style={{top:"30%",right:"22%"}}>↻</div>
          </div>
        </div>
        <div className="text-[8.5px] text-center text-foreground/55">Drag elements onto the canvas</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "15%", y: "40%", label: "Friendly sidebar" },
      { n: 2, x: "55%", y: "50%", label: "Drag-and-drop canvas" },
      { n: 3, x: "50%", y: "92%", label: "No jargon" },
    ],
  })) as Builder,

  // 12. Adobe - Deep raster
  desAdobeRaster: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1.5 -mt-1">
          <div className="w-4 h-4 rounded bg-blue-700 grid place-items-center text-white text-[8px] font-bold">Ps</div>
          <div className="text-[8.5px] font-mono text-foreground/55">untitled.psd @ 200% · RGB/8</div>
        </div>
        <div className="flex gap-0.5 flex-1">
          <div className="w-5 rounded bg-foreground/[0.04] py-1 space-y-1 text-center text-[10px]">
            {["⤢","✋","✂","🖌","🪣","✏","🎨","🔠","💧","○","T"].map((t,i)=>(<div key={i} className={`leading-none ${i===3?"text-blue-500":""}`}>{t}</div>))}
          </div>
          <div className="flex-1 rounded bg-[#2a2a2a] dark:bg-foreground/[0.04] relative overflow-hidden">
            <Photo seed={2} className="absolute inset-1" />
            <div className="absolute left-2 top-2 bg-blue-500/30 border border-blue-400 w-10 h-8" />
            <div className="absolute right-1 top-1 text-[7px] font-mono bg-black/60 text-white px-1 rounded">Brush · 24 px</div>
          </div>
          <div className="w-16 space-y-0.5 text-[8px]">
            <div className="rounded bg-foreground/[0.04] p-0.5">
              <div className="text-foreground/55 text-[7px]">Layers</div>
              <div className="bg-blue-500/15 px-0.5 rounded">🖼 Sky</div>
              <div className="px-0.5">🖼 Mountain</div>
              <div className="px-0.5">⊕ BG</div>
            </div>
            <div className="rounded bg-foreground/[0.04] p-0.5">
              <div className="text-foreground/55 text-[7px]">Adjustments</div>
              <div>Curves · Levels</div>
              <div>Hue/Sat · BW</div>
            </div>
            <div className="rounded bg-foreground/[0.04] p-0.5">
              <div className="text-foreground/55 text-[7px]">History</div>
              <div>Brush</div>
              <div>Crop</div>
            </div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "8%", y: "45%", label: "Deep toolbox" },
      { n: 2, x: "50%", y: "45%", label: "Raster canvas" },
      { n: 3, x: "85%", y: "45%", label: "Layers + adjustments" },
    ],
  })) as Builder,

  // 13. Figma - Multiplayer live
  desFigmaMultiplayer: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1 -mt-1">
          <TrafficLights />
          <div className="text-[8.5px] font-mono text-foreground/55 ml-1">Marketing Site · v3</div>
          <div className="ml-auto flex -space-x-1">
            {[["#FF5252","M"],["#7C3AED","J"],["#10B981","A"],["#F59E0B","L"]].map(([c,l],i)=>(
              <div key={i} className="w-5 h-5 rounded-full border-2 border-background grid place-items-center text-[8px] font-bold text-white" style={{background:c as string}}>{l}</div>
            ))}
          </div>
        </div>
        <div className="relative flex-1 rounded-md border border-border/60 bg-[radial-gradient(circle,_currentColor_0.5px,_transparent_0.5px)] [background-size:8px_8px] text-foreground/15">
          <div className="absolute left-3 top-3 right-12 bottom-12 rounded-lg bg-background border border-border/60 grid place-items-center text-foreground/40 text-[9px]">Hero frame</div>
          {[["20%","30%","#FF5252","Maya"],["60%","20%","#7C3AED","Jin"],["45%","65%","#10B981","Ada"]].map(([x,y,c,n],i)=>(
            <div key={i} className="absolute" style={{left:x as string, top:y as string}}>
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill={c as string}><path d="M2 2 L14 7 L8 9 L7 14 Z" /></svg>
              <div className="text-[7.5px] text-white px-1 rounded mt-0.5" style={{background:c as string}}>{n}</div>
            </div>
          ))}
          <div className="absolute right-2 top-12 w-20 rounded-md bg-background border border-border/60 shadow-md p-1 text-[8px]">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#7C3AED] text-white grid place-items-center text-[7px]">J</div><div className="font-medium">Jin</div></div>
            <div className="mt-0.5 text-foreground/65">Bump padding here?</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "10%", label: "Live avatars" },
      { n: 2, x: "35%", y: "45%", label: "Other cursors" },
      { n: 3, x: "82%", y: "55%", label: "Comment thread" },
    ],
  })) as Builder,

  // 14. Canva - Share + comment
  desCanvaShare: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="text-[11px] font-semibold">Share "Summer Sale"</div>
        <div className="rounded-md border border-border/60 p-2 space-y-1.5">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">People with access</div>
          {[["Maya","can edit"],["Jin","can comment"],["Ada","can view"]].map(([n,r],i)=>(
            <div key={i} className="flex items-center gap-1.5">
              <Photo seed={i} className="w-6 h-6 rounded-full" />
              <div className="text-[10px] flex-1">{n}</div>
              <div className="text-[9px] text-foreground/55">{r}</div>
            </div>
          ))}
          <div className="h-8 rounded bg-foreground/[0.05] border border-border/60 px-2 grid items-center text-[10px] text-foreground/55">Add people by email…</div>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Anyone with the link</div>
          <div className="text-[9px] font-mono text-foreground/70 truncate">canva.com/design/abc123/view</div>
          <div className="flex gap-1 mt-1"><Chip>Can comment ▾</Chip><Chip accent>Copy link</Chip></div>
        </div>
        <div className="flex-1" />
        <CTA>Send invites</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Per-person roles" },
      { n: 2, x: "50%", y: "65%", label: "Link sharing" },
      { n: 3, x: "85%", y: "78%", label: "Permission level" },
    ],
  })) as Builder,

  // 15. Framer - Handoff to dev
  desFramerHandoff: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="flex items-center gap-1.5">
          <div className="text-[11px] font-semibold">Hero / Button</div>
          <Chip accent>{`</> Code`}</Chip>
        </div>
        <div className="rounded-md border border-border/60 overflow-hidden">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center">
            <div className="px-3 py-1.5 rounded-full bg-white text-blue-600 text-[10px] font-semibold">Get Started</div>
          </div>
        </div>
        <div className="rounded-md bg-[#0d1117] text-emerald-300 p-1.5 font-mono text-[8px] leading-tight space-y-0.5">
          <div><span className="text-pink-400">export function</span> <span className="text-blue-300">Button</span>() &#123;</div>
          <div className="pl-2">return (</div>
          <div className="pl-4"><span className="text-foreground/40">{'<button className='}</span></div>
          <div className="pl-6">"px-4 py-2 rounded-full bg-white"</div>
          <div className="pl-4"><span className="text-foreground/40">{'>'}Get Started{'</button>'}</span></div>
          <div className="pl-2">);</div>
          <div>&#125;</div>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[9px] text-center">
          <Chip>React</Chip><Chip accent>Tailwind</Chip><Chip>CSS</Chip>
        </div>
        <div className="flex-1" />
        <CTA>Copy component code</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "82%", y: "13%", label: "Code view" },
      { n: 2, x: "50%", y: "50%", label: "Production code" },
      { n: 3, x: "50%", y: "73%", label: "Framework toggle" },
    ],
  })) as Builder,

  // 16. Adobe - Cloud sync
  desAdobeCloud: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-red-600 grid place-items-center text-white text-[9px] font-bold">Cc</div>
          <div className="text-[11px] font-semibold">Creative Cloud</div>
          <div className="ml-auto text-[8.5px] text-emerald-600">✓ All synced</div>
        </div>
        <div className="rounded-md border border-border/60 divide-y divide-border/60 text-[9.5px]">
          {[
            ["Brand Library","48 assets · synced 2m ago","☁"],
            ["Photos folder","312 files · syncing 64%","↻"],
            ["Type - Adobe Fonts","12 activated","✓"],
            ["Mobile creations","8 files from iPad","✓"],
          ].map(([t,s,ic],i)=>(
            <div key={i} className="flex items-center gap-2 p-1.5">
              <div className="w-6 h-6 rounded bg-foreground/8 grid place-items-center text-[12px]">{ic}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{t}</div>
                <div className="text-[8.5px] text-foreground/55 truncate">{s}</div>
              </div>
              {i===1 && <div className="w-12 h-1 bg-foreground/10 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-red-500" /></div>}
            </div>
          ))}
        </div>
        <div className="rounded-md bg-foreground/[0.04] p-1.5 text-[8.5px] text-foreground/65">98 GB of 100 GB used · across Ps, Ai, Id, Lr</div>
        <div className="flex-1" />
        <CTA>Manage library</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "13%", label: "Sync status" },
      { n: 2, x: "50%", y: "45%", label: "Shared library" },
      { n: 3, x: "50%", y: "78%", label: "Cross-app storage" },
    ],
  })) as Builder,

  // 17. Framer - Publish live site
  desFramerPublish: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="text-[11px] font-semibold">Publish</div>
        <div className="rounded-md border border-border/60 p-2 space-y-1">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Domain</div>
          <div className="flex items-center gap-1">
            <div className="flex-1 rounded bg-foreground/[0.04] px-2 py-1 text-[9.5px] font-mono">acme.framer.website</div>
            <Chip>+ Custom</Chip>
          </div>
          <div className="text-[8.5px] text-emerald-600">✓ SSL · CDN · ⚡ 98 score</div>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-[8.5px] uppercase tracking-wider text-foreground/55">Changes since last publish</div>
          <div className="text-[9.5px] space-y-0.5 mt-0.5">
            <div>+ Updated hero copy</div>
            <div>+ New pricing section</div>
            <div>+ Replaced 4 images</div>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 text-center text-white">
          <div className="text-[8.5px] uppercase tracking-wider opacity-80">One-click</div>
          <div className="font-display text-[15px]">Publish live</div>
          <div className="text-[9px] opacity-90">Deploys in ~12 seconds</div>
        </div>
        <div className="flex-1" />
        <div className="h-11 rounded-xl bg-foreground text-background grid place-items-center text-[12px] font-bold">↑ Publish to acme.framer.website</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Live domain" },
      { n: 2, x: "50%", y: "55%", label: "Diff since last" },
      { n: 3, x: "50%", y: "92%", label: "One-click deploy" },
    ],
  })) as Builder,

  // 18. Figma - Dev Mode specs
  desFigmaDevMode: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1 -mt-1">
          <TrafficLights />
          <Chip accent>{`</> Dev Mode`}</Chip>
          <div className="ml-auto text-[8.5px] font-mono text-foreground/55">CSS</div>
        </div>
        <div className="flex gap-1 flex-1">
          <div className="relative flex-1 rounded-md border border-border/60 bg-foreground/[0.02] p-2">
            <div className="absolute left-3 top-3 right-3 bottom-3 rounded-lg border border-blue-500 bg-background grid place-items-center text-[9px] text-foreground/40">Button</div>
            <div className="absolute -left-1 top-1/2 text-[7.5px] font-mono text-blue-600">↔ 240</div>
            <div className="absolute left-1/2 -top-1 text-[7.5px] font-mono text-blue-600">↕ 48</div>
            <div className="absolute right-1 bottom-1 text-[7.5px] font-mono text-blue-600">↘ 24px gap</div>
          </div>
          <div className="w-24 rounded-md border border-border/60 p-1 text-[8px] space-y-1">
            <div className="text-foreground/55 text-[7.5px] uppercase tracking-wider">Inspect</div>
            <div className="font-mono space-y-0.5 leading-tight">
              <div><span className="text-pink-500">width:</span> 240px</div>
              <div><span className="text-pink-500">height:</span> 48px</div>
              <div><span className="text-pink-500">radius:</span> 8px</div>
              <div><span className="text-pink-500">bg:</span> #3B82F6</div>
              <div><span className="text-pink-500">font:</span> Inter 14</div>
            </div>
            <div className="rounded bg-foreground/[0.05] p-0.5 text-[7px] font-mono">px-4 py-2 rounded-lg bg-blue-500</div>
            <div className="flex gap-0.5"><Chip>CSS</Chip><Chip accent>TW</Chip></div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "82%", y: "13%", label: "Dev Mode" },
      { n: 2, x: "30%", y: "50%", label: "Measurements" },
      { n: 3, x: "85%", y: "50%", label: "Code snippets" },
    ],
  })) as Builder,

  // 19. Sketch - Inspector + export
  desSketchExport: ((_ctx, _p) => ({
    node: (
      <Frame>
        <div className="flex items-center gap-1.5 -mt-1">
          <TrafficLights />
          <div className="text-[9px] font-mono text-foreground/55 ml-1">icon@2x</div>
        </div>
        <div className="flex gap-1 flex-1">
          <div className="flex-1 rounded-md border border-border/60 bg-foreground/[0.03] grid place-items-center">
            <div className="w-12 h-12 rounded-xl bg-orange-500 grid place-items-center text-white text-[18px]">★</div>
          </div>
          <div className="w-24 rounded-md border border-border/60 p-1 text-[8px] space-y-1">
            <div className="text-foreground/55 text-[7.5px] uppercase tracking-wider">Inspector</div>
            <div>W <span className="font-mono">48</span> · H <span className="font-mono">48</span></div>
            <div>Radius <span className="font-mono">12</span></div>
            <div className="border-t border-border/60 pt-0.5 text-foreground/55 text-[7.5px] uppercase tracking-wider">Make exportable</div>
            <div className="space-y-0.5">
              {[["1×","PNG","icon.png"],["2×","PNG","icon@2x.png"],["3×","PNG","icon@3x.png"],["1×","SVG","icon.svg"],["1×","PDF","icon.pdf"]].map(([s,f,n],i)=>(
                <div key={i} className="flex items-center gap-1 text-[7.5px]">
                  <div className="font-mono w-5">{s}</div>
                  <div className="px-1 rounded bg-foreground/8 font-mono">{f}</div>
                  <div className="truncate text-foreground/55">{n}</div>
                </div>
              ))}
            </div>
            <div className="rounded bg-orange-500 text-white text-center py-0.5 text-[8px] font-semibold">Export 5</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "85%", y: "30%", label: "Inspector" },
      { n: 2, x: "85%", y: "55%", label: "Export presets" },
      { n: 3, x: "85%", y: "92%", label: "Batch export" },
    ],
  })) as Builder,

  // 20. Adobe - Asset export
  desAdobeExport: ((_ctx, _p) => ({
    node: (
      <Frame>
        <DesBar />
        <div className="text-[11px] font-semibold">Export As…</div>
        <div className="flex gap-1 flex-1">
          <div className="w-20 rounded-md border border-border/60 p-1 space-y-0.5 text-[8px]">
            <div className="text-foreground/55 text-[7.5px] uppercase tracking-wider">Layers</div>
            {["Sky","Logo","Hero","Button","Footer"].map((l,i)=>(
              <div key={i} className={`flex items-center gap-1 px-1 py-0.5 rounded ${i<3?"bg-blue-500/15":""}`}>
                <div className={`w-2 h-2 rounded-sm border ${i<3?"bg-blue-500 border-blue-500":"border-border"}`} />
                <div>{l}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-md border border-border/60 p-1.5 space-y-1 text-[8.5px]">
            <div className="text-foreground/55 text-[7.5px] uppercase tracking-wider">Scale + format</div>
            {[
              ["1×","PNG-24","logo.png"],
              ["2×","PNG-24","logo@2x.png"],
              ["1×","SVG","logo.svg"],
              ["1×","WebP","logo.webp"],
              ["0.5×","JPG 80","logo-sm.jpg"],
            ].map(([s,f,n],i)=>(
              <div key={i} className="flex items-center gap-1 p-0.5 rounded border border-border/40">
                <select className="bg-foreground/8 rounded px-1 text-[8px] font-mono">{[s].map(o=>(<option key={o}>{o}</option>))}</select>
                <div className="px-1 rounded bg-foreground/8 font-mono text-[7.5px]">{f}</div>
                <div className="truncate text-foreground/55 flex-1">{n}</div>
                <div className="text-foreground/40">⋯</div>
              </div>
            ))}
            <div className="text-[7.5px] text-foreground/55">+ Add scale · 3 layers × 5 = 15 files</div>
          </div>
        </div>
        <CTA>Export 15 assets</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "15%", y: "40%", label: "Layer picker" },
      { n: 2, x: "60%", y: "50%", label: "Format matrix" },
      { n: 3, x: "50%", y: "92%", label: "Batch export" },
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
