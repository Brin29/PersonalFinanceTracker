import { logout } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
