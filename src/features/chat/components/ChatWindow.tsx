import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAnimalChat } from "../hooks/use-chat";
import { useSession } from "../hooks/use-sessions";
import { useVoiceMode } from "../hooks/use-voice-mode";
import { useGenerateImage } from "../hooks/use-image-generation";
import { ChatView } from "./ChatView";
import { VoiceModeView } from "./VoiceModeView";
import styles from "./ChatWindow.module.scss";

type ChatWindowProps = {
  sessionId: string;
};

export const ChatWindow = ({ sessionId }: ChatWindowProps) => {
  const { t } = useTranslation("chat");
  const { data: session } = useSession(sessionId);
  const { messages, setMessages, sendMessage, status } = useAnimalChat(sessionId);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { mutateAsync: generateImage, isPending: isGeneratingImage } = useGenerateImage(sessionId);

  const voiceMode = useVoiceMode({ messages, status, sendMessage });

  useEffect(() => {
    if (session?.ui_messages && messages.length === 0) {
      setMessages(session.ui_messages);
    }
  }, [session?.ui_messages, messages.length, setMessages]);

  useEffect(() => {
    if (isVoiceMode) {
      voiceMode.enter();
    } else {
      voiceMode.exit();
    }
  }, [isVoiceMode]);

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
          state={voiceMode.state}
          errorKey={voiceMode.errorKey}
          onExit={() => setIsVoiceMode(false)}
          onInterrupt={voiceMode.interrupt}
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
