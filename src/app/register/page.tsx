"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { StepIndicator } from "@/components/auth/step-indicator";
import { useRegisterFlow } from "@/hooks/auth/use-register-flow";
import { EmailStep } from "@/components/auth/register/email-step";
import { CodeStep } from "@/components/auth/register/code-step";
import { RegisterStep } from "@/components/auth/register/register-step";

export default function RegisterPage() {
  const {
    step,
    emailForm,
    handleEmailSubmit,
    isEmailBusy,
    codeForm,
    isCodeBusy,
    handleCodeSubmit,
    email,
    resetCodeStep,
    registerForm,
    handleRegisterSubmit,
    isRegisterBusy,
    handleAcceptFeedback,
    feedback
  } = useRegisterFlow();

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <StepIndicator step={step} />

        <div key={step} className="step-enter">
          {step === 1 ? (
            <>
              <EmailStep
                form={emailForm}
                isBusy={isEmailBusy}
                onSubmit={handleEmailSubmit}
              />
              <OAuthButtons />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <CodeStep
                form={codeForm}
                isBusy={isCodeBusy}
                onSubmit={handleCodeSubmit}
                email={email}
                reset={resetCodeStep}
              />
            </>
          ) : null}

          {step === 3 ? (
            <RegisterStep
              form={registerForm}
              isBusy={isRegisterBusy}
              onSubmit={handleRegisterSubmit}
              reset={resetCodeStep}
            />
          ) : null}
        </div>

        <p className="text-center text-sm text-ink-soft">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-leaf-600 hover:text-leaf-700"
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      {feedback ? (
        <InfoModal
          open={true}
          feedback={feedback}
          onAccept={handleAcceptFeedback}
        />
      ) : null}
    </AuthShell>
  );
}
