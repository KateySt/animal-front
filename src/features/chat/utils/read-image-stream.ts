import type { EventSourceMessage } from "eventsource-parser/stream";
import type { ChatUIMessage } from "../types/chat.types";
import {
  ImageStreamEvent,
  type ImageDonePayload,
  type ImageErrorPayload,
  type ImagePartial,
  type ImagePartialPayload,
} from "../types/image.types";
import { ImageGenerationError } from "./image-errors";

const toPartial = ({ index, b64, media_type }: ImagePartialPayload): ImagePartial => ({
  index,
  mediaType: media_type,
  dataUrl: `data:${media_type};base64,${b64}`,
});

export const readImageStream = async (
  stream: ReadableStream<EventSourceMessage>,
  onPartial: (partial: ImagePartial) => void,
): Promise<ChatUIMessage[]> => {
  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) throw new ImageGenerationError(null);

      switch (value.event) {
        case ImageStreamEvent.Partial:
          onPartial(toPartial(JSON.parse(value.data) as ImagePartialPayload));
          break;
        case ImageStreamEvent.Done:
          return (JSON.parse(value.data) as ImageDonePayload).messages;
        case ImageStreamEvent.Error:
          throw new ImageGenerationError((JSON.parse(value.data) as ImageErrorPayload).error_code);
      }
    }
  } finally {
    reader.cancel().catch(() => undefined);
  }
};
