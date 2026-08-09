import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "../../../hooks/use-date-format.ts";
import { InvoiceStatus, STATUS_COLOR, type Invoice } from "../types/stripe.ts";

type InvoicesTableProps = {
  invoices: Invoice[];
  isLoading: boolean;
  canManage: boolean;
  isDeleting: boolean;
  onOpen: (invoiceId: string) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
};

export const InvoicesTable = ({
  invoices,
  isLoading,
  canManage,
  isDeleting,
  onOpen,
  onEdit,
  onDelete,
}: InvoicesTableProps) => {
  const { t } = useTranslation("payment");
  const { formatDate } = useDateFormat();

  return (
    <Table<Invoice>
      rowKey="id"
      dataSource={invoices}
      loading={isLoading}
      pagination={false}
      locale={{ emptyText: t("invoices.empty") }}
    >
      <Table.Column
        title={t("invoices.columns.amount")}
        key="amount"
        render={(_, invoice: Invoice) =>
          `${(invoice.amount_in_cents / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`
        }
      />
      <Table.Column
        title={t("invoices.columns.status")}
        key="status"
        render={(_, invoice: Invoice) => (
          <Tag color={STATUS_COLOR[invoice.status]}>{t(`status.${invoice.status}`)}</Tag>
        )}
      />
      <Table.Column
        title={t("invoices.columns.created")}
        key="created"
        render={(_, invoice: Invoice) => formatDate(invoice.created_at)}
      />
      <Table.Column
        title={t("invoices.columns.actions")}
        key="actions"
        width={200}
        render={(_, invoice: Invoice) => {
          const isPending = invoice.status === InvoiceStatus.Pending;
          return (
            <Space>
              <Button type={isPending ? "primary" : "default"} onClick={() => onOpen(invoice.id)}>
                {isPending ? t("invoices.pay") : t("invoices.view")}
              </Button>
              {canManage && isPending && (
                <>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(invoice)}
                    aria-label={t("edit.title")}
                  />
                  <Popconfirm
                    title={t("invoices.deleteConfirm")}
                    okText={t("invoices.delete")}
                    cancelText={t("create.cancel")}
                    onConfirm={() => onDelete(invoice.id)}
                    okButtonProps={{ danger: true, loading: isDeleting }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      aria-label={t("invoices.delete")}
                    />
                  </Popconfirm>
                </>
              )}
            </Space>
          );
        }}
      />
    </Table>
  );
};
