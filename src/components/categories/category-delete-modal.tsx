import type { Category } from "@/lib/types/category";
import { Modal } from "@/components/ui/modal";

interface CategoryDeleteModalProps {
  deleting: Category | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CategoryDeleteModal({
  deleting,
  isPending,
  onCancel,
  onConfirm,
}: CategoryDeleteModalProps) {
  return (
    <Modal
      open={deleting !== null}
      onClose={onCancel}
      title="Eliminar categoría"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink-soft">
          ¿Seguro que deseas eliminar{" "}
          <span className="font-semibold text-ink">«{deleting?.name}»</span>?
          {deleting?.isSystem
            ? " Solo se ocultará para ti; los demás usuarios seguirán viendo la categoría del sistema."
            : " Esta acción no se puede deshacer."}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn-ghost" disabled={isPending} onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-danger"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
