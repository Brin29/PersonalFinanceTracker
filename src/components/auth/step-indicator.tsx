const STEP_LABELS = ["Correo", "Código", "Datos"] as const;

export function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progreso del registro">
      {STEP_LABELS.map((label, index) => {
        const position = index + 1;
        const isCurrent = position === step;
        const isDone = position < step;
        return (
          <li key={label} className="flex items-center gap-2">
            {index > 0 ? <span className="h-px w-4 bg-line sm:w-6" /> : null}
            <span
              className="flex items-center gap-1.5 text-xs font-medium"
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${isCurrent ? "bg-leaf-600 text-white" : isDone ? "bg-leaf-50 text-leaf-600" : "bg-line/60 text-ink-soft"}`}
              >
                {isDone ? "✓" : position}
              </span>
              <span
                className={`hidden sm:inline ${isCurrent ? "text-ink" : "text-ink-soft"}`}
              >
                {label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}