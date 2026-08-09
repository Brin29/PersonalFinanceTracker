interface CategoryGroupEmptyProps {
  title: string;
}

export function CategoryGroupEmpty({ title }: CategoryGroupEmptyProps) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-line px-6 py-8 text-center"
    >
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-ink-soft">
          Aún no hay categorías de {title.toLowerCase()}.
        </p>
      </div>
    </section>
  );
}
