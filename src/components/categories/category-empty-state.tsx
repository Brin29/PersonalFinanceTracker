import TagIcon from "@/components/ui/icons/tagIcon";

export function CategoryEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
        <TagIcon size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">Aún no hay categorías</p>
        <p className="mt-0.5 text-sm text-ink-soft">
          Crea tu primera categoría para organizar mejor tus movimientos.
        </p>
      </div>
    </div>
  );
}
