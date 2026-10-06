import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatDocuments, DocumentStatusEvent } from "../types/document.types";
import { useWS } from "../../../providers/WSProvider";

export function useDocumentStatusSocket(sessionId: string) {
  const socket = useWS();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !sessionId) return;

    const join = () => socket.emit("join_chat_session", { sessionId });
    // Status events emitted while disconnected are lost, so resync from the API after every reconnect.
    const rejoin = () => {
      join();
      void queryClient.invalidateQueries({ queryKey: ["chat-documents", sessionId] });
    };

    const handleStatus = (data: DocumentStatusEvent) => {
      if (data.type !== "document_status") return;

      queryClient.setQueryData<ChatDocuments>(["chat-documents", sessionId], (old) =>
        old
          ? {
              documents: old.documents.map((doc) =>
                doc.id === data.document_id
                  ? { ...doc, status: data.status, error_message: data.error }
                  : doc,
              ),
            }
          : old,
      );
    };

    if (socket.connected) join();
    socket.on("connect", rejoin);
    socket.on("document_status", handleStatus);

    return () => {
      socket.emit("leave_chat_session", { sessionId });
      socket.off("connect", rejoin);
      socket.off("document_status", handleStatus);
    };
  }, [socket, sessionId, queryClient]);
}
