import { useParams } from "react-router";
import { PaymentWidget } from "../features/stripe/components/PaymentWidget";

export const PaymentPage = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  return <PaymentWidget invoiceId={invoiceId!} />;
};
