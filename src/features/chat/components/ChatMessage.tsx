import { Avatar, Typography } from "antd";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { palette, styleConfig } from "../../../style.config";
import { useThemeStore } from "../../../store/theme.store";
import { type ChatMessage as ChatMessageType, MessageRole } from "../types/chat.types";
import { useDateFormat } from "../../../hooks/use-date-format.ts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTextContent } from "../utils/test-format.ts";

const { Text, Paragraph } = Typography;

type ChatMessageProps = {
  message: ChatMessageType;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  const { formatDate } = useDateFormat();

  const isUser = message.role === MessageRole.User;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 10,
        alignItems: "flex-start",
        maxWidth: "100%",
      }}
    >
      <Avatar
        size={32}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        style={{
          flexShrink: 0,
          background: isUser
            ? palette.accent
            : isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.08)",
        }}
      />

      <div
        style={{
          maxWidth: "72%",
          padding: "10px 14px",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          background: isUser
            ? `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)`
            : isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
          border: isUser ? "none" : `1px solid ${colors.border}`,
        }}
      >
        <Paragraph
          style={{
            margin: 0,
            color: isUser ? "rgba(255,255,255,0.95)" : colors.textPrimary,
            fontSize: styleConfig.fontSizeBase,
            lineHeight: styleConfig.lineHeight,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{getTextContent(message.content)}</Markdown>
        </Paragraph>
        <Text
          style={{
            fontSize: 10,
            color: isUser ? "rgba(255,255,255,0.5)" : colors.textMuted,
            display: "block",
            marginTop: 4,
            textAlign: isUser ? "left" : "right",
          }}
        >
          {formatDate(message.created_at)}
        </Text>
      </div>
    </div>
  );
};
