import { useRouter } from "next/navigation";
import {
  useRegister,
  useRequestCode,
  useVerifyCode,
} from "./mutations/useRegister";
import { useEffect, useState } from "react";
import { FeedbackInfo } from "@/components/ui/info-modal";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { getApiErrorMessage } from "@/lib/api/errors";
import { CodeStepValues, EmailStepValues, RegisterStepValues } from "@/lib/types/auth";


export function useRegisterFlow() {
  const router = useRouter();
  const requestCode = useRequestCode();
  const verifyCode = useVerifyCode();
  const registerMutation = useRegister();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);

  const emailForm = useForm<EmailStepValues>({ mode: "onTouched" });
  const codeForm = useForm<CodeStepValues>({ mode: "onTouched" });
  const registerForm = useForm<RegisterStepValues>({ mode: "onTouched" });

    const submittedCode = useWatch({
      control: codeForm.control,
      name: "code",
    });

  const handleAcceptFeedback = () => {
    const action = feedback?.onAccept;
    setFeedback(null);
    action?.();
  };

  const handleEmailSubmit: SubmitHandler<EmailStepValues> = async (values) => {
    try {
      const response = await requestCode.mutateAsync(values);
      setEmail(values.email);
      setDevCode(response.code ?? null);
      setFeedback({
        tone: "success",
        title: "Código enviado",
        message: `Enviamos un código de verificación a ${values.email}.`,
        onAccept: () => setStep(2),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo enviar el código",
        message: getApiErrorMessage(
          error,
          "No se pudo enviar el código de verificación.",
        ),
      });
    }
  };

  const handleCodeSubmit: SubmitHandler<CodeStepValues> = async (values) => {
    try {
      const response = await verifyCode.mutateAsync({
        email,
        code: values.code,
      });
      setVerificationToken(response.verification_token);
      setFeedback({
        tone: "success",
        title: "Correo verificado",
        message: "Tu correo se verificó correctamente. Continúa con tus datos.",
        onAccept: () => setStep(3),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "Código inválido",
        message: getApiErrorMessage(
          error,
          "El código no es válido. Inténtalo de nuevo.",
        ),
      });
    }
  };

  useEffect(() => {
    if (submittedCode && submittedCode.length === 6 && !verifyCode.isPending) {
      codeForm.handleSubmit(handleCodeSubmit)();
    }
  }, [submittedCode]);

  const handleRegisterSubmit: SubmitHandler<RegisterStepValues> = async (values) => {
    try {
      await registerMutation.mutateAsync({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        },
        verificationToken,
      });
      setFeedback({
        tone: "success",
        title: "Cuenta creada",
        message: "Tu cuenta se creó correctamente. ¡Bienvenido a tus finanzas!",
        onAccept: () => {
          router.push("/dashboard");
          router.refresh();
        },
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo crear la cuenta",
        message: getApiErrorMessage(error, "No se pudo crear la cuenta."),
      });
    }
  };

  const isEmailBusy = emailForm.formState.isSubmitting || requestCode.isPending;
  const isCodeBusy = codeForm.formState.isSubmitting || verifyCode.isPending;
  const isRegisterBusy =
    registerForm.formState.isSubmitting || registerMutation.isPending;

  return {
    step,
    email,
    devCode,
    feedback,
    emailForm,
    codeForm,
    registerForm,
    isEmailBusy,
    isCodeBusy,
    isRegisterBusy,
    handleEmailSubmit,
    handleCodeSubmit,
    handleRegisterSubmit,
    handleAcceptFeedback,
    goToStep: setStep,
    resetCodeStep: () => {
      setStep(1);
      setDevCode(null);
    },
  };
}
