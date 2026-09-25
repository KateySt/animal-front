import type { ChatUIMessage } from "../types/chat.types";

export const getMessageText = (message: ChatUIMessage): string =>
  message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
