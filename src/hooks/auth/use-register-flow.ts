import { useRouter } from "next/navigation";
import {
  useRegister,
  useRequestCode,
  useVerifyCode,
} from "./mutations/useRegister";
import {
  useCheckEmail,
  useMagicLinkGenerate,
} from "./mutations/useMagicLink";
import { useEffect, useState } from "react";
import { FeedbackInfo } from "@/components/ui/info-modal";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { getMutationErrorMessage } from "@/lib/api/error-message";
import { getMutationSuccessMessage } from "@/lib/api/success-message";
import { setSessionCookie } from "@/lib/auth/session-cookie";
import { CodeStepValues, EmailStepValues, RegisterStepValues } from "@/lib/types/auth";


export function useRegisterFlow() {
  const router = useRouter();
  const requestCode = useRequestCode();
  const verifyCode = useVerifyCode();
  const registerMutation = useRegister();
  const checkEmailMutation = useCheckEmail();
  const magicLinkMutation = useMagicLinkGenerate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);

  const emailForm = useForm<EmailStepValues>({ mode: "onChange" });
  const codeForm = useForm<CodeStepValues>({ mode: "onChange" });
  const registerForm = useForm<RegisterStepValues>({ mode: "onChange" });

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
      const emailCheck = await checkEmailMutation.mutateAsync({
        email: values.email,
      });
      setEmail(values.email);

      if (emailCheck.exists) {
        await magicLinkMutation.mutateAsync({ email: values.email });
        setFeedback({
          tone: "success",
          title: "Ya tienes una cuenta",
          message:
            "Este correo ya está registrado. Te enviamos un enlace de acceso a tu bandeja de entrada para entrar a tu panel.",
          onAccept: () => setStep(1),
        });
        return;
      }

      const response = await requestCode.mutateAsync(values);
      setDevCode(response.code ?? null);
      setFeedback({
        tone: "success",
        title: "Código enviado",
        message: getMutationSuccessMessage(response.code),
        onAccept: () => setStep(2),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo continuar",
        message: getMutationErrorMessage(error.code),
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
        message: getMutationSuccessMessage(response.code),
        onAccept: () => setStep(3),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "Código inválido",
        message: getMutationErrorMessage(error.code),
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
      const result = await registerMutation.mutateAsync({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        },
        verificationToken,
      });
      setSessionCookie();
      setFeedback({
        tone: "success",
        title: "Cuenta creada",
        message: getMutationSuccessMessage(result.code),
        onAccept: () => {
          router.push("/dashboard");
          router.refresh();
        },
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo crear la cuenta",
        message: getMutationErrorMessage(error.code),
      });
    }
  };

  const isEmailBusy =
    emailForm.formState.isSubmitting ||
    requestCode.isPending ||
    checkEmailMutation.isPending ||
    magicLinkMutation.isPending;
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
