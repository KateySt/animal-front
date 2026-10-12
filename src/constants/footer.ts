import { Routes } from "../routes";
import {
  AuthStatus,
  MEMBER_STATUSES,
  type AuthStatusType,
} from "../features/auth/hooks/use-auth-status";

type FooterLink = {
  label: string;
  to: string;
  audiences?: AuthStatusType[];
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "footer.sections.navigation",
    links: [
      { label: "footer.links.home", to: Routes.Home },
      { label: "footer.links.animals", to: Routes.Animals, audiences: MEMBER_STATUSES },
      { label: "footer.links.invoices", to: Routes.Invoices, audiences: MEMBER_STATUSES },
    ],
  },
  {
    title: "footer.sections.account",
    links: [
      { label: "footer.links.settings", to: Routes.Settings, audiences: [AuthStatus.Admin] },
      { label: "footer.links.profile", to: Routes.Profile, audiences: MEMBER_STATUSES },
      { label: "footer.links.login", to: Routes.Login, audiences: [AuthStatus.Guest] },
      { label: "footer.links.register", to: Routes.Register, audiences: [AuthStatus.Guest] },
    ],
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

export const LINKEDIN_LINK = "https://www.linkedin.com/in/kateryna-stetsenko-72311b251/";
export const GITHUB_LINK = "https://github.com/KateySt";
