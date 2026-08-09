import { axiosInstance } from "../../../lib/axios";
import type {
  ListResponse,
  Role,
  RoleCreateDto,
  RoleDetail,
  RoleUpdateDto,
} from "../types/rbac.types.ts";

const basePath = "/v1/roles";

export const rolesApi = {
  getRoles: () => axiosInstance.get<ListResponse<Role>>(basePath).then((response) => response.data),

  getRole: (roleId: string) =>
    axiosInstance.get<RoleDetail>(`${basePath}/${roleId}`).then((response) => response.data),

  createRole: (dto: RoleCreateDto) =>
    axiosInstance.post<RoleDetail>(basePath, dto).then((response) => response.data),

  updateRole: (roleId: string, dto: RoleUpdateDto) =>
    axiosInstance.patch<RoleDetail>(`${basePath}/${roleId}`, dto).then((response) => response.data),

  deleteRole: (roleId: string) =>
    axiosInstance.delete<void>(`${basePath}/${roleId}`).then((response) => response.data),

  setRolePermissions: (roleId: string, permissionIds: string[]) =>
    axiosInstance
      .put<RoleDetail>(`${basePath}/${roleId}/permissions`, { permission_ids: permissionIds })
      .then((response) => response.data),
};
