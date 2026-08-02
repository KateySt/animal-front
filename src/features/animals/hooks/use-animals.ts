import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { animalsApi } from "../api/animals.api";
import type {
  AnimalsQueryParams,
  CreateAnimalDto,
  UpdateAnimalDto,
} from "../types/animals.types.ts";

export const animalKeys = {
  all: ["animals"] as const,
  lists: () => [...animalKeys.all, "list"] as const,
  list: (params: AnimalsQueryParams) => [...animalKeys.lists(), params] as const,
  details: () => [...animalKeys.all, "detail"] as const,
  detail: (id: string) => [...animalKeys.details(), id] as const,
};

export function useAnimals(params: AnimalsQueryParams) {
  return useQuery(
    queryOptions({
      queryKey: animalKeys.list(params),
      queryFn: () => animalsApi.getAnimals(params),
      placeholderData: keepPreviousData,
    }),
  );
}

export function useAnimal(animalId: string) {
  return useQuery(
    queryOptions({
      queryKey: animalKeys.detail(animalId),
      queryFn: () => animalsApi.getAnimal(animalId),
      enabled: !!animalId,
    }),
  );
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAnimalDto) => animalsApi.createAnimal(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
    },
  });
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ animalId, dto }: { animalId: string; dto: UpdateAnimalDto }) =>
      animalsApi.updateAnimal(animalId, dto),
    onSuccess: (_, { animalId }) => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(animalId) });
    },
  });
}

export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animalId: string) => animalsApi.deleteAnimal(animalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
    },
  });
}
