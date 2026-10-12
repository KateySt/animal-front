import type { MetaDescriptor } from "react-router";
import { Routes } from "../routes";
import { Locale } from "../lib/locales";

export const SITE_URL = import.meta.env.VITE_SITE_URL;
export const APP_NAME = import.meta.env.VITE_APP_NAME;

export const SITE_DESCRIPTION =
  "Animal care platform for shelters, veterinarians and pet owners: pet profiles, health logs, " +
  "invoices with online card payment, and an AI assistant (text and voice) that answers questions " +
  "about your animals and attached PDF documents.";

export const PUBLIC_PAGES = [Routes.Home, Routes.Register, Routes.Login];

export const PRIVATE_PATH_PREFIXES = [
  Routes.Animals,
  Routes.Profile,
  Routes.Settings,
  Routes.Payment,
  Routes.Invoices,
  Routes.Chat,
  "/auth/",
];

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export const buildPageMeta = ({ title, description, path }: PageMeta): MetaDescriptor[] => [
  { title },
  { name: "description", content: description },
  { tagName: "link", rel: "canonical", href: absoluteUrl(path) },
  { property: "og:type", content: "website" },
  { property: "og:site_name", content: APP_NAME },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:url", content: absoluteUrl(path) },
  { name: "twitter:card", content: "summary" },
];

export const NO_INDEX_META: MetaDescriptor[] = [
  { title: APP_NAME },
  { name: "robots", content: "noindex, nofollow" },
];

export const WEB_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  url: absoluteUrl(Routes.Home),
  description: SITE_DESCRIPTION,
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  inLanguage: Object.values(Locale),
};
