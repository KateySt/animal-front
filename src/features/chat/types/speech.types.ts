export type TranscribeResponse = {
  transcript: string;
};

type VoicePhase = "listening" | "userSpeaking" | "thinking" | "assistantSpeaking" | "error";

export type VoiceModeState = "initializing" | "micDenied" | VoicePhase;

export type VoiceErrorKey = "transcribeError" | "synthesizeError" | "chatError";
