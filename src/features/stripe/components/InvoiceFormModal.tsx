import { type UIEvent, useEffect, useMemo } from "react";
import { Form, InputNumber, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useAnimal, useInfiniteAnimals } from "../../animals/hooks/use-animals.ts";
import { getAnimalName, getLocalized } from "../../animals/utils/translations.ts";
import { useCreateInvoice, useUpdateInvoice } from "../hooks/use-invoices.ts";
import { Currency, type CurrencyType, type Invoice } from "../types/stripe.ts";

const SCROLL_THRESHOLD_PX = 32;

type InvoiceFormModalProps = {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onSaved: () => void;
};

type FormShape = {
  animal_id: string;
  health_logs: string[];
  amount: number;
  currency: CurrencyType;
};

export const InvoiceFormModal = ({ open, invoice, onClose, onSaved }: InvoiceFormModalProps) => {
  const { t, i18n } = useTranslation("payment");
  const [form] = Form.useForm<FormShape>();
  const isEdit = !!invoice;

  const {
    data: animalPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteAnimals();
  const { data: editedAnimal } = useAnimal(invoice?.animal_id ?? "");
  const { mutate: createInvoice, isPending: isCreating } = useCreateInvoice();
  const { mutate: updateInvoice, isPending: isUpdating } = useUpdateInvoice();

  const animals = useMemo(() => {
    const loaded = animalPages?.pages.flatMap((page) => page.data) ?? [];
    if (editedAnimal && !loaded.some((animal) => animal.id === editedAnimal.id)) {
      return [editedAnimal, ...loaded];
    }
    return loaded;
  }, [animalPages, editedAnimal]);

  const selectedAnimalId = Form.useWatch("animal_id", form);
  const selectedAnimal = animals.find((animal) => animal.id === selectedAnimalId);

  const handleAnimalsScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, offsetHeight, scrollHeight } = event.currentTarget;
    if (scrollTop + offsetHeight >= scrollHeight - SCROLL_THRESHOLD_PX) {
      void fetchNextPage();
    }
  };
  const healthLogOptions = selectedAnimal?.health_logs.length
    ? selectedAnimal.health_logs
    : (invoice?.health_logs ?? []);

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    form.setFieldsValue(
      invoice
        ? {
            animal_id: invoice.animal_id,
            health_logs: invoice.health_logs.map((log) => log.id),
            amount: invoice.amount_in_cents / 100,
            currency: invoice.currency,
          }
        : { currency: Currency.USD },
    );
  }, [open, invoice, form]);

  const handleSubmit = (values: FormShape) => {
    if (isEdit) {
      updateInvoice(
        {
          invoiceId: invoice.id,
          dto: {
            amount: values.amount,
            currency: values.currency,
            health_logs: values.health_logs,
          },
        },
        { onSuccess: onSaved },
      );
      return;
    }

    createInvoice(values, { onSuccess: onSaved });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? t("edit.title") : t("create.title")}
      okText={isEdit ? t("edit.submit") : t("create.submit")}
      cancelText={t("create.cancel")}
      confirmLoading={isCreating || isUpdating}
      onOk={form.submit}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("create.animal")}
          name="animal_id"
          rules={[{ required: true, message: t("create.animalRequired") }]}
        >
          <Select
            showSearch
            disabled={isEdit}
            loading={isFetching}
            placeholder={t("create.animal")}
            onPopupScroll={handleAnimalsScroll}
            onChange={() => form.setFieldValue("health_logs", [])}
            options={animals.map((animal) => ({
              value: animal.id,
              label: getAnimalName(animal.translations, i18n.language),
            }))}
          />
        </Form.Item>

        <Form.Item
          label={t("create.healthLogs")}
          name="health_logs"
          rules={[{ required: true, message: t("create.healthLogsRequired") }]}
        >
          <Select
            mode="multiple"
            disabled={!selectedAnimalId}
            placeholder={t("create.healthLogs")}
            options={healthLogOptions.map((log) => ({
              value: log.id,
              label: getLocalized(log.translations, i18n.language)?.procedure_name ?? log.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={t("create.amount")}
          name="amount"
          rules={[{ required: true, message: t("create.amountRequired") }]}
        >
          <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={t("create.currency")}
          name="currency"
          rules={[{ required: true, message: t("create.currencyRequired") }]}
        >
          <Select
            options={Object.values(Currency).map((currency) => ({
              value: currency,
              label: currency.toUpperCase(),
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
