import { createFileRoute, Link } from "@tanstack/react-router";
import { patterns } from "@/lib/patterns";

const CANONICAL = "https://productgenomestudio.lovable.app/patterns";

export const Route = createFileRoute("/patterns/")({
  head: () => ({
    meta: [
      { title: "UX Pattern Library - Product Genome Studio" },
      {
        name: "description",
        content:
          "A library of common UX patterns - modal windows, pagination, infinite scroll, search, onboarding tours, and empty states - with use cases, pros, and cons.",
      },
      { property: "og:title", content: "UX Pattern Library - Product Genome Studio" },
      {
        property: "og:description",
        content:
          "Common UI patterns explained with use cases, pros, and cons. Explore each pattern and try it live in the Studio simulator.",
      },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "UX Pattern Library",
          url: CANONICAL,
          hasPart: patterns.map((p) => ({
            "@type": "TechArticle",
            name: p.name,
            url: `${CANONICAL}/${p.slug}`,
            description: p.tagline,
          })),
        }),
      },
    ],
  }),
  component: PatternsIndex,
});

function PatternsIndex() {
  return (
    <div className="max-w-4xl mx-auto px-5 pt-16 pb-20">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Pattern Library
      </div>
      <h1 className="font-display text-4xl md:text-6xl leading-[0.95]">
        Common <em className="text-primary not-italic">UX patterns</em>, explained.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        Reference guides for the UI patterns you compose in the Studio. Each entry covers what
        the pattern is, when to use it, and the tradeoffs it brings.
      </p>

      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {patterns.map((p) => (
          <li key={p.slug}>
            <Link
              to="/patterns/$slug"
              params={{ slug: p.slug }}
              className="block h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              <h2 className="font-display text-2xl">{p.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
              <span className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-primary">
                Read pattern →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-16 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Try patterns in the Studio</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every pattern here shows up in the Studio simulator. Pick an industry and compose a
          product genome using these building blocks.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-sm px-4 h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Open the Studio
        </Link>
      </div>
    </div>
  );
}