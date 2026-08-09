import { useState } from "react";
import { Button, Flex, Popconfirm, Space, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SafetyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";
import { useDeleteRole, useRoles } from "../hooks/use-roles.ts";
import { RoleFormModal } from "./RoleFormModal.tsx";
import { RolePermissionsModal } from "./RolePermissionsModal.tsx";
import type { Role } from "../types/rbac.types.ts";

const { Title } = Typography;

export const RolesPanel = () => {
  const { t } = useTranslation("settings");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { data, isLoading, isError, error } = useRoles();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const openCreate = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const openEdit = (role: Role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const openPermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsOpen(true);
  };

  const handleOnCloseRoleFormModal = () => {
    setIsFormOpen(false);
  };

  const handleOnCloseRolePermissionsModal = () => {
    setIsPermissionsOpen(false);
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
          {t("roles.title")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("roles.add")}
        </Button>
      </Flex>

      <Table<Role>
        rowKey="id"
        dataSource={data}
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: t("roles.empty") }}
      >
        <Table.Column title={t("roles.name")} dataIndex="name" key="name" />
        <Table.Column
          title={t("roles.description")}
          key="description"
          render={(_, role: Role) => role.description ?? "—"}
        />
        <Table.Column
          title={t("common.actions")}
          key="actions"
          width={160}
          render={(_, role: Role) => (
            <Space>
              <Button
                type="text"
                icon={<SafetyOutlined />}
                onClick={() => openPermissions(role)}
                aria-label={t("roles.permissions")}
              />
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => openEdit(role)}
                aria-label={t("common.edit")}
              />
              <Popconfirm
                title={t("roles.deleteConfirm")}
                okText={t("common.delete")}
                cancelText={t("common.cancel")}
                onConfirm={() => deleteRole(role.id)}
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

      <RoleFormModal open={isFormOpen} role={selectedRole} onClose={handleOnCloseRoleFormModal} />
      <RolePermissionsModal
        open={isPermissionsOpen}
        role={selectedRole}
        onClose={handleOnCloseRolePermissionsModal}
      />
    </div>
  );
};
