import { useMemo, useState } from "react";
import { Button, Flex, Popconfirm, Table, Tag, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";
import { useDeletePermission, usePermissions } from "../hooks/use-permissions.ts";
import { useResources } from "../hooks/use-resources.ts";
import { PermissionFormModal } from "./PermissionFormModal.tsx";
import type { Permission } from "../types/rbac.types.ts";

const { Title } = Typography;

export const PermissionsPanel = () => {
  const { t } = useTranslation("settings");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = usePermissions();
  const { data: resources } = useResources();
  const { mutate: deletePermission, isPending: isDeleting } = useDeletePermission();

  const resourceNameById = useMemo(
    () => new Map((resources ?? []).map((resource) => [resource.id, resource.name])),
    [resources],
  );

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
          {t("permissions.title")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          {t("permissions.add")}
        </Button>
      </Flex>

      <Table<Permission>
        rowKey="id"
        dataSource={data}
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: t("permissions.empty") }}
      >
        <Table.Column
          title={t("permissions.scope")}
          key="scope"
          render={(_, permission: Permission) => <Tag color="blue">{permission.scope}</Tag>}
        />
        <Table.Column
          title={t("permissions.resource")}
          key="resource"
          render={(_, permission: Permission) =>
            resourceNameById.get(permission.resource_id) ?? permission.resource_id
          }
        />
        <Table.Column title={t("permissions.action")} dataIndex="action" key="action" />
        <Table.Column
          title={t("common.actions")}
          key="actions"
          width={80}
          render={(_, permission: Permission) => (
            <Popconfirm
              title={t("permissions.deleteConfirm")}
              description={t("permissions.deleteWarning")}
              okText={t("common.delete")}
              cancelText={t("common.cancel")}
              onConfirm={() => deletePermission(permission.id)}
              okButtonProps={{ danger: true, loading: isDeleting }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={t("common.delete")}
              />
            </Popconfirm>
          )}
        />
      </Table>

      <PermissionFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
