import { queryOptions } from "@tanstack/react-query";
import { stripeApi } from "../api/stripe.api";

export const invoiceKeys = {
  all: ["invoices"] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

export const invoiceDetailOptions = (invoiceId: string) =>
  queryOptions({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => stripeApi.getInvoice(invoiceId),
    enabled: !!invoiceId,
  });
