import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import EmptyChartState from "./EmptyChartState.tsx";
import styles from "./ChatView.module.scss";
import type { ChatMessageType } from "../types/chat.types";

type ChatViewProps = {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
};

export const ChatView = ({ messages, isLoading, onSendMessage }: ChatViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className={styles.messages} ref={containerRef}>
        {messages.length === 0 ? (
          <EmptyChartState />
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
      </div>

      <ChatInput onSend={(text) => onSendMessage(text)} isLoading={isLoading} />
    </>
  );
};
