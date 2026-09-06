import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { PulseHero } from "../features/dashboard/components/PulseHero.tsx";
import { PetPulseCard } from "../features/animals/components/PetPulseCard.tsx";
import { EmptyPetsState } from "../features/animals/components/EmptyPetsState.tsx";
import { AnimalFormModal } from "../features/animals/components/AnimalFormModal.tsx";
import { LoadingPage } from "../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../components/ui/ErrorPage.tsx";
import { useAnimals } from "../features/animals/hooks/use-animals.ts";
import { getAnimalName } from "../features/animals/utils/translations.ts";
import { Routes } from "../routes.ts";
import { ITEMS_PER_PAGE } from "../constants";
import styles from "./HomePage.module.scss";

const cardListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const { i18n } = useTranslation();
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
      <PulseHero totalAnimals={data.total} />

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

export default HomePage;
