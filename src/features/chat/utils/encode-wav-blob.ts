import { utils } from "@ricky0123/vad-react";

export const encodeWavBlob = (audio: Float32Array): Blob => {
  const wavBuffer = utils.encodeWAV(audio);
  return new Blob([wavBuffer], { type: "audio/wav" });
};
