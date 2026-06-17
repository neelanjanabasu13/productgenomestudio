import type {
  Concept,
  Conflict,
  GenomeData,
  Goal,
  GoalId,
  Industry,
  Picks,
  Stage,
} from "@/data/genome.types";

export function recommendFor(stage: Stage, goal: GoalId | null): string | null {
  if (!goal) return null;
  return stage.recommend[goal] ?? null;
}

function getChosen(industry: Industry, picks: Picks) {
  return industry.funnel
    .map((s) => {
      const id = picks[s.stage];
      const opt = id ? s.options.find((o) => o.id === id) : null;
      return opt ? { stage: s.stage, option: opt } : null;
    })
    .filter((x): x is { stage: string; option: Stage["options"][number] } => !!x);
}

const axisLabel: Record<"ex" | "em" | "si", [string, string]> = {
  ex: ["explore-heavy", "precise"],
  em: ["emotional", "transactional"],
  si: ["simple", "dense"],
};

export function detectConflicts(industry: Industry, picks: Picks): Conflict[] {
  const chosen = getChosen(industry, picks);
  const conflicts: Conflict[] = [];
  (["ex", "em", "si"] as const).forEach((axis) => {
    for (let i = 0; i < chosen.length; i++) {
      for (let j = i + 1; j < chosen.length; j++) {
        const a = chosen[i];
        const b = chosen[j];
        const va = a.option.traits[axis];
        const vb = b.option.traits[axis];
        if ((va >= 2 && vb <= -2) || (va <= -2 && vb >= 2)) {
          const [posLabel, negLabel] = axisLabel[axis];
          const posStage = va >= 2 ? a.stage : b.stage;
          const negStage = va >= 2 ? b.stage : a.stage;
          conflicts.push({
            axis,
            stages: [posStage, negStage],
            message: `${posStage} feels ${posLabel}, but ${negStage} is ${negLabel} — friction between the two.`,
          });
        }
      }
    }
  });
  return conflicts;
}

export interface ScoreResult {
  consistency: number;
  goalMatches: number;
  totalPicks: number;
  totalStages: number;
  conflicts: Conflict[];
  traitTotals: { ex: number; em: number; si: number };
}

export function score(
  industry: Industry,
  picks: Picks,
  goal: GoalId | null
): ScoreResult {
  const chosen = getChosen(industry, picks);
  const conflicts = detectConflicts(industry, picks);
  const consistency = Math.max(0, 100 - conflicts.length * 18);
  const goalMatches = goal
    ? industry.funnel.reduce((n, s) => {
        const rec = s.recommend[goal];
        return picks[s.stage] && picks[s.stage] === rec ? n + 1 : n;
      }, 0)
    : 0;
  const traitTotals = chosen.reduce(
    (acc, c) => ({
      ex: acc.ex + c.option.traits.ex,
      em: acc.em + c.option.traits.em,
      si: acc.si + c.option.traits.si,
    }),
    { ex: 0, em: 0, si: 0 }
  );
  return {
    consistency,
    goalMatches,
    totalPicks: chosen.length,
    totalStages: industry.funnel.length,
    conflicts,
    traitTotals,
  };
}

export function matchGoalFromText(text: string, goals: Goal[]): GoalId | null {
  if (!text) return null;
  const t = text.toLowerCase();
  for (const g of goals) {
    if (g.keywords.some((k) => t.includes(k.toLowerCase()))) return g.id;
  }
  return null;
}

function adj(n: number, pos: string, neg: string, neutral = "balanced") {
  if (n >= 2) return pos;
  if (n <= -2) return neg;
  return neutral;
}

export function synthesizeConceptLocal(
  industry: Industry,
  picks: Picks,
  goal: GoalId | null,
  goals: Goal[]
): Concept {
  const s = score(industry, picks, goal);
  const chosen = getChosen(industry, picks);
  const tEx = adj(s.traitTotals.ex, "exploratory", "precise");
  const tEm = adj(s.traitTotals.em, "emotional", "transactional");
  const tSi = adj(s.traitTotals.si, "simple", "dense");

  const goalLabel = goal ? goals.find((g) => g.id === goal)?.label : null;

  const namePrefix =
    tEm === "emotional"
      ? ["Lumen", "Ember", "Hearth", "Aria"]
      : tEx === "exploratory"
      ? ["Drift", "Compass", "Roam", "Atlas"]
      : tSi === "simple"
      ? ["Pith", "Brisk", "Crisp", "Plain"]
      : ["Vector", "Loft", "Forge", "Quill"];
  const tag = industry.name.split(/[\s&/]+/)[0] ?? "Studio";
  const name = `${namePrefix[chosen.length % namePrefix.length]} ${tag}`;

  const positioning = `A ${tEm}, ${tEx} take on ${industry.name.toLowerCase()} — ${tSi} on the surface, built around ${chosen
    .slice(0, 2)
    .map((c) => c.option.pattern.toLowerCase())
    .join(" and ")}.`;

  const direction = chosen.map(
    (c) => `${c.stage}: ${c.option.pattern} (after ${c.option.company})`
  );

  const critique: string[] = [];
  if (s.conflicts.length === 0) {
    critique.push("The picks line up on every axis — coherent product DNA.");
  } else {
    s.conflicts.forEach((c) => critique.push(c.message));
    critique.push(
      "Reconcile these tensions in the visual language, or lean into one pole."
    );
  }
  if (goalLabel) {
    critique.push(
      `Goal alignment: ${s.goalMatches}/${s.totalStages} stages match "${goalLabel}".`
    );
  }

  return { name, positioning, direction, critique };
}

export function suggestedPicksFor(
  industry: Industry,
  goal: GoalId | null
): Picks {
  if (!goal) return {};
  const out: Picks = {};
  industry.funnel.forEach((s) => {
    out[s.stage] = s.recommend[goal];
  });
  return out;
}

export type { GenomeData };

// ---------- annotation helpers ----------

type AnyOption = Stage["options"][number];

export function composePurpose(
  opt: AnyOption,
  screenTypes: Record<string, string> | undefined,
  stageName: string
): string {
  // Use opt.purpose if the dataset has it (forward-compatible)
  const purpose = (opt as unknown as { purpose?: string }).purpose;
  if (purpose && purpose.trim()) return purpose.trim();
  const raw = screenTypes?.[opt.screen];
  if (raw) {
    const t = raw.replace(/^[a-z]/, (c) => c.toUpperCase()).replace(/\.$/, "");
    return `${t}.`;
  }
  return `Frames the ${stageName.toLowerCase()} step as a ${opt.pattern.toLowerCase()}.`;
}

export function composeStrength(opt: AnyOption): string {
  const phrases: Record<string, [string, string]> = {
    ex: ["rewards open exploration", "feels fast and decisive"],
    em: ["builds emotional pull", "stays calm and transactional"],
    si: ["reads instantly", "exposes power and depth"],
  };
  const axes: ("ex" | "em" | "si")[] = ["ex", "em", "si"];
  let bestAxis: "ex" | "em" | "si" = "em";
  let bestMag = -1;
  axes.forEach((a) => {
    const v = opt.traits[a];
    if (Math.abs(v) > bestMag) {
      bestMag = Math.abs(v);
      bestAxis = a;
    }
  });
  const dir = opt.traits[bestAxis] >= 0 ? phrases[bestAxis][0] : phrases[bestAxis][1];
  return `Best at this: ${dir}.`;
}