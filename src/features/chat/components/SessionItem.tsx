import type { ChatSession } from "../types/chat.types.ts";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Tooltip, Typography } from "antd";
import styles from "./SessionItem.module.scss";
import clsx from "clsx";

const { Text } = Typography;

type SessionItemProps = {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

const SessionItem = ({ session, isActive, onSelect, onDelete }: SessionItemProps) => {
  const { t } = useTranslation("chat");

  return (
    <div
      onClick={() => onSelect(session.id)}
      className={clsx(styles.item, isActive && styles.itemActive)}
    >
      <MessageOutlined className={clsx(styles.icon, isActive && styles.iconActive)} />
      <Text ellipsis className={clsx(styles.title, isActive && styles.titleActive)}>
        {session.title || t("sidebar.newChat")}
      </Text>
      <Tooltip title={t("sidebar.delete")}>
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(session.id);
          }}
          className={styles.deleteBtn}
        />
      </Tooltip>
    </div>
  );
};

export default SessionItem;
