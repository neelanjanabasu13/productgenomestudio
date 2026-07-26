export type PatternEntry = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  useCases: string[];
  pros: string[];
  cons: string[];
  relatedStages: string[];
};

export const patterns: PatternEntry[] = [
  {
    slug: "modal-windows",
    name: "Modal Windows",
    tagline: "Focused overlays for a single decision or task.",
    description:
      "A modal window is an overlay that traps focus on one task, dimming the page behind it. Modals are used when a decision must be made before continuing, or when a short flow benefits from context isolation.",
    useCases: [
      "Confirming destructive actions like delete or cancel",
      "Short forms such as invite, share, or quick edit",
      "Contextual detail for a list row without a full page navigation",
    ],
    pros: [
      "Keeps users in place, preserving context on the underlying page",
      "Forces attention on a single, focused decision",
      "Cheap to open and dismiss compared to a full route change",
    ],
    cons: [
      "Poor for long flows; scrolling inside a modal feels cramped",
      "Hard to deep-link and share; state lives outside the URL",
      "Accessibility is easy to get wrong (focus trap, ESC, ARIA)",
    ],
    relatedStages: ["Onboarding", "Core loop", "Monetization"],
  },
  {
    slug: "pagination",
    name: "Pagination",
    tagline: "Split long result sets into numbered pages.",
    description:
      "Pagination divides a large collection into discrete pages the user can jump between. It is the classic alternative to infinite scroll and load-more, and it works well when users need to find, bookmark, or share a specific position in a list.",
    useCases: [
      "Search results and directory listings",
      "Admin tables where users scan and act on rows",
      "Content archives that need stable, shareable URLs",
    ],
    pros: [
      "Predictable performance, each page loads a bounded set",
      "URLs encode position, making results shareable and bookmarkable",
      "Easier keyboard and screen reader navigation than infinite scroll",
    ],
    cons: [
      "Extra click cost between pages compared to infinite scroll",
      "Total-count queries can be expensive on very large datasets",
      "Feels dated in feed-style consumer products",
    ],
    relatedStages: ["Acquisition", "Core loop"],
  },
  {
    slug: "infinite-scroll",
    name: "Infinite Scroll",
    tagline: "Continuously append items as the user scrolls.",
    description:
      "Infinite scroll loads the next chunk of content as the user approaches the end of the list. It is designed for exploratory, feed-style consumption where users do not need to remember or return to a specific position.",
    useCases: [
      "Social feeds and video reels",
      "Discovery grids like photos, products, or reels",
      "Activity streams where recency matters more than position",
    ],
    pros: [
      "Removes friction from continuous browsing",
      "Feels native on touch devices",
      "Encourages longer sessions on discovery surfaces",
    ],
    cons: [
      "Hard to return to a specific item after leaving",
      "Footers and later content become inaccessible",
      "Screen reader and keyboard experiences degrade quickly",
    ],
    relatedStages: ["Core loop", "Retention"],
  },
  {
    slug: "search",
    name: "Search",
    tagline: "A direct query surface for finding a known item.",
    description:
      "Search lets users skip navigation by typing what they want. Good search combines an input, live suggestions, clear result ranking, and filters that refine without discarding the query.",
    useCases: [
      "Product catalogs and marketplaces",
      "Documentation and help centers",
      "Any app where the item space is larger than the navigation can expose",
    ],
    pros: [
      "Fastest path when the user knows what they want",
      "Reveals demand signals through query logs",
      "Scales with catalog size where menus do not",
    ],
    cons: [
      "Empty and zero-result states need real care",
      "Ranking quality is a continuous investment",
      "Users often forget search exists without a persistent input",
    ],
    relatedStages: ["Acquisition", "Core loop"],
  },
  {
    slug: "onboarding-tours",
    name: "Onboarding Tours",
    tagline: "Guided first-run walkthroughs of the interface.",
    description:
      "An onboarding tour points at UI elements in sequence to teach a first-time user how the product works. Tours are most effective when tied to a first meaningful action rather than every possible feature.",
    useCases: [
      "Complex tools with non-obvious primary actions",
      "Feature launches inside an already-familiar product",
      "Role-specific setup, like admin versus member",
    ],
    pros: [
      "Reduces the cold-start problem for new users",
      "Sets expectations about where key surfaces live",
      "Can be personalized by role or goal",
    ],
    cons: [
      "Users skip tours far more often than product teams assume",
      "Retention rarely improves without a real first-value moment",
      "Tours drift out of sync as the UI evolves",
    ],
    relatedStages: ["Onboarding"],
  },
  {
    slug: "empty-states",
    name: "Empty States",
    tagline: "The first thing a user sees before any data exists.",
    description:
      "An empty state is what the interface shows when a list, dashboard, or view has no content yet. Good empty states teach the primary action and preview the payoff of using the feature.",
    useCases: [
      "New workspaces, projects, or inboxes",
      "Filtered views that happen to return no matches",
      "Features gated behind a first setup step",
    ],
    pros: [
      "Turns dead screens into a strong call to action",
      "Sets expectations for what the feature will look like once used",
      "Cheap conversion win compared to redesigning the feature",
    ],
    cons: [
      "Easy to make cute and useless; illustrations without a next step",
      "Different for zero-data versus zero-results; conflating them confuses users",
      "Needs to be maintained as the feature grows",
    ],
    relatedStages: ["Onboarding", "Core loop"],
  },
];

export function getPattern(slug: string) {
  return patterns.find((p) => p.slug === slug);
}