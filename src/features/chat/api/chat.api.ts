import type {
  ChatSession,
  ChatSessions,
  ChatSessionWithMessages,
  LiveKitTokenResponse,
} from "../types/chat.types";
import type { ChatDocument, ChatDocuments } from "../types/document.types";
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

  upload: (sessionId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance
      .post<ChatDocument>(`${basePath}/${sessionId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data);
  },

  list: (sessionId: string) =>
    axiosInstance
      .get<ChatDocuments>(`${basePath}/${sessionId}/documents`)
      .then((response) => response.data),

  remove: (sessionId: string, documentId: string) =>
    axiosInstance.delete(`${basePath}/${sessionId}/documents/${documentId}`),
};
