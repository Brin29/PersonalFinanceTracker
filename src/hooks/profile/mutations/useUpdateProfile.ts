import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/auth";
import { profileKeys } from "../profile.keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      });
    },
  });
}
