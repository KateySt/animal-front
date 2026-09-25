import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./ChatMessage.module.scss";

export const GeneratingImagePlaceholder = () => {
  const { t } = useTranslation("chat");
  return (
    <span className={styles.toolStatus}>
      <LoadingOutlined spin /> {t("imageGen.generating")}
    </span>
  );
};
