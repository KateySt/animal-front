import { useParams } from "react-router";
import { useThemeStore } from "../store/theme.store";
import { styleConfig } from "../style.config";
import { ChatSidebar } from "../features/chat/components/ChatSidebar";
import { ChatWindow } from "../features/chat/components/ChatWindow";

export const ChatPage = () => {
  const { sessionId } = useParams();
  const { isDark } = useThemeStore();

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 56px)",
        background: isDark ? styleConfig.dark.bg : styleConfig.light.bg,
        overflow: "hidden",
      }}
    >
      <ChatSidebar />

      {sessionId && <ChatWindow sessionId={sessionId} />}
    </div>
  );
};
