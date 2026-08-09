import { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { rbacSchema } from "../schemas/rbac.schema.ts";
import { useCreateResource, useUpdateResource } from "../hooks/use-resources.ts";
import type { Resource } from "../types/rbac.types.ts";

type ResourceFormModalProps = {
  open: boolean;
  resource: Resource | null;
  onClose: () => void;
};

type FormShape = {
  name: string;
  description?: string;
};

export const ResourceFormModal = ({ open, resource, onClose }: ResourceFormModalProps) => {
  const { t } = useTranslation("settings");
  const [form] = Form.useForm<FormShape>();

  const { mutate: createResource, isPending: isCreating } = useCreateResource();
  const { mutate: updateResource, isPending: isUpdating } = useUpdateResource();
  const isEdit = !!resource;

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    form.setFieldsValue({
      name: resource?.name ?? "",
      description: resource?.description ?? undefined,
    });
  }, [open, resource, form]);

  const handleSubmit = (values: FormShape) => {
    if (isEdit) {
      updateResource(
        { resourceId: resource.id, dto: { description: values.description || null } },
        { onSuccess: onClose },
      );
      return;
    }

    createResource(
      { name: values.name, description: values.description || null },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={open}
      title={isEdit ? t("resources.edit") : t("resources.add")}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isCreating || isUpdating}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("resources.name")}
          name="name"
          rules={rbacSchema.resourceName()}
          extra={t("resources.nameHint")}
        >
          <Input disabled={isEdit} />
        </Form.Item>
        <Form.Item
          label={t("resources.description")}
          name="description"
          rules={rbacSchema.description()}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
