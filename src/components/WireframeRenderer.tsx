import { motion } from "framer-motion";
import type { ReactNode } from "react";
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

const title = (p: Preview) => `${p.company} · ${p.pattern}`;
const row = (p: Preview, i: number) => p.rows[i % p.rows.length];
const detail = (p: Preview, i: number) => [p.metric, p.header, p.cta, p.company, p.pattern][i % 5];

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
          <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-2xl shadow-[0_10px_40px_-10px_var(--primary)] px-2 text-center leading-tight">{p.metric}</div>
          <div className="font-display text-[16px] leading-tight">{p.header}</div>
          <div className="text-[10px] font-mono text-foreground/55 truncate max-w-full">{row(p, 0)}</div>
          <Chip accent>{row(p, 1)}</Chip>
        </div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Headline metric" },
      { n: 2, x: "50%", y: "55%", label: "Supporting line" },
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
        <div className="flex gap-2 flex-wrap pt-1">{p.rows.slice(0, 4).map((c, i) => <Chip key={i} accent>{c}</Chip>)}</div>
        <div className="text-[11px] text-foreground/70 leading-snug mt-1">{p.metric}</div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Trust chips" },
      { n: 2, x: "50%", y: "55%", label: "Assurance line" },
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
        <div className="text-[10px] p-2 rounded-lg bg-primary/10 border border-primary/30 text-foreground/80 truncate">{p.metric}</div>
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Minimal fields" },
      { n: 2, x: "50%", y: "62%", label: "Reassurance" },
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
        <div className="text-[10px] p-2 rounded-lg bg-primary/10 border border-primary/30 text-foreground/80">{p.metric}</div>
        {p.rows.slice(0, 2).map((l, i) => (
          <div key={i} className={`rounded-xl border border-border bg-background/40 px-3 ${i === 0 ? "h-10 flex items-center" : "h-20 pt-2"} text-[11px] text-foreground/60 truncate`}>{l}</div>
        ))}
        <div className="mt-auto"><CTA>{p.cta}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Calm framing" },
      { n: 2, x: "50%", y: "55%", label: "Personal note" },
      { n: 3, x: "50%", y: "90%", label: "Low-pressure CTA" },
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
        <div className="flex items-center gap-2"><Chip accent>{p.metric}</Chip></div>
        <div className="font-display text-[18px] leading-tight truncate">{p.header}</div>
        <div className="space-y-1.5">
          {p.rows.slice(0, 3).map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-border/60">
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <div className="flex-1 text-[11px] truncate">{c}</div>
              <span className="text-[9px] font-mono text-primary shrink-0 truncate max-w-[72px]">{p.cta}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-border/80 opacity-60">
            <div className="w-2 h-2 rounded-full bg-foreground/30 shrink-0" />
            <div className="flex-1 text-[11px] truncate">{row(p, 3)}</div>
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "12%", label: "Tier badge" },
      { n: 2, x: "78%", y: "45%", label: "Unlocked perk" },
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
        <div className="font-display text-[16px] leading-tight truncate">{p.header}</div>
        <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 truncate">{p.metric}</div>
        <div className="grid grid-cols-3 gap-1.5 flex-1">
          {[
            { col: p.header, items: [p.rows[0], p.rows[1]] },
            { col: p.metric, items: [p.rows[2]] },
            { col: p.cta, items: [p.rows[3]] },
          ].map((col, i) => (
            <div key={i} className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 truncate">{col.col}</div>
              {col.items.map((t, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-1.5 bg-card/70">
                  <div className="text-[10px] font-medium leading-tight line-clamp-3">{t}</div>
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
          <div className="text-foreground/40 truncate">// {p.header}</div>
          <div className="truncate"><span className="text-primary">const</span> v = <span className="text-foreground/80">"{row(p, 3)}"</span></div>
          <div className="mt-1 truncate"><span className="text-primary">export function</span> Page() {"{"}</div>
          <div className="pl-3 truncate"><span className="text-primary">return</span> {"<View />"}</div>
          <div>{"}"}</div>
          <div className="mt-2 text-foreground/40 truncate">// {p.metric}</div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-foreground/55 gap-2"><span className="truncate">{p.cta}</span><span className="text-primary shrink-0">● live</span></div>
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
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">To</div>
        <div className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 gap-2">
          <div className="w-6 h-6 rounded-full bg-foreground/20 shrink-0" />
          <div className="text-[11px] flex-1 truncate">{row(p, 0)}</div>
        </div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">Amount</div>
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
};

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
