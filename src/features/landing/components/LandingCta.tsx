import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { ButtonLink } from "../../../components/ui/ButtonLink.tsx";
import { Routes } from "../../../routes.ts";
import styles from "./LandingCta.module.scss";

const { Title, Paragraph } = Typography;

export const LandingCta = () => {
  const { t } = useTranslation("landing");

  return (
    <section aria-labelledby="cta-title" className={styles.cta}>
      <Title level={2} id="cta-title" className={styles.title}>
        {t("cta.title")}
      </Title>
      <Paragraph className={styles.text}>{t("cta.text")}</Paragraph>
      <ButtonLink to={Routes.Register} type="primary" size="large">
        {t("cta.register")}
      </ButtonLink>
    </section>
  );
};
