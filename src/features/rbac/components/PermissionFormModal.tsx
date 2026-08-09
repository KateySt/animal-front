import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { rbacSchema } from "../schemas/rbac.schema.ts";
import { useCreatePermission } from "../hooks/use-permissions.ts";
import { useResources } from "../hooks/use-resources.ts";

type PermissionFormModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormShape = {
  resource_id: string;
  action: string;
};

export const PermissionFormModal = ({ open, onClose }: PermissionFormModalProps) => {
  const { t } = useTranslation("settings");
  const [form] = Form.useForm<FormShape>();

  const { data: resources } = useResources();
  const { mutate: createPermission, isPending } = useCreatePermission();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  const handleSubmit = (values: FormShape) => {
    createPermission(values, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      title={t("permissions.add")}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isPending}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("permissions.resource")}
          name="resource_id"
          rules={rbacSchema.resourceId()}
        >
          <Select
            showSearch
            options={(resources ?? []).map((resource) => ({
              value: resource.id,
              label: resource.name,
            }))}
          />
        </Form.Item>
        <Form.Item label={t("permissions.action")} name="action" rules={rbacSchema.action()}>
          <Input placeholder={t("permissions.actionPlaceholder")} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
