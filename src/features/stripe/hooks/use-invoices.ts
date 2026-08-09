import { message } from "antd";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stripeApi } from "../api/stripe.api";
import { getStripeErrorMessage } from "../utils/errors.ts";
import { invoiceKeys } from "./use-invoice.ts";
import type { InvoiceCreateDto, InvoiceUpdateDto } from "../types/stripe.ts";

export function useMyInvoices() {
  return useQuery(
    queryOptions({
      queryKey: invoiceKeys.mine(),
      queryFn: () => stripeApi.getMyInvoices(),
    }),
  );
}

export function useAllInvoices(enabled: boolean) {
  return useQuery(
    queryOptions({
      queryKey: invoiceKeys.everyone(),
      queryFn: () => stripeApi.getAllInvoices(),
      enabled,
    }),
  );
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: InvoiceCreateDto) => stripeApi.createInvoice(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() }),
    onError: (error) => message.error(getStripeErrorMessage(error)),
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, dto }: { invoiceId: string; dto: InvoiceUpdateDto }) =>
      stripeApi.updateInvoice(invoiceId, dto),
    onSuccess: (_, { invoiceId }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
    onError: (error) => message.error(getStripeErrorMessage(error)),
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => stripeApi.deleteInvoice(invoiceId),
    onSuccess: (_, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
    onError: (error) => message.error(getStripeErrorMessage(error)),
  });
}
