import { useEffect } from "react";
import { useAnimalChat } from "../hooks/use-chat";
import { useSession } from "../hooks/use-sessions";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import EmptyChartState from "./EmptyChartState.tsx";
import styles from "./ChatWindow.module.scss";

type ChatWindowProps = {
  sessionId: string;
};

export const ChatWindow = ({ sessionId }: ChatWindowProps) => {
  const { data: session } = useSession(sessionId);
  const { messages, setMessages, sendMessage, status } = useAnimalChat(sessionId);

  useEffect(() => {
    if (session?.ui_messages && messages.length === 0) {
      setMessages(session.ui_messages);
    }
  }, [session?.ui_messages, messages.length, setMessages]);

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className={styles.window}>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <EmptyChartState />
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
      </div>

      <ChatInput onSend={(text) => sendMessage({ text })} isLoading={isLoading} />
    </div>
  );
};
