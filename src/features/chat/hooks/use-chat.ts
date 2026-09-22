import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { chatFetch } from "../api/chat.fetch";
import { chatMessagesUrl } from "../api/chat.api";

export const useAnimalChat = (sessionId: string) =>
  useChat({
    id: sessionId,
    transport: new DefaultChatTransport({
      fetch: chatFetch,
      prepareSendMessagesRequest: ({ id, messages }) => {
        const lastUserMessage = messages.filter((m) => m.role === "user").at(-1);
        const content = (lastUserMessage?.parts ?? [])
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("");

        return {
          api: chatMessagesUrl(id),
          body: { content },
        };
      },
    }),
  });
