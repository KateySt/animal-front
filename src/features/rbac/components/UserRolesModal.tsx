import { useEffect } from "react";
import { Form, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { rbacSchema } from "../schemas/rbac.schema.ts";
import { useRoles } from "../hooks/use-roles.ts";
import { useAssignUserRoles } from "../hooks/use-users.ts";
import type { RbacUser } from "../types/rbac.types.ts";

type UserRolesModalProps = {
  open: boolean;
  user: RbacUser | null;
  onClose: () => void;
};

type FormShape = {
  role_ids: string[];
};

export const UserRolesModal = ({ open, user, onClose }: UserRolesModalProps) => {
  const { t } = useTranslation("settings");
  const [form] = Form.useForm<FormShape>();

  const { data: roles } = useRoles();
  const { mutate: assignRoles, isPending } = useAssignUserRoles();

  useEffect(() => {
    if (!open || !user) return;
    form.setFieldsValue({ role_ids: user.roles.map((role) => role.id) });
  }, [open, user, form]);

  const handleSubmit = (values: FormShape) => {
    if (!user) return;
    assignRoles({ userId: user.id, roleIds: values.role_ids }, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      title={t("users.manageRoles", { email: user?.email ?? "" })}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isPending}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={t("users.selectRoles")} name="role_ids" rules={rbacSchema.roleIds()}>
          <Select
            mode="multiple"
            showSearch
            placeholder={t("users.selectRoles")}
            options={(roles ?? []).map((role) => ({ value: role.id, label: role.name }))}
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
