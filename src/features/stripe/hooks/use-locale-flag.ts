import { useTranslation } from "react-i18next";
import { Locale, type LocaleType } from "../../../lib/locales";
import type { StripeElementLocale } from "@stripe/stripe-js";

export const LOCALE_FLAGS: Record<string, string> = {
  [Locale.EN]: "🇬🇧",
  [Locale.RU]: "🇷🇺",
  [Locale.UK]: "🇺🇦",
};

export const LOCALE_LABELS: Record<string, string> = {
  [Locale.EN]: "EN",
  [Locale.RU]: "RU",
  [Locale.UK]: "UK",
};

export const STRIPE_LOCALE_MAP: Record<LocaleType, StripeElementLocale> = {
  [Locale.EN]: "en",
  [Locale.RU]: "ru",
  [Locale.UK]: "auto",
};

export const useLocaleFlag = () => {
  const { i18n } = useTranslation();
  const currentLocale = (
    i18n.language in LOCALE_FLAGS ? i18n.language : Locale.EN
  ) as (typeof Locale)[keyof typeof Locale];
  const flag = LOCALE_FLAGS[currentLocale];
  return { currentLocale, flag };
};
