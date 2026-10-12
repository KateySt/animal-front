import prettyBytes from "pretty-bytes";

export const formatBytes = (bytes: number): string => {
  return prettyBytes(bytes, { binary: true });
};
