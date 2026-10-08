import { type ChangeEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Button, Popover, Tooltip, message } from "antd";
import { FileTextOutlined, PaperClipOutlined } from "@ant-design/icons";
import {
  useChatDocuments,
  useDeleteDocument,
  useUploadDocument,
} from "../hooks/use-chat-documents";
import { DocumentListItem } from "./DocumentListItem";
import { getDocumentErrorMessage } from "../utils/document-errors";
import styles from "./ChatDocumentsPanel.module.scss";

type ChatDocumentsPanelProps = {
  sessionId: string;
};

export const ChatDocumentsPanel = ({ sessionId }: ChatDocumentsPanelProps) => {
  const { t } = useTranslation("chat");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { documents, isEmbedding } = useChatDocuments(sessionId);
  const uploadMutation = useUploadDocument(sessionId);
  const deleteMutation = useDeleteDocument(sessionId);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      await uploadMutation.mutateAsync(file);
    } catch (error) {
      message.error(getDocumentErrorMessage(error));
    }
  };

  const documentListContent = (
    <div className={styles.list}>
      {documents.length === 0 ? (
        <span className={styles.empty}>{t("documents.empty")}</span>
      ) : (
        documents.map((document) => (
          <DocumentListItem
            key={document.id}
            document={document}
            onDelete={(documentId) => deleteMutation.mutate(documentId)}
            isDeleting={deleteMutation.isPending && deleteMutation.variables === document.id}
          />
        ))
      )}
    </div>
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleFileChange}
      />
      <Tooltip title={t("documents.attach")}>
        <Button
          type="text"
          icon={<PaperClipOutlined />}
          loading={uploadMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
        />
      </Tooltip>
      <Popover
        title={t("documents.title")}
        content={documentListContent}
        trigger="click"
        placement="topLeft"
      >
        <Tooltip title={t("documents.list")}>
          <Badge
            count={documents.length}
            size="small"
            offset={[-2, 2]}
            dot={isEmbedding}
            status={isEmbedding ? "processing" : undefined}
          >
            <Button type="text" icon={<FileTextOutlined />} />
          </Badge>
        </Tooltip>
      </Popover>
    </>
  );
};
