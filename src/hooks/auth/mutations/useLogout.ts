import { logout } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { clearSessionCookie } from "@/lib/auth/session-cookie";

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearSessionCookie();
    },
  });
}