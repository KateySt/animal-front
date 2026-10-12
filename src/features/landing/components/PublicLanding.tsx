import { useTranslation } from "react-i18next";
import { PulseHero } from "../../dashboard/components/PulseHero.tsx";
import { ButtonLink } from "../../../components/ui/ButtonLink.tsx";
import { LandingFeatures } from "./LandingFeatures.tsx";
import { LandingSteps } from "./LandingSteps.tsx";
import { LandingFaq } from "./LandingFaq.tsx";
import { LandingCta } from "./LandingCta.tsx";
import { Routes } from "../../../routes.ts";
import styles from "./PublicLanding.module.scss";

export const PublicLanding = () => {
  const { t } = useTranslation("landing");

  return (
    <div className={styles.page}>
      <PulseHero
        headingLevel={1}
        title={t("hero.title", { appName: import.meta.env.VITE_APP_NAME })}
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <ButtonLink to={Routes.Register} type="primary" size="large">
              {t("hero.register")}
            </ButtonLink>
            <ButtonLink to={Routes.Login} size="large">
              {t("hero.login")}
            </ButtonLink>
          </>
        }
      />

      <LandingFeatures />
      <LandingSteps />
      <LandingFaq />
      <LandingCta />
    </div>
  );
};
