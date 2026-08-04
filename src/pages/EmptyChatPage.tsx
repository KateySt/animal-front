import { ChatSidebar } from "../features/chat/components/ChatSidebar.tsx";
import NoConversationPlaceholder from "../features/chat/components/NoConversationPlaceholder.tsx";
import styles from "./ChatPage.module.scss";

export const EmptyChatPage = () => {
  return (
    <div className={styles.layout}>
      <ChatSidebar />
      <NoConversationPlaceholder />
    </div>
  );
};
