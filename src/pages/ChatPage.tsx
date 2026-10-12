import { useParams } from "react-router";
import { ChatSidebar } from "../features/chat/components/ChatSidebar";
import { ChatWindow } from "../features/chat/components/ChatWindow";
import { useIsMobile } from "../hooks/use-media-query.ts";
import styles from "./ChatPage.module.scss";

const ChatPage = () => {
  const { sessionId } = useParams();
  const isMobile = useIsMobile();

  return (
    <div className={styles.layout}>
      {!isMobile && <ChatSidebar />}
      {sessionId && <ChatWindow key={sessionId} sessionId={sessionId} />}
    </div>
  );
};

export default ChatPage;
