import { Locale, type LocaleType } from "../../../lib/locales.ts";
import type {
  HealthLog,
  HealthLogCreateDto,
  HealthLogUpdateDto,
} from "../types/health-logs.types.ts";

const LOCALES = Object.values(Locale);

type HealthLogTranslationForm = { procedure_name: string; examination_findings?: string };

export type HealthLogFormValues = {
  translations: Record<LocaleType, HealthLogTranslationForm>;
};

export const emptyHealthLogFormValues = (): HealthLogFormValues => ({
  translations: Object.fromEntries(
    LOCALES.map((locale) => [locale, { procedure_name: "", examination_findings: undefined }]),
  ) as Record<LocaleType, HealthLogTranslationForm>,
});

export const healthLogToFormValues = (log: HealthLog): HealthLogFormValues => ({
  translations: Object.fromEntries(
    LOCALES.map((locale) => {
      const tr = log.translations.find((item) => item.locale === locale);
      return [
        locale,
        {
          procedure_name: tr?.procedure_name ?? "",
          examination_findings: tr?.examination_findings ?? undefined,
        },
      ];
    }),
  ) as Record<LocaleType, HealthLogTranslationForm>,
});

const toTranslations = (values: HealthLogFormValues) =>
  LOCALES.filter(
    (locale) => locale === Locale.EN || values.translations[locale].procedure_name.trim(),
  ).map((locale) => ({
    locale,
    procedure_name: values.translations[locale].procedure_name,
    examination_findings: values.translations[locale].examination_findings || null,
  }));

export const formValuesToCreateDto = (values: HealthLogFormValues): HealthLogCreateDto => ({
  translations: toTranslations(values),
});

export const formValuesToUpdateDto = (values: HealthLogFormValues): HealthLogUpdateDto => ({
  translations: toTranslations(values),
});
