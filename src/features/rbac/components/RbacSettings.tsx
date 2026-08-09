import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { ResourcesPanel } from "./ResourcesPanel.tsx";
import { PermissionsPanel } from "./PermissionsPanel.tsx";
import { RolesPanel } from "./RolesPanel.tsx";

export const RbacSettings = () => {
  const { t } = useTranslation("settings");

  return (
    <Tabs
      defaultActiveKey="resources"
      items={[
        { key: "resources", label: t("tabs.resources"), children: <ResourcesPanel /> },
        { key: "permissions", label: t("tabs.permissions"), children: <PermissionsPanel /> },
        { key: "roles", label: t("tabs.roles"), children: <RolesPanel /> },
      ]}
    />
  );
};
