import type { MetaFunction } from "react-router";
import { PetsDashboard } from "../features/dashboard/components/PetsDashboard.tsx";
import { PublicLanding } from "../features/landing/components/PublicLanding.tsx";
import { LoadingPage } from "../components/ui/LoadingPage.tsx";
import { AuthStatus, useAuthStatus } from "../features/auth/hooks/use-auth-status.ts";
import { APP_NAME, buildPageMeta, SITE_DESCRIPTION, WEB_APPLICATION_SCHEMA } from "../seo/site.ts";
import { Routes } from "../routes.ts";

export const meta: MetaFunction = () => [
  ...buildPageMeta({
    title: `${APP_NAME}: animal health records, payments and AI assistant`,
    description: SITE_DESCRIPTION,
    path: Routes.Home,
  }),
  { "script:ld+json": WEB_APPLICATION_SCHEMA },
];

const HomePage = () => {
  const authStatus = useAuthStatus();

  if (authStatus === AuthStatus.Pending) {
    return <LoadingPage />;
  }

  return authStatus === AuthStatus.Guest ? <PublicLanding /> : <PetsDashboard />;
};

export default HomePage;
