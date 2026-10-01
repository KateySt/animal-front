import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useChatRoom } from "../hooks/use-chat-room";
import { useGenerateImage } from "../hooks/use-image-generation";
import { ChatView } from "./ChatView";
import { VoiceModeView } from "./VoiceModeView";
import { useChatStore } from "../../../store/chat.store.ts";
import styles from "./ChatWindow.module.scss";
import { useVoiceAssistant, useConnectionState, useLocalParticipant, RoomAudioRenderer } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

type ChatWindowBodyProps = {
  sessionId: string;
};

export const ChatWindowBody = ({ sessionId }: ChatWindowBodyProps) => {
  const { t } = useTranslation("chat");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { mutateAsync: generateImage, isPending: isGeneratingImage } = useGenerateImage(sessionId);
  const { state, audioTrack } = useVoiceAssistant();
  const connectionState = useConnectionState();
  const { lastMicrophoneError } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);
  const { messages, setMessages, sendMessage, status, room } =
    useChatRoom(sessionId);


  useEffect(() => {
    if (state !== "speaking") setIsMuted(false);
  }, [state]);



  useEffect(() => {
    if (isVoiceMode) {
      void room.localParticipant.setMicrophoneEnabled(true);
    } else {
      void room.localParticipant.setMicrophoneEnabled(false);
    }
  }, [isVoiceMode, room.localParticipant]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleGenerateImage = async (description: string) => {
    const tempUserId = crypto.randomUUID();
    const tempImageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: tempUserId, role: "user", parts: [{ type: "text", text: description }] },
      { id: tempImageId, role: "assistant", parts: [], metadata: { pending: true } },
    ]);

    try {
      const { messages: newMessages } = await generateImage(description);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserId && m.id !== tempImageId),
        ...newMessages,
      ]);
    } catch {
      message.error(t("imageGen.error"));
      setMessages((prev) => prev.filter((m) => m.id !== tempUserId && m.id !== tempImageId));
    }
  };

  return (
    <div className={styles.window}>
      <RoomAudioRenderer muted={isMuted} />
      <div className={styles.header}>
        <Button
          type="text"
          icon={<PhoneOutlined />}
          title={t("voice.enter")}
          onClick={() => setIsVoiceMode(true)}
        />
      </div>

      {isVoiceMode ? (
        <VoiceModeView
          state={state}
          audioTrack={audioTrack}
          isError={connectionState === ConnectionState.Disconnected}
          isMicDenied={!!lastMicrophoneError}
          onExit={() => {
            setIsVoiceMode(false);
            useChatStore.getState().setStatus(sessionId, "ready");
          }}
        />
      ) : (
        <ChatView
          messages={messages}
          isLoading={isLoading}
          isGeneratingImage={isGeneratingImage}
          onSendMessage={(text) => sendMessage({ text })}
          onGenerateImage={handleGenerateImage}
        />
      )}
    </div>
  );
};
