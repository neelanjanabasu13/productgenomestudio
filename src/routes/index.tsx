import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { dataSource } from "@/lib/dataSource";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Product Genome Studio — Design a product by choosing patterns" },
      { name: "description", content: "Hands-on product design simulator. Pick real UX patterns at every funnel stage and watch a live phone preview." },
      { property: "og:title", content: "Product Genome Studio" },
      { property: "og:description", content: "Design a product by choosing real UX patterns at every funnel stage." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const meta = useQuery({ queryKey: ["meta"], queryFn: () => dataSource.meta() });
  const industries = useQuery({ queryKey: ["industries"], queryFn: () => dataSource.listIndustries() });

  const filtered = useMemo(() => {
    const list = industries.data ?? [];
    if (!q.trim()) return list;
    const t = q.toLowerCase();
    return list.filter(
      (i) =>
        i.name.toLowerCase().includes(t) ||
        i.companies.some((c) => c.toLowerCase().includes(t))
    );
  }, [q, industries.data]);

  const noMatch = q.trim().length > 0 && filtered.length === 0;

  async function onGenerate() {
    try {
      await dataSource.generateIndustry(q.trim());
    } catch (e) {
      toast.message("AI generation", { description: (e as Error).message });
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 pt-16 pb-12">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" /> A hands-on simulator
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95]">
          Design a product by <em className="text-primary not-italic">choosing patterns</em>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          {meta.data?.tagline ?? "Pick real UX patterns at each funnel stage. See the tradeoffs, surface the conflicts, and assemble a coherent product."}
        </p>
      </div>

      <div className="mt-10 max-w-xl">
        <div className="flex items-center gap-2 px-4 h-12 rounded-full border border-border bg-card">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Explore an industry…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        {noMatch && (
          <button
            onClick={onGenerate}
            className="mt-3 inline-flex items-center gap-2 text-sm px-4 h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" /> Generate "{q.trim()}" with AI
          </button>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ind) => (
          <Link
            key={ind.id}
            to="/studio/$industryId"
            params={{ industryId: ind.id }}
            className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{ind.emoji}</span>
              {ind.source && ind.source !== "seed" && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{ind.source}</span>
              )}
            </div>
            <h3 className="mt-4 font-display text-xl">{ind.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{ind.companies.length} companies · {ind.funnel.length} stages</p>
            <div className="mt-4 flex flex-wrap gap-1">
              {ind.companies.slice(0, 3).map((c) => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c}</span>
              ))}
              {ind.companies.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{ind.companies.length - 3}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
