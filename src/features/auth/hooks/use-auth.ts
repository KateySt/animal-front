import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { getAuthErrorMessage } from "../utils/errors.ts";
import { useAuthStore } from "../../../store/auth.store";
import { Routes } from "../../../routes";
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

export function useGoogleLogin() {
  return () => authApi.googleLogin();
}

export function useUploadAvatar() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: (user: User) => {
      setUser(user);
    },
    onError: (error) => message.error(getAuthErrorMessage(error)),
  });
}

export function useRemoveAvatar() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: () => authApi.removeAvatar(),
    onSuccess: () => {
      if (user) setUser({ ...user, avatar_url: null });
    },
    onError: (error) => message.error(getAuthErrorMessage(error)),
  });
}
