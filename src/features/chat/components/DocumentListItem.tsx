import { useTranslation } from "react-i18next";
import { Button, Tooltip, Typography } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { DocumentStatus, type ChatDocument } from "../types/document.types";
import { formatBytes } from "../utils/format-bytes";
import styles from "./DocumentListItem.module.scss";

const { Text } = Typography;

type DocumentListItemProps = {
  document: ChatDocument;
  onDelete: (documentId: string) => void;
  isDeleting: boolean;
};

const StatusIcon = ({ document }: { document: ChatDocument }) => {
  const { t } = useTranslation("chat");

  if (document.status === DocumentStatus.Ready) {
    return <CheckCircleOutlined className={styles.statusReady} />;
  }
  if (document.status === DocumentStatus.Failed) {
    return (
      <Tooltip title={document.error_message ?? t("documents.status.failed")}>
        <ExclamationCircleOutlined className={styles.statusFailed} />
      </Tooltip>
    );
  }
  return <LoadingOutlined className={styles.statusPending} />;
};

export const DocumentListItem = ({ document, onDelete, isDeleting }: DocumentListItemProps) => {
  const { t } = useTranslation("chat");

  return (
    <div className={styles.item}>
      <StatusIcon document={document} />
      <div className={styles.info}>
        <Text className={styles.filename} ellipsis={{ tooltip: document.filename }}>
          {document.filename}
        </Text>
        <Text className={styles.meta} type="secondary">
          PDF · {formatBytes(document.size_bytes)}
        </Text>
      </div>
      <Tooltip title={t("documents.delete")}>
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          loading={isDeleting}
          onClick={() => onDelete(document.id)}
        />
      </Tooltip>
    </div>
  );
};
