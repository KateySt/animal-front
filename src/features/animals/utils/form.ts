import { Locale } from "../../../lib/locales.ts";
import { getAnimalName, getEnTranslation } from "./translations.ts";
import type { Animal, CreateAnimalDto, GenderType } from "../types/animals.types.ts";

export type AnimalFormValues = {
  name: string;
  caretaker_notes?: string;
  gender: GenderType;
  birth_date: string;
  health_logs: { procedure_name: string; examination_findings?: string }[];
};

export const animalToFormValues = (animal: Animal): AnimalFormValues => ({
  name: getAnimalName(animal.translations),
  caretaker_notes: getEnTranslation(animal.translations)?.caretaker_notes ?? undefined,
  gender: animal.gender,
  birth_date: animal.birth_date,
  health_logs: animal.health_logs.map((log) => {
    const en = getEnTranslation(log.translations);
    return {
      procedure_name: en?.procedure_name ?? "",
      examination_findings: en?.examination_findings ?? undefined,
    };
  }),
});

export const formValuesToDto = (values: AnimalFormValues): Omit<CreateAnimalDto, "owner_id"> => ({
  gender: values.gender,
  birth_date: values.birth_date,
  translations: [
    {
      locale: Locale.EN,
      name: values.name,
      caretaker_notes: values.caretaker_notes || null,
    },
  ],
  health_logs: values.health_logs.map((log) => ({
    translations: [
      {
        locale: Locale.EN,
        procedure_name: log.procedure_name,
        examination_findings: log.examination_findings || null,
      },
    ],
  })),
});
