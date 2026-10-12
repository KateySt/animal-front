import type { ReactNode } from "react";
import { Typography } from "antd";
import styles from "./LandingSection.module.scss";

const { Title } = Typography;

type LandingSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export const LandingSection = ({ id, title, children }: LandingSectionProps) => {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <Title level={2} id={headingId} className={styles.title}>
        {title}
      </Title>
      {children}
    </section>
  );
};
