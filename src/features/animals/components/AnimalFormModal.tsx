import { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/auth.store.ts";
import { useCreateAnimal, useUpdateAnimal } from "../hooks/use-animals.ts";
import { animalSchema } from "../schemas/animal.schema.ts";
import { Gender, type Animal } from "../types/animals.types.ts";
import { animalToFormValues, formValuesToDto, type AnimalFormValues } from "../utils/form.ts";
import { DATE_FORMAT } from "../../../constants";

type AnimalFormModalProps = {
  open: boolean;
  animal: Animal | null;
  onClose: () => void;
};

type FormShape = Omit<AnimalFormValues, "birth_date"> & { birth_date: dayjs.Dayjs };

const getEmptyValues = (): FormShape => ({
  name: "",
  gender: Gender.Unknown,
  birth_date: dayjs(),
  health_logs: [{ procedure_name: "", examination_findings: "" }],
});

export const AnimalFormModal = ({ open, animal, onClose }: AnimalFormModalProps) => {
  const { t } = useTranslation("animals");
  const [form] = Form.useForm<FormShape>();

  const { mutate: createAnimal, isPending: isCreating } = useCreateAnimal();
  const { mutate: updateAnimal, isPending: isUpdating } = useUpdateAnimal();
  const isEdit = !!animal;

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    form.setFieldsValue(
      animal
        ? { ...animalToFormValues(animal), birth_date: dayjs(animal.birth_date) }
        : getEmptyValues(),
    );
  }, [open, animal, form]);

  const handleSubmit = (values: FormShape) => {
    const dto = formValuesToDto({
      ...values,
      birth_date: values.birth_date.format(DATE_FORMAT),
    });

    if (isEdit) {
      updateAnimal({ animalId: animal.id, dto }, { onSuccess: onClose });
      return;
    }

    const ownerId = useAuthStore.getState().user!.id;
    createAnimal({ ...dto, owner_id: ownerId }, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? t("edit") : t("add")}
      okText={t("form.submit")}
      cancelText={t("form.cancel")}
      confirmLoading={isCreating || isUpdating}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={t("form.name")} name="name" rules={animalSchema.name()}>
          <Input />
        </Form.Item>

        <Form.Item
          label={t("form.caretakerNotes")}
          name="caretaker_notes"
          rules={animalSchema.caretakerNotes()}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label={t("form.gender")} name="gender" rules={animalSchema.gender()}>
          <Select
            options={Object.values(Gender).map((value) => ({
              value,
              label: t(`gender.${value}`),
            }))}
          />
        </Form.Item>

        <Form.Item label={t("form.birthDate")} name="birth_date" rules={animalSchema.birthDate()}>
          <DatePicker format={DATE_FORMAT} style={{ width: "100%" }} />
        </Form.Item>

        <Form.List name="health_logs">
          {(fields, { add, remove }) => (
            <Space orientation="vertical" style={{ width: "100%" }} size="small">
              {fields.map(({ key, name, ...rest }) => (
                <Space key={key} align="baseline" style={{ width: "100%" }}>
                  <Form.Item
                    {...rest}
                    name={[name, "procedure_name"]}
                    label={t("form.procedureName")}
                    rules={animalSchema.procedureName()}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...rest}
                    name={[name, "examination_findings"]}
                    label={t("form.examinationFindings")}
                    rules={animalSchema.examinationFindings()}
                  >
                    <Input />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      aria-label={t("form.removeLog")}
                    />
                  )}
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                {t("form.addLog")}
              </Button>
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
