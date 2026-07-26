import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { dataSource } from "@/lib/dataSource";
import type { Industry, Stage } from "@/data/genome.types";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title: "Add an industry - Product Genome Studio" },
      { name: "description", content: "Contribute a new industry with real UX patterns to the Product Genome Studio simulator." },
      { property: "og:title", content: "Add an industry - Product Genome Studio" },
      { property: "og:description", content: "Contribute a new industry with real UX patterns to the Product Genome Studio simulator." },
      { property: "og:url", content: "https://productgenomestudio.lovable.app/add" },
    ],
    links: [
      { rel: "canonical", href: "https://productgenomestudio.lovable.app/add" },
    ],
  }),
  component: Add,
});

function blankStage(): Stage {
  return {
    stage: "",
    options: [blankOption()],
    recommend: { conversion: "", emotional: "", simple: "" },
  };
}
function blankOption() {
  return {
    id: Math.random().toString(36).slice(2, 9),
    company: "",
    pattern: "",
    tradeoff: "",
    screen: "listRows",
    traits: { ex: 0, em: 0, si: 0 },
    goalsServed: [],
  };
}

const screenChoices = [
  "photoGrid","dealList","searchBox","filterList","mapView","listRows","scoreBadge",
  "profileTrust","badgeRow","guestForm","oneClick","reassureForm","stampCard","savedGrid",
  "tierList","feedFull","composer","chatThread","dashboard","carousel","onboardChecklist",
  "insightsCards","playerView","lessonCard","progressRings","kanban","templateGallery",
  "codeCanvas","sendForm",
];

function Add() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [companies, setCompanies] = useState("");
  const [funnel, setFunnel] = useState<Stage[]>([blankStage()]);

  async function submit() {
    if (!name.trim()) return toast.error("Industry name required");
    if (funnel.some((s) => !s.stage.trim())) return toast.error("Every stage needs a name");
    if (funnel.some((s) => s.options.some((o) => !o.pattern.trim()))) return toast.error("Every option needs a pattern");

    // backfill recommend with first option per stage if empty
    const cleaned = funnel.map((s) => ({
      ...s,
      recommend: {
        conversion: s.recommend.conversion || s.options[0].id,
        emotional: s.recommend.emotional || s.options[0].id,
        simple: s.recommend.simple || s.options[0].id,
      },
    }));

    const ind: Industry = {
      id: `community_${name.toLowerCase().replace(/\W+/g, "_").slice(0, 24)}_${Date.now().toString(36)}`,
      name: name.trim(),
      emoji: emoji.trim() || "✨",
      companies: companies.split(",").map((c) => c.trim()).filter(Boolean),
      funnel: cleaned,
      source: "community",
    };
    await dataSource.addEntry(ind);
    toast.success("Industry added");
    navigate({ to: "/studio/$industryId", params: { industryId: ind.id } });
  }

  function updateStage(idx: number, patch: Partial<Stage>) {
    setFunnel((f) => f.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }
  function updateOption(sIdx: number, oIdx: number, patch: Partial<Stage["options"][number]>) {
    setFunnel((f) =>
      f.map((s, i) =>
        i === sIdx ? { ...s, options: s.options.map((o, j) => (j === oIdx ? { ...o, ...patch } : o)) } : s
      )
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-4xl">Add an industry</h1>
      <p className="text-sm text-muted-foreground mt-2">Saved to your browser as <code className="text-foreground">community</code>. Appears immediately in the grid.</p>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <Field label="Emoji"><input value={emoji} onChange={(e) => setEmoji(e.target.value)} className={inputCls}/></Field>
          <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Hospitality"/></Field>
        </div>
        <Field label="Companies (comma-separated)">
          <input value={companies} onChange={(e) => setCompanies(e.target.value)} className={inputCls} placeholder="Marriott, Hilton, Hyatt"/>
        </Field>
      </div>

      <div className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Funnel</h2>
          <button onClick={() => setFunnel((f) => [...f, blankStage()])} className="text-xs px-3 h-8 rounded-full border border-border hover:bg-accent inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5"/> Stage
          </button>
        </div>

        {funnel.map((s, sIdx) => (
          <div key={sIdx} className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <input
                value={s.stage}
                onChange={(e) => updateStage(sIdx, { stage: e.target.value })}
                placeholder="Stage name (e.g. Discovery)"
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm font-medium outline-none focus:border-primary"
              />
              {funnel.length > 1 && (
                <button onClick={() => setFunnel((f) => f.filter((_, i) => i !== sIdx))} className="w-9 h-9 grid place-items-center rounded-lg hover:bg-accent">
                  <Trash2 className="w-4 h-4"/>
                </button>
              )}
            </div>

            {s.options.map((opt, oIdx) => (
              <div key={opt.id} className="rounded-xl border border-border p-3 space-y-2 bg-background">
                <div className="grid grid-cols-2 gap-2">
                  <input value={opt.pattern} onChange={(e) => updateOption(sIdx, oIdx, { pattern: e.target.value })} placeholder="Pattern" className={inputCls}/>
                  <input value={opt.company} onChange={(e) => updateOption(sIdx, oIdx, { company: e.target.value })} placeholder="Company" className={inputCls}/>
                </div>
                <input value={opt.tradeoff} onChange={(e) => updateOption(sIdx, oIdx, { tradeoff: e.target.value })} placeholder="Tradeoff" className={inputCls}/>
                <div className="grid grid-cols-[1fr_repeat(3,80px)] gap-2 items-center">
                  <select value={opt.screen} onChange={(e) => updateOption(sIdx, oIdx, { screen: e.target.value })} className={inputCls}>
                    {screenChoices.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {(["ex","em","si"] as const).map((k) => (
                    <label key={k} className="text-xs flex items-center gap-1">
                      {k}
                      <input
                        type="number" min={-2} max={2}
                        value={opt.traits[k]}
                        onChange={(e) => updateOption(sIdx, oIdx, { traits: { ...opt.traits, [k]: Number(e.target.value) } })}
                        className="w-12 h-8 rounded border border-border bg-background text-center"
                      />
                    </label>
                  ))}
                </div>
                {s.options.length > 1 && (
                  <button onClick={() => updateStage(sIdx, { options: s.options.filter((_, j) => j !== oIdx) })} className="text-xs text-muted-foreground hover:text-foreground">Remove option</button>
                )}
              </div>
            ))}

            <button onClick={() => updateStage(sIdx, { options: [...s.options, blankOption()] })} className="text-xs px-3 h-8 rounded-full border border-border hover:bg-accent inline-flex items-center gap-1">
              <Plus className="w-3.5 h-3.5"/> Option
            </button>
          </div>
        ))}
      </div>

      <button onClick={submit} className="mt-8 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">
        Save industry
      </button>
    </div>
  );
}

const inputCls = "w-full h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}