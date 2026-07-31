import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { Locale } from "./locales";

i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      fetch(`/locales/${language}/${namespace}.json`).then((res) => res.json()),
    ),
  )
  .use(initReactI18next)
  .init({
    fallbackLng: Locale.EN,
    supportedLngs: Object.values(Locale),
    defaultNS: "common",
    ns: ["common", "animals", "payment", "chat"],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
