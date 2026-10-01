import { LiveKitRoom } from "@livekit/components-react";
import { useLiveKitToken } from "../hooks/use-sessions";
import { useChatStore } from "../../../store/chat.store.ts";
import { ChatWindowBody } from "./ChatWindowBody";
import styles from "./ChatWindow.module.scss";

type ChatWindowProps = {
  sessionId: string;
};

export const ChatWindow = ({ sessionId }: ChatWindowProps) => {
  const { data: token } = useLiveKitToken(sessionId);

  return (
    <LiveKitRoom
      key={sessionId}
      className={styles.roomWrapper}
      serverUrl={token?.url}
      token={token?.token}
      connect={!!token}
      onError={() => useChatStore.getState().setStatus(sessionId, "error")}
    >
      <ChatWindowBody sessionId={sessionId} />
    </LiveKitRoom>
  );
};
