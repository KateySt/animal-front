import type {
  ChatSession,
  ChatSessions,
  ChatSessionWithMessages,
  SendMessage,
} from "../types/chat.types";
import { axiosInstance } from "../../../lib/axios.ts";

const basePath = "/v1/anthropic-chat";

export const chatApi = {
  createSession: () => axiosInstance.post<ChatSession>(basePath).then((response) => response.data),

  getSession: (sessionId: string) =>
    axiosInstance
      .get<ChatSessionWithMessages>(`${basePath}/${sessionId}`)
      .then((response) => response.data),

  getSessions: () => axiosInstance.get<ChatSessions>(basePath).then((response) => response.data),

  deleteSession: (sessionId: string) => axiosInstance.delete(`${basePath}/${sessionId}`),

  streamMessage(dto: SendMessage, onChunk: (chunk: string) => void): Promise<void> {
    let received = "";

    return axiosInstance
      .post(
        `${basePath}/${dto.sessionId}/messages`,
        { content: dto.content },
        {
          responseType: "text",
          onDownloadProgress: (event) => {
            const raw = event.event?.target?.responseText ?? "";
            const newChunk = raw.slice(received.length);
            received = raw;
            if (newChunk) onChunk(newChunk);
          },
        },
      )
      .then(() => undefined);
  },
};
