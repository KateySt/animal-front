import { useEffect } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useChatStore, type ChatStatus } from "../../../store/chat.store.ts";
import type { ChatUIMessage } from "../types/chat.types";

const FIRST_TOKEN_TIMEOUT_MS = 60_000;
const STREAM_IDLE_TIMEOUT_MS = 20_000;

const isBusy = (status: ChatStatus) => status === "submitted" || status === "streaming";

export function useReplyWatchdog(sessionId: string, status: ChatStatus, messages: ChatUIMessage[]) {
  const { t } = useTranslation("chat");
  const setStatus = useChatStore((s) => s.setStatus);

  useEffect(
    () => () => {
      if (isBusy(useChatStore.getState().getStatus(sessionId))) setStatus(sessionId, "ready");
    },
    [sessionId, setStatus],
  );

  useEffect(() => {
    if (!isBusy(status)) return;

    const isWaitingFirstToken = status === "submitted";
    const timer = setTimeout(
      () => {
        if (isWaitingFirstToken) {
          setStatus(sessionId, "error");
          message.error(t("errors.replyTimeout"));
        } else {
          setStatus(sessionId, "ready");
        }
      },
      isWaitingFirstToken ? FIRST_TOKEN_TIMEOUT_MS : STREAM_IDLE_TIMEOUT_MS,
    );
    return () => clearTimeout(timer);
  }, [sessionId, status, messages, setStatus, t]);
}
