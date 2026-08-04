import { Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./EmptyChartState.module.scss";

const { Text } = Typography;

const EmptyChartState = () => {
  const { t } = useTranslation("chat");

  return (
    <div className={styles.wrapper}>
      <MessageOutlined className={styles.icon} />
      <Text className={styles.hint}>{t("window.emptyHint")}</Text>
    </div>
  );
};

export default EmptyChartState;
