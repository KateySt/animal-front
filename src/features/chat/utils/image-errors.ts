import axios from "axios";
import { ImageErrorKey, type ImageErrorKeyType } from "../types/image.types";

const PROMPT_REJECTED = "image_prompt_rejected";

type ApiError = { detail?: string; error_code?: string };

export class ImageGenerationError extends Error {
  readonly errorCode: string | null;

  constructor(errorCode: string | null) {
    super(errorCode ?? "image_stream_incomplete");
    this.name = "ImageGenerationError";
    this.errorCode = errorCode;
  }
}

const isAbortError = (error: unknown) =>
  axios.isCancel(error) || (error instanceof DOMException && error.name === "AbortError");

const readErrorCode = async (error: unknown): Promise<string | null> => {
  if (error instanceof ImageGenerationError) return error.errorCode;
  const body: unknown = axios.isAxiosError(error) ? error.response?.data : undefined;
  if (!(body instanceof ReadableStream)) return null;
  try {
    const data = (await new Response(body).json()) as ApiError;
    return data.error_code ?? null;
  } catch {
    return null;
  }
};

export const toImageErrorKey = async (error: unknown): Promise<ImageErrorKeyType | null> => {
  if (isAbortError(error)) return null;
  const code = await readErrorCode(error);
  return code === PROMPT_REJECTED ? ImageErrorKey.Rejected : ImageErrorKey.Failed;
};
