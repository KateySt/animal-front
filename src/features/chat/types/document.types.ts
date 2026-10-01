import type { TimeStamp } from "../../../types/base.ts";

export const DocumentStatus = {
  Uploading: "uploading",
  Embedding: "embedding",
  Ready: "ready",
  Failed: "failed",
} as const;
export type DocumentStatusType = (typeof DocumentStatus)[keyof typeof DocumentStatus];

export type ChatDocument = {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  status: DocumentStatusType;
  error_message: string | null;
} & TimeStamp;

export type ChatDocuments = {
  documents: ChatDocument[];
};

export type DocumentStatusEvent = {
  type: "document_status";
  document_id: string;
  filename: string;
  status: DocumentStatusType;
  error: string | null;
};
