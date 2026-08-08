import { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { LocaleTabs } from "../../../components/ui/LocaleTabs.tsx";
import { useAuthStore } from "../../../store/auth.store.ts";
import { useCreateAnimal, useUpdateAnimal } from "../hooks/use-animals.ts";
import { animalSchema } from "../schemas/animal.schema.ts";
import { Gender, type Animal } from "../types/animals.types.ts";
import {
  animalToFormValues,
  emptyAnimalTranslations,
  emptyHealthLogTranslations,
  formValuesToDto,
  type AnimalFormValues,
} from "../utils/form.ts";
import { DATE_FORMAT } from "../../../constants";
import styles from "./AnimalFormModal.module.scss";

type AnimalFormModalProps = {
  open: boolean;
  animal: Animal | null;
  onClose: () => void;
};

type FormShape = Omit<AnimalFormValues, "birth_date"> & { birth_date: dayjs.Dayjs };

const getEmptyValues = (): FormShape => ({
  gender: Gender.Unknown,
  birth_date: dayjs(),
  translations: emptyAnimalTranslations(),
  health_logs: [{ translations: emptyHealthLogTranslations() }],
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
        <LocaleTabs
          renderFields={(locale) => (
            <>
              <Form.Item
                label={t("form.name")}
                name={["translations", locale, "name"]}
                rules={animalSchema.name(locale)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t("form.caretakerNotes")}
                name={["translations", locale, "caretaker_notes"]}
                rules={animalSchema.caretakerNotes()}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </>
          )}
        />

        <Form.Item label={t("form.gender")} name="gender" rules={animalSchema.gender()}>
          <Select
            options={Object.values(Gender).map((value) => ({
              value,
              label: t(`gender.${value}`),
            }))}
          />
        </Form.Item>

        <Form.Item label={t("form.birthDate")} name="birth_date" rules={animalSchema.birthDate()}>
          <DatePicker format={DATE_FORMAT} className={styles.datePicker} />
        </Form.Item>

        <Form.List name="health_logs">
          {(fields, { add, remove }) => (
            <Space orientation="vertical" style={{ width: "100%" }} size="small">
              {fields.map(({ key, name }) => (
                <div key={key} className={styles.healthLog}>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      className={styles.removeLog}
                      onClick={() => remove(name)}
                      aria-label={t("form.removeLog")}
                    />
                  )}
                  <LocaleTabs
                    renderFields={(locale) => (
                      <>
                        <Form.Item
                          name={[name, "translations", locale, "procedure_name"]}
                          label={t("form.procedureName")}
                          rules={animalSchema.procedureName(locale)}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={[name, "translations", locale, "examination_findings"]}
                          label={t("form.examinationFindings")}
                          rules={animalSchema.examinationFindings()}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    )}
                  />
                </div>
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
