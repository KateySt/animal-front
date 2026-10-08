import { useCallback } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { useLiveKitToken } from "../hooks/use-sessions";
import { useIdleConnection } from "../hooks/use-idle-connection";
import { useChatStore } from "../../../store/chat.store.ts";
import { ChatWindowBody } from "./ChatWindowBody";
import styles from "./ChatWindow.module.scss";

type ChatWindowProps = {
  sessionId: string;
};

export const ChatWindow = ({ sessionId }: ChatWindowProps) => {
  const { data: token, refetch } = useLiveKitToken(sessionId);
  const fetchToken = useCallback(async () => {
    const result = await refetch();
    if (result.isError) throw result.error;
  }, [refetch]);
  const idle = useIdleConnection(fetchToken);

  return (
    <LiveKitRoom
      key={sessionId}
      className={styles.roomWrapper}
      serverUrl={token?.url}
      token={token?.token}
      connect={!!token && idle.shouldConnect}
      onError={() => useChatStore.getState().setStatus(sessionId, "error")}
    >
      <ChatWindowBody sessionId={sessionId} idle={idle} />
    </LiveKitRoom>
  );
};
