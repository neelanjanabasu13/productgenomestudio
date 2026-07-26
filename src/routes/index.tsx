import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { dataSource } from "@/lib/dataSource";
import { toast } from "sonner";
import { HexIndustryPicker } from "@/components/HexIndustryPicker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Product Genome Studio - UX Pattern Simulator" },
      { name: "description", content: "Hands-on product design simulator. Pick real UX patterns at every funnel stage and watch a live phone preview." },
      { property: "og:title", content: "Product Genome Studio - UX Pattern Simulator" },
      { property: "og:description", content: "Pick real UX patterns at every funnel stage and watch a live phone preview build your product." },
      { property: "og:url", content: "https://productgenomestudio.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://productgenomestudio.lovable.app/" },
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
    <div className="max-w-6xl mx-auto px-5 pt-16 pb-20">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" /> A hands-on simulator
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95]">
          Design a product by <em className="text-primary not-italic">choosing patterns</em>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          {meta.data?.tagline ?? "Design a product by choosing real patterns at each journey stage - with tradeoffs, conflicts, and a goal-guided assist."}
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

      <div className="mt-16">
        <HexIndustryPicker industries={filtered} />
      </div>
    </div>
  );
}
