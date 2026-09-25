import { Image } from "antd";

type ChatImageProps = {
  url: string;
  filename?: string | null;
};

export const ChatImage = ({ url, filename }: ChatImageProps) => (
  <Image src={url} alt={filename ?? "Generated image"} width={280} />
);
