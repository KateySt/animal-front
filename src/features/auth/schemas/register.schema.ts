import type { FormInstance, Rule } from "antd/es/form";
import i18n from "../../../lib/i18n.ts";

const t = (key: string) => i18n.t(key, { ns: "common" });

export const registerSchema = {
  email: (): Rule[] => [
    { required: true, message: t("auth.register.emailRequired") },
    { type: "email" as const, message: t("auth.register.emailInvalid") },
  ],

  password: (): Rule[] => [
    { required: true, message: t("auth.register.passwordRequired") },
    { min: 4, message: t("auth.register.passwordMin") }, //todo  validation
  ],

  confirmPassword: (form: FormInstance): Rule[] => [
    { required: true, message: t("auth.register.confirmRequired") },
    {
      validator(_: Rule, value: string) {
        if (!value || form.getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(t("auth.register.confirmMismatch")));
      },
    },
  ],
};

export const loginSchema = {
  username: (): Rule[] => [
    { required: true, message: t("auth.register.emailRequired") },
    { type: "email" as const, message: t("auth.register.emailInvalid") },
  ],

  password: (): Rule[] => [
    { required: true, message: t("auth.register.passwordRequired") },
    { min: 4, message: t("auth.register.passwordMin") }, //todo  validation
  ],
};
