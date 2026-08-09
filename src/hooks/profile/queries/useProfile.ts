import { getProfile } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { profileKeys } from "../profile.keys";

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: getProfile,
    retry: false
  });
}