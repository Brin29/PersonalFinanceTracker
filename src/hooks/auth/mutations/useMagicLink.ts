import { useMutation } from "@tanstack/react-query";
import {
  checkEmail,
  generateMagicLink,
  verifyMagicToken,
} from "@/services/auth";

export function useCheckEmail() {
  return useMutation({
    mutationFn: checkEmail,
  });
}

export function useMagicLinkGenerate() {
  return useMutation({
    mutationFn: generateMagicLink,
  });
}

export function useVerifyMagicToken() {
  return useMutation({
    mutationFn: verifyMagicToken,
  });
}
