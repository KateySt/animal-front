import { useRef, useState } from "react";
import { chatApi } from "../api/chat.api";
import { useChatStore } from "../../../store/chat.store";
import { useQueryClient } from "@tanstack/react-query";
import { type ChatMessage, type ChatSessions, MessageRole } from "../types/chat.types";

type UseSendMessageResult = {
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
};

export const useSendMessage = (sessionId: string): UseSendMessageResult => {
  const [isLoading, setIsLoading] = useState(false);
  const isSendingRef = useRef(false);

  const { appendMessage, updateMessageContent, removeMessages, messagesBySession } = useChatStore();
  const queryClient = useQueryClient();

  const sendMessage = async (content: string) => {
    if (!content.trim() || isSendingRef.current) return;

    isSendingRef.current = true;
    setIsLoading(true);

    const trimmed = content.trim();

    const messages = messagesBySession[sessionId] ?? [];
    const isFirstMessage = messages.length === 0;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: MessageRole.User,
      content: trimmed,
      is_tool: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    appendMessage(sessionId, userMessage);

    if (isFirstMessage) {
      queryClient.setQueryData<ChatSessions>(["sessions"], (old) => ({
        sessions: (old?.sessions ?? []).map((s) =>
          s.id === sessionId ? { ...s, title: trimmed.slice(0, 40) } : s,
        ),
      }));
    }

    const botMessageId = crypto.randomUUID();
    const now = new Date().toISOString();
    const placeholder: ChatMessage = {
      id: botMessageId,
      role: MessageRole.Assistant,
      content: "",
      is_tool: false,
      created_at: now,
      updated_at: now,
    };

    appendMessage(sessionId, placeholder);

    try {
      await chatApi.streamMessage({ sessionId, content: trimmed }, (chunk) => {
        updateMessageContent(sessionId, botMessageId, chunk);
      });
    } catch {
      removeMessages(sessionId, [userMessage.id, botMessageId]);
    } finally {
      isSendingRef.current = false;
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};
