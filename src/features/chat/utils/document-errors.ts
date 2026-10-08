import type { AxiosError } from "axios";
import i18n from "../../../lib/i18n.ts";

type ApiError = { detail?: string; error_code?: string };

export const getDocumentErrorMessage = (error: unknown): string => {
  const code =
    typeof error === "string" ? error : (error as AxiosError<ApiError>)?.response?.data?.error_code;

  if (code && i18n.exists(`errors.${code}`, { ns: "common" })) {
    return i18n.t(`errors.${code}`, { ns: "common" });
  }

  return i18n.t("errors.generic", { ns: "common" });
};
