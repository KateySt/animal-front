import { axiosInstance } from "../../../lib/axios";
import type {
  Animal,
  AnimalsList,
  AnimalsQueryParams,
  CreateAnimalDto,
  UpdateAnimalDto,
} from "../types/animals.types.ts";

export const animalsApi = {
  getAnimals: (params: AnimalsQueryParams) =>
    axiosInstance.get<AnimalsList>("/v1/animals", { params }).then((response) => response.data),

  getAnimal: (animalId: string) =>
    axiosInstance.get<Animal>(`/v1/animals/${animalId}`).then((response) => response.data),

  createAnimal: (dto: CreateAnimalDto) =>
    axiosInstance.post<Animal>("/v1/animals", dto).then((response) => response.data),

  updateAnimal: (animalId: string, dto: UpdateAnimalDto) =>
    axiosInstance.patch<Animal>(`/v1/animals/${animalId}`, dto).then((response) => response.data),

  deleteAnimal: (animalId: string) =>
    axiosInstance.delete<void>(`/v1/animals/${animalId}`).then((response) => response.data),
};
