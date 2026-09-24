import { motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import type { VoiceModeState } from "../types/speech.types";
import styles from "./VoiceOrb.module.scss";

type VoiceOrbProps = {
  state: VoiceModeState;
  onClick?: () => void;
};

const STATE_CLASS: Record<VoiceModeState, string> = {
  initializing: styles.orbNeutral,
  micDenied: styles.orbError,
  error: styles.orbError,
  listening: styles.orbListening,
  userSpeaking: styles.orbUserSpeaking,
  thinking: styles.orbThinking,
  assistantSpeaking: styles.orbAssistantSpeaking,
};

const PULSE_RINGS: Partial<
  Record<VoiceModeState, { scale: number[]; opacity: number[]; duration: number }>
> = {
  listening: { scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5], duration: 2.6 },
  userSpeaking: { scale: [1, 1.3, 1], opacity: [0.6, 0.1, 0.6], duration: 0.9 },
  assistantSpeaking: { scale: [1, 1.2, 1], opacity: [0.6, 0.2, 0.6], duration: 1.1 },
};

export const VoiceOrb = ({ state, onClick }: VoiceOrbProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isInterruptible = state === "assistantSpeaking";
  const pulse = PULSE_RINGS[state];

  return (
    <button
      type="button"
      className={clsx(styles.orb, STATE_CLASS[state])}
      onClick={isInterruptible ? onClick : undefined}
      disabled={!isInterruptible}
      aria-label="voice orb"
    >
      {!prefersReducedMotion && state === "thinking" && (
        <motion.span
          className={clsx(styles.ring, styles.ringDashed)}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      )}
      {!prefersReducedMotion && pulse && (
        <>
          <motion.span
            className={styles.ring}
            animate={{ scale: pulse.scale, opacity: pulse.opacity }}
            transition={{ duration: pulse.duration, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className={styles.ring}
            animate={{ scale: pulse.scale, opacity: pulse.opacity }}
            transition={{
              duration: pulse.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pulse.duration / 3,
            }}
          />
        </>
      )}
      <span className={styles.core} />
    </button>
  );
};
