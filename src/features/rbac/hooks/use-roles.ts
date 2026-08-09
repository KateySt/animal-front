import { message } from "antd";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "../api/roles.api";
import { getRbacErrorMessage } from "../utils/errors.ts";
import type { RoleCreateDto, RoleUpdateDto } from "../types/rbac.types.ts";

export const roleKeys = {
  all: ["roles"] as const,
  list: () => [...roleKeys.all, "list"] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

export function useRoles() {
  return useQuery(
    queryOptions({
      queryKey: roleKeys.list(),
      queryFn: () => rolesApi.getRoles(),
      select: (response) => response.data,
    }),
  );
}

export function useRole(roleId: string) {
  return useQuery(
    queryOptions({
      queryKey: roleKeys.detail(roleId),
      queryFn: () => rolesApi.getRole(roleId),
      enabled: !!roleId,
    }),
  );
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RoleCreateDto) => rolesApi.createRole(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roleKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, dto }: { roleId: string; dto: RoleUpdateDto }) =>
      rolesApi.updateRole(roleId, dto),
    onSuccess: (_, { roleId }) => {
      void queryClient.invalidateQueries({ queryKey: roleKeys.list() });
      void queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
    },
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => rolesApi.deleteRole(roleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roleKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}

export function useSetRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      rolesApi.setRolePermissions(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      void queryClient.invalidateQueries({ queryKey: roleKeys.list() });
      void queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
    },
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}
