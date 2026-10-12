import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, message } from "antd";
import { ArrowLeftOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../../hooks/use-media-query.ts";
import { Routes } from "../../../routes";
import { useChatRoom } from "../hooks/use-chat-room";
import type { IdleConnection } from "../hooks/use-idle-connection";
import { useGenerateImage } from "../hooks/use-image-generation";
import type { ImagePartial } from "../types/image.types";
import { toImageErrorKey } from "../utils/image-errors";
import { preloadImage } from "../utils/preload-image";
import { ChatView } from "./ChatView";
import { VoiceModeView } from "./VoiceModeView";
import { useChatStore } from "../../../store/chat.store.ts";
import styles from "./ChatWindow.module.scss";
import {
  useVoiceAssistant,
  useConnectionState,
  useLocalParticipant,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

type ChatWindowBodyProps = {
  sessionId: string;
  idle: IdleConnection;
};

export const ChatWindowBody = ({ sessionId, idle }: ChatWindowBodyProps) => {
  const { setPaused, wake } = idle;
  const { t } = useTranslation("chat");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { mutateAsync: generateImage, isPending: isGeneratingImage } = useGenerateImage(sessionId);
  const { state, audioTrack } = useVoiceAssistant();
  const connectionState = useConnectionState();
  const { lastMicrophoneError } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);
  const { messages, setMessages, sendMessage, status, room } = useChatRoom(sessionId, idle);

  useEffect(() => {
    if (state !== "speaking") setIsMuted(false);
  }, [state]);

  useEffect(() => {
    if (connectionState !== ConnectionState.Connected) return;
    void room.localParticipant.setMicrophoneEnabled(isVoiceMode);
  }, [isVoiceMode, connectionState, room.localParticipant]);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    setPaused(isVoiceMode || isLoading);
  }, [isVoiceMode, isLoading, setPaused]);

  const enterVoiceMode = () => {
    setIsVoiceMode(true);
    wake().catch(() => message.error(t("errors.sendFailed")));
  };

  const handleGenerateImage = async (description: string) => {
    const tempUserId = crypto.randomUUID();
    const tempImageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: tempUserId, role: "user", parts: [{ type: "text", text: description }] },
      { id: tempImageId, role: "assistant", parts: [], metadata: { pending: true } },
    ]);

    const showPartial = ({ mediaType, dataUrl }: ImagePartial) =>
      setMessages((prev) =>
        prev.map((chatMessage) =>
          chatMessage.id === tempImageId
            ? { ...chatMessage, parts: [{ type: "file", mediaType, url: dataUrl, filename: null }] }
            : chatMessage,
        ),
      );

    try {
      const newMessages = await generateImage({ description, onPartial: showPartial });
      await Promise.all(
        newMessages
          .flatMap((m) => m.parts)
          .flatMap((part) => (part.type === "file" ? [preloadImage(part.url)] : [])),
      );
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserId && m.id !== tempImageId),
        ...newMessages,
      ]);
    } catch (error) {
      const errorKey = await toImageErrorKey(error);
      if (errorKey) message.error(t(errorKey));
      setMessages((prev) => prev.filter((m) => m.id !== tempUserId && m.id !== tempImageId));
    }
  };

  return (
    <div className={styles.window}>
      <RoomAudioRenderer muted={isMuted} />
      <div className={styles.header}>
        {isMobile && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(Routes.Chat)}
            aria-label={t("window.back")}
            className={styles.backBtn}
          />
        )}
        <Button
          type="text"
          icon={<PhoneOutlined />}
          title={t("voice.enter")}
          onClick={enterVoiceMode}
        />
      </div>

      {isVoiceMode ? (
        <VoiceModeView
          state={state}
          audioTrack={audioTrack}
          isError={idle.shouldConnect && connectionState === ConnectionState.Disconnected}
          isMicDenied={!!lastMicrophoneError}
          onExit={() => {
            setIsVoiceMode(false);
            useChatStore.getState().setStatus(sessionId, "ready");
          }}
        />
      ) : (
        <ChatView
          sessionId={sessionId}
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
