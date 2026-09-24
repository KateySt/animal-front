import { useEffect, useState } from "react";
import { Button } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAnimalChat } from "../hooks/use-chat";
import { useSession } from "../hooks/use-sessions";
import { useVoiceMode } from "../hooks/use-voice-mode";
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
          onSendMessage={(text) => sendMessage({ text })}
        />
      )}
    </div>
  );
};
