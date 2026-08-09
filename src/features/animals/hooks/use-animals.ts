import {
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
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
import { ITEMS_PER_PAGE } from "../../../constants";

export const animalKeys = {
  all: ["animals"] as const,
  lists: () => [...animalKeys.all, "list"] as const,
  list: (params: AnimalsQueryParams) => [...animalKeys.lists(), params] as const,
  infinite: (itemsPerPage: number) => [...animalKeys.all, "infinite", itemsPerPage] as const,
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

export function useInfiniteAnimals(itemsPerPage: number = ITEMS_PER_PAGE) {
  return useInfiniteQuery({
    queryKey: animalKeys.infinite(itemsPerPage),
    queryFn: ({ pageParam }) =>
      animalsApi.getAnimals({ page: pageParam, items_per_page: itemsPerPage }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.page + 1 : undefined),
  });
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
      void queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
    },
  });
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ animalId, dto }: { animalId: string; dto: UpdateAnimalDto }) =>
      animalsApi.updateAnimal(animalId, dto),
    onSuccess: (_, { animalId }) => {
      void queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: animalKeys.detail(animalId) });
    },
  });
}

export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animalId: string) => animalsApi.deleteAnimal(animalId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
    },
  });
}
