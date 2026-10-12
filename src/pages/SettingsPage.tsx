import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { RbacSettings } from "../features/rbac/components/RbacSettings.tsx";
import styles from "./SettingsPage.module.scss";

const { Title } = Typography;

const SettingsPage = () => {
  const { t } = useTranslation("settings");

  return (
    <div className={styles.page}>
      <Title level={3}>{t("title")}</Title>
      <RbacSettings />
    </div>
  );
};

export default SettingsPage;
