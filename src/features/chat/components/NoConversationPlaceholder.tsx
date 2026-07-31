import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import { styleConfig } from "../../../style.config.ts";
import { useThemeStore } from "../../../store/theme.store.ts";

const { Title, Text } = Typography;

const NoConversationPlaceholder = () => {
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
        gap: 8,
      }}
    >
      <Title level={4} style={{ color: colors.textPrimary, margin: 0 }}>
        {t("page.welcomeTitle")}
      </Title>
      <Text style={{ color: colors.textSecondary }}>{t("page.welcomeHint")}</Text>
    </div>
  );
};

export default NoConversationPlaceholder;
