import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import { Routes } from "../../../router/routes";
import type { LoginDto, RegisterDto, User } from "../types/auth";

export function useLogin() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const { mutateAsync: getMe } = useMe();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: async ({ access_token }) => {
      setAccessToken(access_token);
      await getMe();
      navigate(Routes.Home);
    },
  });
}

export function useMe(onSuccess?: () => void | Promise<void>) {
  const { setUser } = useAuthStore((state) => state);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.me(),
    onSuccess: (user: User) => {
      setUser(user);

      if (onSuccess) onSuccess();
    },
    onError: () => {
      navigate(Routes.Login, { replace: true });
    },
  });
}

export function useRegister() {
  const loginMutation = useLogin();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: async (_, variables) => {
      await loginMutation.mutateAsync({
        username: variables.email,
        password: variables.password,
      });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      navigate(Routes.Login, { replace: true });
    },
  });
}
