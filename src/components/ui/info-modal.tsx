"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import CheckIcon from "@/components/ui/icons/checkIcon";
import AlertIcon from "@/components/ui/icons/alertIcon";

export type FeedbackTone = "success" | "error";

export interface FeedbackInfo {
  tone: FeedbackTone;
  title: string;
  message: ReactNode;
  onAccept?: () => void;
}

interface InfoModalProps {
  open: boolean;
  feedback: FeedbackInfo;
  onAccept: () => void;
  acceptLabel?: string;
}

export function InfoModal({
  open,
  feedback,
  onAccept,
  acceptLabel = "Aceptar",
}: InfoModalProps) {
  const isError = feedback.tone === "error";

  return (
    <Modal open={open} onClose={onAccept} title={feedback.title}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
              isError
                ? "bg-red-50 text-red-600 dark:bg-red-950/40"
                : "bg-leaf-50 text-leaf-600 dark:bg-leaf-950/40"
            }`}
            aria-hidden="true"
          >
            {isError ? <AlertIcon size={18} /> : <CheckIcon size={18} />}
          </span>
          <p className="text-sm leading-relaxed text-ink-soft">
            {feedback.message}
          </p>
        </div>
        <button
          type="button"
          className={`w-full ${isError ? "btn-danger" : "btn-primary"}`}
          onClick={onAccept}
        >
          {acceptLabel}
        </button>
      </div>
    </Modal>
  );
}
