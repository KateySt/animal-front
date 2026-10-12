import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { ProfileCard } from "../features/auth/components/ProfileCard.tsx";
import styles from "./ProfilePage.module.scss";

const { Title } = Typography;

const ProfilePage = () => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.page}>
      <Title level={3}>{t("profile.title")}</Title>
      <ProfileCard />
    </div>
  );
};

export default ProfilePage;
