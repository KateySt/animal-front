import { axiosInstance } from "../../../lib/axios";
import type {
  HealthLog,
  HealthLogCreateDto,
  HealthLogsList,
  HealthLogsQueryParams,
  HealthLogUpdateDto,
} from "../types/health-logs.types.ts";

const basePath = (animalId: string) => `/v1/animals/${animalId}/health-logs`;

export const healthLogsApi = {
  getHealthLogs: (animalId: string, params: HealthLogsQueryParams) =>
    axiosInstance
      .get<HealthLogsList>(basePath(animalId), { params })
      .then((response) => response.data),

  getHealthLog: (animalId: string, healthLogId: string) =>
    axiosInstance
      .get<HealthLog>(`${basePath(animalId)}/${healthLogId}`)
      .then((response) => response.data),

  createHealthLog: (animalId: string, dto: HealthLogCreateDto) =>
    axiosInstance.post<HealthLog>(basePath(animalId), dto).then((response) => response.data),

  updateHealthLog: (animalId: string, healthLogId: string, dto: HealthLogUpdateDto) =>
    axiosInstance
      .patch<HealthLog>(`${basePath(animalId)}/${healthLogId}`, dto)
      .then((response) => response.data),

  deleteHealthLog: (animalId: string, healthLogId: string) =>
    axiosInstance
      .delete<void>(`${basePath(animalId)}/${healthLogId}`)
      .then((response) => response.data),
};
