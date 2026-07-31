import { useThemeStore } from "../store/theme.store.ts";
import { styleConfig } from "../style.config.ts";
import { ChatSidebar } from "../features/chat/components/ChatSidebar.tsx";
import NoConversationPlaceholder from "../features/chat/components/NoConversationPlaceholder.tsx";

export const EmptyChatPage = () => {
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

      <NoConversationPlaceholder />
    </div>
  );
};
