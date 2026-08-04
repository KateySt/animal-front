import { Routes } from "../router/routes.ts";

export const FOOTER_SECTIONS = [
  {
    title: "footer.sections.navigation",
    links: [
      { label: "footer.links.home", to: Routes.Home },
      { label: "footer.links.animals", to: Routes.Animals },
      { label: "footer.links.profile", to: Routes.Profile },
    ],
  },
  {
    title: "footer.sections.account",
    links: [{ label: "footer.links.settings", to: Routes.Settings }],
  },
  {
    title: "footer.sections.support",
    links: [
      { label: "footer.links.helpCenter", to: "#" },
      { label: "footer.links.privacyPolicy", to: "#" },
      { label: "footer.links.termsOfService", to: "#" },
    ],
  },
];
