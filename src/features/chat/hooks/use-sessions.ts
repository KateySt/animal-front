import { chatApi } from "../api/chat.api";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatSessions } from "../types/chat.types";

export const sessionsQueryOptions = queryOptions({
  queryKey: ["sessions"],
  queryFn: () => chatApi.getSessions(),
});

export const useSessions = () => {
  return useQuery(sessionsQueryOptions);
};

export const useSession = (sessionId: string) => {
  return useQuery(
    queryOptions({
      queryKey: ["session", sessionId],
      queryFn: () => chatApi.getSession(sessionId),
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
    }),
  );
};

export const useLiveKitToken = (sessionId: string) => {
  return useQuery(
    queryOptions({
      queryKey: ["livekit-token", sessionId],
      queryFn: () => chatApi.getToken(sessionId),
      enabled: !!sessionId,
      staleTime: Infinity,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
  );
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatApi.createSession(),
    onSuccess: (session) => {
      queryClient.setQueryData<ChatSessions>(["sessions"], (old) => ({
        sessions: [session, ...(old?.sessions ?? [])],
      }));
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => chatApi.deleteSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.setQueryData<ChatSessions>(["sessions"], (old) => ({
        sessions: (old?.sessions ?? []).filter((s) => s.id !== sessionId),
      }));
    },
  });
};
