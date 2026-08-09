import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { RbacSettings } from "../features/rbac/components/RbacSettings.tsx";

const { Title } = Typography;

export const SettingsPage = () => {
  const { t } = useTranslation("settings");

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>{t("title")}</Title>
      <RbacSettings />
    </div>
  );
};
