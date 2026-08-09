import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { login } from "@/services/auth";
import { profileKeys } from "@/hooks/profile/profile.keys";
import { setSessionCookie } from "@/lib/auth/session-cookie";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      setSessionCookie();
      queryClient.invalidateQueries({
        queryKey: profileKeys.all, // cache obsoleto
      });
    }
  });
}
