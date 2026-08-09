import { Field } from "@/components/ui/field";
import { EmailStepValues } from "@/lib/types/auth";
import { SubmitHandler, UseFormReturn } from "react-hook-form";


interface EmailStepProps {
  form: UseFormReturn<EmailStepValues>;
  isBusy: boolean;
  onSubmit: SubmitHandler<EmailStepValues>;
};

export function EmailStep({ form, isBusy, onSubmit }: EmailStepProps) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Ingresa tu correo y te enviaremos un código de verificación.
        </p>
      </div>

      <Field
        id="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="tu@correo.com"
        error={form.formState.errors.email?.message}
        {...form.register("email", {
          required: "Ingresa tu correo.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Ingresa un correo válido.",
          },
        })}
      />

      <button type="submit" className="btn-primary mt-2" disabled={isBusy}>
        {isBusy ? "Enviando…" : "Enviar código"}
      </button>
    </form>
  );
}
