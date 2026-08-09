const STEP_LABELS = ["Correo", "Código", "Datos"] as const;

interface StepItemProps {
  label: string;
  position: number;
  step: number;
  showSeparator: boolean;
}

function StepItem({ label, position, step, showSeparator }: StepItemProps) {
  const isCurrent = position === step;
  const isDone = position < step;

  return (
    <li className="flex items-center gap-2">
      {showSeparator ? <span className="h-px w-4 bg-line sm:w-6" /> : null}
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
}

export function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progreso del registro">
      {STEP_LABELS.map((label, index) => (
        <StepItem
          key={label}
          label={label}
          position={index + 1}
          step={step}
          showSeparator={index > 0}
        />
      ))}
    </ol>
  );
}
