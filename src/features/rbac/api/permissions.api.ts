import { axiosInstance } from "../../../lib/axios";
import type { Permission, PermissionCreateDto } from "../types/rbac.types.ts";

const basePath = "/v1/permissions";

export const permissionsApi = {
  getPermissions: () => axiosInstance.get<Permission[]>(basePath).then((response) => response.data),

  createPermission: (dto: PermissionCreateDto) =>
    axiosInstance.post<Permission>(basePath, dto).then((response) => response.data),

  deletePermission: (permissionId: string) =>
    axiosInstance.delete<void>(`${basePath}/${permissionId}`).then((response) => response.data),
};
