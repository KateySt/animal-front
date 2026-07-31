import type { ChatSession } from "../types/chat.types.ts";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../../store/theme.store.ts";
import { palette, styleConfig } from "../../../style.config.ts";
import { DeleteOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Tooltip, Typography } from "antd";

const { Text } = Typography;

type SessionItemProps = {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

const SessionItem = ({ session, isActive, onSelect, onDelete }: SessionItemProps) => {
  const { t } = useTranslation("chat");
  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  return (
    <div
      onClick={() => onSelect(session.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: styleConfig.borderRadius,
        cursor: "pointer",
        background: isActive
          ? isDark
            ? palette.primaryAlpha15
            : palette.primaryAlpha08
          : "transparent",
        border: isActive ? `1px solid ${palette.primaryAlpha30}` : "1px solid transparent",
        transition: "all 0.15s",
      }}
    >
      <MessageOutlined
        style={{ color: isActive ? palette.accent : colors.textSecondary, flexShrink: 0 }}
      />
      <Text
        ellipsis
        style={{
          flex: 1,
          fontSize: styleConfig.fontSizeSM,
          color: isActive ? palette.primary : colors.textPrimary,
        }}
      >
        {session.title || t("sidebar.newChat")}
      </Text>
      <Tooltip title={t("sidebar.delete")}>
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(session.id);
          }}
          style={{ color: colors.textSecondary, flexShrink: 0, opacity: 0.6 }}
        />
      </Tooltip>
    </div>
  );
};

export default SessionItem;
