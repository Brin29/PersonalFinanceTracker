import { CategoryList } from "@/components/categories/category-list";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Categorías
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Organiza tus ingresos y gastos por categoría. Haz clic en un nombre
          para editarlo.
        </p>
      </div>

      <CategoryList />
    </div>
  );
}
