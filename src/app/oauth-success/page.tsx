import { Suspense } from "react";
import OAuthSuccessContent from "@/components/auth/oauth-success-content";

export default function OAuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
          <span
            className="size-6 animate-spin rounded-full border-2 border-line border-t-leaf-600"
            aria-hidden="true"
          />
        </div>
      }
    >
      <OAuthSuccessContent />
    </Suspense>
  );
}
