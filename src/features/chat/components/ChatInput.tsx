import React, { useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./ChatInput.module.scss";
import { MAX_MESSAGE_LENGTH } from "../../../constants";

const { TextArea } = Input;

type ChatInputProps = {
  onSend: (content: string) => void;
  isLoading: boolean;
};

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const { t } = useTranslation("chat");
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
    <div className={styles.inputBar}>
      <div className={styles.composer}>
        <TextArea
          value={value}
          placeholder={t("input.placeholder")}
          autoSize={{ minRows: 1, maxRows: 8 }}
          disabled={isLoading}
          maxLength={MAX_MESSAGE_LENGTH}
          variant="borderless"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.textarea}
        />
        <div className={styles.footer}>
          <span className={styles.count}>
            {value.length} / {MAX_MESSAGE_LENGTH}
          </span>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={isLoading || !value.trim()}
            className={styles.sendBtn}
          />
        </div>
      </div>
    </div>
  );
};
