import { Field } from "@/components/ui/field";
import { CodeStepValues } from "@/lib/types/auth";
import { SubmitHandler, UseFormReturn } from "react-hook-form";


interface CodeStepProps {
  form: UseFormReturn<CodeStepValues>;
  isBusy: boolean;
  onSubmit: SubmitHandler<CodeStepValues>;
  email: string;
  reset: () => void;
};

export function CodeStep({
  form,
  isBusy,
  onSubmit,
  email,
  reset,
}: CodeStepProps) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Verifica tu correo
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Enviamos un código de 6 dígitos a{" "}
          <span className="font-medium text-ink">{email}</span>.
        </p>
      </div>

      <Field
        id="code"
        label="Código de verificación"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="000000"
        error={form.formState.errors.code?.message}
        {...form.register("code", {
          required: "Ingresa el código.",
          pattern: {
            value: /^\d{6}$/,
            message: "El código tiene 6 dígitos.",
          },
        })}
      />

      <div className="mt-2 flex flex-col gap-2">
        <button type="submit" className="btn-primary" disabled={isBusy}>
          {isBusy ? "Verificando…" : "Verificar código"}
        </button>

        <button type="button" className="btn-ghost" onClick={reset}>
          Cambiar correo
        </button>
      </div>
    </form>
  );
}
