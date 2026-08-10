import { message } from "antd";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { permissionsApi } from "../api/permissions.api";
import { getRbacErrorMessage } from "../utils/errors.ts";
import type { PermissionCreateDto } from "../types/rbac.types.ts";

export const permissionKeys = {
  all: ["permissions"] as const,
  list: () => [...permissionKeys.all, "list"] as const,
};

export function usePermissions() {
  return useQuery(
    queryOptions({
      queryKey: permissionKeys.list(),
      queryFn: () => permissionsApi.getPermissions(),
      select: (response) => response,
    }),
  );
}

export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: PermissionCreateDto) => permissionsApi.createPermission(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permissionKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (permissionId: string) => permissionsApi.deletePermission(permissionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permissionKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}
