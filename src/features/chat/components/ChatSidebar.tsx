import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useThemeStore } from "../../../store/theme.store";
import { styleConfig } from "../../../style.config";
import SessionItem from "./SessionItem.tsx";
import { useCreateSession, useDeleteSession, useSessions } from "../hooks/use-sessions.ts";
import { Routes } from "../../../router/routes.ts";

const { Text } = Typography;

export const ChatSidebar = () => {
  const { sessionId: activeSessionId } = useParams();
  const { t } = useTranslation("chat");

  const { data } = useSessions();
  const sessions = data?.sessions ?? [];

  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  const { mutate: createSession } = useCreateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const navigateToSession = (id: string) => {
    navigate(Routes.ChatSession.replace(":sessionId", id));
  };

  const handleDelete = (id: string) => {
    deleteSession(id);

    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        navigateToSession(remaining[0].id);
      } else {
        navigate(Routes.Chat);
      }
    }
  };

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${colors.border}`,
        padding: "12px 8px",
        gap: 8,
        overflowY: "auto",
      }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() =>
          createSession(undefined, {
            onSuccess: (s) => navigateToSession(s.id),
          })
        }
        block
        style={{ marginBottom: 4 }}
      >
        {t("sidebar.newChat")}
      </Button>

      <Text
        style={{
          fontSize: styleConfig.fontSizeSM,
          color: colors.textSecondary,
          padding: "4px 4px 0",
        }}
      >
        {t("sidebar.history")}
      </Text>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
        {sessions.length === 0 && (
          <Text
            style={{
              fontSize: styleConfig.fontSizeSM,
              color: colors.textMuted,
              padding: "8px 4px",
            }}
          >
            {t("sidebar.empty")}
          </Text>
        )}
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onSelect={navigateToSession}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
