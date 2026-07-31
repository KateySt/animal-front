import type { TimeStamp } from "../../../types/base.ts";

export const PaymentStatus = {
  Idle: "idle",
  Processing: "processing",
  Succeeded: "succeeded",
  Error: "error",
} as const;

export const InvoiceStatus = {
  Pending: "pending",
  Paid: "paid",
  Failed: "failed",
  Processing: "processing",
} as const;

export const Currency = {
  USD: "usd",
  UAH: "uah",
} as const;

//todo move to correct module
export type HealthLog = {
  id: string;
  animal_id: string;
  procedure_name: string;
  examination_findings: string;
} & TimeStamp;

export type InvoiceStatusType = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type CurrencyType = (typeof Currency)[keyof typeof Currency];

export type Invoice = {
  id: string;
  status: InvoiceStatusType;
  animal_id: string;
  user_id: string;
  amount_in_cents: number;
  currency: CurrencyType;
  health_logs: HealthLog[];
} & TimeStamp;
