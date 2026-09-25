import { useCallback, useEffect, useRef, useState } from "react";
import { useSynthesize } from "./use-api-speech";
import { createAudioResource } from "../utils/audio-resource";

export type TextToSpeechState = "idle" | "loading" | "playing";

export function useTextToSpeech() {
  const { mutateAsync: synthesize, isPending } = useSynthesize();
  const [isPlaying, setIsPlaying] = useState(false);
  const resourceRef = useRef<ReturnType<typeof createAudioResource> | null>(null);

  const cleanup = useCallback(() => {
    resourceRef.current?.dispose();
    resourceRef.current = null;
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setIsPlaying(false);
  }, [cleanup]);

  useEffect(() => cleanup, [cleanup]);

  const play = useCallback(
    async (text: string) => {
      cleanup();
      setIsPlaying(false);

      const audioBlob = await synthesize(text);

      const resource = createAudioResource(audioBlob);
      resourceRef.current = resource;
      resource.onEnded(() => {
        cleanup();
        setIsPlaying(false);
      });
      resource.onError(() => {
        cleanup();
        setIsPlaying(false);
      });

      setIsPlaying(true);
      try {
        await resource.play();
      } catch {
        cleanup();
        setIsPlaying(false);
      }
    },
    [cleanup, synthesize],
  );

  const state: TextToSpeechState = isPending ? "loading" : isPlaying ? "playing" : "idle";

  return { state, play, stop };
}
