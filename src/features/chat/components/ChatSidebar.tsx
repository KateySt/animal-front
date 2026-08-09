import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import SessionItem from "./SessionItem.tsx";
import { useCreateSession, useDeleteSession, useSessions } from "../hooks/use-sessions.ts";
import { Routes } from "../../../router/routes.ts";
import styles from "./ChatSidebar.module.scss";

const { Text } = Typography;

export const ChatSidebar = () => {
  const { sessionId: activeSessionId } = useParams();
  const { t } = useTranslation("chat");

  const { data } = useSessions();
  const sessions = data?.sessions ?? [];

  const navigate = useNavigate();

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

  const handleCreateNewChat = () => {
    createSession(undefined, {
      onSuccess: (s) => navigateToSession(s.id),
    });
  };

  return (
    <div className={styles.sidebar}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateNewChat}
        block
        className={styles.newChatBtn}
      >
        {t("sidebar.newChat")}
      </Button>

      <Text className={styles.historyLabel}>{t("sidebar.history")}</Text>

      <div className={styles.sessionList}>
        {sessions.length === 0 && <Text className={styles.emptyLabel}>{t("sidebar.empty")}</Text>}
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
