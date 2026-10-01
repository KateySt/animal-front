import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_DOCUMENTS_PER_SESSION,
  MAX_DOCUMENT_SIZE_BYTES,
} from "../../../constants";

export function validateDocumentFile(file: File, currentDocumentCount: number): string | null {
  if (
    !file.name.toLowerCase().endsWith(".pdf") ||
    !ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type)
  ) {
    return "document_invalid_type";
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return "document_too_large";
  }
  if (currentDocumentCount >= MAX_DOCUMENTS_PER_SESSION) {
    return "document_limit_reached";
  }
  return null;
}
