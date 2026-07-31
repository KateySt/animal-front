import { useTranslation } from "react-i18next";

export const useDateFormat = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  const formatDate = (value: string | Date): string => {
    const date = new Date(value);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(date);
    }

    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(date);
  };

  return { formatDate };
};
