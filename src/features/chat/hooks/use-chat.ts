import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { chatFetch } from "../api/chat.fetch";
import { chatMessagesUrl } from "../api/chat.api";
import { getMessageText } from "../utils/get-message-text";
import type { ChatUIMessage } from "../types/chat.types";

export const useAnimalChat = (sessionId: string) =>
  useChat<ChatUIMessage>({
    id: sessionId,
    transport: new DefaultChatTransport({
      fetch: chatFetch,
      prepareSendMessagesRequest: ({ id, messages }) => {
        const lastUserMessage = messages.filter((m) => m.role === "user").at(-1);
        const content = lastUserMessage ? getMessageText(lastUserMessage) : "";

        return {
          api: chatMessagesUrl(id),
          body: { content },
        };
      },
    }),
  });
