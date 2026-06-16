import { staticDataSource, type DataSource } from "./static";

export const MODE: "static" | "live" = "static";

function withFallback(live: DataSource): DataSource {
  const wrap = <K extends keyof DataSource>(key: K): DataSource[K] => {
    const liveFn = live[key] as unknown as (...args: unknown[]) => unknown;
    const staticFn = staticDataSource[key] as unknown as (
      ...args: unknown[]
    ) => unknown;
    if (typeof liveFn !== "function") return live[key];
    return (async (...args: unknown[]) => {
      try {
        return await liveFn(...args);
      } catch {
        return staticFn(...args);
      }
    }) as unknown as DataSource[K];
  };
  return {
    ...live,
    listIndustries: wrap("listIndustries"),
    getIndustry: wrap("getIndustry"),
    generateIndustry: wrap("generateIndustry"),
    synthesizeConcept: wrap("synthesizeConcept"),
    addEntry: wrap("addEntry"),
    submitCorrection: wrap("submitCorrection"),
    meta: wrap("meta"),
  };
}

export const dataSource: DataSource =
  MODE === "static" ? staticDataSource : withFallback(staticDataSource);

export type { DataSource };