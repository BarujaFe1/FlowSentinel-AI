import { cn } from "@/lib/utils";

export function FailureHeatmap({
  values,
  steps,
}: {
  values: number[];
  steps: string[];
}) {
  const max = Math.max(...values, 0.01);

  return (
    <div className="space-y-2">
      {values.map((value, i) => {
        const intensity = value / max;
        const color =
          intensity > 0.7
            ? "bg-[var(--risk-critical)]"
            : intensity > 0.4
              ? "bg-[var(--risk-high)]"
              : intensity > 0.2
                ? "bg-[var(--risk-medium)]"
                : "bg-[var(--success)]";
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="w-32 truncate text-xs text-[var(--text-muted)]" title={steps[i]}>
              {steps[i] ?? `Step ${i + 1}`}
            </span>
            <div className="flex-1 h-6 overflow-hidden rounded bg-[var(--bg-elevated)]">
              <div
                className={cn("h-full rounded transition-all", color)}
                style={{ width: `${intensity * 100}%`, opacity: 0.4 + intensity * 0.6 }}
              />
            </div>
            <span className="w-14 text-right text-xs text-[var(--text-secondary)]">
              {(value * 100).toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
