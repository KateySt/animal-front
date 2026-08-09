import { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { rbacSchema } from "../schemas/rbac.schema.ts";
import { useCreateRole, useUpdateRole } from "../hooks/use-roles.ts";
import type { Role } from "../types/rbac.types.ts";

type RoleFormModalProps = {
  open: boolean;
  role: Role | null;
  onClose: () => void;
};

type FormShape = {
  name: string;
  description?: string;
};

export const RoleFormModal = ({ open, role, onClose }: RoleFormModalProps) => {
  const { t } = useTranslation("settings");
  const [form] = Form.useForm<FormShape>();

  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const isEdit = !!role;

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    form.setFieldsValue({
      name: role?.name ?? "",
      description: role?.description ?? undefined,
    });
  }, [open, role, form]);

  const handleSubmit = (values: FormShape) => {
    const dto = { name: values.name, description: values.description || null };

    if (isEdit) {
      updateRole({ roleId: role.id, dto }, { onSuccess: onClose });
      return;
    }

    createRole(dto, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? t("roles.edit") : t("roles.add")}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isCreating || isUpdating}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={t("roles.name")} name="name" rules={rbacSchema.roleName()}>
          <Input />
        </Form.Item>
        <Form.Item
          label={t("roles.description")}
          name="description"
          rules={rbacSchema.description()}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
