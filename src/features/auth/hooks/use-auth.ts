import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import { Routes } from "../../../router/routes";
import type { LoginDto, RegisterDto } from "../types/auth";

export function useLogin() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: async ({ access_token }) => {
      setAccessToken(access_token);

      const user = await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: () => authApi.me(),
      });

      setUser(user);
      navigate(Routes.Home);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    enabled: false,
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
