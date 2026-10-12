import type { ReactNode } from "react";
import { Typography } from "antd";
import {
  CreditCardOutlined,
  FilePdfOutlined,
  MedicineBoxOutlined,
  MessageOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LandingSection } from "./LandingSection.tsx";
import styles from "./LandingFeatures.module.scss";

const { Title, Paragraph } = Typography;

const FEATURES: { key: string; icon: ReactNode }[] = [
  { key: "pets", icon: <TeamOutlined /> },
  { key: "health", icon: <MedicineBoxOutlined /> },
  { key: "payments", icon: <CreditCardOutlined /> },
  { key: "assistant", icon: <MessageOutlined /> },
  { key: "documents", icon: <FilePdfOutlined /> },
];

export const LandingFeatures = () => {
  const { t } = useTranslation("landing");

  return (
    <LandingSection id="features" title={t("features.title")}>
      <ul className={styles.grid}>
        {FEATURES.map(({ key, icon }) => (
          <li key={key} className={styles.card}>
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
            <Title level={3} className={styles.cardTitle}>
              {t(`features.items.${key}.title`)}
            </Title>
            <Paragraph className={styles.cardText}>{t(`features.items.${key}.text`)}</Paragraph>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
};
