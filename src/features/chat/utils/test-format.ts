type ContentBlock = { type: string; text?: string; name?: string };

export const getTextContent = (content: string | ContentBlock[]): string => {
  if (typeof content === "string") return content;
  return content
    .filter((block) => ["text", "tool_use"].includes(block.type))
    .map((block) => block?.text || block?.name)
    .join("\n");
};
