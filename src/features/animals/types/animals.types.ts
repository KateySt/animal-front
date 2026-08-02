import type { TimeStamp } from "../../../types/base.ts";
import type { LocaleType } from "../../../lib/locales.ts";

export const Gender = {
  Male: "male",
  Female: "female",
  Unknown: "unknown",
} as const;

export type GenderType = (typeof Gender)[keyof typeof Gender];

export type AnimalTranslation = {
  locale: LocaleType;
  name: string;
  caretaker_notes: string | null;
};

export type HealthLogTranslation = {
  locale: LocaleType;
  procedure_name: string;
  examination_findings: string | null;
};

export type HealthLog = {
  id: string;
  animal_id: string;
  translations: HealthLogTranslation[];
} & TimeStamp;

export type Animal = {
  id: string;
  gender: GenderType;
  birth_date: string;
  translations: AnimalTranslation[];
  health_logs: HealthLog[];
} & TimeStamp;

export type AnimalsList = {
  data: Animal[];
  total: number;
  has_more: boolean;
  page: number;
  items_per_page: number;
};

export type CreateAnimalDto = {
  owner_id: string;
  gender: GenderType;
  birth_date: string;
  translations: AnimalTranslation[];
  health_logs: { translations: HealthLogTranslation[] }[];
};

export type UpdateAnimalDto = Partial<Omit<CreateAnimalDto, "owner_id">>;

export type AnimalsQueryParams = {
  page: number;
  items_per_page: number;
};
