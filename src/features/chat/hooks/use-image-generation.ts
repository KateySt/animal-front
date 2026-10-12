import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { imageApi } from "../api/image.api";
import type { ImagePartial } from "../types/image.types";
import { readImageStream } from "../utils/read-image-stream";

type GenerateImageVariables = {
  description: string;
  onPartial: (partial: ImagePartial) => void;
};

export const useGenerateImage = (sessionId: string) => {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), [sessionId]);

  return useMutation({
    mutationFn: async ({ description, onPartial }: GenerateImageVariables) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const stream = await imageApi.generateStream(sessionId, description, controller.signal);
      return readImageStream(stream, onPartial);
    },
  });
};
