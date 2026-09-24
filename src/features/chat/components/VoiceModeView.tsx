import { Button, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { VoiceOrb } from "./VoiceOrb";
import type { VoiceErrorKey, VoiceModeState } from "../types/speech.types";
import styles from "./VoiceModeView.module.scss";

const { Text } = Typography;

type VoiceModeViewProps = {
  state: VoiceModeState;
  errorKey: VoiceErrorKey | null;
  onExit: () => void;
  onInterrupt: () => void;
};

export const VoiceModeView = ({ state, errorKey, onExit, onInterrupt }: VoiceModeViewProps) => {
  const { t } = useTranslation("chat");

  return (
    <div className={styles.voiceMode}>
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={onExit}
        className={styles.closeButton}
        aria-label={t("voice.exit")}
      />

      <VoiceOrb state={state} onClick={onInterrupt} />

      <Text className={styles.stateLabel}>
        {errorKey ? t(`voice.${errorKey}`) : t(`voice.states.${state}`)}
      </Text>
    </div>
  );
};
