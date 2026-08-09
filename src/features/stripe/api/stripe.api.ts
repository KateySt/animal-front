import { axiosInstance } from "../../../lib/axios";
import type {
  ConfirmPaymentResponse,
  Invoice,
  InvoiceCreateDto,
  InvoiceUpdateDto,
} from "../types/stripe.ts";

const basePath = "/v1/stripe";

export const stripeApi = {
  getInvoice: (invoiceId: string) =>
    axiosInstance.get<Invoice>(`${basePath}/${invoiceId}`).then((response) => response.data),

  getMyInvoices: () =>
    axiosInstance.get<Invoice[]>(`${basePath}/me`).then((response) => response.data),

  getAllInvoices: () => axiosInstance.get<Invoice[]>(basePath).then((response) => response.data),

  createInvoice: (dto: InvoiceCreateDto) =>
    axiosInstance.post<Invoice>(basePath, dto).then((response) => response.data),

  updateInvoice: (invoiceId: string, dto: InvoiceUpdateDto) =>
    axiosInstance.patch<Invoice>(`${basePath}/${invoiceId}`, dto).then((response) => response.data),

  deleteInvoice: (invoiceId: string) =>
    axiosInstance.delete<void>(`${basePath}/${invoiceId}`).then((response) => response.data),

  confirmPayment: (invoiceId: string, confirmationTokenId: string) =>
    axiosInstance
      .post<ConfirmPaymentResponse>(`${basePath}/${invoiceId}/confirm`, {
        confirmation_token_id: confirmationTokenId,
      })
      .then((response) => response.data),
};
