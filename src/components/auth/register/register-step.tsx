import { Field } from "@/components/ui/field";
import { RegisterStepValues } from "@/lib/types/auth";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

interface RegisterStepProps {
  form: UseFormReturn<RegisterStepValues>;
  isBusy: boolean;
  onSubmit: SubmitHandler<RegisterStepValues>;
  reset: () => void;
}

export function RegisterStep({
  form,
  isBusy,
  onSubmit,
  reset,
}: RegisterStepProps) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Completa tus datos
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Casi listo. Crea tu acceso para empezar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="firstName"
          label="Nombre"
          type="text"
          autoComplete="given-name"
          placeholder="Ana"
          error={form.formState.errors.firstName?.message}
          {...form.register("firstName", {
            required: "Ingresa tu nombre.",
          })}
        />
        <Field
          id="lastName"
          label="Apellido"
          type="text"
          autoComplete="family-name"
          placeholder="López"
          error={form.formState.errors.lastName?.message}
          {...form.register("lastName", {
            required: "Ingresa tu apellido.",
          })}
        />
      </div>

      <Field
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 6 caracteres"
        error={form.formState.errors.password?.message}
        {...form.register("password", {
          required: "Crea una contraseña.",
          minLength: {
            value: 6,
            message: "La contraseña debe tener al menos 6 caracteres.",
          },
        })}
      />

      <Field
        id="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Repite tu contraseña"
        error={form.formState.errors.confirmPassword?.message}
        {...form.register("confirmPassword", {
          required: "Confirma tu contraseña.",
          validate: (value) =>
            value === form.getValues("password") ||
            "Las contraseñas no coinciden.",
        })}
      />

      <div className="mt-2 flex flex-col gap-2">
        <button type="submit" className="btn-primary" disabled={isBusy}>
          {isBusy ? "Creando cuenta…" : "Crear cuenta"}
        </button>
        <button type="button" className="btn-ghost" onClick={reset}>
          Volver
        </button>
      </div>
    </form>
  );
}
