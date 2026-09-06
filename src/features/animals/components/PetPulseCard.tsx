import { Avatar, Typography } from "antd";
import { motion, useReducedMotion } from "motion/react";
import { AnimalGenderTag } from "./AnimalGenderTag.tsx";
import type { GenderType } from "../types/animals.types.ts";
import styles from "./PetPulseCard.module.scss";

const { Text } = Typography;

type PetPulseCardProps = {
  name: string;
  gender: GenderType;
  onView: () => void;
};

export const PetPulseCard = ({ name, gender, onView }: PetPulseCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={styles.card}
      onClick={onView}
      whileHover={prefersReducedMotion ? undefined : { rotate: -2, scale: 1.02 }}
      animate={prefersReducedMotion ? undefined : { scale: [1, 1.015, 1] }}
      transition={
        prefersReducedMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <Avatar size={48} className={styles.avatar}>
        {name.charAt(0).toUpperCase()}
      </Avatar>

      <Text className={styles.name}>{name}</Text>
      <AnimalGenderTag gender={gender} />
    </motion.button>
  );
};
