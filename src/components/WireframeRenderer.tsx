import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { samplesFor, ctaFor, type IndustrySamples } from "@/lib/sampleContent";

export interface Pin {
  n: number;
  x: string; // CSS left
  y: string; // CSS top
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
  <div className="flex items-center justify-between text-[9px] font-mono text-foreground/50 -mt-1">
    <span>9:41</span>
    <span className="tracking-[0.18em] uppercase">{title}</span>
    <span>●●●</span>
  </div>
);

const Chip = ({ children, accent, mono = true }: { children: ReactNode; accent?: boolean; mono?: boolean }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] ${mono ? "font-mono" : ""} ${
      accent ? "bg-primary text-primary-foreground" : "bg-foreground/8 text-foreground/70 border border-border/60"
    }`}
  >
    {children}
  </span>
);

const Photo = ({ seed = 0, className = "", children }: { seed?: number; className?: string; children?: ReactNode }) => {
  // Soft gradient stand-in for an image — varies by seed
  const hues = [
    "from-foreground/20 to-foreground/5",
    "from-primary/25 to-foreground/5",
    "from-foreground/15 to-foreground/0",
    "from-primary/15 to-foreground/10",
  ];
  return <div className={`bg-gradient-to-br ${hues[seed % hues.length]} ${className}`}>{children}</div>;
};

const CTA = ({ children }: { children: ReactNode }) => (
  <div className="h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[12px] font-medium tracking-wide">
    {children}
  </div>
);

type Builder = (ctx: RenderCtx, s: IndustrySamples) => RenderedScreen;

const screens: Record<string, Builder> = {
  photoGrid: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">{s.hero}</div>
        <div className="flex gap-1.5 -mt-1">{s.chips.slice(0, 3).map((c) => <Chip key={c}>{c}</Chip>)}</div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border/60 bg-muted/40 flex flex-col">
              <Photo seed={i} className="aspect-[4/5] relative">
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-background/85 grid place-items-center text-[10px]">♡</div>
              </Photo>
              <div className="p-1.5">
                <div className="text-[10px] font-medium leading-tight truncate">{s.titles[i]}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className="text-[9px] text-foreground/55 truncate">{s.ratings[i]}</div>
                  <div className="text-[10px] font-mono text-primary">{s.prices[i]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "33%", label: "Visual hero tile" },
      { n: 2, x: "78%", y: "60%", label: "Price + rating" },
      { n: 3, x: "44%", y: "26%", label: "Quick save" },
    ],
  }),

  dealList: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Deals today</div>
        <div className="space-y-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl border border-border/60">
              <Photo seed={i} className="w-10 h-10 rounded-md" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{s.titles[i]}</div>
                <div className="text-[9px] text-foreground/55 truncate">Ends in {3 + i}h · {s.subtitles[i]}</div>
              </div>
              <div className="text-right">
                <Chip accent>-{20 + i * 5}%</Chip>
                <div className="text-[10px] font-mono mt-0.5 text-foreground/70">{s.prices[i]}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "78%", y: "26%", label: "Discount badge" },
      { n: 2, x: "44%", y: "40%", label: "Urgency line" },
      { n: 3, x: "78%", y: "62%", label: "Price tag" },
    ],
  }),

  searchBox: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex-1 flex flex-col justify-center items-center gap-3 px-2 text-center">
          <div className="font-display text-[24px] leading-tight">{s.hero}</div>
          <div className="text-[11px] text-foreground/60 -mt-1">{s.heroSub}</div>
          <div className="w-full mt-2 space-y-2">
            <div className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 text-[11px] font-mono text-foreground/60">⌕ {s.titles[0]}</div>
            <div className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 text-[11px] text-foreground/60">Aug 14 — Aug 18</div>
          </div>
          <div className="w-full"><CTA>{ctaFor(s, ctx.stage)}</CTA></div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "One-line promise" },
      { n: 2, x: "50%", y: "55%", label: "Primary input" },
      { n: 3, x: "50%", y: "85%", label: "Single CTA" },
    ],
  }),

  filterList: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex items-baseline justify-between">
          <div className="font-display text-[16px]">128 results</div>
          <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">sort · top</div>
        </div>
        <div className="flex gap-1 flex-wrap">{s.chips.map((c, i) => <Chip key={c} accent={i === 0}>{c}</Chip>)}</div>
        <div className="space-y-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2 p-2 border border-border/60 rounded-xl">
              <Photo seed={i} className="w-12 h-12 rounded-md" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{s.titles[i]}</div>
                <div className="text-[9px] text-foreground/55 truncate">{s.subtitles[i]}</div>
                <div className="text-[10px] font-mono text-primary mt-0.5">{s.prices[i]}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "11%", label: "Result count" },
      { n: 2, x: "50%", y: "21%", label: "Filter chips" },
      { n: 3, x: "50%", y: "55%", label: "Dense result row" },
    ],
  }),

  mapView: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="relative flex-1 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/0 border border-border/60 overflow-hidden">
          {/* fake roads */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(transparent 49%, var(--border) 50%, transparent 51%), linear-gradient(90deg, transparent 49%, var(--border) 50%, transparent 51%)", backgroundSize: "32px 32px" }} />
          {[
            [22, 28], [42, 18], [62, 38], [30, 52], [70, 60], [50, 72],
          ].map(([l, t], i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${l}%`, top: `${t}%` }}>
              <div className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-mono shadow">{s.prices[i % s.prices.length]}</div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto -mt-px" />
            </div>
          ))}
        </div>
        <div className="p-2 rounded-xl border border-border/60 flex gap-2 items-center">
          <Photo seed={1} className="w-10 h-10 rounded-md" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium truncate">{s.titles[0]}</div>
            <div className="text-[9px] text-foreground/55 truncate">{s.subtitles[0]} · {s.ratings[0]}</div>
          </div>
          <div className="text-[11px] font-mono text-primary">{s.prices[0]}</div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "42%", y: "30%", label: "Price pin" },
      { n: 2, x: "50%", y: "78%", label: "Linked card" },
      { n: 3, x: "78%", y: "82%", label: "Tap-to-book price" },
    ],
  }),

  listRows: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">{s.hero}</div>
        <div className="divide-y divide-border/60 flex-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-center py-2">
              <Photo seed={i} className="w-9 h-9 rounded-md" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate">{s.titles[i % s.titles.length]}</div>
                <div className="text-[9px] text-foreground/55 truncate">{s.subtitles[i % s.subtitles.length]}</div>
              </div>
              <div className="text-[10px] font-mono text-foreground/60">{s.ratings[i % s.ratings.length]}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "22%", y: "10%", label: "Clean headline" },
      { n: 2, x: "44%", y: "40%", label: "Single-row item" },
      { n: 3, x: "82%", y: "40%", label: "Quiet metadata" },
    ],
  }),

  scoreBadge: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex flex-col items-center gap-2 pt-3">
          <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-3xl shadow-[0_10px_40px_-10px_var(--primary)]">9.4</div>
          <div className="font-display text-[18px] leading-tight">{s.titles[0]}</div>
          <div className="text-[10px] font-mono text-foreground/55">2,184 reviews</div>
          <Chip accent>Only 2 left at this price</Chip>
        </div>
        <div className="mt-auto"><CTA>{ctaFor(s, ctx.stage)}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Trust score" },
      { n: 2, x: "50%", y: "55%", label: "Scarcity badge" },
      { n: 3, x: "50%", y: "90%", label: "Commit CTA" },
    ],
  }),

  profileTrust: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex items-center gap-3">
          <Photo seed={2} className="w-14 h-14 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="font-display text-[16px] truncate">{s.names[0]}</div>
            <div className="flex gap-1 mt-0.5"><Chip>Verified</Chip><Chip>Superhost</Chip></div>
          </div>
        </div>
        <div className="text-[10px] text-foreground/70">{s.ratings[0]} from guests</div>
        {[5, 4, 3, 2, 1].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <span className="text-[10px] w-3 font-mono text-foreground/55">{n}</span>
            <div className="flex-1 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${n === 5 ? 88 : n === 4 ? 64 : n * 12}%` }} />
            </div>
          </div>
        ))}
        <div className="mt-2 p-2 rounded-lg border border-border/60 text-[10px] text-foreground/70 leading-snug">
          "Spotless, calm, and so well located. Would book again."
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "60%", y: "18%", label: "Identity + badges" },
      { n: 2, x: "50%", y: "52%", label: "Rating distribution" },
      { n: 3, x: "50%", y: "85%", label: "Real quote" },
    ],
  }),

  badgeRow: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Booked with confidence</div>
        <div className="flex gap-2 flex-wrap pt-1">{s.trust.map((c) => <Chip key={c} accent>{c}</Chip>)}</div>
        <div className="text-[11px] text-foreground/70 leading-snug mt-1">Every booking is backed by full refund protection and 24/7 support.</div>
        <div className="mt-auto"><CTA>{ctaFor(s, ctx.stage)}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Trust chips" },
      { n: 2, x: "50%", y: "55%", label: "Plain-language assurance" },
      { n: 3, x: "50%", y: "90%", label: "Commit CTA" },
    ],
  }),

  guestForm: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Almost done</div>
        <div className="space-y-2">
          {["Email", "Phone", "Card · 4242"].map((l) => (
            <div key={l} className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 text-[11px] text-foreground/60">{l}</div>
          ))}
        </div>
        <div className="text-[10px] p-2 rounded-lg bg-primary/10 border border-primary/30 text-foreground/80">No account required — checkout as guest.</div>
        <div className="mt-auto"><CTA>{ctaFor(s, ctx.stage)}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "25%", label: "Minimal fields" },
      { n: 2, x: "50%", y: "62%", label: "Reassurance banner" },
      { n: 3, x: "50%", y: "90%", label: "Single CTA" },
    ],
  }),

  oneClick: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Confirm purchase</div>
        <div className="p-3 rounded-xl border border-border/60 flex items-center gap-2">
          <div className="w-9 h-6 rounded bg-foreground/70" />
          <div className="flex-1 text-[11px]">Visa · 4242</div>
          <span className="text-[9px] font-mono text-foreground/55">DEFAULT</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 flex items-center gap-2">
          <div className="flex-1 text-[11px]">{s.names[0]} · 12 Rue de Rivoli</div>
        </div>
        <div className="text-[11px] text-foreground/70">Total <span className="font-mono text-foreground">{s.prices[0]}</span></div>
        <div className="mt-auto"><CTA>Buy now</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "30%", label: "Saved payment" },
      { n: 2, x: "82%", y: "30%", label: "Default flag" },
      { n: 3, x: "50%", y: "90%", label: "One-tap commit" },
    ],
  }),

  reassureForm: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Request to book</div>
        <div className="text-[10px] p-2 rounded-lg bg-primary/10 border border-primary/30 text-foreground/80">You won't be charged yet — the host has 24h to respond.</div>
        {["Trip dates", "Message to host"].map((l, i) => (
          <div key={l} className={`rounded-xl border border-border bg-background/40 px-3 ${i === 0 ? "h-10 flex items-center" : "h-20 pt-2"} text-[11px] text-foreground/60`}>{l}</div>
        ))}
        <div className="mt-auto"><CTA>Send request</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "22%", label: "Calm framing" },
      { n: 2, x: "50%", y: "55%", label: "Personal note" },
      { n: 3, x: "50%", y: "90%", label: "Low-pressure CTA" },
    ],
  }),

  stampCard: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">6 of 10 stamps</div>
        <div className="text-[11px] text-foreground/70 -mt-1">Four more orders to unlock a free meal.</div>
        <div className="grid grid-cols-5 gap-2 pt-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`aspect-square rounded-full grid place-items-center text-[10px] font-mono ${i < 6 ? "bg-primary text-primary-foreground" : "border border-dashed border-border/80 text-foreground/40"}`}>{i < 6 ? "✓" : i + 1}</div>
          ))}
        </div>
        <div className="mt-auto p-2 rounded-xl border border-border/60 text-[10px] text-foreground/70 flex items-center justify-between">
          <span>Next reward · Free entree</span><span className="font-mono text-primary">4 to go</span>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Progress headline" },
      { n: 2, x: "50%", y: "48%", label: "Visual stamp grid" },
      { n: 3, x: "82%", y: "92%", label: "Reward countdown" },
    ],
  }),

  savedGrid: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Saved</div>
        <div className="text-[10px] font-mono text-foreground/55 -mt-1 uppercase tracking-wider">{s.titles.length} items · synced</div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border/60 relative">
              <Photo seed={i} className="aspect-square" />
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-background/80 grid place-items-center text-[10px] text-primary">♥</div>
              <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-medium text-foreground bg-background/70 backdrop-blur px-1.5 py-0.5 rounded truncate">{s.titles[i]}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "14%", label: "Personal collection" },
      { n: 2, x: "78%", y: "32%", label: "Filled heart" },
      { n: 3, x: "30%", y: "60%", label: "Labeled tile" },
    ],
  }),

  tierList: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex items-center gap-2"><Chip accent>GOLD TIER</Chip><span className="text-[10px] font-mono text-foreground/55">since 2023</span></div>
        <div className="font-display text-[18px] leading-tight">Welcome back, {s.names[0]}</div>
        <div className="space-y-1.5">
          {["Free upgrades on every stay", "Member-only pricing", "Early access to releases", "Dedicated concierge line"].map((c, i) => (
            <div key={c} className="flex items-center gap-2 p-2 rounded-lg border border-border/60">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1 text-[11px]">{c}</div>
              <span className="text-[9px] font-mono text-primary">UNLOCKED</span>
            </div>
          ))}
          <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-border/80 opacity-60">
            <div className="w-2 h-2 rounded-full bg-foreground/30" />
            <div className="flex-1 text-[11px]">Platinum: 2 nights to go</div>
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

  feedFull: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex-1 flex gap-2">
          <div className="flex-1 rounded-xl bg-gradient-to-b from-foreground/15 to-foreground/40 relative overflow-hidden">
            <div className="absolute top-2 left-2 right-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-background/70" />
              <div className="text-[10px] font-medium text-background">{s.titles[0]}</div>
            </div>
            <div className="absolute bottom-3 left-3 right-10">
              <div className="text-[12px] font-medium text-background leading-snug">{s.subtitles[0]}</div>
              <div className="text-[10px] text-background/80 mt-0.5">{s.ratings[0]}</div>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-center justify-end pb-3">
            {[["♥", s.prices[0]], ["💬", "84"], ["↗", ""], ["⋯", ""]].map(([i, n]) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-foreground/15 grid place-items-center text-sm">{i}</div>
                {n && <div className="text-[9px] font-mono text-foreground/70 mt-0.5">{n}</div>}
              </div>
            ))}
          </div>
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "40%", y: "50%", label: "Full-bleed content" },
      { n: 2, x: "85%", y: "35%", label: "Side actions" },
      { n: 3, x: "40%", y: "85%", label: "Creator + caption" },
    ],
  }),

  composer: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex-1 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/0 border border-dashed border-border grid place-items-center text-foreground/50 text-[11px]">
          Tap to capture
        </div>
        <div className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider">add</div>
        <div className="flex justify-between">
          {[["✨", "Effects"], ["🎵", "Audio"], ["📍", "Place"], ["🏷", "Tag"]].map(([i, l]) => (
            <div key={l} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-foreground/8 border border-border/60 grid place-items-center text-base">{i}</div>
              <div className="text-[9px] font-mono text-foreground/60">{l}</div>
            </div>
          ))}
        </div>
        <CTA>Share to followers</CTA>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "35%", label: "Capture canvas" },
      { n: 2, x: "50%", y: "72%", label: "Creation tools" },
      { n: 3, x: "50%", y: "92%", label: "Publish CTA" },
    ],
  }),

  chatThread: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex items-center gap-2 pb-2 border-b border-border/60">
          <Photo seed={1} className="w-7 h-7 rounded-full" />
          <div className="flex-1">
            <div className="text-[11px] font-medium">{s.names[0]}</div>
            <div className="text-[9px] font-mono text-primary">● online</div>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {s.chat.map((m, i) => (
            <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
              <div className={`px-2.5 py-1.5 rounded-2xl text-[11px] leading-snug max-w-[80%] ${m.me ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-foreground/8 rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="h-9 rounded-full border border-border bg-background/40 flex items-center px-3 text-[11px] text-foreground/50">Message…</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "10%", label: "Presence header" },
      { n: 2, x: "70%", y: "48%", label: "Your message" },
      { n: 3, x: "50%", y: "92%", label: "Composer" },
    ],
  }),

  dashboard: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-foreground/5 border border-border/60">
          <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">{s.metricLabel}</div>
          <div className="text-[26px] font-display mt-0.5 leading-none">{s.metricValue}</div>
          <div className="text-[10px] text-foreground/55 mt-1">+2.4% this week</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Send", "Pay", "Top up"].map((c) => (
            <div key={c} className="aspect-square rounded-xl border border-border/60 bg-card/60 grid place-items-center text-[10px] font-medium">{c}</div>
          ))}
        </div>
        <div className="space-y-1.5">
          {s.titles.slice(0, 3).map((t, i) => (
            <div key={t} className="flex items-center gap-2">
              <Photo seed={i} className="w-8 h-8 rounded-md" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] truncate">{t}</div>
                <div className="text-[9px] text-foreground/55">{s.subtitles[i]}</div>
              </div>
              <div className="text-[11px] font-mono text-primary">{s.prices[i]}</div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "18%", label: "Key metric" },
      { n: 2, x: "50%", y: "48%", label: "Quick actions" },
      { n: 3, x: "82%", y: "78%", label: "Recent activity" },
    ],
  }),

  carousel: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">{s.hero}</div>
        {["Continue watching", "New this week"].map((label, row) => (
          <div key={label}>
            <div className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider mb-1.5">{label}</div>
            <div className="flex gap-2 overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-[68px] shrink-0">
                  <Photo seed={i + row} className="w-full h-24 rounded-md" />
                  <div className="text-[10px] mt-1 truncate">{s.titles[(i + row) % s.titles.length]}</div>
                  <div className="text-[9px] text-foreground/55 truncate">{s.ratings[(i + row) % s.ratings.length]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "26%", label: "Row label" },
      { n: 2, x: "18%", y: "44%", label: "Poster tile" },
      { n: 3, x: "70%", y: "72%", label: "Second row" },
    ],
  }),

  onboardChecklist: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Let's set you up</div>
        <div className="text-[11px] text-foreground/60 -mt-1">Two minutes to a working {ctx.industryId === "saas_pm" ? "board" : "account"}.</div>
        <div className="space-y-2 mt-2">
          {[
            { done: true, t: "Create your workspace" },
            { done: true, t: "Invite your team" },
            { done: false, t: "Connect calendar" },
            { done: false, t: "Pick a template" },
          ].map((step, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border ${step.done ? "border-border/60 bg-foreground/[0.03]" : "border-border"}`}>
              <div className={`w-4 h-4 rounded-full grid place-items-center text-[9px] ${step.done ? "bg-primary text-primary-foreground" : "border-2 border-border"}`}>{step.done ? "✓" : ""}</div>
              <div className={`flex-1 text-[11px] ${step.done ? "line-through text-foreground/50" : ""}`}>{step.t}</div>
              {!step.done && <span className="text-[9px] font-mono text-primary">2 min</span>}
            </div>
          ))}
        </div>
        <div className="mt-auto"><CTA>{ctaFor(s, ctx.stage)}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "20%", label: "Clear promise" },
      { n: 2, x: "50%", y: "55%", label: "Stepwise checklist" },
      { n: 3, x: "82%", y: "62%", label: "Time-to-finish hint" },
    ],
  }),

  insightsCards: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">This week</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "Revenue", v: "$4,820", d: "+12%" },
            { l: "Orders", v: "128", d: "+4%" },
            { l: "New users", v: "42", d: "-3%" },
            { l: "Refunds", v: "2", d: "0%" },
          ].map((m) => (
            <div key={m.l} className="p-2.5 rounded-xl border border-border/60">
              <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">{m.l}</div>
              <div className="text-[18px] font-display mt-0.5 leading-none">{m.v}</div>
              <div className={`text-[10px] mt-1 font-mono ${m.d.startsWith("-") ? "text-amber-400" : "text-primary"}`}>{m.d}</div>
              <div className="h-5 mt-1.5 flex items-end gap-0.5">
                {[3, 5, 4, 6, 5, 7, 6].map((h, i) => <div key={i} className="flex-1 bg-primary/40 rounded-sm" style={{ height: `${h * 12}%` }} />)}
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "26%", y: "26%", label: "Bite-sized metric" },
      { n: 2, x: "74%", y: "26%", label: "Trend delta" },
      { n: 3, x: "50%", y: "70%", label: "Sparkline bars" },
    ],
  }),

  playerView: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <Photo seed={2} className="aspect-square rounded-xl relative grid place-items-center">
          <div className="w-14 h-14 rounded-full bg-background/85 grid place-items-center text-2xl text-primary">▶</div>
        </Photo>
        <div className="font-display text-[18px] leading-tight">{s.titles[0]}</div>
        <div className="text-[10px] font-mono text-foreground/55">{s.subtitles[0]}</div>
        <div className="space-y-1">
          <div className="h-1 bg-foreground/10 rounded-full"><div className="h-full w-1/3 bg-primary rounded-full" /></div>
          <div className="flex justify-between text-[9px] font-mono text-foreground/55"><span>00:42</span><span>02:18</span></div>
        </div>
        <div className="flex justify-around items-center mt-1 text-lg text-foreground/70">⏮ <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center text-base">⏯</span> ⏭</div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "32%", label: "Big play target" },
      { n: 2, x: "50%", y: "70%", label: "Scrub timeline" },
      { n: 3, x: "50%", y: "90%", label: "Transport controls" },
    ],
  }),

  lessonCard: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">Lesson 12 of 30</div>
        <div className="rounded-xl border border-border/60 p-3 bg-card/60 flex-1 flex flex-col">
          <div className="font-display text-[18px] leading-tight">Choose the past tense</div>
          <div className="text-[11px] text-foreground/65 mt-1">"Yesterday I ___ to the market."</div>
          <div className="mt-3 space-y-1.5">
            {[
              { t: "go", ok: false }, { t: "went", ok: true }, { t: "going", ok: false }, { t: "gone", ok: false },
            ].map((o) => (
              <div key={o.t} className={`px-3 py-2 rounded-lg border text-[11px] ${o.ok ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background/30 text-foreground/75"}`}>
                {o.t}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto"><CTA>Check answer</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "14%", label: "Progress crumb" },
      { n: 2, x: "50%", y: "50%", label: "One question, focused" },
      { n: 3, x: "50%", y: "92%", label: "Immediate feedback" },
    ],
  }),

  progressRings: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex gap-4 justify-center pt-1">
          {[{ p: 80, l: "Lessons" }, { p: 60, l: "Practice" }, { p: 100, l: "Streak" }].map((r) => (
            <div key={r.l} className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16 rounded-full" style={{ background: `conic-gradient(var(--primary) ${r.p * 3.6}deg, var(--muted) 0)` }}>
                <div className="absolute inset-1.5 rounded-full bg-card grid place-items-center text-[11px] font-mono font-medium">{r.p}%</div>
              </div>
              <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">{r.l}</div>
            </div>
          ))}
        </div>
        <div className="font-display text-[18px] leading-tight mt-2">{s.metricLabel}: {s.metricValue}</div>
        <div className="space-y-1.5 mt-1">
          {[{ l: "Spanish vocab", v: "120 words" }, { l: "Past tense", v: "8/10 correct" }, { l: "Listening", v: "5 min" }].map((it) => (
            <div key={it.l} className="flex items-center justify-between text-[11px] border-b border-border/40 pb-1">
              <span>{it.l}</span><span className="font-mono text-primary">{it.v}</span>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "78%", y: "20%", label: "Streak ring" },
      { n: 2, x: "50%", y: "50%", label: "Headline reward" },
      { n: 3, x: "78%", y: "78%", label: "Today's wins" },
    ],
  }),

  kanban: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">{s.titles[0].split(" ")[0]} sprint</div>
        <div className="grid grid-cols-3 gap-1.5 flex-1">
          {[
            { col: "Todo", items: [s.titles[1], s.titles[2]] },
            { col: "Doing", items: [s.titles[0]] },
            { col: "Done", items: [s.titles[3]] },
          ].map((col) => (
            <div key={col.col} className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase tracking-wider text-foreground/55">{col.col}</div>
              {col.items.map((t, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-1.5 bg-card/70">
                  <div className="text-[10px] font-medium leading-tight">{t}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] font-mono text-primary">P{(i % 3) + 1}</span>
                    <div className="w-4 h-4 rounded-full bg-foreground/15" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "20%", y: "20%", label: "Status columns" },
      { n: 2, x: "50%", y: "50%", label: "Draggable card" },
      { n: 3, x: "82%", y: "70%", label: "Owner avatar" },
    ],
  }),

  templateGallery: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">{s.hero}</div>
        <div className="flex gap-1">{s.chips.slice(0, 3).map((c, i) => <Chip key={c} accent={i === 0}>{c}</Chip>)}</div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border/60 flex flex-col">
              <Photo seed={i} className="aspect-[3/4]" />
              <div className="p-1.5">
                <div className="text-[10px] font-medium truncate">{s.titles[i]}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className="text-[9px] text-foreground/55">{s.subtitles[i]}</div>
                  <div className="text-[9px] font-mono text-primary">{s.prices[i]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "30%", y: "20%", label: "Category chips" },
      { n: 2, x: "26%", y: "50%", label: "Preview thumb" },
      { n: 3, x: "74%", y: "78%", label: "Free / Pro tag" },
    ],
  }),

  codeCanvas: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="flex items-center gap-1">
          {["Design", "Code", "Preview"].map((t, i) => (
            <div key={t} className={`px-2 py-0.5 rounded text-[9px] font-mono ${i === 1 ? "bg-primary text-primary-foreground" : "text-foreground/55"}`}>{t}</div>
          ))}
        </div>
        <div className="flex-1 rounded-lg border border-border/60 bg-background/40 p-2 font-mono text-[9px] leading-relaxed">
          <div className="text-foreground/40">// {s.titles[1]}</div>
          <div><span className="text-primary">import</span> {"{ Studio }"} <span className="text-primary">from</span> <span className="text-foreground/80">"./studio"</span></div>
          <div className="mt-1"><span className="text-primary">export function</span> Page() {"{"}</div>
          <div className="pl-3"><span className="text-primary">return</span> {"<"}<span className="text-foreground">Studio</span> theme=<span className="text-foreground/80">"deep-teal"</span> /{">"}</div>
          <div>{"}"}</div>
          <div className="mt-2 text-foreground/40">// 8 layers · auto-saved</div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-foreground/55"><span>{s.titles[1]}</span><span className="text-primary">●  live</span></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "12%", label: "Mode toggle" },
      { n: 2, x: "50%", y: "50%", label: "Editable canvas" },
      { n: 3, x: "82%", y: "92%", label: "Live status" },
    ],
  }),

  sendForm: (ctx, s) => ({
    node: (
      <Frame>
        <StatusBar title={ctx.stage} />
        <div className="font-display text-[18px] leading-tight">Send money</div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">To</div>
        <div className="h-10 rounded-xl border border-border bg-background/40 flex items-center px-3 gap-2">
          <div className="w-6 h-6 rounded-full bg-foreground/20" />
          <div className="text-[11px] flex-1">{s.names[0]}</div>
          <div className="text-[9px] font-mono text-foreground/55">@anareyes</div>
        </div>
        <div className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">Amount</div>
        <div className="rounded-xl border border-border bg-background/40 px-3 py-3 text-center">
          <div className="font-display text-[28px] leading-none">$240<span className="text-foreground/40">.00</span></div>
          <div className="text-[10px] text-foreground/55 mt-1">Available {s.metricValue}</div>
        </div>
        <div className="h-14 rounded-xl border border-border bg-background/40 px-3 py-2 text-[11px] text-foreground/60">Note · Rent · Aug</div>
        <div className="mt-auto"><CTA>Send {s.metricLabel === "Available" ? "now" : "instantly"}</CTA></div>
      </Frame>
    ),
    pins: [
      { n: 1, x: "50%", y: "26%", label: "Recipient" },
      { n: 2, x: "50%", y: "55%", label: "Big amount field" },
      { n: 3, x: "50%", y: "92%", label: "Commit CTA" },
    ],
  }),
};

const fallback: Builder = (ctx, s) => ({
  node: (
    <Frame>
      <StatusBar title={ctx.stage} />
      <div className="font-display text-[18px] leading-tight">{s.hero}</div>
      <div className="text-[11px] text-foreground/60 -mt-1">{s.heroSub}</div>
      <div className="space-y-2 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-2 items-center p-2 border border-border/60 rounded-xl">
            <Photo seed={i} className="w-10 h-10 rounded-md" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate">{s.titles[i]}</div>
              <div className="text-[9px] text-foreground/55 truncate">{s.subtitles[i]}</div>
            </div>
            <div className="text-[10px] font-mono text-primary">{s.prices[i]}</div>
          </div>
        ))}
      </div>
      <CTA>{ctaFor(s, ctx.stage)}</CTA>
    </Frame>
  ),
  pins: [
    { n: 1, x: "50%", y: "14%", label: "Headline" },
    { n: 2, x: "50%", y: "50%", label: "Primary content" },
    { n: 3, x: "50%", y: "92%", label: "Action" },
  ],
});

export function renderScreen(screen: string | undefined, ctx: RenderCtx): RenderedScreen {
  const s = samplesFor(ctx.industryId);
  const b = (screen && screens[screen]) || fallback;
  return b(ctx, s);
}

export function WireframeRenderer({ screen, ctx }: { screen?: string; ctx: RenderCtx }) {
  const { node } = renderScreen(screen, ctx);
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
