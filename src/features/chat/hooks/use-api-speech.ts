import { useMutation } from "@tanstack/react-query";
import { speechApi } from "../api/speech.api";

export function useSynthesize() {
  return useMutation({
    mutationFn: (text: string) => speechApi.synthesize(text),
  });
}

export function useTranscribe() {
  return useMutation({
    mutationFn: ({ audioBlob, filename = "speech.wav" }: { audioBlob: Blob; filename?: string }) =>
      speechApi.transcribe(audioBlob, filename),
  });
}
