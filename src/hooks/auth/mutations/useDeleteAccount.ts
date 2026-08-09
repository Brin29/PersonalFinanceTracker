import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "@/services/auth";
import { clearSessionCookie } from "@/lib/auth/session-cookie";

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearSessionCookie();
    },
  });
}
