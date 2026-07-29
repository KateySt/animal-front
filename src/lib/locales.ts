export const Locale = {
  EN: "en",
  RU: "ru",
  UK: "uk",
} as const;

export type LocaleType = (typeof Locale)[keyof typeof Locale];
