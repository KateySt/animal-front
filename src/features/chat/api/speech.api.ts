import type { TranscribeResponse } from "../types/speech.types";
import { axiosInstance } from "../../../lib/axios.ts";

const basePath = "/v1/speech";

export const speechApi = {
  transcribe: (audioBlob: Blob, filename: string) => {
    const formData = new FormData();
    formData.append("file", audioBlob, filename);
    return axiosInstance
      .post<TranscribeResponse>(`${basePath}/transcribe`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data);
  },

  synthesize: (text: string) =>
    axiosInstance
      .post(`${basePath}/synthesize`, { text }, { responseType: "blob" })
      .then((response) => response.data as Blob),
};
