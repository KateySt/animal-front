import type { TimeStamp } from "../../../types/base.ts";
import type { HealthLog } from "../../animals/types/animals.types.ts";

export const PaymentStatus = {
  Idle: "idle",
  Processing: "processing",
  Succeeded: "succeeded",
  Error: "error",
} as const;

export const InvoiceStatus = {
  Pending: "pending",
  Processing: "processing",
  Paid: "paid",
  Cancelled: "cancelled",
} as const;

export const Currency = {
  USD: "usd",
  UAH: "uah",
} as const;

export type InvoiceStatusType = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type CurrencyType = (typeof Currency)[keyof typeof Currency];

export const STATUS_COLOR = {
  [InvoiceStatus.Pending]: "orange",
  [InvoiceStatus.Processing]: "gold",
  [InvoiceStatus.Paid]: "green",
  [InvoiceStatus.Cancelled]: "red",
} satisfies Record<InvoiceStatusType, string>;

export type Invoice = {
  id: string;
  status: InvoiceStatusType;
  animal_id: string;
  user_id: string;
  amount_in_cents: number;
  currency: CurrencyType;
  health_logs: HealthLog[];
} & TimeStamp;

export type InvoiceCreateDto = {
  animal_id: string;
  amount: number;
  currency: CurrencyType;
  health_logs: string[];
};

export type InvoiceUpdateDto = Partial<Omit<InvoiceCreateDto, "animal_id">>;

export type ConfirmPaymentResponse = {
  status: string;
  client_secret: string | null;
  payment_intent_id: string | null;
};
