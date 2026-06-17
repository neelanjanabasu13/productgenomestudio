import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Star, AlertTriangle, ArrowLeft, Sparkles, Check, X } from "lucide-react";
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

      {concept && <ConceptModal concept={concept} onClose={() => setConcept(null)} />}
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

function ConceptModal({ concept, onClose }: { concept: Concept; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg w-full bg-card border border-border rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Synthesized concept</div>
            <h2 className="font-display text-3xl mt-2">{concept.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-full hover:bg-accent">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed">{concept.positioning}</p>

        <div className="mt-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">UX direction</div>
          <ul className="space-y-1.5">
            {concept.direction.map((d, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-primary">→</span><span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Critique</div>
          <ul className="space-y-1.5">
            {concept.critique.map((d, i) => (
              <li key={i} className="text-sm text-muted-foreground">{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}