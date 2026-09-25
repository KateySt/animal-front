import { useMutation } from "@tanstack/react-query";
import { imageApi } from "../api/image.api";

export function useGenerateImage(sessionId: string) {
  return useMutation({
    mutationFn: (description: string) => imageApi.generate(sessionId, description),
  });
}
