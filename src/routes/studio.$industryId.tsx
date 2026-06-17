import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Star, AlertTriangle, ArrowLeft, Sparkles, Check, X, ChevronLeft, ChevronRight, RotateCcw, Pause, Play, Wand2 } from "lucide-react";
import { dataSource } from "@/lib/dataSource";
import {
  matchGoalFromText,
  recommendFor,
  score,
  suggestedPicksFor,
} from "@/lib/engine";
import type { Concept, GoalId, Picks } from "@/data/genome.types";
import { PhoneFrame } from "@/components/PhoneFrame";
import { WireframeRenderer, renderScreen } from "@/components/WireframeRenderer";
import { composePurpose, composeStrength } from "@/lib/engine";
import { SketchIcon } from "@/components/SketchIcons";

export const Route = createFileRoute("/studio/$industryId")({
  head: ({ params }) => ({
    meta: [
      { title: `Studio · ${params.industryId} — Product Genome Studio` },
      { name: "description", content: "Pick UX patterns at every stage and watch a live phone preview." },
    ],
  }),
  component: Studio,
});

function picksKey(id: string) {
  return `pgs:picks:${id}`;
}

function Studio() {
  const { industryId } = Route.useParams();
  const meta = useQuery({ queryKey: ["meta"], queryFn: () => dataSource.meta() });
  const industryQ = useQuery({
    queryKey: ["industry", industryId],
    queryFn: async () => {
      const i = await dataSource.getIndustry(industryId);
      if (!i) throw notFound();
      return i;
    },
  });

  const industry = industryQ.data;
  const goals = meta.data?.goals ?? [];

  const [picks, setPicks] = useState<Picks>({});
  const [goalText, setGoalText] = useState("");
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [concept, setConcept] = useState<Concept | null>(null);

  // hydrate picks from storage
  useEffect(() => {
    if (!industry) return;
    try {
      const raw = localStorage.getItem(picksKey(industry.id));
      if (raw) setPicks(JSON.parse(raw));
    } catch {}
    setActiveStage(industry.funnel[0]?.stage ?? null);
  }, [industry]);

  useEffect(() => {
    if (!industry) return;
    localStorage.setItem(picksKey(industry.id), JSON.stringify(picks));
  }, [picks, industry]);

  // goal typing
  useEffect(() => {
    if (!goalText) return;
    const matched = matchGoalFromText(goalText, goals);
    if (matched) setGoal(matched);
  }, [goalText, goals]);

  const stage = useMemo(
    () => industry?.funnel.find((s) => s.stage === activeStage) ?? industry?.funnel[0],
    [industry, activeStage]
  );

  const chosenOption = useMemo(() => {
    if (!stage) return null;
    const id = picks[stage.stage];
    return id ? stage.options.find((o) => o.id === id) ?? null : null;
  }, [stage, picks]);

  const scored = useMemo(
    () => (industry ? score(industry, picks, goal) : null),
    [industry, picks, goal]
  );

  const screenTypes = meta.data?.screenTypes;
  const rendered = useMemo(() => {
    if (!chosenOption || !stage || !industry) return null;
    return renderScreen(chosenOption.screen, {
      industryId: industry.id,
      stage: stage.stage,
      pattern: chosenOption.pattern,
      company: chosenOption.company,
    });
  }, [chosenOption, stage, industry]);

  function pick(stageName: string, optId: string) {
    setPicks((p) => ({ ...p, [stageName]: p[stageName] === optId ? "" : optId }));
  }

  function useSuggested() {
    if (!industry || !goal) return;
    setPicks(suggestedPicksFor(industry, goal));
  }

  function reset() {
    setPicks({});
    setConcept(null);
  }

  async function synthesize() {
    if (!industry) return;
    const c = await dataSource.synthesizeConcept(industry.id, picks, goal);
    setConcept(c);
  }

  if (industryQ.isLoading || !industry || !stage) {
    return <div className="max-w-6xl mx-auto px-5 py-12 text-muted-foreground">Loading…</div>;
  }

  const allChosen = industry.funnel.every((s) => picks[s.stage]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> All industries
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 text-foreground/80">
              <SketchIcon id={industry.id} />
            </div>
            <h1 className="font-display text-4xl tracking-tight">{industry.name}</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {industry.companies.join(" · ")}
          </p>
        </div>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Reset picks</button>
      </div>

      {/* Goal bar */}
      <div className="mt-6 p-4 rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Your goal (optional)…"
            className="flex-1 min-w-[200px] h-9 px-3 rounded-full border border-border bg-background text-sm outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-1.5">
            <GoalChip active={goal === null} onClick={() => { setGoal(null); setGoalText(""); }}>No goal</GoalChip>
            {goals.map((g) => (
              <GoalChip key={g.id} active={goal === g.id} onClick={() => setGoal(g.id)}>{g.label}</GoalChip>
            ))}
          </div>
          {goal && (
            <button onClick={useSuggested} className="text-xs px-3 h-8 rounded-full bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5"/> Use suggested set
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* PHONE */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <PhoneFrame>
              {chosenOption && industry ? (
                <WireframeRenderer
                  screen={chosenOption.screen}
                  ctx={{
                    industryId: industry.id,
                    stage: stage.stage,
                    pattern: chosenOption.pattern,
                    company: chosenOption.company,
                  }}
                />
              ) : (
                <div className="h-full grid place-items-center text-center px-6">
                  <div>
                    <div className="text-3xl mb-2">↗</div>
                    <div className="text-sm text-muted-foreground">Pick a pattern to preview the {stage.stage.toLowerCase()} screen.</div>
                  </div>
                </div>
              )}
            </PhoneFrame>
            {/* Numbered pin overlay — positioned over the phone screen area (inset-2 + top pt-6 of PhoneFrame) */}
            {rendered && (
              <div className="absolute pointer-events-none" style={{ left: 8, right: 8, top: 8 + 24, bottom: 8 }}>
                {rendered.pins.map((p) => (
                  <div
                    key={p.n}
                    className="absolute -translate-x-1/2 -translate-y-1/2 animate-scale-in"
                    style={{ left: p.x, top: p.y }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/30 blur-[6px]" />
                      <div className="relative w-5 h-5 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px] font-mono ring-2 ring-background shadow-md">
                        {p.n}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {chosenOption && (
            <div className="mt-4 text-center max-w-[290px]">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{stage.stage}</div>
              <div className="text-sm font-medium mt-0.5">{chosenOption.pattern}</div>
              <div className="text-xs text-muted-foreground">after {chosenOption.company}</div>
            </div>
          )}

          {/* Callout panel — Purpose / Strength / Weakness */}
          <div className="mt-5 w-full max-w-[290px]">
            {chosenOption && rendered ? (
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Annotation</div>
                <CalloutRow
                  n={rendered.pins[0]?.n ?? 1}
                  label="Purpose"
                  text={composePurpose(chosenOption, screenTypes, stage.stage)}
                  tone="primary"
                />
                <CalloutRow
                  n={rendered.pins[1]?.n ?? 2}
                  label="Strength"
                  text={composeStrength(chosenOption)}
                  tone="primary"
                />
                <CalloutRow
                  n={rendered.pins[2]?.n ?? 3}
                  label="Weakness — tradeoff"
                  text={chosenOption.tradeoff}
                  tone="amber"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground text-center">
                Pick a pattern to see how it works.
              </div>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div>
          {/* Stage tabs */}
          <div className="flex flex-wrap gap-1.5 mb-5 border-b border-border pb-3">
            {industry.funnel.map((s) => {
              const active = s.stage === stage.stage;
              const has = !!picks[s.stage];
              return (
                <button
                  key={s.stage}
                  onClick={() => setActiveStage(s.stage)}
                  className={`px-3 h-8 rounded-full text-xs inline-flex items-center gap-1.5 transition-colors ${
                    active ? "bg-foreground text-background" : "hover:bg-accent"
                  }`}
                >
                  {s.stage}
                  {has && <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-primary" : "bg-primary"}`} />}
                </button>
              );
            })}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stage.options.map((opt) => {
              const isSuggested = recommendFor(stage, goal) === opt.id;
              const isSelected = picks[stage.stage] === opt.id;
              const goalLabel = goals.find((g) => g.id === goal)?.label;
              return (
                <button
                  key={opt.id}
                  onClick={() => pick(stage.stage, opt.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-foreground/30"
                  }`}
                >
                  {isSuggested && goal && (
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary mb-2">
                      <Star className="w-3 h-3 fill-current" /> Suggested for {goalLabel}
                    </div>
                  )}
                  <div className="font-display text-base leading-tight">{opt.pattern}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">after {opt.company}</div>
                  {isSelected && (
                    <div className="mt-3 flex gap-2 items-start text-xs text-muted-foreground border-t border-border pt-3">
                      <AlertTriangle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{opt.tradeoff}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Genome panel */}
          {scored && (
            <div className="mt-6 p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg">Genome</h3>
                <div className="text-xs text-muted-foreground">{scored.totalPicks}/{scored.totalStages} stages</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Consistency</div>
                  <div className="mt-1 text-3xl font-display">{scored.consistency}%</div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${scored.consistency}%` }} />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Goal match</div>
                  <div className="mt-1 text-3xl font-display">
                    {goal ? `${scored.goalMatches}/${scored.totalStages}` : "—"}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {goal ? goals.find((g) => g.id === goal)?.label : "No goal selected"}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">Conflicts</div>
                {scored.conflicts.length === 0 ? (
                  <div className="text-xs text-foreground/70 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-primary"/> Picks are coherent across all axes.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {scored.conflicts.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{c.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={synthesize}
                disabled={!allChosen}
                className="mt-5 w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {allChosen ? "Synthesize concept" : `Pick all ${scored.totalStages} stages to synthesize`}
              </button>
            </div>
          )}
        </div>
      </div>

      {concept && (
        <FlowReelModal
          concept={concept}
          industry={industry}
          picks={picks}
          consistency={scored?.consistency ?? 0}
          conflicts={scored?.conflicts ?? []}
          onClose={() => setConcept(null)}
        />
      )}
    </div>
  );
}

function GoalChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 h-8 rounded-full text-xs transition-colors ${
        active ? "bg-foreground text-background" : "border border-border hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function CalloutRow({
  n,
  label,
  text,
  tone,
}: {
  n: number;
  label: string;
  text: string;
  tone: "primary" | "amber";
}) {
  const borderCls = tone === "primary" ? "border-primary" : "border-amber-400/80";
  const chipCls =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-amber-400 text-background";
  const labelCls = tone === "primary" ? "text-primary" : "text-amber-400";
  return (
    <div className={`pl-3 border-l-2 ${borderCls}`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-4 h-4 rounded-full grid place-items-center text-[9px] font-mono ${chipCls}`}>{n}</span>
        <span className={`text-[9px] font-mono uppercase tracking-[0.16em] ${labelCls}`}>{label}</span>
      </div>
      <p className="mt-1.5 text-[12px] leading-snug text-foreground/85">{text}</p>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

type FlowStep = {
  stage: string;
  pattern: string;
  company: string;
  screen: string;
};

function FlowReelModal({
  concept,
  industry,
  picks,
  consistency,
  conflicts,
  onClose,
}: {
  concept: Concept;
  industry: import("@/data/genome.types").Industry;
  picks: Picks;
  consistency: number;
  conflicts: { message: string }[];
  onClose: () => void;
}) {
  const reduced = usePrefersReducedMotion();

  const steps: FlowStep[] = useMemo(() => {
    return industry.funnel
      .map((s) => {
        const optId = picks[s.stage];
        const opt = optId ? s.options.find((o) => o.id === optId) : undefined;
        if (!opt) return null;
        return { stage: s.stage, pattern: opt.pattern, company: opt.company, screen: opt.screen };
      })
      .filter((x): x is FlowStep => !!x);
  }, [industry, picks]);

  const total = steps.length;
  // index in [0, total]; total = end card
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hoverPause = useRef(false);

  useEffect(() => {
    if (reduced) return;
    if (paused || hoverPause.current) return;
    if (index >= total) return;
    const t = setTimeout(() => setIndex((i) => Math.min(i + 1, total)), 1800);
    return () => clearTimeout(t);
  }, [index, paused, reduced, total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, total));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, onClose]);

  function replay() {
    setIndex(0);
    setPaused(false);
  }

  const atEnd = index >= total;
  const current = !atEnd ? steps[index] : null;
  const progress = total === 0 ? 0 : Math.min(index + (atEnd ? 0 : 1), total) / total;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 grid place-items-center rounded-full bg-card border border-border hover:bg-accent z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary">Your concept · play flow</div>
          <h2 className="font-display text-3xl mt-2 leading-tight">{concept.name}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{concept.positioning}</p>
        </div>

        {reduced ? (
          <ReducedFilmstrip steps={steps} industry={industry} concept={concept} consistency={consistency} conflicts={conflicts} onReplay={replay} />
        ) : (
          <>
            <div
              className="relative"
              onMouseEnter={() => { hoverPause.current = true; }}
              onMouseLeave={() => { hoverPause.current = false; }}
            >
              <PhoneFrame>
                {current ? (
                  <div key={index} className="h-full w-full animate-reel-in">
                    <WireframeRenderer
                      screen={current.screen}
                      ctx={{
                        industryId: industry.id,
                        stage: current.stage,
                        pattern: current.pattern,
                        company: current.company,
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full" />
                )}
              </PhoneFrame>

              {atEnd && (
                <EndCard
                  concept={concept}
                  consistency={consistency}
                  conflicts={conflicts}
                  onReplay={replay}
                />
              )}
            </div>

            {/* Progress + dots */}
            <div className="mt-5 w-full max-w-[300px]">
              <div className="h-[2px] rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {steps.map((s, i) => {
                    const active = i === index;
                    const done = i < index || atEnd;
                    return (
                      <button
                        key={s.stage}
                        onClick={() => setIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          active ? "bg-primary w-4" : done ? "bg-primary/60" : "bg-muted-foreground/30"
                        }`}
                        aria-label={`Step ${i + 1} ${s.stage}`}
                      />
                    );
                  })}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  {atEnd ? "END" : `${String(index + 1).padStart(2, "0")} · ${current?.stage}`}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                className="w-9 h-9 grid place-items-center rounded-full border border-border hover:bg-accent disabled:opacity-30"
                disabled={index === 0}
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPaused((p) => !p)}
                className="w-9 h-9 grid place-items-center rounded-full border border-border hover:bg-accent"
                aria-label={paused ? "Play" : "Pause"}
              >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={replay}
                className="h-9 px-4 rounded-full border border-border hover:bg-accent inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay
              </button>
              <button
                onClick={() => setIndex((i) => Math.min(i + 1, total))}
                className="w-9 h-9 grid place-items-center rounded-full border border-border hover:bg-accent disabled:opacity-30"
                disabled={atEnd}
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EndCard({
  concept,
  consistency,
  conflicts,
  onReplay,
}: {
  concept: Concept;
  consistency: number;
  conflicts: { message: string }[];
  onReplay: () => void;
}) {
  return (
    <div className="absolute inset-0 grid place-items-center p-4 animate-fade-in">
      <div className="w-[260px] max-h-full overflow-y-auto rounded-2xl bg-card/95 backdrop-blur border border-border shadow-2xl p-4">
        <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-primary">Concept</div>
        <h3 className="font-display text-xl mt-1 leading-tight">{concept.name}</h3>
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{concept.positioning}</p>

        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-1.5">UX direction</div>
          <ul className="space-y-1">
            {concept.direction.slice(0, 3).map((d, i) => (
              <li key={i} className="text-[11px] leading-snug flex gap-1.5">
                <span className="text-primary shrink-0">→</span><span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Consistency</div>
            <div className="font-display text-2xl mt-0.5">{consistency}%</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Conflicts</div>
            <div className={`font-display text-2xl mt-0.5 ${conflicts.length ? "text-amber-400" : ""}`}>
              {conflicts.length}
            </div>
          </div>
        </div>

        {conflicts.length > 0 && (
          <ul className="mt-2 space-y-1">
            {conflicts.slice(0, 2).map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[10px] leading-snug text-amber-400/90">
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" /> <span>{c.message}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={onReplay}
            className="flex-1 h-8 rounded-lg border border-border hover:bg-accent text-[11px] font-mono uppercase tracking-wider inline-flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Replay
          </button>
          <button
            className="flex-1 h-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-[11px] font-mono uppercase tracking-wider inline-flex items-center justify-center gap-1"
          >
            <Wand2 className="w-3 h-3" /> Refine AI
          </button>
        </div>
      </div>
    </div>
  );
}

function ReducedFilmstrip({
  steps,
  industry,
  concept,
  consistency,
  conflicts,
  onReplay,
}: {
  steps: FlowStep[];
  industry: import("@/data/genome.types").Industry;
  concept: Concept;
  consistency: number;
  conflicts: { message: string }[];
  onReplay: () => void;
}) {
  return (
    <div className="w-full max-h-[70vh] overflow-y-auto space-y-6 pr-1">
      {steps.map((s, i) => (
        <div key={s.stage} className="flex items-start gap-4">
          <div className="shrink-0 text-right w-14">
            <div className="font-mono text-[10px] text-primary">{String(i + 1).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{s.stage}</div>
          </div>
          <div className="w-[180px]">
            <PhoneFrame>
              <WireframeRenderer
                screen={s.screen}
                ctx={{ industryId: industry.id, stage: s.stage, pattern: s.pattern, company: s.company }}
              />
            </PhoneFrame>
            <div className="mt-2 text-[11px]">{s.pattern}</div>
            <div className="text-[10px] text-muted-foreground">after {s.company}</div>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-primary">Concept</div>
        <h3 className="font-display text-xl mt-1">{concept.name}</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">{concept.positioning}</p>
        <div className="mt-3 flex justify-between text-xs">
          <span>Consistency <strong className="font-display text-base">{consistency}%</strong></span>
          <span>Conflicts <strong className={`font-display text-base ${conflicts.length ? "text-amber-400" : ""}`}>{conflicts.length}</strong></span>
        </div>
        <button onClick={onReplay} className="mt-3 w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider">
          Restart
        </button>
      </div>
    </div>
  );
}