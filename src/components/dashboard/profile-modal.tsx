"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { Field } from "@/components/ui/field";
import { useProfile } from "@/hooks/profile/queries/useProfile";
import { useUpdateProfile } from "@/hooks/profile/mutations/useUpdateProfile";
import { useUploadAvatar } from "@/hooks/profile/mutations/useUploadAvatar";
import { getApiErrorMessage } from "@/lib/api/errors";
import { PROVIDER_LABELS } from "@/lib/utils/provider";
import { UserAvatar } from "./user-avatar";
import CameraIcon from "@/components/ui/icons/cameraIcon";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

interface ProfileFormValues {
  firstName: string;
  lastName: string;
}

const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { data: user } = useProfile();
  const update = useUpdateProfile();
  const avatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) return;
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    });
  }, [open, user, reset]);

  const handleClose = () => {
    setFeedback(null);
    onClose();
  };

  const isBusy = isSubmitting || update.isPending;
  const provider = user?.provider ? PROVIDER_LABELS[user.provider] : undefined;

  const handleAcceptFeedback = () => {
    const action = feedback?.onAccept;
    setFeedback(null);
    if (feedback?.tone === "success") handleClose();
    action?.();
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      await update.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      });
      setFeedback({
        tone: "success",
        title: "Información actualizada",
        message: "Tus datos de perfil se actualizaron correctamente.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo actualizar",
        message: getApiErrorMessage(error, "No se pudo actualizar el perfil."),
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
      await avatar.mutateAsync(file);
      setFeedback({
        tone: "success",
        title: "Foto actualizada",
        message: "Tu foto de perfil se actualizó correctamente.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo subir la imagen",
        message: getApiErrorMessage(error, "No se pudo subir la imagen."),
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Mi perfil">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3">
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

          <div className="text-center">
            <p className="text-base font-semibold text-ink">
              {user ? `${user.firstName} ${user.lastName}` : "Cargando…"}
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">{user?.email ?? "…"}</p>
            {provider ? (
              <p className="mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-leaf-700">
                  <span className="size-1 rounded-full bg-leaf-600" />
                  {provider}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <form
          className="flex flex-col gap-4 border-t border-line pt-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Field
            id="profile-first-name"
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
            id="profile-last-name"
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

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              className="btn-ghost"
              onClick={handleClose}
              disabled={isBusy}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isBusy}>
              {isBusy ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>

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
