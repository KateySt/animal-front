import { message } from "antd";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rbacUsersApi } from "../api/users.api";
import { getRbacErrorMessage } from "../utils/errors.ts";

export const rbacUserKeys = {
  all: ["rbac-users"] as const,
  list: () => [...rbacUserKeys.all, "list"] as const,
};

export function useRbacUsers() {
  return useQuery(
    queryOptions({
      queryKey: rbacUserKeys.list(),
      queryFn: () => rbacUsersApi.getUsers(),
    }),
  );
}

export function useAssignUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      rbacUsersApi.assignRoles(userId, roleIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rbacUserKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}
