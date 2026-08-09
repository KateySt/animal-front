import { useEffect } from "react";
import { Form, Modal, Select, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { rbacSchema } from "../schemas/rbac.schema.ts";
import { usePermissions } from "../hooks/use-permissions.ts";
import { useRole, useSetRolePermissions } from "../hooks/use-roles.ts";
import type { Role } from "../types/rbac.types.ts";

type RolePermissionsModalProps = {
  open: boolean;
  role: Role | null;
  onClose: () => void;
};

type FormShape = {
  permission_ids: string[];
};

export const RolePermissionsModal = ({ open, role, onClose }: RolePermissionsModalProps) => {
  const { t } = useTranslation("settings");
  const [form] = Form.useForm<FormShape>();

  const { data: permissions } = usePermissions();
  const { data: roleDetail, isLoading: isRoleLoading } = useRole(open && role ? role.id : "");
  const { mutate: setRolePermissions, isPending } = useSetRolePermissions();

  useEffect(() => {
    if (!open || !roleDetail) return;
    form.setFieldsValue({ permission_ids: roleDetail.permissions.map((item) => item.id) });
  }, [open, roleDetail, form]);

  const handleSubmit = (values: FormShape) => {
    if (!role) return;
    setRolePermissions(
      { roleId: role.id, permissionIds: values.permission_ids },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={open}
      title={t("roles.managePermissions", { name: role?.name ?? "" })}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isPending}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      {isRoleLoading ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={t("roles.selectPermissions")}
            name="permission_ids"
            rules={rbacSchema.permissionIds()}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder={t("roles.selectPermissions")}
              options={(permissions ?? []).map((permission) => ({
                value: permission.id,
                label: permission.scope,
              }))}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
