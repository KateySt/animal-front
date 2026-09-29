import type {
  ChatSession,
  ChatSessions,
  ChatSessionWithMessages,
  LiveKitTokenResponse,
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

  getToken: (sessionId: string) =>
    axiosInstance
      .post<LiveKitTokenResponse>(`${basePath}/${sessionId}/token`)
      .then((response) => response.data),
};
