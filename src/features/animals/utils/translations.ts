import { Locale } from "../../../lib/locales.ts";
import type { AnimalTranslation, HealthLogTranslation } from "../types/animals.types.ts";

export const getEnTranslation = <T extends { locale: string }>(translations: T[]): T | undefined =>
  translations.find((item) => item.locale === Locale.EN);

export const getAnimalName = (translations: AnimalTranslation[]): string =>
  getEnTranslation(translations)?.name ?? "";

export const getProcedureName = (translations: HealthLogTranslation[]): string =>
  getEnTranslation(translations)?.procedure_name ?? "";
