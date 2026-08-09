import { axiosInstance } from "../../../lib/axios";
import type {
  ListResponse,
  Resource,
  ResourceCreateDto,
  ResourceUpdateDto,
} from "../types/rbac.types.ts";

const basePath = "/v1/resources";

export const resourcesApi = {
  getResources: () =>
    axiosInstance.get<ListResponse<Resource>>(basePath).then((response) => response.data),

  createResource: (dto: ResourceCreateDto) =>
    axiosInstance.post<Resource>(basePath, dto).then((response) => response.data),

  updateResource: (resourceId: string, dto: ResourceUpdateDto) =>
    axiosInstance
      .patch<Resource>(`${basePath}/${resourceId}`, dto)
      .then((response) => response.data),

  deleteResource: (resourceId: string) =>
    axiosInstance.delete<void>(`${basePath}/${resourceId}`).then((response) => response.data),
};
