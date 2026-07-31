import { Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../../store/theme.store";
import { styleConfig } from "../../../style.config";

const { Text } = Typography;

const EmptyChartState = () => {
  const { t } = useTranslation("chat");
  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <MessageOutlined style={{ fontSize: 40, color: colors.textMuted }} />
      <Text style={{ color: colors.textSecondary }}>{t("window.emptyHint")}</Text>
    </div>
  );
};

export default EmptyChartState;
