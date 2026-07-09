import { cn } from "@/lib/utils";

const variants = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
  success: "bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30",
  warning: "bg-[var(--accent-amber)]/15 text-[var(--accent-amber)] border border-[var(--accent-amber)]/30",
  danger: "bg-[var(--risk-critical)]/15 text-[var(--risk-critical)] border border-[var(--risk-critical)]/30",
  info: "bg-[var(--accent-teal)]/15 text-[var(--accent-teal)] border border-[var(--accent-teal)]/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function RiskBadge({ score }: { score: number }) {
  const variant = score >= 70 ? "danger" : score >= 40 ? "warning" : "success";
  const label = score >= 70 ? "Alto risco" : score >= 40 ? "Médio risco" : "Baixo risco";
  return (
    <Badge variant={variant}>
      {label} · {score}
    </Badge>
  );
}
