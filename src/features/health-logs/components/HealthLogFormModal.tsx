import { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { LocaleTabs } from "../../../components/ui/LocaleTabs.tsx";
import { animalSchema } from "../../animals/schemas/animal.schema.ts";
import { useCreateHealthLog, useUpdateHealthLog } from "../hooks/use-health-logs.ts";
import type { HealthLog } from "../types/health-logs.types.ts";
import {
  emptyHealthLogFormValues,
  formValuesToCreateDto,
  formValuesToUpdateDto,
  type HealthLogFormValues,
  healthLogToFormValues,
} from "../utils/form.ts";

type HealthLogFormModalProps = {
  open: boolean;
  animalId: string;
  healthLog: HealthLog | null;
  onClose: () => void;
};

export const HealthLogFormModal = ({
  open,
  animalId,
  healthLog,
  onClose,
}: HealthLogFormModalProps) => {
  const { t } = useTranslation("animals");
  const [form] = Form.useForm<HealthLogFormValues>();

  const { mutate: createHealthLog, isPending: isCreating } = useCreateHealthLog(animalId);
  const { mutate: updateHealthLog, isPending: isUpdating } = useUpdateHealthLog(animalId);
  const isEdit = !!healthLog;

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    form.setFieldsValue(healthLog ? healthLogToFormValues(healthLog) : emptyHealthLogFormValues());
  }, [open, healthLog, form]);

  const handleSubmit = (values: HealthLogFormValues) => {
    if (isEdit) {
      updateHealthLog(
        { healthLogId: healthLog.id, dto: formValuesToUpdateDto(values) },
        { onSuccess: onClose },
      );
      return;
    }

    createHealthLog(formValuesToCreateDto(values), { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? t("healthLogs.edit") : t("healthLogs.add")}
      okText={t("form.submit")}
      cancelText={t("form.cancel")}
      confirmLoading={isCreating || isUpdating}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <LocaleTabs
          renderFields={(locale) => (
            <>
              <Form.Item
                label={t("form.procedureName")}
                name={["translations", locale, "procedure_name"]}
                rules={animalSchema.procedureName(locale)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t("form.examinationFindings")}
                name={["translations", locale, "examination_findings"]}
                rules={animalSchema.examinationFindings()}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </>
          )}
        />
      </Form>
    </Modal>
  );
};
