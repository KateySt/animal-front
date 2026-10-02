import type { TimeStamp } from "../../../types/base.ts";

export type ChatUIMessagePart =
  | { type: "text"; text: string }
  | {
      type: `tool-${string}`;
      toolCallId: string;
      state: "input-available" | "output-available";
      input: unknown;
      output?: unknown;
    }
  | { type: "dynamic-tool"; toolCallId: string; state: string; input?: unknown; output?: unknown }
  | { type: "file"; mediaType: string; url: string; filename: string | null };

export type ChatUIMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  metadata?: { pending?: boolean };
  parts: ChatUIMessagePart[];
};

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

export type LiveKitTokenResponse = {
  url: string;
  token: string;
  room_name: string;
};
