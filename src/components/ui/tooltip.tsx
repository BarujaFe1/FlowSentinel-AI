"use client";

import { cn } from "@/lib/utils";

export function Tooltip({
  content,
  children,
  className,
}: {
  content: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--bg-ink)] px-2 py-1 text-xs text-[var(--text-primary)] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {content}
      </span>
    </span>
  );
}
