export type AudioResource = {
  play: () => Promise<void>;
  onEnded: (callback: () => void) => void;
  onError: (callback: () => void) => void;
  dispose: () => void;
};

export const createAudioResource = (blob: Blob): AudioResource => {
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);

  return {
    play: () => audio.play(),
    onEnded: (callback) => {
      audio.onended = callback;
    },
    onError: (callback) => {
      audio.onerror = callback;
    },
    dispose: () => {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      URL.revokeObjectURL(objectUrl);
    },
  };
};
