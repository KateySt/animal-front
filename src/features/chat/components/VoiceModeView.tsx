import { Button, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  VoiceAssistantControlBar,
  type AgentState,
  type TrackReference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import clsx from "clsx";
import { useThemeStore } from "../../../store/theme.store";
import { AgentAudioVisualizerAura } from "./AgentAudioVisualizerAura";
import styles from "./VoiceModeView.module.scss";

const { Text } = Typography;

type VoiceModeViewProps = {
  state: AgentState;
  audioTrack: TrackReference | undefined;
  isError: boolean;
  isMicDenied: boolean;
  onExit: () => void;
};

export const VoiceModeView = ({
  state,
  audioTrack,
  isError,
  isMicDenied,
  onExit,
}: VoiceModeViewProps) => {
  const { t } = useTranslation("chat");
  const isDark = useThemeStore((s) => s.isDark);
  const isInterruptible = state === "speaking";

  const label = isMicDenied
    ? t("voice.micDenied")
    : isError
      ? t("voice.chatError")
      : t(`voice.states.${state}`);

  return (
    <div className={styles.voiceMode} data-lk-theme="default">
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={onExit}
        className={styles.closeButton}
        aria-label={t("voice.exit")}
      />

      <button
        type="button"
        className={clsx(styles.visualizer, isInterruptible && styles.interruptible)}
        disabled={!isInterruptible}
        aria-label="voice visualizer"
      >
        <AgentAudioVisualizerAura
          size="lg"
          state={state}
          audioTrack={audioTrack}
          themeMode={isDark ? "dark" : "light"}
        />
      </button>

      <Text className={styles.stateLabel}>{label}</Text>

      <VoiceAssistantControlBar controls={{ leave: false }} />
    </div>
  );
};
