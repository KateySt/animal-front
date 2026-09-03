import { axiosInstance } from "../../../lib/axios";
import type { RbacUser } from "../types/rbac.types.ts";

const basePath = "/v1/users";

export const rbacUsersApi = {
  getUsers: () => axiosInstance.get<RbacUser[]>(basePath).then((response) => response.data),

  assignRoles: (userId: string, roleIds: string[]) =>
    axiosInstance
      .put<RbacUser>(`${basePath}/${userId}/roles`, { role_ids: roleIds })
      .then((response) => response.data),
};
