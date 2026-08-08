import { Button, Popconfirm, Space, Table, type TablePaginationConfig } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "../../../hooks/use-date-format.ts";
import { getLocalized } from "../../animals/utils/translations.ts";
import type { HealthLog } from "../types/health-logs.types.ts";

type HealthLogsListProps = {
  healthLogs: HealthLog[];
  total: number;
  page: number;
  itemsPerPage: number;
  isLoading: boolean;
  isDeleting: boolean;
  onPageChange: (page: number) => void;
  onEdit: (healthLog: HealthLog) => void;
  onDelete: (healthLogId: string) => void;
};

export const HealthLogsList = ({
  healthLogs,
  total,
  page,
  itemsPerPage,
  isLoading,
  isDeleting,
  onPageChange,
  onEdit,
  onDelete,
}: HealthLogsListProps) => {
  const { t, i18n } = useTranslation("animals");
  const { formatDate } = useDateFormat();

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize: itemsPerPage,
    total,
    showSizeChanger: false,
    onChange: onPageChange,
  };

  return (
    <Table<HealthLog>
      rowKey="id"
      dataSource={healthLogs}
      loading={isLoading}
      pagination={pagination}
      locale={{ emptyText: t("healthLogs.empty") }}
    >
      <Table.Column
        title={t("form.procedureName")}
        key="procedure"
        render={(_, log: HealthLog) =>
          getLocalized(log.translations, i18n.language)?.procedure_name ?? ""
        }
      />
      <Table.Column
        title={t("form.examinationFindings")}
        key="findings"
        render={(_, log: HealthLog) =>
          getLocalized(log.translations, i18n.language)?.examination_findings ?? ""
        }
      />
      <Table.Column
        title={t("columns.createdAt")}
        key="createdAt"
        render={(_, log: HealthLog) => formatDate(log.created_at)}
      />
      <Table.Column
        title={t("columns.actions")}
        key="actions"
        width={120}
        render={(_, log: HealthLog) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(log)}
              aria-label={t("healthLogs.edit")}
            />
            <Popconfirm
              title={t("healthLogs.deleteConfirm")}
              okText={t("delete")}
              cancelText={t("form.cancel")}
              onConfirm={() => onDelete(log.id)}
              okButtonProps={{ danger: true, loading: isDeleting }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} aria-label={t("delete")} />
            </Popconfirm>
          </Space>
        )}
      />
    </Table>
  );
};
