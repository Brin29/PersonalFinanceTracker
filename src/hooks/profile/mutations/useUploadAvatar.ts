import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "@/services/auth";
import { profileKeys } from "../profile.keys";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
