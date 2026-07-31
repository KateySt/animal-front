import type {
  ChatSession,
  ChatSessions,
  ChatSessionWithMessages,
  SendMessage,
} from "../types/chat.types";
import { axiosInstance } from "../../../lib/axios.ts";

export const chatApi = {
  createSession: () =>
    axiosInstance.post<ChatSession>("/v1/anthropic-chat").then((response) => response.data),

  getSession: (sessionId: string) =>
    axiosInstance
      .get<ChatSessionWithMessages>(`/v1/anthropic-chat/${sessionId}`)
      .then((response) => response.data),

  getSessions: () =>
    axiosInstance.get<ChatSessions>("/v1/anthropic-chat").then((response) => response.data),

  deleteSession: (sessionId: string) => axiosInstance.delete(`/v1/anthropic-chat/${sessionId}`),

  streamMessage(dto: SendMessage, onChunk: (chunk: string) => void): Promise<void> {
    let received = "";

    return axiosInstance
      .post(
        `/v1/anthropic-chat/${dto.sessionId}/messages`,
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
