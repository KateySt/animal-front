import { useState } from "react";
import { Button, Flex, Popconfirm, Space, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";
import { useDeleteResource, useResources } from "../hooks/use-resources.ts";
import { ResourceFormModal } from "./ResourceFormModal.tsx";
import type { Resource } from "../types/rbac.types.ts";

const { Title } = Typography;

export const ResourcesPanel = () => {
  const { t } = useTranslation("settings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const { data, isLoading, isError, error } = useResources();
  const { mutate: deleteResource, isPending: isDeleting } = useDeleteResource();

  const openCreate = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const openEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleOnCloseResourceFormModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  if (isLoading && !data) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage message={error?.message} />;
  }

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          {t("resources.title")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("resources.add")}
        </Button>
      </Flex>

      <Table<Resource>
        rowKey="id"
        dataSource={data}
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: t("resources.empty") }}
      >
        <Table.Column title={t("resources.name")} dataIndex="name" key="name" />
        <Table.Column
          title={t("resources.description")}
          key="description"
          render={(_, resource: Resource) => resource.description ?? "—"}
        />
        <Table.Column
          title={t("common.actions")}
          key="actions"
          width={120}
          render={(_, resource: Resource) => (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => openEdit(resource)}
                aria-label={t("common.edit")}
              />
              <Popconfirm
                title={t("resources.deleteConfirm")}
                okText={t("common.delete")}
                cancelText={t("common.cancel")}
                onConfirm={() => deleteResource(resource.id)}
                okButtonProps={{ danger: true, loading: isDeleting }}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={t("common.delete")}
                />
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <ResourceFormModal
        open={isModalOpen}
        resource={editingResource}
        onClose={handleOnCloseResourceFormModal}
      />
    </div>
  );
};
