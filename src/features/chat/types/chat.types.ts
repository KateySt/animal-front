import type { UIMessage } from "ai";
import type { TimeStamp } from "../../../types/base.ts";

export type ChatUIMessage = UIMessage;

export type ChatUIMessagePart = ChatUIMessage["parts"][number];

export type ChatSession = {
  id: string;
  title: null | string;
  summary: null | string;
} & TimeStamp;

export type ChatSessions = {
  sessions: ChatSession[];
};

export type ChatSessionWithMessages = {
  ui_messages: ChatUIMessage[];
} & ChatSession;
