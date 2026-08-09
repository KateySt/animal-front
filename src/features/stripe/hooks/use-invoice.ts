import { queryOptions, useQuery } from "@tanstack/react-query";
import { stripeApi } from "../api/stripe.api";
import { InvoiceStatus } from "../types/stripe.ts";

const POLL_INTERVAL_MS = 2000;

export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  mine: () => [...invoiceKeys.lists(), "me"] as const,
  everyone: () => [...invoiceKeys.lists(), "all"] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

export function useInvoice(invoiceId: string) {
  return useQuery(
    queryOptions({
      queryKey: invoiceKeys.detail(invoiceId),
      queryFn: () => stripeApi.getInvoice(invoiceId),
      enabled: !!invoiceId,
      refetchInterval: (query) =>
        query.state.data?.status === InvoiceStatus.Processing ? POLL_INTERVAL_MS : false,
    }),
  );
}
