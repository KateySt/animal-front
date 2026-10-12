import { Image } from "antd";
import clsx from "clsx";
import styles from "./ChatMessage.module.scss";

const IMAGE_SIZE = 280;

type ChatImageProps = {
  url: string;
  filename?: string | null;
  isPending?: boolean;
};

export const ChatImage = ({ url, filename, isPending = false }: ChatImageProps) => (
  <Image
    src={url}
    alt={filename ?? "Generated image"}
    width={IMAGE_SIZE}
    height={IMAGE_SIZE}
    preview={!isPending}
    className={clsx(styles.image, isPending && styles.imagePending)}
  />
);
