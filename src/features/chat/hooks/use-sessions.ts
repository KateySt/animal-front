import { useChatStore } from "../../../store/chat.store";
import { chatApi } from "../api/chat.api";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatSessions } from "../types/chat.types";

export const sessionsQueryOptions = queryOptions({
  queryKey: ["sessions"],
  queryFn: () => chatApi.getSessions(),
});

export function useSessions() {
  return useQuery(sessionsQueryOptions);
}

export function useSession(sessionId: string) {
  return useQuery(
    queryOptions({
      queryKey: ["session", sessionId],
      queryFn: () => chatApi.getSession(sessionId),
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
    }),
  );
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const { setActiveSession } = useChatStore();

  return useMutation({
    mutationFn: () => chatApi.createSession(),
    onSuccess: (session) => {
      queryClient.setQueryData<ChatSessions>(["sessions"], (old) => ({
        sessions: [session, ...(old?.sessions ?? [])],
      }));
      setActiveSession(session.id);
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { clearSessionMessages } = useChatStore();

  return useMutation({
    mutationFn: (sessionId: string) => chatApi.deleteSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.setQueryData<ChatSessions>(["sessions"], (old) => ({
        sessions: (old?.sessions ?? []).filter((s) => s.id !== sessionId),
      }));
      clearSessionMessages(sessionId);
    },
  });
}
