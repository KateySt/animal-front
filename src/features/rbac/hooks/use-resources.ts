import { message } from "antd";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "../api/resources.api";
import { getRbacErrorMessage } from "../utils/errors.ts";
import type { ResourceCreateDto, ResourceUpdateDto } from "../types/rbac.types.ts";

export const resourceKeys = {
  all: ["resources"] as const,
  list: () => [...resourceKeys.all, "list"] as const,
};

export function useResources() {
  return useQuery(
    queryOptions({
      queryKey: resourceKeys.list(),
      queryFn: () => resourcesApi.getResources(),
      select: (response) => response.data,
    }),
  );
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ResourceCreateDto) => resourcesApi.createResource(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resourceKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ resourceId, dto }: { resourceId: string; dto: ResourceUpdateDto }) =>
      resourcesApi.updateResource(resourceId, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resourceKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) => resourcesApi.deleteResource(resourceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resourceKeys.list() }),
    onError: (error) => message.error(getRbacErrorMessage(error)),
  });
}
