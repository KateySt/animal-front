import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat.api";
import { validateDocumentFile } from "../utils/validate-document-file";
import { DocumentStatus, type ChatDocuments } from "../types/document.types";

export const chatDocumentsQueryOptions = (sessionId: string) =>
  queryOptions({
    queryKey: ["chat-documents", sessionId],
    queryFn: () => chatApi.list(sessionId),
    enabled: !!sessionId,
  });

export function useChatDocuments(sessionId: string) {
  const query = useQuery(chatDocumentsQueryOptions(sessionId));
  const documents = query.data?.documents ?? [];
  const isEmbedding = documents.some(
    (doc) => doc.status === DocumentStatus.Uploading || doc.status === DocumentStatus.Embedding,
  );

  return { ...query, documents, isEmbedding };
}

export function useUploadDocument(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      const documents = queryClient.getQueryData<ChatDocuments>(["chat-documents", sessionId]);
      const validationError = validateDocumentFile(file, documents?.documents.length ?? 0);
      if (validationError) {
        return Promise.reject(validationError);
      }
      return chatApi.upload(sessionId, file);
    },
    onSuccess: (document) => {
      queryClient.setQueryData<ChatDocuments>(["chat-documents", sessionId], (old) => ({
        documents: [...(old?.documents ?? []), document],
      }));
    },
  });
}

export function useDeleteDocument(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => chatApi.remove(sessionId, documentId),
    onSuccess: (_, documentId) => {
      queryClient.setQueryData<ChatDocuments>(["chat-documents", sessionId], (old) => ({
        documents: (old?.documents ?? []).filter((doc) => doc.id !== documentId),
      }));
    },
  });
}
