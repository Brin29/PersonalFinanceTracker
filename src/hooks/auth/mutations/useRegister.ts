import {
  useMutation,
} from "@tanstack/react-query";
import { register, requestCode, verifyCode } from "@/services/auth";
import { RegisterInput, RequestCodeInput, VerifyCodeInput } from "@/lib/types/auth";


export function useRegister() {
  
  return useMutation({
    mutationFn: ({
      data,
      verificationToken,
    }: {
      data: RegisterInput;
      verificationToken: string;
    }) => register(data, verificationToken)
  });
}

export function useRequestCode() {
  return useMutation({
    mutationFn: requestCode,
  });
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: verifyCode,
  });
}