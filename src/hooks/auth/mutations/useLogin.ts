import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { login } from "@/services/auth";
import { profileKeys } from "@/hooks/profile/profile.keys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.all, // cache obsoleto
      });
    }
  });
}
