import type { Rule } from "antd/es/form";
import i18n from "../../../lib/i18n.ts";

const t = (key: string) => i18n.t(key, { ns: "settings" });

const NAME_MAX = 100;
const DESCRIPTION_MAX = 500;
const ACTION_MAX = 50;
const RESOURCE_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const rbacSchema = {
  resourceName: (): Rule[] => [
    { required: true, message: t("validation.nameRequired") },
    { pattern: RESOURCE_NAME_PATTERN, message: t("validation.namePattern") },
    { max: NAME_MAX, message: t("validation.nameMax") },
  ],

  description: (): Rule[] => [{ max: DESCRIPTION_MAX, message: t("validation.descriptionMax") }],

  resourceId: (): Rule[] => [{ required: true, message: t("validation.resourceRequired") }],

  action: (): Rule[] => [
    { required: true, message: t("validation.actionRequired") },
    { max: ACTION_MAX, message: t("validation.actionMax") },
  ],

  roleName: (): Rule[] => [
    { required: true, message: t("validation.roleNameRequired") },
    { max: NAME_MAX, message: t("validation.nameMax") },
  ],

  permissionIds: (): Rule[] => [
    { required: true, message: t("validation.permissionsRequired") },
    { type: "array", min: 1, message: t("validation.permissionsRequired") },
  ],
};
