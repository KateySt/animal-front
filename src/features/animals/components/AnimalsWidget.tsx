import { useState } from "react";
import { Button, Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";
import { useAnimals, useDeleteAnimal } from "../hooks/use-animals.ts";
import { AnimalsList } from "./AnimalsList.tsx";
import { AnimalFormModal } from "./AnimalFormModal.tsx";
import type { Animal } from "../types/animals.types.ts";
import { ITEMS_PER_PAGE } from "../../../constants";
import styles from "./AnimalsWidget.module.scss";

const { Title } = Typography;

export const AnimalsWidget = () => {
  const { t } = useTranslation("animals");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);

  const { data, isLoading, isError, error } = useAnimals({
    page,
    items_per_page: ITEMS_PER_PAGE,
  });
  const { mutate: deleteAnimal, isPending: isDeleting } = useDeleteAnimal();

  const openCreate = () => {
    setEditingAnimal(null);
    setIsModalOpen(true);
  };

  const openEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setIsModalOpen(true);
  };

  if (isLoading && !data) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage message={error?.message} />;
  }

  return (
    <div className={styles.widget}>
      <Flex justify="space-between" align="center" className={styles.header}>
        <Title level={3} className={styles.title}>
          {t("title")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("add")}
        </Button>
      </Flex>

      <AnimalsList
        animals={data.data}
        total={data.total}
        page={data.page}
        itemsPerPage={data.items_per_page}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onPageChange={setPage}
        onEdit={openEdit}
        onDelete={deleteAnimal}
      />

      <AnimalFormModal
        open={isModalOpen}
        animal={editingAnimal}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
