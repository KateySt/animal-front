export const PaymentStatus = {
  Idle: "idle",
  Processing: "processing",
  Succeeded: "succeeded",
  Error: "error",
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const InvoiceStatus = {
  Pending: "pending",
  Paid: "paid",
  Failed: "failed",
  Proceeding: "proceeding",
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
  created_at: string;
  updated_at: string;
};

export type InvoiceStatusType = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type CurrencyType = (typeof Currency)[keyof typeof Currency];

export interface Invoice {
  id: string;
  status: InvoiceStatusType;
  animal_id: string;
  user_id: string;
  amount_in_cents: number;
  currency: CurrencyType;
  created_at: string;
  updated_at: string;
  health_logs: HealthLog[];
}
