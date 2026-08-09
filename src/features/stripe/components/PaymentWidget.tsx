import { Elements } from "@stripe/react-stripe-js";
import { Alert, Card, Space, Spin, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { stripePromise } from "../../../lib/stripe";
import { useInvoice } from "../hooks/use-invoice";
import { PaymentForm } from "./PaymentForm";
import { styleConfig } from "../../../style.config.ts";
import { InvoiceStatus, STATUS_COLOR, type InvoiceStatusType } from "../types/stripe.ts";
import { useThemeStore } from "../../../store/theme.store.ts";
import { STRIPE_LOCALE_MAP, useLocaleFlag } from "../hooks/use-locale-flag.ts";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";

const { Title, Text } = Typography;

type PaymentWidgetProps = {
  invoiceId: string;
};

export const PaymentWidget = ({ invoiceId }: PaymentWidgetProps) => {
  const { t } = useTranslation("payment");
  const { currentLocale } = useLocaleFlag();
  const isDark = useThemeStore((s) => s.isDark);
  const { data: invoice, isLoading, isError, error } = useInvoice(invoiceId);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || !invoice) {
    return <ErrorPage message={error?.message} />;
  }

  const amount = (invoice.amount_in_cents / 100).toFixed(2);

  const renderStatusContent = (status: InvoiceStatusType) => {
    switch (status) {
      case InvoiceStatus.Pending:
        return (
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: invoice.amount_in_cents,
              currency: invoice.currency,
              locale: STRIPE_LOCALE_MAP[currentLocale],
              appearance: {
                theme: isDark ? "night" : "stripe",
                variables: { colorPrimary: styleConfig.colorPrimary },
              },
            }}
          >
            <PaymentForm invoiceId={invoiceId} />
          </Elements>
        );
      case InvoiceStatus.Processing:
        return (
          <Space>
            <Spin size="small" />
            <Text type="secondary">{t("form.processingDesc")}</Text>
          </Space>
        );
      case InvoiceStatus.Cancelled:
        return <Alert title={t("failed")} type="error" showIcon />;
      case InvoiceStatus.Paid:
        return <Alert title={t("alreadyPaid")} type="success" showIcon />;
    }
  };

  return (
    <Card style={{ maxWidth: 480, margin: "0 auto" }}>
      <Title level={4} style={{ marginTop: 0 }}>
        {t("title")}
      </Title>

      <Text type="secondary">{t("amount")} </Text>
      <Text strong>
        {amount} {invoice.currency}
      </Text>

      <div style={{ margin: "8px 0 20px" }}>
        <Tag color={STATUS_COLOR[invoice.status]}>{t(`status.${invoice.status}`)}</Tag>
      </div>

      {renderStatusContent(invoice.status)}
    </Card>
  );
};
