import type { AxiosError } from "axios";
import i18n from "../../../lib/i18n.ts";

type ApiError = { detail?: string; error_code?: string };

export const getRbacErrorMessage = (error: unknown): string => {
  const data = (error as AxiosError<ApiError>)?.response?.data;
  const code = data?.error_code;

  if (code && i18n.exists(`errors.${code}`, { ns: "settings" })) {
    return i18n.t(`errors.${code}`, { ns: "settings" });
  }

  return data?.detail ?? i18n.t("errors.generic", { ns: "settings" });
};
