import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import styles from "./NoConversationPlaceholder.module.scss";

const { Title, Text } = Typography;

const NoConversationPlaceholder = () => {
  const { t } = useTranslation("chat");

  return (
    <div className={styles.wrapper}>
      <Title level={4} className={styles.title}>
        {t("page.welcomeTitle")}
      </Title>
      <Text className={styles.hint}>{t("page.welcomeHint")}</Text>
    </div>
  );
};

export default NoConversationPlaceholder;
