import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPattern, patterns } from "@/lib/patterns";

const BASE = "https://productgenomestudio.lovable.app/patterns";

export const Route = createFileRoute("/patterns/$slug")({
  loader: ({ params }) => {
    const pattern = getPattern(params.slug);
    if (!pattern) throw notFound();
    return { pattern };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Pattern not found - Product Genome Studio" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { pattern } = loaderData;
    const url = `${BASE}/${params.slug}`;
    const title = `${pattern.name} - UX Pattern - Product Genome Studio`;
    return {
      meta: [
        { title },
        { name: "description", content: pattern.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: pattern.tagline },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: pattern.name,
            description: pattern.tagline,
            url,
            articleBody: pattern.description,
          }),
        },
      ],
    };
  },
  component: PatternPage,
});

function PatternPage() {
  const { pattern } = Route.useLoaderData();
  return (
    <div className="max-w-3xl mx-auto px-5 pt-16 pb-20">
      <Link
        to="/patterns"
        className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
      >
        ← Pattern library
      </Link>
      <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[0.95]">{pattern.name}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{pattern.tagline}</p>

      <p className="mt-8 text-base leading-relaxed">{pattern.description}</p>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Use cases</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
          {pattern.useCases.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl text-primary">Pros</h2>
          <ul className="mt-3 space-y-2 text-sm list-disc pl-5">
            {pattern.pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Cons</h2>
          <ul className="mt-3 space-y-2 text-sm list-disc pl-5">
            {pattern.cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </div>

      {pattern.relatedStages.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl">Where it fits in the funnel</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This pattern most often shows up at these Studio stages:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pattern.relatedStages.map((s) => (
              <span
                key={s}
                className="text-xs uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-border"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Try it in the Studio</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          See how {pattern.name.toLowerCase()} plays out across real industries. Compose a product
          genome and watch it render live.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-sm px-4 h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Open the Studio
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl">More patterns</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {patterns
            .filter((p) => p.slug !== pattern.slug)
            .map((p) => (
              <li key={p.slug}>
                <Link
                  to="/patterns/$slug"
                  params={{ slug: p.slug }}
                  className="block rounded-xl border border-border p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="font-display text-lg">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.tagline}</div>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}