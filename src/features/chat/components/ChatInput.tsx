import React, { useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { styleConfig } from "../../../style.config";
import { useThemeStore } from "../../../store/theme.store";

const { TextArea } = Input;

type ChatInputProps = {
  onSend: (content: string) => void;
  isLoading: boolean;
};

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const { t } = useTranslation("chat");
  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        padding: "12px 16px",
        borderTop: `1px solid ${colors.border}`,
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
      }}
    >
      <TextArea
        value={value}
        placeholder={t("input.placeholder")}
        autoSize={{ minRows: 1, maxRows: 5 }}
        disabled={isLoading}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ flex: 1, resize: "none", fontSize: styleConfig.fontSizeBase }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        loading={isLoading}
        disabled={isLoading}
        style={{ flexShrink: 0, height: 32 }}
      >
        {t("input.send")}
      </Button>
    </div>
  );
};
