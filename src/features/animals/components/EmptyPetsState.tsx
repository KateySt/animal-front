import { useRef, useState, type MouseEvent } from "react";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import styles from "./EmptyPetsState.module.scss";

const { Title, Text } = Typography;

const MAX_PUPIL_OFFSET = 3;

type EmptyPetsStateProps = {
  onAdd: () => void;
};

export const EmptyPetsState = ({ onAdd }: EmptyPetsStateProps) => {
  const { t } = useTranslation("animals");
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const ratioX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ratioY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    setPupilOffset({
      x: Math.max(-1, Math.min(1, ratioX)) * MAX_PUPIL_OFFSET,
      y: Math.max(-1, Math.min(1, ratioY)) * MAX_PUPIL_OFFSET,
    });
  };

  const handleMouseLeave = () => setPupilOffset({ x: 0, y: 0 });

  return (
    <div
      className={styles.wrapper}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox="0 0 120 100" className={styles.cat} aria-hidden="true">
        <ellipse cx="60" cy="55" rx="45" ry="38" className={styles.face} />
        <polygon points="20,30 35,5 45,35" className={styles.ear} />
        <polygon points="100,30 85,5 75,35" className={styles.ear} />
        <g
          className={styles.pupilGroup}
          style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}
        >
          <circle cx="42" cy="52" r="7" className={styles.eye} />
          <circle cx="78" cy="52" r="7" className={styles.eye} />
        </g>
        <ellipse cx="60" cy="68" rx="4" ry="3" className={styles.nose} />
      </svg>

      <Title level={4} className={styles.title}>
        {t("empty")}
      </Title>
      <Text type="secondary">{t("emptyHint")}</Text>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        {t("add")}
      </Button>
    </div>
  );
};
