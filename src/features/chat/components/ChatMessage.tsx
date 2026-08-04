import { Avatar, Typography } from "antd";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { type ChatMessage as ChatMessageType, MessageRole } from "../types/chat.types";
import { useDateFormat } from "../../../hooks/use-date-format.ts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTextContent } from "../utils/test-format.ts";
import styles from "./ChatMessage.module.scss";
import clsx from "clsx";

const { Paragraph, Text } = Typography;

type ChatMessageProps = {
  message: ChatMessageType;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { formatDate } = useDateFormat();
  const isUser = message.role === MessageRole.User;

  return (
    <div className={clsx(styles.message, isUser && styles.messageUser)}>
      <Avatar
        size={32}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        className={clsx(styles.avatar, isUser ? styles.avatarUser : styles.avatarAi)}
      />

      <div className={clsx(styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi)}>
        <Paragraph className={clsx(styles.text, isUser ? styles.textUser : styles.textAi)}>
          <Markdown remarkPlugins={[remarkGfm]}>{getTextContent(message.content)}</Markdown>
        </Paragraph>
        <Text
          className={clsx(styles.timestamp, isUser ? styles.timestampUser : styles.timestampAi)}
        >
          {formatDate(message.created_at)}
        </Text>
      </div>
    </div>
  );
};
