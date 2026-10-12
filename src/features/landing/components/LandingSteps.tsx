import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { LandingSection } from "./LandingSection.tsx";
import styles from "./LandingSteps.module.scss";

const { Title, Paragraph } = Typography;

const STEP_KEYS = ["account", "pets", "assistant"];

export const LandingSteps = () => {
  const { t } = useTranslation("landing");

  return (
    <LandingSection id="how-it-works" title={t("steps.title")}>
      <ol className={styles.list}>
        {STEP_KEYS.map((key, index) => (
          <li key={key} className={styles.step}>
            <span className={styles.number} aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <Title level={3} className={styles.stepTitle}>
                {t(`steps.items.${key}.title`)}
              </Title>
              <Paragraph className={styles.stepText}>{t(`steps.items.${key}.text`)}</Paragraph>
            </div>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
};
