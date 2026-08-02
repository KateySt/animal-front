import type { Rule } from "antd/es/form";
import i18n from "../../../lib/i18n.ts";

const t = (key: string) => i18n.t(key, { ns: "animals" });

const NAME_MAX = 100;
const NOTES_MAX = 255;

export const animalSchema = {
  name: (): Rule[] => [
    { required: true, message: t("validation.nameRequired") },
    { max: NAME_MAX, message: t("validation.nameMax") },
  ],

  caretakerNotes: (): Rule[] => [{ max: NOTES_MAX, message: t("validation.notesMax") }],

  gender: (): Rule[] => [{ required: true, message: t("validation.genderRequired") }],

  birthDate: (): Rule[] => [{ required: true, message: t("validation.birthDateRequired") }],

  procedureName: (): Rule[] => [
    { required: true, message: t("validation.procedureRequired") },
    { max: NAME_MAX, message: t("validation.procedureMax") },
  ],

  examinationFindings: (): Rule[] => [{ max: NOTES_MAX, message: t("validation.findingsMax") }],
};
