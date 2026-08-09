export function CategoryListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-xl border border-line bg-surface"
        />
      ))}
    </div>
  );
}
