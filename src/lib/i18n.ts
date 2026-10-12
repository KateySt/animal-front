import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { Locale } from "./locales";

const loadLocale = (language: string, namespace: string) =>
  import.meta.env.SSR
    ? import("node:fs/promises")
        .then((fs) => fs.readFile(`public/locales/${language}/${namespace}.json`, "utf-8"))
        .then(JSON.parse)
    : fetch(`/locales/${language}/${namespace}.json`).then((res) => res.json());

if (!import.meta.env.SSR) {
  i18n.use(LanguageDetector);
}

export const i18nReady = i18n
  .use(resourcesToBackend(loadLocale))
  .use(initReactI18next)
  .init({
    lng: import.meta.env.SSR ? Locale.EN : undefined,
    fallbackLng: Locale.EN,
    supportedLngs: Object.values(Locale),
    defaultNS: "common",
    ns: ["common", "animals", "payment", "chat", "settings", "landing"],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
