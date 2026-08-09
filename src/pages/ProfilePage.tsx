import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { ProfileCard } from "../features/auth/components/ProfileCard.tsx";

const { Title } = Typography;

export const ProfilePage = () => {
  const { t } = useTranslation("common");

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <Title level={3}>{t("profile.title")}</Title>
      <ProfileCard />
    </div>
  );
};
