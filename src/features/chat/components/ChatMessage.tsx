import { Avatar, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  RobotOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { ChatUIMessage, ChatUIMessagePart } from "../types/chat.types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ChatMessage.module.scss";
import clsx from "clsx";

const { Paragraph } = Typography;

type ChatMessageProps = {
  message: ChatUIMessage;
};

const ToolStatus = ({ state }: { state: string | undefined }) => {
  const { t } = useTranslation("chat");

  if (state === "output-available") {
    return (
      <div className={clsx(styles.toolStatus, styles.toolStatusDone)}>
        <CheckCircleOutlined /> {t("toolCall.done")}
      </div>
    );
  }
  if (state === "output-error" || state === "output-denied") {
    return (
      <div className={clsx(styles.toolStatus, styles.toolStatusError)}>
        <CloseCircleOutlined /> {t("toolCall.error")}
      </div>
    );
  }
  return (
    <div className={clsx(styles.toolStatus, styles.toolStatusRunning)}>
      <LoadingOutlined spin /> {t("toolCall.running")}
    </div>
  );
};

const renderMessagePart = (part: ChatUIMessagePart, index: number, isUser: boolean) => {
  switch (part.type) {
    case "text":
      return (
        <Paragraph
          key={index}
          className={clsx(styles.text, isUser ? styles.textUser : styles.textAi)}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{part.text}</Markdown>
        </Paragraph>
      );
    default: {
      if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
        const state = "state" in part ? part.state : undefined;
        return <ToolStatus key={index} state={state} />;
      }
      return null;
    }
  }
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={clsx(styles.message, isUser && styles.messageUser)}>
      <Avatar
        size={32}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        className={clsx(styles.avatar, isUser ? styles.avatarUser : styles.avatarAi)}
      />

      <div className={clsx(styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi)}>
        {message.parts.map((part, index) => renderMessagePart(part, index, isUser))}
      </div>
    </div>
  );
};
