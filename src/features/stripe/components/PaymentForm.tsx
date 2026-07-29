import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Alert, Button, Space, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useConfirmPayment } from "../hooks/use-confirm-payment";
import { PaymentStatus } from "../types/stripe";
import React, { useState } from "react";

const { Text } = Typography;

type PaymentFormProps = {
  invoiceId: string;
};

export const PaymentForm = ({ invoiceId }: PaymentFormProps) => {
  const { t } = useTranslation("payment");
  const stripe = useStripe();
  const elements = useElements();
  const { confirm, status, errorMessage, isDone, isProcessing } = useConfirmPayment({ invoiceId });
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    await confirm(stripe, elements);
  };

  const statusMessage =
    status !== PaymentStatus.Idle ? t(`form.${status}`, { defaultValue: "" }) : "";

  return (
    <form onSubmit={handleSubmit}>
      <Space orientation="vertical" style={{ width: "100%" }} size="middle">
        <PaymentElement onReady={() => setIsReady(true)} />

        {statusMessage && (
          <Space>
            {isProcessing && <Spin size="small" />}
            <Text type="secondary">{statusMessage}</Text>
          </Space>
        )}

        {errorMessage && <Alert title={errorMessage} type="error" showIcon />}

        {isDone && (
          <Alert
            title={t("form.processingTitle")}
            description={t("form.processingDesc")}
            type="info"
            showIcon
          />
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={isProcessing || !isReady}
          disabled={!stripe || !elements || isDone}
          block
        >
          {t("form.submit")}
        </Button>
      </Space>
    </form>
  );
};
