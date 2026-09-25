import React, { useState } from "react";
import { Button, Input } from "antd";
import { PictureOutlined, SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./ChatInput.module.scss";
import { MAX_MESSAGE_LENGTH } from "../../../constants";

const { TextArea } = Input;

type ChatInputProps = {
  onSend: (content: string) => void;
  onGenerateImage: (description: string) => void;
  isLoading: boolean;
  isGeneratingImage: boolean;
};

export const ChatInput = ({
  onSend,
  onGenerateImage,
  isLoading,
  isGeneratingImage,
}: ChatInputProps) => {
  const { t } = useTranslation("chat");
  const [value, setValue] = useState("");

  const isBusy = isLoading || isGeneratingImage;

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isBusy) return;
    onSend(trimmed);
    setValue("");
  };

  const handleGenerateImage = () => {
    const trimmed = value.trim();
    if (!trimmed || isBusy) return;
    onGenerateImage(trimmed);
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
          disabled={isBusy}
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
          <div className={styles.buttons}>
            <Button
              icon={<PictureOutlined />}
              onClick={handleGenerateImage}
              loading={isGeneratingImage}
              disabled={isBusy || !value.trim()}
              title={t("input.generateImage")}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={isLoading}
              disabled={isBusy || !value.trim()}
              className={styles.sendBtn}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
