import { EventSourceParserStream, type EventSourceMessage } from "eventsource-parser/stream";
import { axiosInstance } from "../../../lib/axios.ts";

const basePath = "/v1/image";

export const imageApi = {
  generateStream: (
    sessionId: string,
    description: string,
    signal: AbortSignal,
  ): Promise<ReadableStream<EventSourceMessage>> =>
    axiosInstance
      .post<ReadableStream<Uint8Array<ArrayBuffer>>>(
        `${basePath}/${sessionId}/generate-image`,
        { description },
        { adapter: "fetch", responseType: "stream", signal },
      )
      .then((response) =>
        response.data
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(new EventSourceParserStream()),
      ),
};
