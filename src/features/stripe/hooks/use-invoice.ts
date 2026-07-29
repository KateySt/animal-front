import { useQuery } from "@tanstack/react-query";
import { invoiceDetailOptions } from "../queries/stripe.queries";

export function useInvoice(invoiceId: string) {
  return useQuery(invoiceDetailOptions(invoiceId));
}
