import seedData from "@/data/genome.json";
import type {
  Concept,
  Correction,
  GenomeData,
  GoalId,
  Industry,
  Picks,
} from "@/data/genome.types";
import { synthesizeConceptLocal } from "@/lib/engine";

const data = seedData as unknown as GenomeData;

const LS_INDUSTRIES = "pgs:industries";
const LS_CORRECTIONS = "pgs:corrections";

function readLS<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLS<T>(key: string, val: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(val));
}

function allIndustries(): Industry[] {
  const extras = readLS<Industry>(LS_INDUSTRIES);
  const seedTagged = data.industries.map((i) => ({
    ...i,
    source: i.source ?? ("seed" as const),
  }));
  return [...seedTagged, ...extras];
}

export const staticDataSource = {
  mode: "static" as const,
  meta() {
    return Promise.resolve({
      product: data.product,
      tagline: data.tagline,
      disclaimer: data.disclaimer,
      goals: data.goals,
      conflictModel: data.conflictModel,
      screenTypes: data.screenTypes,
    });
  },
  listIndustries(): Promise<Industry[]> {
    return Promise.resolve(allIndustries());
  },
  getIndustry(id: string): Promise<Industry | null> {
    return Promise.resolve(allIndustries().find((i) => i.id === id) ?? null);
  },
  generateIndustry(_name: string): Promise<Industry> {
    return Promise.reject(new Error("coming soon"));
  },
  synthesizeConcept(
    industryId: string,
    picks: Picks,
    goal: GoalId | null
  ): Promise<Concept> {
    const ind = allIndustries().find((i) => i.id === industryId);
    if (!ind) return Promise.reject(new Error("industry not found"));
    return Promise.resolve(
      synthesizeConceptLocal(ind, picks, goal, data.goals)
    );
  },
  addEntry(industry: Industry): Promise<Industry> {
    const tagged: Industry = { ...industry, source: "community" };
    const extras = readLS<Industry>(LS_INDUSTRIES).filter(
      (i) => i.id !== tagged.id
    );
    writeLS(LS_INDUSTRIES, [...extras, tagged]);
    return Promise.resolve(tagged);
  },
  submitCorrection(c: Omit<Correction, "createdAt" | "source">): Promise<Correction> {
    const tagged: Correction = {
      ...c,
      source: "community",
      createdAt: Date.now(),
    };
    const prev = readLS<Correction>(LS_CORRECTIONS);
    writeLS(LS_CORRECTIONS, [...prev, tagged]);
    return Promise.resolve(tagged);
  },
};

export type DataSource = typeof staticDataSource;