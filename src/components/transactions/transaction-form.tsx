"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { Field } from "@/components/ui/field";
import { useCreateTransaction } from "@/hooks/transactions/mutations/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/transactions/mutations/useUpdateTransaction";
import { useParamsOptions } from "@/hooks/params/useParamsOptions";
import { getMutationErrorMessage } from "@/lib/api/error-message";
import { getMutationSuccessMessage } from "@/lib/api/success-message";
import { toDateInputValue } from "@/lib/utils/format";
import type { ParamOption } from "@/lib/types/params";
import type {
  Transaction,
  TransactionCategory,
  TransactionInput,
  TransactionType,
} from "@/lib/types/transaction";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

interface TransactionFormValues {
  title: string;
  amount: string;
  type: TransactionType;
  category: TransactionCategory | "";
  date: string;
}

const AMOUNT_PATTERN = /^\d+([.,]\d{1,2})?$/;

interface TypeSelectorProps {
  types: ParamOption[];
  selectedType: TransactionType;
  onChange: (type: TransactionType) => void;
}

function TypeSelector({ types, selectedType, onChange }: TypeSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="field-label">Tipo</span>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo">
        {types.map((type) => {
          const active = selectedType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(type.value as TransactionType)}
              className={`h-11 rounded-lg border text-sm font-semibold transition-colors ${
                active
                  ? type.value === "income"
                    ? "border-leaf-600 bg-leaf-50 text-leaf-700"
                    : "border-gold-500 bg-gold-500/10 text-ink"
                  : "border-line bg-surface text-ink-soft hover:bg-ink/5"
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TransactionForm({
  open,
  onClose,
  transaction,
}: TransactionFormProps) {
  const create = useCreateTransaction();
  const update = useUpdateTransaction();
  const { types, categories } = useParamsOptions();
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) return;

    reset({
      title: transaction?.title ?? "",
      amount: transaction ? String(transaction.amount) : "",
      type: transaction?.type ?? "expense",
      category: transaction?.category ?? "",
      date: transaction
        ? toDateInputValue(transaction.date)
        : toDateInputValue(new Date()),
    });
  }, [open, transaction, reset]);

  const handleClose = () => {
    setFeedback(null);
    onClose();
  };

  const selectedType = useWatch({
    control,
    name: "type",
    defaultValue: "expense" as TransactionType,
  });

  const categoryOptions = useMemo(
    () =>
      categories.filter(
        (category) => category.type === (selectedType as TransactionType),
      ),
    [categories, selectedType],
  );

  const handleTypeChange = (type: TransactionType) => {
    setValue("type", type, {
      shouldValidate: true,
      shouldDirty: true,
    });
    const current = getValues("category");
    if (
      current &&
      !categories.some((category) => category.key === current && category.type === type)
    ) {
      setValue("category", "", { shouldValidate: true });
    }
  };

  const isBusy = isSubmitting || create.isPending || update.isPending;

  const onSubmit: SubmitHandler<TransactionFormValues> = async (values) => {
    const payload: TransactionInput = {
      title: values.title.trim(),
      amount: parseFloat(values.amount.replace(",", ".")),
      type: values.type,
      category: values.category as TransactionCategory,
      date: values.date ? new Date(values.date).toISOString() : undefined,
    };

    try {
      const result = transaction
        ? await update.mutateAsync({ id: transaction._id, data: payload })
        : await create.mutateAsync(payload);
      setFeedback({
        tone: "success",
        title: transaction ? "Cambios guardados" : "Transacción creada",
        message: getMutationSuccessMessage(result.code),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo guardar",
        message: getMutationErrorMessage(error.code),
      });
    }
  };

  const handleAcceptFeedback = () => {
    const action = feedback?.onAccept;
    setFeedback(null);
    if (feedback?.tone === "success") handleClose();
    action?.();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={transaction ? "Editar transacción" : "Nueva transacción"}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <TypeSelector
          types={types}
          selectedType={selectedType}
          onChange={handleTypeChange}
        />

        <Field
          id="title"
          label="Título"
          placeholder="Ej. Sueldo, Supermercado…"
          error={errors.title?.message}
          {...register("title", {
            required: "Ingresa un título.",
            maxLength: {
              value: 120,
              message: "El título no puede superar 120 caracteres.",
            },
          })}
        />

        <Field
          id="amount"
          label="Monto"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register("amount", {
            required: "Ingresa el monto.",
            pattern: {
              value: AMOUNT_PATTERN,
              message: "Usa un formato de monto válido (ej. 1500.50).",
            },
            validate: (value) =>
              parseFloat(value.replace(",", ".")) > 0 ||
              "El monto debe ser mayor a 0.",
          })}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="field-label">
            Categoría
          </label>
          <select
            id="category"
            className={`field-input${
              errors.category ? " border-red-300 focus:border-red-400 focus:ring-red-400/20" : ""
            }`}
            aria-invalid={errors.category ? "true" : undefined}
            {...register("category", {
              required: "Selecciona una categoría.",
            })}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categoryOptions.map((category) => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="field-error" role="alert">
              {errors.category.message}
            </p>
          ) : null}
        </div>

        <Field
          id="date"
          label="Fecha"
          type="date"
          error={errors.date?.message}
          {...register("date", {
            validate: (value) =>
              !value ||
              !Number.isNaN(new Date(value).getTime()) ||
              "Ingresa una fecha válida.",
          })}
        />

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={handleClose}
            disabled={isBusy}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isBusy}>
            {isBusy
              ? "Guardando…"
              : transaction
                ? "Guardar cambios"
                : "Crear transacción"}
          </button>
        </div>
      </form>

      {feedback ? (
        <InfoModal
          open={true}
          feedback={feedback}
          onAccept={handleAcceptFeedback}
        />
      ) : null}
    </Modal>
  );
}
