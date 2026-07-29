import { useCallback, useReducer } from "react";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { stripeApi } from "../api/stripe.api";
import { invoiceKeys } from "../queries/stripe.queries";
import { PaymentStatus } from "../types/stripe";

type PaymentState =
  | { status: typeof PaymentStatus.Idle }
  | { status: typeof PaymentStatus.Processing }
  | { status: typeof PaymentStatus.Succeeded }
  | { status: typeof PaymentStatus.Error; message: string };

type PaymentAction =
  { type: "START" } | { type: "SUCCEED" } | { type: "FAIL"; message: string } | { type: "RESET" };

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case "START":
      return { status: PaymentStatus.Processing };
    case "SUCCEED":
      return { status: PaymentStatus.Succeeded };
    case "FAIL":
      return { status: PaymentStatus.Error, message: action.message };
    case "RESET":
      return { status: PaymentStatus.Idle };
    default:
      return state;
  }
}

type UseConfirmPaymentOptions = {
  invoiceId: string;
};

export function useConfirmPayment({ invoiceId }: UseConfirmPaymentOptions) {
  const queryClient = useQueryClient();

  const [state, dispatch] = useReducer(paymentReducer, { status: PaymentStatus.Idle });

  const confirm = useCallback(
    async (stripe: Stripe, elements: StripeElements) => {
      if (state.status === PaymentStatus.Processing) return;
      dispatch({ type: "START" });

      const { error: submitError } = await elements.submit();
      if (submitError) {
        dispatch({ type: "FAIL", message: submitError.message ?? "Validation error" });
        return;
      }

      const { confirmationToken, error: tokenError } = await stripe.createConfirmationToken({
        elements,
      });
      if (tokenError) {
        dispatch({ type: "FAIL", message: tokenError.message ?? "Token error" });
        return;
      }

      let serverResponse: { client_secret?: string; status?: string; error?: string };
      try {
        serverResponse = await stripeApi.confirmPayment(invoiceId, confirmationToken.id);
      } catch (error) {
        dispatch({
          type: "FAIL",
          message: error instanceof Error ? error.message : "Payment failed",
        });
        return;
      }

      if (serverResponse.status === "requires_action" && serverResponse.client_secret) {
        const { error: actionError } = await stripe.handleNextAction({
          clientSecret: serverResponse.client_secret,
        });
        if (actionError) {
          dispatch({ type: "FAIL", message: actionError.message ?? "Authentication failed" });
          return;
        }
      }
      dispatch({ type: "SUCCEED" });
      await queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
    },
    [invoiceId, queryClient, state.status],
  );

  return {
    confirm,
    status: state.status,
    errorMessage: state.status === PaymentStatus.Error ? state.message : null,
    isProcessing: state.status === PaymentStatus.Processing,
    isDone: state.status === PaymentStatus.Succeeded,
  };
}
