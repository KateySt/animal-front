import type { HealthLog, HealthLogTranslation } from "../../animals/types/animals.types.ts";

export type { HealthLog, HealthLogTranslation };

export type HealthLogCreateDto = {
  translations: HealthLogTranslation[];
};

export type HealthLogUpdateDto = {
  translations?: HealthLogTranslation[];
};

export type HealthLogsList = {
  data: HealthLog[];
  total_count: number;
  has_more: boolean;
  page: number;
  items_per_page: number;
};

export type HealthLogsQueryParams = {
  page: number;
  items_per_page: number;
};
