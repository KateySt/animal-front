import type { TimeStamp } from "../../../types/base.ts";

export const MessageRole = {
  User: "user",
  Assistant: "assistant",
} as const;

export type MessageRoleType = (typeof MessageRole)[keyof typeof MessageRole];

export type ChatMessage = {
  id: string;
  role: MessageRoleType;
  content: any;
  is_tool: boolean;
} & TimeStamp;

export type ChatSession = {
  id: string;
  title: null | string;
  summary: null | string;
} & TimeStamp;

export type ChatSessions = {
  sessions: ChatSession[];
};

export type ChatSessionWithMessages = {
  messages: ChatMessage[];
} & ChatSession;

export type SendMessage = {
  sessionId: string;
  content: string;
};
