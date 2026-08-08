import { Locale } from "../../../lib/locales.ts";
import type { AnimalTranslation, HealthLogTranslation } from "../types/animals.types.ts";

export const getEnTranslation = <T extends { locale: string }>(translations: T[]): T | undefined =>
  translations.find((item) => item.locale === Locale.EN);

export const getLocalized = <T extends { locale: string }>(
  translations: T[],
  locale: string,
): T | undefined =>
  translations.find((item) => item.locale === locale) ?? getEnTranslation(translations);

export const getAnimalName = (translations: AnimalTranslation[], locale: string): string =>
  getLocalized(translations, locale)?.name ?? "";

export const getProcedureName = (translations: HealthLogTranslation[], locale: string): string =>
  getLocalized(translations, locale)?.procedure_name ?? "";
