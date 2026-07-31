import { useEffect } from "react";
import { useChatStore } from "../../../store/chat.store";
import { useSendMessage } from "../hooks/use-send-message";
import { useSession } from "../hooks/use-sessions";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import EmptyChartState from "./EmptyChartState.tsx";

type ChatWindowProps = {
  sessionId: string;
};

export const ChatWindow = ({ sessionId }: ChatWindowProps) => {
  const { messagesBySession, setSessionMessages } = useChatStore();
  const { sendMessage, isLoading } = useSendMessage(sessionId);
  const { data: session } = useSession(sessionId);

  const hasLocalMessages = !!messagesBySession[sessionId];

  useEffect(() => {
    if (session?.messages && !hasLocalMessages) {
      setSessionMessages(sessionId, session.messages);
    }
  }, [session?.messages, sessionId, setSessionMessages, hasLocalMessages]);

  const messages = messagesBySession[sessionId] ?? [];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {messages.length === 0 ? (
          <EmptyChartState />
        ) : (
          messages
            .filter((el) => !el.is_tool)
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
      </div>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};
