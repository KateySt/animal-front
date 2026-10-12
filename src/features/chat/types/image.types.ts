import type { ChatUIMessage } from "./chat.types";

export const ImageStreamEvent = {
  Partial: "partial",
  Done: "done",
  Error: "error",
} as const;

export type ImagePartial = { index: number; dataUrl: string; mediaType: string };

export type ImagePartialPayload = { index: number; b64: string; media_type: string };
export type ImageDonePayload = { messages: ChatUIMessage[] };
export type ImageErrorPayload = { detail: string; error_code: string | null };

export const ImageErrorKey = {
  Rejected: "imageGen.rejected",
  Failed: "imageGen.error",
} as const;
export type ImageErrorKeyType = (typeof ImageErrorKey)[keyof typeof ImageErrorKey];
