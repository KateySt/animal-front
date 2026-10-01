import { useEffect, useRef } from "react";
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

const ATTR_FINAL = "lk.transcription_final";
const ATTR_SEGMENT_ID = "lk.segment_id";

const EMPTY_MESSAGES: ChatUIMessage[] = [];

export function useChatRoom(sessionId: string) {
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
  } = useChatStore();

  const transcriptions = useTranscriptions();
  const { send } = useChat();
  const { state: agentState } = useVoiceAssistant();

  const streamMessageIds = useRef<Map<string, string>>(new Map());
  const userSegmentMessageIds = useRef<Map<string, string>>(new Map());
  const userTurnRef = useRef<{
    messageId: string;
    segments: Map<string, string>;
  } | null>(null);
  const prevAgentStateRef = useRef(agentState);

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

  const sendMessage = ({ text }: { text: string }) => {
    appendUserMessage(sessionId, {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text }],
    });
    setStatus(sessionId, "submitted");
    void send(text).catch(() => setStatus(sessionId, "error"));
  };

  return { messages, setMessages, sendMessage, status, room };
}
