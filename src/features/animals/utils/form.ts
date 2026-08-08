import { Locale, type LocaleType } from "../../../lib/locales.ts";
import type { Animal, CreateAnimalDto, GenderType } from "../types/animals.types.ts";

const LOCALES = Object.values(Locale);

type AnimalTranslationForm = { name: string; caretaker_notes?: string };
type HealthLogTranslationForm = { procedure_name: string; examination_findings?: string };

export type AnimalFormValues = {
  gender: GenderType;
  birth_date: string;
  translations: Record<LocaleType, AnimalTranslationForm>;
  health_logs: { translations: Record<LocaleType, HealthLogTranslationForm> }[];
};

const byLocale = <T>(fill: (locale: LocaleType) => T): Record<LocaleType, T> =>
  Object.fromEntries(LOCALES.map((locale) => [locale, fill(locale)])) as Record<LocaleType, T>;

export const emptyAnimalTranslations = (): Record<LocaleType, AnimalTranslationForm> =>
  byLocale(() => ({ name: "", caretaker_notes: undefined }));

export const emptyHealthLogTranslations = (): Record<LocaleType, HealthLogTranslationForm> =>
  byLocale(() => ({ procedure_name: "", examination_findings: undefined }));

export const animalToFormValues = (animal: Animal): AnimalFormValues => ({
  gender: animal.gender,
  birth_date: animal.birth_date,
  translations: byLocale((locale) => {
    const tr = animal.translations.find((item) => item.locale === locale);
    return { name: tr?.name ?? "", caretaker_notes: tr?.caretaker_notes ?? undefined };
  }),
  health_logs: animal.health_logs.map((log) => ({
    translations: byLocale((locale) => {
      const tr = log.translations.find((item) => item.locale === locale);
      return {
        procedure_name: tr?.procedure_name ?? "",
        examination_findings: tr?.examination_findings ?? undefined,
      };
    }),
  })),
});

const toAnimalTranslations = (translations: Record<LocaleType, AnimalTranslationForm>) =>
  LOCALES.filter((locale) => locale === Locale.EN || translations[locale].name.trim()).map(
    (locale) => ({
      locale,
      name: translations[locale].name,
      caretaker_notes: translations[locale].caretaker_notes || null,
    }),
  );

const toHealthLogTranslations = (translations: Record<LocaleType, HealthLogTranslationForm>) =>
  LOCALES.filter(
    (locale) => locale === Locale.EN || translations[locale].procedure_name.trim(),
  ).map((locale) => ({
    locale,
    procedure_name: translations[locale].procedure_name,
    examination_findings: translations[locale].examination_findings || null,
  }));

export const formValuesToDto = (values: AnimalFormValues): Omit<CreateAnimalDto, "owner_id"> => ({
  gender: values.gender,
  birth_date: values.birth_date,
  translations: toAnimalTranslations(values.translations),
  health_logs: values.health_logs.map((log) => ({
    translations: toHealthLogTranslations(log.translations),
  })),
});
