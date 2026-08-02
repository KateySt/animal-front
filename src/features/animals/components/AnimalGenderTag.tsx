import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import { Gender, type GenderType } from "../types/animals.types.ts";

const GENDER_COLOR = {
  [Gender.Male]: "blue",
  [Gender.Female]: "magenta",
  [Gender.Unknown]: "default",
} satisfies Record<GenderType, string>;

type AnimalGenderTagProps = {
  gender: GenderType;
};

export const AnimalGenderTag = ({ gender }: AnimalGenderTagProps) => {
  const { t } = useTranslation("animals");
  return <Tag color={GENDER_COLOR[gender]}>{t(`gender.${gender}`)}</Tag>;
};
