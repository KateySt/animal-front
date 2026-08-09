import { axiosInstance } from "../../../lib/axios";
import type {
  Animal,
  AnimalsList,
  AnimalsQueryParams,
  CreateAnimalDto,
  UpdateAnimalDto,
} from "../types/animals.types.ts";

const basePath = "/v1/animals";

export const animalsApi = {
  getAnimals: (params: AnimalsQueryParams) =>
    axiosInstance.get<AnimalsList>(basePath, { params }).then((response) => response.data),

  getAnimal: (animalId: string) =>
    axiosInstance.get<Animal>(`${basePath}/${animalId}`).then((response) => response.data),

  createAnimal: (dto: CreateAnimalDto) =>
    axiosInstance.post<Animal>(basePath, dto).then((response) => response.data),

  updateAnimal: (animalId: string, dto: UpdateAnimalDto) =>
    axiosInstance.patch<Animal>(`${basePath}/${animalId}`, dto).then((response) => response.data),

  deleteAnimal: (animalId: string) =>
    axiosInstance.delete<void>(`${basePath}/${animalId}`).then((response) => response.data),
};
