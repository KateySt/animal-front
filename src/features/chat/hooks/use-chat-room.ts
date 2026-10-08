import { useEffect, useRef } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import {
  useChat,
  useLocalParticipant,
  useRoomContext,
  useTranscriptions,
  useVoiceAssistant,
} from "@livekit/components-react";
import { useChatStore } from "../../../store/chat.store.ts";
import type { ChatUIMessage } from "../types/chat.types";
import { useSession } from "./use-sessions";
import { useReplyWatchdog } from "./use-reply-watchdog";
import type { IdleConnection } from "./use-idle-connection";

const ATTR_FINAL = "lk.transcription_final";
const ATTR_SEGMENT_ID = "lk.segment_id";
const AGENT_JOIN_TIMEOUT_MS = 15_000;
// The agent only reads chat input once its session has started, i.e. after "initializing".
const READY_AGENT_STATES = new Set(["listening", "thinking", "speaking"]);

const EMPTY_MESSAGES: ChatUIMessage[] = [];

type PendingMessage = { id: string; text: string; timer: ReturnType<typeof setTimeout> };

export function useChatRoom(sessionId: string, { markActive, wake }: IdleConnection) {
  const { t } = useTranslation("chat");
  const { data: session } = useSession(sessionId);
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const messages = useChatStore((s) => s.messagesBySession[sessionId] ?? EMPTY_MESSAGES);
  const status = useChatStore((s) => s.statusBySession[sessionId] ?? "ready");
  const {
    setMessages: storeSetMessages,
    appendUserMessage,
    setUserMessageText,
    setAssistantMessageText,
    setStatus,
    removeMessage,
  } = useChatStore();

  const transcriptions = useTranscriptions();
  const { send } = useChat();
  const { state: agentState, agent } = useVoiceAssistant();

  useReplyWatchdog(sessionId, status, messages);

  const streamMessageIds = useRef<Map<string, string>>(new Map());
  const userSegmentMessageIds = useRef<Map<string, string>>(new Map());
  const userTurnRef = useRef<{
    messageId: string;
    segments: Map<string, string>;
  } | null>(null);
  const prevAgentStateRef = useRef(agentState);
  const pendingRef = useRef<PendingMessage | null>(null);
  const isAgentReady = !!agent && READY_AGENT_STATES.has(agentState);

  const hydratedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevAgentStateRef.current === "listening" && agentState !== "listening") {
      userTurnRef.current = null;
    }
    prevAgentStateRef.current = agentState;
  }, [agentState]);

  useEffect(() => {
    const hasStoreMessages = useChatStore.getState().messagesBySession[sessionId]?.length;
    if (session && hydratedSessionRef.current !== sessionId && !hasStoreMessages) {
      hydratedSessionRef.current = sessionId;
      storeSetMessages(sessionId, [...session.ui_messages]);
    }
  }, [session, sessionId]);

  useEffect(() => {
    if (transcriptions.length) markActive();
    transcriptions.forEach((stream) => {
      const isLocal = stream.participantInfo.identity === localParticipant.identity;
      const segmentId = stream.streamInfo.attributes?.[ATTR_SEGMENT_ID];
      const streamKey = segmentId ?? stream.streamInfo.id;

      if (isLocal) {
        const knownMessageId = userSegmentMessageIds.current.get(streamKey);
        if (knownMessageId !== undefined) {
          if (userTurnRef.current?.messageId === knownMessageId) {
            const turn = userTurnRef.current;
            turn.segments.set(streamKey, stream.text);
            const text = Array.from(turn.segments.values()).join(" ");
            setUserMessageText(sessionId, knownMessageId, text, false);
          }
          return;
        }

        if (!userTurnRef.current) {
          userTurnRef.current = {
            messageId: crypto.randomUUID(),
            segments: new Map(),
          };
        }
        const turn = userTurnRef.current;
        const isNew = turn.segments.size === 0;
        userSegmentMessageIds.current.set(streamKey, turn.messageId);
        turn.segments.set(streamKey, stream.text);
        const text = Array.from(turn.segments.values()).join(" ");
        setUserMessageText(sessionId, turn.messageId, text, isNew);
        return;
      }

      const isFinal = stream.streamInfo.attributes?.[ATTR_FINAL] === "true";
      let messageId = streamMessageIds.current.get(streamKey);
      const isNew = messageId === undefined;
      if (!messageId) {
        messageId = crypto.randomUUID();
        streamMessageIds.current.set(streamKey, messageId);
      }
      setAssistantMessageText(sessionId, messageId, stream.text, isNew);
      setStatus(sessionId, isFinal ? "ready" : "streaming");
    });
  }, [transcriptions, localParticipant, sessionId]);

  const setMessages = (update: ChatUIMessage[] | ((prev: ChatUIMessage[]) => ChatUIMessage[])) => {
    const prev = useChatStore.getState().messagesBySession[sessionId] ?? [];
    const next = typeof update === "function" ? update(prev) : update;
    storeSetMessages(sessionId, next);
  };

  const failSend = (messageId: string) => {
    removeMessage(sessionId, messageId);
    setStatus(sessionId, "error");
    message.error(t("errors.sendFailed"));
  };

  const deliver = (messageId: string, text: string) => {
    markActive();
    void send(text).catch(() => failSend(messageId));
  };

  const dropPending = (messageId: string) => {
    if (pendingRef.current?.id !== messageId) return;
    clearTimeout(pendingRef.current.timer);
    pendingRef.current = null;
    failSend(messageId);
  };

  useEffect(() => {
    const pending = pendingRef.current;
    if (!isAgentReady || !pending) return;
    clearTimeout(pending.timer);
    pendingRef.current = null;
    deliver(pending.id, pending.text);
  }, [isAgentReady]);

  useEffect(
    () => () => {
      if (pendingRef.current) clearTimeout(pendingRef.current.timer);
    },
    [],
  );

  const sendMessage = ({ text }: { text: string }): boolean => {
    if (pendingRef.current) {
      message.warning(t("errors.agentNotReady"));
      return false;
    }

    const messageId = crypto.randomUUID();
    appendUserMessage(sessionId, {
      id: messageId,
      role: "user",
      parts: [{ type: "text", text }],
    });
    setStatus(sessionId, "submitted");

    if (isAgentReady) {
      deliver(messageId, text);
      return true;
    }

    // Disconnected after idling, or the agent is still joining: hold the message until it is ready.
    const timer = setTimeout(() => dropPending(messageId), AGENT_JOIN_TIMEOUT_MS);
    pendingRef.current = { id: messageId, text, timer };
    wake().catch(() => dropPending(messageId));
    return true;
  };

  return { messages, setMessages, sendMessage, status, room };
}
