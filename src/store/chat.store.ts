import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ChatUIMessage } from "../features/chat/types/chat.types.ts";

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

type ChatState = {
  messagesBySession: Record<string, ChatUIMessage[]>;
  statusBySession: Record<string, ChatStatus>;
  getMessages: (sessionId: string) => ChatUIMessage[];
  getStatus: (sessionId: string) => ChatStatus;
  setMessages: (sessionId: string, messages: ChatUIMessage[]) => void;
  appendUserMessage: (sessionId: string, message: ChatUIMessage) => void;
  setUserMessageText: (sessionId: string, messageId: string, text: string, isNew: boolean) => void;
  setAssistantMessageText: (
    sessionId: string,
    messageId: string,
    text: string,
    isNew: boolean,
  ) => void;
  setStatus: (sessionId: string, status: ChatStatus) => void;
  removeMessage: (sessionId: string, messageId: string) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      messagesBySession: {},
      statusBySession: {},

      getMessages: (sessionId) => get().messagesBySession[sessionId] ?? [],
      getStatus: (sessionId) => get().statusBySession[sessionId] ?? "ready",

      setMessages: (sessionId, messages) =>
        set(
          (s) => ({ messagesBySession: { ...s.messagesBySession, [sessionId]: messages } }),
          false,
          "setMessages",
        ),

      appendUserMessage: (sessionId, message) =>
        set(
          (s) => ({
            messagesBySession: {
              ...s.messagesBySession,
              [sessionId]: [...(s.messagesBySession[sessionId] ?? []), message],
            },
          }),
          false,
          "appendUserMessage",
        ),

      setUserMessageText: (sessionId, messageId, text, isNew) =>
        set(
          (s) => {
            const existing = s.messagesBySession[sessionId] ?? [];
            if (!isNew) {
              const current = existing.find((m) => m.id === messageId);
              const currentText =
                current?.parts[0]?.type === "text" ? current.parts[0].text : undefined;
              if (currentText === text) return s;
            }
            const messages = isNew
              ? [
                  ...existing,
                  {
                    id: messageId,
                    role: "user" as const,
                    parts: [{ type: "text" as const, text }],
                  },
                ]
              : existing.map((m) =>
                  m.id === messageId ? { ...m, parts: [{ type: "text" as const, text }] } : m,
                );
            return { messagesBySession: { ...s.messagesBySession, [sessionId]: messages } };
          },
          false,
          "setUserMessageText",
        ),

      setAssistantMessageText: (sessionId, messageId, text, isNew) =>
        set(
          (s) => {
            const existing = s.messagesBySession[sessionId] ?? [];
            if (!isNew) {
              const current = existing.find((m) => m.id === messageId);
              const currentText =
                current?.parts[0]?.type === "text" ? current.parts[0].text : undefined;
              if (currentText === text) return s;
            }
            const messages = isNew
              ? [
                  ...existing,
                  {
                    id: messageId,
                    role: "assistant" as const,
                    parts: [{ type: "text" as const, text }],
                  },
                ]
              : existing.map((m) =>
                  m.id === messageId ? { ...m, parts: [{ type: "text" as const, text }] } : m,
                );
            return { messagesBySession: { ...s.messagesBySession, [sessionId]: messages } };
          },
          false,
          "setAssistantMessageText",
        ),

      setStatus: (sessionId, status) =>
        set(
          (s) => {
            if (s.statusBySession[sessionId] === status) return s;
            return { statusBySession: { ...s.statusBySession, [sessionId]: status } };
          },
          false,
          "setStatus",
        ),

      removeMessage: (sessionId, messageId) =>
        set(
          (s) => ({
            messagesBySession: {
              ...s.messagesBySession,
              [sessionId]: (s.messagesBySession[sessionId] ?? []).filter((m) => m.id !== messageId),
            },
          }),
          false,
          "removeMessage",
        ),

      reset: () => set({ messagesBySession: {}, statusBySession: {} }, false, "reset"),
    }),
    { name: "ChatStore" },
  ),
);
