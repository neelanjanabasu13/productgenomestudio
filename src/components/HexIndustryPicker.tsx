import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Industry } from "@/data/genome.types";
import { SketchIcon } from "./SketchIcons";

const PAGE_SIZE = 3;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function HexIndustryPicker({ industries }: { industries: Industry[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(industries.length / PAGE_SIZE));

  // Clamp page when filter shrinks list
  useEffect(() => {
    if (page > pages - 1) setPage(0);
  }, [pages, page]);

  const slice = useMemo(
    () => industries.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [industries, page]
  );

  const prev = () => setPage((p) => (p - 1 + pages) % pages);
  const next = () => setPage((p) => (p + 1) % pages);

  // Arrow-key nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Swipe
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  }

  return (
    <section
      aria-label="Industry picker"
      className="select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Pager header */}
      <div className="flex items-center justify-between max-w-3xl mx-auto px-2 mb-10">
        <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Industries
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={prev}
            aria-label="Previous page"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs tracking-[0.18em] text-foreground/80 tabular-nums">
            {pad2(page + 1)} <span className="text-muted-foreground/60">/</span> {pad2(pages)}
          </span>
          <button
            onClick={next}
            aria-label="Next page"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Honeycomb */}
      <div
        key={page}
        className="hex-grid mx-auto"
        style={{ animation: "hex-page-in 600ms ease-out both" }}
      >
        {slice.map((ind, i) => {
          const globalIdx = page * PAGE_SIZE + i + 1;
          return (
            <HexTile
              key={ind.id}
              industry={ind}
              index={globalIdx}
              position={i}
            />
          );
        })}
      </div>
    </section>
  );
}

function HexTile({
  industry,
  index,
  position,
}: {
  industry: Industry;
  index: number;
  position: number;
}) {
  // Stagger float speed/delay per tile
  const delay = [0, 1.6, 3.1][position] ?? 0;
  const duration = [9, 11, 10][position] ?? 10;

  return (
    <Link
      to="/studio/$industryId"
      params={{ industryId: industry.id }}
      className={`hex-tile hex-pos-${position} group`}
      style={
        {
          ["--float-delay" as string]: `${delay}s`,
          ["--float-duration" as string]: `${duration}s`,
        } as React.CSSProperties
      }
    >
      <span className="hex-border" aria-hidden />
      <span className="hex-fill" aria-hidden />
      <div className="hex-inner">
        <span className="hex-index font-mono text-[11px] tracking-[0.22em]">
          {String(index).padStart(2, "0")}
        </span>
        <div className="hex-content">
          <span className="hex-name font-display text-[19px] leading-tight text-center px-4">
            {industry.name}
          </span>
          <span className="hex-icon">
            <SketchIcon id={industry.id} />
          </span>
        </div>
      </div>
    </Link>
  );
}