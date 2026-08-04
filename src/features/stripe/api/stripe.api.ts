import { axiosInstance } from "../../../lib/axios";
import type { ConfirmPaymentResponse, Invoice } from "../types/stripe.ts";

export const stripeApi = {
  getInvoice: (invoiceId: string) =>
    axiosInstance.get<Invoice>(`/v1/stripe/${invoiceId}`).then((response) => response.data),

  confirmPayment: (invoiceId: string, confirmationTokenId: string) =>
    axiosInstance
      .post<ConfirmPaymentResponse>(`/v1/stripe/${invoiceId}/confirm`, {
        confirmation_token_id: confirmationTokenId,
      })
      .then((response) => response.data),
};
