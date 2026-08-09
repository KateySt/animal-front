import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Flex, Tabs, Typography, message } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useHasRole, useIsSuperuser } from "../../auth/hooks/use-access.ts";
import { Routes } from "../../../router/routes.ts";
import { useAllInvoices, useDeleteInvoice, useMyInvoices } from "../hooks/use-invoices.ts";
import { InvoicesTable } from "./InvoicesTable.tsx";
import { InvoiceFormModal } from "./InvoiceFormModal.tsx";
import type { Invoice } from "../types/stripe.ts";

const { Title } = Typography;

const VET_ROLE = "vet";

export const InvoicesWidget = () => {
  const { t } = useTranslation("payment");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const canManage = useHasRole(VET_ROLE);
  const isSuperuser = useIsSuperuser();

  const myInvoices = useMyInvoices();
  const allInvoices = useAllInvoices(isSuperuser);
  const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoice();

  const openPayment = (invoiceId: string) => navigate(`${Routes.Payment}/${invoiceId}`);

  const openCreate = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const openEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const tableProps = {
    canManage,
    isDeleting,
    onOpen: openPayment,
    onEdit: openEdit,
    onDelete: deleteInvoice,
  };

  const tabs = [
    {
      key: "mine",
      label: t("invoices.myTab"),
      children: (
        <InvoicesTable
          invoices={myInvoices.data ?? []}
          isLoading={myInvoices.isLoading}
          {...tableProps}
        />
      ),
    },
    ...(isSuperuser
      ? [
          {
            key: "all",
            label: t("invoices.allTab"),
            children: (
              <InvoicesTable
                invoices={allInvoices.data ?? []}
                isLoading={allInvoices.isLoading}
                {...tableProps}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          {t("invoices.title")}
        </Title>
        {canManage && (
          <Button type="primary" icon={<FileAddOutlined />} onClick={openCreate}>
            {t("create.button")}
          </Button>
        )}
      </Flex>

      <Tabs defaultActiveKey="mine" items={tabs} />

      <InvoiceFormModal
        open={isModalOpen}
        invoice={editingInvoice}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setIsModalOpen(false);
          message.success(editingInvoice ? t("edit.success") : t("create.success"));
        }}
      />
    </div>
  );
};
