import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 290, height: 600 }}>
      <div className="absolute inset-0 rounded-[44px] bg-foreground/5 border border-border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]" />
      <div className="absolute inset-2 rounded-[38px] bg-card border border-border overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-foreground/80 rounded-b-2xl z-10" />
        <div className="absolute inset-0 pt-6">{children}</div>
      </div>
    </div>
  );
}