import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { PulseHero } from "./PulseHero.tsx";
import { PetPulseCard } from "../../animals/components/PetPulseCard.tsx";
import { EmptyPetsState } from "../../animals/components/EmptyPetsState.tsx";
import { AnimalFormModal } from "../../animals/components/AnimalFormModal.tsx";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";
import { useAnimals } from "../../animals/hooks/use-animals.ts";
import { getAnimalName } from "../../animals/utils/translations.ts";
import { Routes } from "../../../routes.ts";
import { ITEMS_PER_PAGE } from "../../../constants";
import styles from "./PetsDashboard.module.scss";

const cardListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const PetsDashboard = () => {
  const { t, i18n } = useTranslation("animals");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useAnimals({
    page: 1,
    items_per_page: ITEMS_PER_PAGE,
  });

  if (isLoading && !data) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage message={error?.message} />;
  }

  return (
    <div className={styles.page}>
      <PulseHero
        title={t("hero.title")}
        subtitle={
          data.total > 0 ? t("hero.petsInCare", { count: data.total }) : t("hero.emptySubtitle")
        }
      />

      {data.data.length === 0 ? (
        <EmptyPetsState onAdd={() => setIsModalOpen(true)} />
      ) : (
        <motion.div
          className={styles.grid}
          variants={cardListVariants}
          initial="hidden"
          animate="visible"
        >
          {data.data.map((animal) => (
            <motion.div key={animal.id} variants={cardVariants}>
              <PetPulseCard
                name={getAnimalName(animal.translations, i18n.language)}
                gender={animal.gender}
                onView={() => navigate(`${Routes.Animals}/${animal.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimalFormModal open={isModalOpen} animal={null} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
