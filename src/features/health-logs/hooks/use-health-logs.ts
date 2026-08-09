import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { animalKeys } from "../../animals/hooks/use-animals.ts";
import { healthLogsApi } from "../api/health-logs.api";
import type {
  HealthLogCreateDto,
  HealthLogsQueryParams,
  HealthLogUpdateDto,
} from "../types/health-logs.types.ts";

export const healthLogKeys = {
  all: (animalId: string) => [...animalKeys.detail(animalId), "health-logs"] as const,
  lists: (animalId: string) => [...healthLogKeys.all(animalId), "list"] as const,
  list: (animalId: string, params: HealthLogsQueryParams) =>
    [...healthLogKeys.lists(animalId), params] as const,
  details: (animalId: string) => [...healthLogKeys.all(animalId), "detail"] as const,
  detail: (animalId: string, id: string) => [...healthLogKeys.details(animalId), id] as const,
};

export function useHealthLogs(animalId: string, params: HealthLogsQueryParams) {
  return useQuery(
    queryOptions({
      queryKey: healthLogKeys.list(animalId, params),
      queryFn: () => healthLogsApi.getHealthLogs(animalId, params),
      enabled: !!animalId,
      placeholderData: keepPreviousData,
    }),
  );
}

export function useHealthLog(animalId: string, healthLogId: string) {
  return useQuery(
    queryOptions({
      queryKey: healthLogKeys.detail(animalId, healthLogId),
      queryFn: () => healthLogsApi.getHealthLog(animalId, healthLogId),
      enabled: !!animalId && !!healthLogId,
    }),
  );
}

export function useCreateHealthLog(animalId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: HealthLogCreateDto) => healthLogsApi.createHealthLog(animalId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: healthLogKeys.lists(animalId) });
      void queryClient.invalidateQueries({ queryKey: animalKeys.detail(animalId) });
    },
  });
}

export function useUpdateHealthLog(animalId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ healthLogId, dto }: { healthLogId: string; dto: HealthLogUpdateDto }) =>
      healthLogsApi.updateHealthLog(animalId, healthLogId, dto),
    onSuccess: (_, { healthLogId }) => {
      void queryClient.invalidateQueries({ queryKey: healthLogKeys.lists(animalId) });
      void queryClient.invalidateQueries({ queryKey: healthLogKeys.detail(animalId, healthLogId) });
      void queryClient.invalidateQueries({ queryKey: animalKeys.detail(animalId) });
    },
  });
}

export function useDeleteHealthLog(animalId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (healthLogId: string) => healthLogsApi.deleteHealthLog(animalId, healthLogId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: healthLogKeys.lists(animalId) });
      void queryClient.invalidateQueries({ queryKey: animalKeys.detail(animalId) });
    },
  });
}
