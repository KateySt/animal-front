import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatStatus } from "ai";
import type { ChatUIMessage } from "../types/chat.types";
import type { VoiceModeState, VoiceErrorKey } from "../types/speech.types";
import { getMessageText } from "../utils/get-message-text";
import { encodeWavBlob } from "../utils/encode-wav-blob";
import { useTranscribe } from "./use-api-speech";
import { useMicVad } from "./use-mic-vad";
import { useTextToSpeech, type TextToSpeechState } from "./use-text-to-speech";
import { useTimeout } from "../../../hooks/use-timeout.ts";

type VoicePhase = Exclude<VoiceModeState, "initializing" | "micDenied">;

type UseVoiceModeParams = {
  messages: ChatUIMessage[];
  status: ChatStatus;
  sendMessage: (message: { text: string }) => void;
};

export function useVoiceMode({ messages, status, sendMessage }: UseVoiceModeParams) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>("listening");
  const [errorKey, setErrorKey] = useState<VoiceErrorKey | null>(null);

  const isActiveRef = useRef(false);
  const spokenIdsRef = useRef(new Set<string>());
  const prevStatusRef = useRef<ChatStatus>(status);
  const prevTtsStateRef = useRef<TextToSpeechState>("idle");

  const tts = useTextToSpeech();
  const { mutateAsync: transcribe } = useTranscribe();

  const handleUtterance = useCallback(
    async (audio: Float32Array) => {
      try {
        const wavBlob = encodeWavBlob(audio);
        const { transcript } = await transcribe({ audioBlob: wavBlob });
        if (!isActiveRef.current) return;
        sendMessage({ text: transcript });
      } catch {
        if (!isActiveRef.current) return;
        setErrorKey("transcribeError");
        setPhase("error");
      }
    },
    [sendMessage, transcribe],
  );

  const vad = useMicVad({
    onSpeechStart: () => {
      if (!isActiveRef.current) return;
      setPhase("userSpeaking");
    },
    onSpeechEnd: (audio: Float32Array) => {
      if (!isActiveRef.current) return;
      setPhase("thinking");
      vad.pause();
      void handleUtterance(audio);
    },
  });

  const {
    loading: vadLoading,
    errored: vadErrored,
    listening: vadListening,
    start: vadStart,
    pause: vadPause,
  } = vad;

  useEffect(() => {
    if (isActive && !vadLoading && !vadErrored && !vadListening && phase === "listening") {
      vadStart();
    }
  }, [isActive, vadLoading, vadErrored, vadListening, phase, vadStart]);

  useEffect(() => {
    const wasBusy = prevStatusRef.current === "submitted" || prevStatusRef.current === "streaming";
    prevStatusRef.current = status;

    if (!isActiveRef.current || phase !== "thinking") return;

    if (status === "error") {
      setErrorKey("chatError");
      setPhase("error");
      return;
    }

    if (status === "ready" && wasBusy) {
      const last = messages[messages.length - 1];
      if (!last || last.role !== "assistant" || spokenIdsRef.current.has(last.id)) return;
      spokenIdsRef.current.add(last.id);

      const text = getMessageText(last);
      if (!text) {
        setPhase("listening");
        return;
      }

      setPhase("assistantSpeaking");
      tts.play(text).catch(() => {
        if (!isActiveRef.current) return;
        setErrorKey("synthesizeError");
        setPhase("error");
      });
    }
  }, [status, messages, phase, tts]);

  useEffect(() => {
    const prevState = prevTtsStateRef.current;
    prevTtsStateRef.current = tts.state;

    if (!isActiveRef.current || phase !== "assistantSpeaking") return;
    if (prevState === "playing" && tts.state === "idle") {
      setPhase("listening");
    }
  }, [tts.state, phase]);

  useTimeout(
    () => {
      setPhase("listening");
      setErrorKey(null);
    },
    phase === "error",
  );

  const enter = useCallback(() => {
    isActiveRef.current = true;
    spokenIdsRef.current = new Set();
    setIsActive(true);
    setErrorKey(null);
    setPhase("listening");
  }, []);

  const exit = useCallback(() => {
    isActiveRef.current = false;
    setIsActive(false);
    vadPause();
    tts.stop();
    setPhase("listening");
    setErrorKey(null);
  }, [tts, vadPause]);

  const interrupt = useCallback(() => {
    if (phase !== "assistantSpeaking") return;
    tts.stop();
    setPhase("listening");
  }, [phase, tts]);

  const state: VoiceModeState = vadErrored ? "micDenied" : vadLoading ? "initializing" : phase;

  return { state, errorKey, enter, exit, interrupt };
}
