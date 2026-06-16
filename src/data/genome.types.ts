export type GoalId = "conversion" | "emotional" | "simple";
export type Source = "seed" | "ai" | "community";

export interface Traits {
  ex: number;
  em: number;
  si: number;
}

export interface Option {
  id: string;
  company: string;
  pattern: string;
  tradeoff: string;
  screen: string;
  traits: Traits;
  goalsServed: GoalId[];
}

export interface Stage {
  stage: string;
  options: Option[];
  recommend: Record<GoalId, string>;
}

export interface Industry {
  id: string;
  name: string;
  emoji: string;
  companies: string[];
  funnel: Stage[];
  source?: Source;
}

export interface Goal {
  id: GoalId;
  label: string;
  keywords: string[];
}

export interface ConflictModel {
  axes: Record<"ex" | "em" | "si", string>;
  rule: string;
}

export interface GenomeData {
  schemaVersion: number;
  product: string;
  tagline: string;
  disclaimer: string;
  goals: Goal[];
  conflictModel: ConflictModel;
  screenTypes: Record<string, string>;
  industries: Industry[];
}

export type Picks = Record<string, string>; // stage name -> option id

export interface Conflict {
  axis: "ex" | "em" | "si";
  message: string;
  stages: [string, string];
}

export interface Concept {
  name: string;
  positioning: string;
  direction: string[];
  critique: string[];
}

export interface Correction {
  industryId: string;
  stage: string;
  optionId: string;
  note: string;
  source: Source;
  createdAt: number;
}