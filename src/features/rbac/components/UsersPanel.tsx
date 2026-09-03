import { useState } from "react";
import { Button, Flex, Table, Tag, Typography } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";
import { useRbacUsers } from "../hooks/use-users.ts";
import { UserRolesModal } from "./UserRolesModal.tsx";
import type { RbacUser } from "../types/rbac.types.ts";

const { Title } = Typography;

export const UsersPanel = () => {
  const { t } = useTranslation("settings");
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RbacUser | null>(null);

  const { data, isLoading, isError, error } = useRbacUsers();

  const openRoles = (user: RbacUser) => {
    setSelectedUser(user);
    setIsRolesOpen(true);
  };

  const handleOnCloseUserRolesModal = () => {
    setIsRolesOpen(false);
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
          {t("users.title")}
        </Title>
      </Flex>

      <Table<RbacUser>
        rowKey="id"
        dataSource={data}
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: t("users.empty") }}
      >
        <Table.Column title={t("users.email")} dataIndex="email" key="email" />
        <Table.Column
          title={t("users.roles")}
          key="roles"
          render={(_, user: RbacUser) => (
            <>
              {user.roles.length
                ? user.roles.map((role) => <Tag key={role.id}>{role.name}</Tag>)
                : "—"}
            </>
          )}
        />
        <Table.Column
          title={t("common.actions")}
          key="actions"
          width={100}
          render={(_, user: RbacUser) => (
            <Button
              type="text"
              icon={<SafetyOutlined />}
              onClick={() => openRoles(user)}
              aria-label={t("users.manageRolesAction")}
            />
          )}
        />
      </Table>

      <UserRolesModal
        open={isRolesOpen}
        user={selectedUser}
        onClose={handleOnCloseUserRolesModal}
      />
    </div>
  );
};
