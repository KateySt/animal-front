import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatMessage } from "../features/chat/types/chat.types";

type MessagesBySession = Record<string, ChatMessage[]>;

type ChatState = {
  activeSessionId: string | null;
  messagesBySession: MessagesBySession;

  setActiveSession: (id: string) => void;
  setSessionMessages: (sessionId: string, messages: ChatMessage[]) => void;
  appendMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessageContent: (sessionId: string, messageId: string, chunk: string) => void;
  removeMessages: (sessionId: string, messageIds: string[]) => void;
  clearSessionMessages: (sessionId: string) => void;
  clearAll: () => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        activeSessionId: null,
        messagesBySession: {},

        setActiveSession: (id) => set({ activeSessionId: id }, false, "setActiveSession"),

        setSessionMessages: (sessionId, messages) =>
          set(
            (s) => ({
              messagesBySession: {
                ...s.messagesBySession,
                [sessionId]: messages,
              },
            }),
            false,
            "setSessionMessages",
          ),

        appendMessage: (sessionId, message) =>
          set(
            (s) => ({
              messagesBySession: {
                ...s.messagesBySession,
                [sessionId]: [...(s.messagesBySession[sessionId] ?? []), message],
              },
            }),
            false,
            "appendMessage",
          ),

        updateMessageContent: (sessionId, messageId, chunk) =>
          set(
            (s) => ({
              messagesBySession: {
                ...s.messagesBySession,
                [sessionId]: (s.messagesBySession[sessionId] ?? []).map((m) =>
                  m.id === messageId ? { ...m, content: m.content + chunk } : m,
                ),
              },
            }),
            false,
            "updateMessageContent",
          ),

        removeMessages: (sessionId, messageIds) =>
          set(
            (s) => ({
              messagesBySession: {
                ...s.messagesBySession,
                [sessionId]: (s.messagesBySession[sessionId] ?? []).filter(
                  (m) => !messageIds.includes(m.id),
                ),
              },
            }),
            false,
            "removeMessages",
          ),

        clearSessionMessages: (sessionId) =>
          set(
            (s) => {
              const { [sessionId]: _, ...rest } = s.messagesBySession;
              return { messagesBySession: rest };
            },
            false,
            "clearSessionMessages",
          ),

        clearAll: () => set({ activeSessionId: null, messagesBySession: {} }, false, "clearAll"),
      }),
      {
        name: "chat",
        partialize: (state) => ({
          activeSessionId: state.activeSessionId,
        }),
      },
    ),
    { name: "ChatStore" },
  ),
);
