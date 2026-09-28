import type { ChatUIMessage } from "../types/chat.types";
import { axiosInstance } from "../../../lib/axios.ts";

const basePath = "/v1/image";

export const imageApi = {
  generate: (sessionId: string, description: string) =>
    axiosInstance
      .post<{ messages: ChatUIMessage[] }>(`${basePath}/${sessionId}/generate-image`, {
        description,
      })
      .then((response) => response.data),
};
