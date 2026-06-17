// Deterministic sample content per industry for the Studio phone preview.
// All strings are original; nothing references real brand IPs.

export interface IndustrySamples {
  titles: string[];
  subtitles: string[];
  prices: string[];
  ratings: string[];
  chips: string[];
  hero: string;
  heroSub: string;
  ctas: Record<string, string>;
  chat: { me: boolean; text: string }[];
  metricLabel: string;
  metricValue: string;
  names: string[];
  trust: string[];
}

const DEFAULT: IndustrySamples = {
  titles: ["Item One", "Item Two", "Item Three", "Item Four"],
  subtitles: ["Detail line", "Detail line", "Detail line", "Detail line"],
  prices: ["$24", "$48", "$72", "$96"],
  ratings: ["4.8", "4.7", "4.9", "4.6"],
  chips: ["All", "Popular", "New", "Near"],
  hero: "Find your match",
  heroSub: "Search across thousands of options.",
  ctas: {},
  chat: [
    { me: false, text: "Hey - got a sec?" },
    { me: true, text: "Sure, what's up?" },
    { me: false, text: "Quick question on the brief." },
    { me: true, text: "Send it over." },
  ],
  metricLabel: "Balance",
  metricValue: "$12,480",
  names: ["Ana", "Marco", "Priya", "Sam"],
  trust: ["Verified", "Insured", "24/7", "Refund"],
};

const SAMPLES: Record<string, Partial<IndustrySamples>> = {
  travel: {
    titles: ["Lisbon Loft", "Kyoto Ryokan", "Oaxaca Casita", "Reykjavik Cabin"],
    subtitles: ["Alfama · 2 guests", "Gion · 3 nights", "Centro · pool", "Coast · aurora"],
    prices: ["$148/nt", "$212/nt", "$96/nt", "$184/nt"],
    ratings: ["4.92 · 312", "4.88 · 204", "4.97 · 411", "4.81 · 128"],
    chips: ["Anywhere", "This week", "Stays", "Under $150"],
    hero: "Where next?",
    heroSub: "Stays, flights, and weekends curated for you.",
    ctas: { Discover: "Search stays", Match: "See homes", Confirm: "Reserve", Loyalty: "View trips" },
    metricLabel: "Trips planned", metricValue: "3 upcoming",
    trust: ["Verified host", "Free cancel", "24/7 help", "Refund"],
  },
  saas_pm: {
    titles: ["Migrate auth flow", "Launch v2.1 docs", "Onboarding redesign", "Q3 roadmap"],
    subtitles: ["#platform · due Fri", "#docs · 3 subtasks", "#growth · in review", "@team"],
    prices: ["12 tasks", "5 open", "Due 8/14", "82% done"],
    ratings: ["P1", "P2", "P0", "P3"],
    chips: ["My work", "Sprint", "Blocked", "Done"],
    hero: "Plan the week",
    heroSub: "Group work by project, sprint, or owner.",
    ctas: { Discover: "New project", Setup: "Create board", Activate: "Start sprint" },
    metricLabel: "Velocity", metricValue: "42 pts this sprint",
    trust: ["SSO", "SOC 2", "Audit log", "SLA"],
  },
  social: {
    titles: ["@nora.k", "@dev_juno", "@small.studio", "@field.notes"],
    subtitles: ["Posted 2h", "Live now", "Reel · 38s", "Carousel · 6"],
    prices: ["12.4k", "881", "3.2k", "212"],
    ratings: ["4.1k likes", "612 likes", "18k likes", "902 likes"],
    chips: ["Following", "For you", "Reels", "Nearby"],
    hero: "What's happening",
    heroSub: "A feed shaped by who you actually care about.",
    ctas: { Discover: "Explore", Create: "Post", Engage: "Follow" },
    chat: [
      { me: false, text: "saw your reel - fire" },
      { me: true, text: "thx! shot it on the rooftop" },
      { me: false, text: "lmk if you do another" },
      { me: true, text: "next sunday probably" },
    ],
    metricLabel: "Followers", metricValue: "12,418",
  },
  food: {
    titles: ["Sunda Thai", "Roman & Co.", "Hanok BBQ", "Pier 9 Oysters"],
    subtitles: ["25 min · $$ · Thai", "18 min · $$ · Italian", "32 min · $$$ · Korean", "12 min · $$ · Seafood"],
    prices: ["$18 min", "$22 min", "$28 min", "$14 min"],
    ratings: ["4.7 · 1.2k", "4.6 · 880", "4.9 · 2.1k", "4.5 · 410"],
    chips: ["Near me", "Under 30m", "$$", "Top rated"],
    hero: "Hungry?",
    heroSub: "Order from spots open right now.",
    ctas: { Discover: "Browse", Confirm: "Place order", Activate: "Start order" },
    metricLabel: "Reorder", metricValue: "Sunda · last Fri",
    trust: ["Live tracking", "On-time", "Hot bag", "Refund"],
  },
  ecommerce: {
    titles: ["Linen Camp Shirt", "Wide-Leg Trouser", "Suede Loafer", "Ribbed Tank"],
    subtitles: ["Stone · S-XL", "Ink · 26-34", "Tan · 8-12", "Cream · XS-L"],
    prices: ["$48", "$92", "$148", "$28"],
    ratings: ["4.8 · 612", "4.7 · 318", "4.9 · 1.1k", "4.6 · 204"],
    chips: ["New", "Best sellers", "Under $50", "Linen"],
    hero: "Summer, simply.",
    heroSub: "Clothing built for warm-weather days.",
    ctas: { Confirm: "Place order", Activate: "Add to bag", Loyalty: "Members" },
    metricLabel: "Bag total", metricValue: "$216 · 4 items",
    trust: ["Free returns", "Ships in 24h", "Lifetime repair", "Carbon neutral"],
  },
  fintech: {
    titles: ["Rent - Aug", "Grocery", "Salary", "Coffee shop"],
    subtitles: ["Recurring", "Whole Foods", "Acme Inc · Net 0", "Blue Bottle"],
    prices: ["-$2,140", "-$84.21", "+$5,420", "-$5.50"],
    ratings: ["Cleared", "Pending", "Cleared", "Cleared"],
    chips: ["All", "Income", "Spend", "Recurring"],
    hero: "Your money, today",
    heroSub: "Move, track and grow it from one place.",
    ctas: { Discover: "Get started", Setup: "Open account", Activate: "Send money" },
    metricLabel: "Available", metricValue: "$12,480.22",
    names: ["Ana Reyes", "Marco T.", "Priya N.", "Sam O."],
    trust: ["FDIC", "256-bit", "Face ID", "Refund"],
  },
  streaming: {
    titles: ["The Long Quiet", "After the Fall", "Northstar", "Lowlight"],
    subtitles: ["Drama · S2", "Documentary · 2024", "Thriller · S1", "Stand-up · 58m"],
    prices: ["8 eps", "92 min", "10 eps", "58 min"],
    ratings: ["8.6", "7.9", "9.1", "8.2"],
    chips: ["Continue", "New", "Top 10", "My list"],
    hero: "Tonight's pick",
    heroSub: "Picking up where you left off.",
    ctas: { Discover: "Browse", Activate: "Play", Loyalty: "My list" },
    metricLabel: "Watching", metricValue: "Northstar · E4",
  },
  mobility: {
    titles: ["Standard", "Comfort", "XL", "Premier"],
    subtitles: ["3 min away", "5 min away", "8 min away", "4 min away"],
    prices: ["$12.40", "$16.20", "$22.80", "$28.10"],
    ratings: ["4 seats", "4 seats · quiet", "6 seats", "4 seats · luxe"],
    chips: ["Now", "Schedule", "Share", "Pool"],
    hero: "Where to?",
    heroSub: "Ride, share or schedule.",
    ctas: { Confirm: "Request ride", Activate: "Confirm pickup", Discover: "Where to?" },
    metricLabel: "Arriving", metricValue: "3 min · plate 7AC",
    trust: ["ID verified", "Insured", "Share trip", "24/7"],
  },
  dating: {
    titles: ["Iris, 28", "Theo, 31", "Maren, 26", "Ren, 33"],
    subtitles: ["Architect · 2 mi", "Chef · 1 mi", "Editor · 4 mi", "Musician · 3 mi"],
    prices: ["94% match", "88% match", "91% match", "82% match"],
    ratings: ["6 photos", "verified", "new", "active today"],
    chips: ["Nearby", "Verified", "New", "Active today"],
    hero: "Say hi.",
    heroSub: "People who actually want to meet.",
    ctas: { Match: "Like", Engage: "Send message", Discover: "See profiles" },
    chat: [
      { me: false, text: "loved your bookshelf pic" },
      { me: true, text: "ha - half of it I haven't read" },
      { me: false, text: "coffee saturday?" },
      { me: true, text: "yes - abraco at 10?" },
    ],
    metricLabel: "New likes", metricValue: "12 this week",
  },
  edtech: {
    titles: ["Present perfect", "Past simple drills", "Travel vocab", "Pronunciation"],
    subtitles: ["Lesson 12 · 5 min", "Lesson 8 · 7 min", "Lesson 15 · 4 min", "Lesson 3 · 6 min"],
    prices: ["+20 XP", "+15 XP", "+25 XP", "+10 XP"],
    ratings: ["Day 14", "Day 14", "Day 14", "Day 14"],
    chips: ["Today", "Weak spots", "Grammar", "Speaking"],
    hero: "5 minutes a day",
    heroSub: "Tiny lessons that stick.",
    ctas: { Discover: "Pick a path", Activate: "Start lesson", Loyalty: "Keep streak" },
    metricLabel: "Streak", metricValue: "14 days · 1,820 XP",
  },
  design: {
    titles: ["Mobile app - kit", "Landing - bold", "Pitch deck - quiet", "Brand starter"],
    subtitles: ["48 components", "6 sections", "12 slides", "logo + tokens"],
    prices: ["Free", "Pro", "Free", "Pro"],
    ratings: ["4.9", "4.7", "4.8", "4.6"],
    chips: ["Templates", "Components", "Tokens", "Plugins"],
    hero: "Start from a template",
    heroSub: "Beautiful files you can edit in seconds.",
    ctas: { Discover: "Browse", Activate: "Use template", Create: "New file" },
    metricLabel: "Open file", metricValue: "Mobile app - kit",
  },
  ai: {
    titles: ["Draft launch brief", "Refactor utils.ts", "Summarize meeting", "Plan Q3 sprint"],
    subtitles: ["used 2h ago", "session · 14 msgs", "12 min audio", "context · roadmap"],
    prices: ["3.2k tok", "812 tok", "1.4k tok", "2.1k tok"],
    ratings: ["GPT-class", "Claude-class", "Open-source", "Reasoning"],
    chips: ["Recent", "Pinned", "Write", "Code"],
    hero: "Ask anything",
    heroSub: "Reason, write, and ship - together.",
    ctas: { Discover: "Try a prompt", Activate: "New chat", Create: "Start project" },
    chat: [
      { me: false, text: "Draft a launch brief for the v2 release." },
      { me: true, text: "Here's a 4-section brief - positioning, audience, beats, FAQ. Want me to tighten it?" },
      { me: false, text: "Tighter, and lead with the upgrade story." },
      { me: true, text: "Done. Pasted the revision above." },
    ],
    metricLabel: "Today", metricValue: "12 chats · 4 projects",
  },
};

export function samplesFor(industryId: string): IndustrySamples {
  return { ...DEFAULT, ...(SAMPLES[industryId] ?? {}) } as IndustrySamples;
}

export function ctaFor(s: IndustrySamples, stage: string): string {
  return s.ctas[stage] ?? "Continue";
}
