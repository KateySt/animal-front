import { useCallback, useEffect, useRef } from "react";
import { useMicVAD } from "@ricky0123/vad-react";

const ONNX_WASM_BASE_PATH = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/";
const VAD_BASE_ASSET_PATH = "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.27/dist/";

type UseMicVadParams = {
  onSpeechStart: () => void;
  onSpeechEnd: (audio: Float32Array) => void;
};

export function useMicVad({ onSpeechStart, onSpeechEnd }: UseMicVadParams) {
  const vad = useMicVAD({
    onnxWASMBasePath: ONNX_WASM_BASE_PATH,
    baseAssetPath: VAD_BASE_ASSET_PATH,
    onSpeechStart,
    onSpeechEnd,
  });

  const controlsRef = useRef({ start: vad.start, pause: vad.pause });

  useEffect(() => {
    controlsRef.current = { start: vad.start, pause: vad.pause };
  });

  const start = useCallback(() => {
    void controlsRef.current.start();
  }, []);

  const pause = useCallback(() => {
    void controlsRef.current.pause();
  }, []);

  return {
    loading: vad.loading,
    errored: vad.errored,
    listening: vad.listening,
    start,
    pause,
  };
}
