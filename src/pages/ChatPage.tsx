import { useParams } from "react-router";
import { ChatSidebar } from "../features/chat/components/ChatSidebar";
import { ChatWindow } from "../features/chat/components/ChatWindow";
import styles from "./ChatPage.module.scss";

export const ChatPage = () => {
  const { sessionId } = useParams();

  return (
    <div className={styles.layout}>
      <ChatSidebar />
      {sessionId && <ChatWindow sessionId={sessionId} />}
    </div>
  );
};
