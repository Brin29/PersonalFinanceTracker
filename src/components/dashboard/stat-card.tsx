import { type ComponentType } from "react";

interface StatCardProps {
  label: string;
  amount: string;
  tone: string;
  icon: ComponentType<{ size?: number }>;
  isLoading: boolean;
  periodLabel: string;
}

export function StatCard({
  label,
  amount,
  tone,
  icon: Icon,
  isLoading,
  periodLabel,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </p>
      {isLoading ? (
        <div
          className="mt-2.5 h-8 w-24 animate-pulse rounded bg-ink/5 dark:bg-white/10"
          aria-hidden="true"
        />
      ) : (
        <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
          {amount}
        </p>
      )}
      <p
        className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${tone}`}
      >
        <Icon size={14} />
        {isLoading ? "cargando…" : periodLabel}
      </p>
    </div>
  );
}
