"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useProfile } from "@/hooks/profile/queries/useProfile";
import { useUpdateProfile } from "@/hooks/profile/mutations/useUpdateProfile";
import { useUploadAvatar } from "@/hooks/profile/mutations/useUploadAvatar";
import { useDeleteAccount } from "@/hooks/auth/mutations/useDeleteAccount";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { getMutationErrorMessage } from "@/lib/api/error-message";
import { getMutationSuccessMessage } from "@/lib/api/success-message";
import { PROVIDER_LABELS } from "@/lib/utils/provider";
import CameraIcon from "@/components/ui/icons/cameraIcon";
import TrashIcon from "@/components/ui/icons/trashIcon";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
}

const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

export default function SettingsPage() {
  const router = useRouter();
  const { data: user } = useProfile();
  const update = useUpdateProfile();
  const avatar = useUploadAvatar();
  const removeAccount = useDeleteAccount();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    });
  }, [user, reset]);

  const isProfileBusy = isSubmitting || update.isPending;
  const provider = user?.provider ? PROVIDER_LABELS[user.provider] : undefined;
  const canDelete =
    deleteConfirmation.trim().toLowerCase() ===
    (user?.email ?? "").trim().toLowerCase();

  const handleAcceptFeedback = () => {
    const action = feedback?.onAccept;
    setFeedback(null);
    action?.();
  };

  const handleProfileSubmit: SubmitHandler<ProfileFormValues> = async (
    values,
  ) => {
    try {
      const result = await update.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      });
      setFeedback({
        tone: "success",
        title: "Información actualizada",
        message: getMutationSuccessMessage(result.code),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo actualizar",
        message: getMutationErrorMessage(error.code),
      });
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > AVATAR_MAX_SIZE) {
      setFeedback({
        tone: "error",
        title: "Imagen demasiado grande",
        message: "La imagen no puede superar 5 MB.",
      });
      return;
    }

    try {
      const result = await avatar.mutateAsync(file);
      setFeedback({
        tone: "success",
        title: "Foto actualizada",
        message: getMutationSuccessMessage(result.code),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo subir la imagen",
        message: getMutationErrorMessage(error.code),
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await removeAccount.mutateAsync();
      setDeleteOpen(false);
      setFeedback({
        tone: "success",
        title: "Cuenta eliminada",
        message: getMutationSuccessMessage(result.code),
        onAccept: () => {
          router.replace("/login");
          router.refresh();
        },
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo eliminar la cuenta",
        message: getMutationErrorMessage(error.code),
      });
    }
  };

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Configuración
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Administra tu perfil, tus datos y tu cuenta.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <section
          className="min-w-0 flex-1 rounded-2xl border border-line bg-surface p-5 sm:p-6"
          aria-label="Información personal"
        >
        <h3 className="text-base font-semibold tracking-tight text-ink">
          Información personal
        </h3>
        <p className="mt-0.5 text-sm text-ink-soft">
          Tu foto y tu nombre se muestran en toda la aplicación.
        </p>

        <div className="mt-5 flex items-center gap-4">
          <button
            type="button"
            className="group relative rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatar.isPending}
            aria-label="Cambiar foto de perfil"
            title="Cambiar foto de perfil"
          >
            <UserAvatar user={user} size="2xl" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-0">
              <CameraIcon size={30} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarChange}
            aria-hidden="true"
            tabIndex={-1}
          />

          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-ink">
              {user ? `${user.firstName} ${user.lastName}` : "Cargando…"}
            </p>
            <p className="truncate text-sm text-ink-soft">{user?.email ?? "…"}</p>
            {provider ? (
              <p className="mt-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-leaf-700">
                  <span className="size-1 rounded-full bg-leaf-600" />
                  {provider}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit(handleProfileSubmit)}
          noValidate
        >
          {errors.root?.serverError ? (
            <p className="alert-error sm:col-span-2" role="alert">
              {errors.root.serverError.message}
            </p>
          ) : null}

          <Field
            id="settings-first-name"
            label="Nombre"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName", {
              required: "Ingresa tu nombre.",
              maxLength: {
                value: 60,
                message: "El nombre no puede superar 60 caracteres.",
              },
            })}
          />

          <Field
            id="settings-last-name"
            label="Apellido"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName", {
              required: "Ingresa tu apellido.",
              maxLength: {
                value: 60,
                message: "El apellido no puede superar 60 caracteres.",
              },
            })}
          />

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="btn-primary w-auto px-6"
              disabled={isProfileBusy}
            >
              {isProfileBusy ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </section>

      <section
        className="shrink-0 rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-500/25 dark:bg-red-950/20 sm:p-6 lg:w-72 lg:self-stretch xl:w-80"
        aria-label="Zona de peligro"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 lg:h-full lg:flex-col lg:items-stretch lg:justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Eliminar cuenta
            </h3>
            <p className="mt-0.5 max-w-md text-sm text-ink-soft">
              Se eliminarán tu cuenta, tus movimientos y toda tu información.
              Esta acción no se puede deshacer.
            </p>
          </div>
          <button
            type="button"
            className="btn-danger w-auto px-5 lg:w-full"
            onClick={() => {
              setDeleteOpen(true);
              setDeleteConfirmation("");
            }}
          >
            <TrashIcon size={16} />
            Eliminar cuenta
          </button>
        </div>
      </section>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => {
          if (removeAccount.isPending) return;
          setDeleteOpen(false);
        }}
        title="Eliminar tu cuenta"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            Vas a eliminar permanentemente la cuenta{" "}
            <span className="font-semibold text-ink">{user?.email}</span> con
            todos sus movimientos. Esta acción no se puede deshacer.
          </p>

          <Field
            id="delete-confirmation"
            label={`Escribe tu correo para confirmar`}
            type="email"
            autoComplete="off"
            placeholder={user?.email ?? "tu@correo.com"}
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="btn-ghost"
              disabled={removeAccount.isPending}
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-danger"
              disabled={!canDelete || removeAccount.isPending}
              onClick={handleDeleteAccount}
            >
              {removeAccount.isPending ? "Eliminando…" : "Eliminar para siempre"}
            </button>
          </div>
        </div>
      </Modal>

      {feedback ? (
        <InfoModal
          open={true}
          feedback={feedback}
          onAccept={handleAcceptFeedback}
        />
      ) : null}
    </div>
  );
}
