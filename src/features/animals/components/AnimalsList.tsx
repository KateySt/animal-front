import { Button, Popconfirm, Space, Table, type TablePaginationConfig } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "../../../hooks/use-date-format.ts";
import { AnimalGenderTag } from "./AnimalGenderTag.tsx";
import { getAnimalName } from "../utils/translations.ts";
import type { Animal } from "../types/animals.types.ts";

type AnimalsListProps = {
  animals: Animal[];
  total: number;
  page: number;
  itemsPerPage: number;
  isLoading: boolean;
  isDeleting: boolean;
  onPageChange: (page: number) => void;
  onEdit: (animal: Animal) => void;
  onDelete: (animalId: string) => void;
};

export const AnimalsList = ({
  animals,
  total,
  page,
  itemsPerPage,
  isLoading,
  isDeleting,
  onPageChange,
  onEdit,
  onDelete,
}: AnimalsListProps) => {
  const { t } = useTranslation("animals");
  const { formatDate } = useDateFormat();

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize: itemsPerPage,
    total,
    showSizeChanger: false,
    onChange: onPageChange,
  };

  return (
    <Table<Animal>
      rowKey="id"
      dataSource={animals}
      loading={isLoading}
      pagination={pagination}
      locale={{ emptyText: t("empty") }}
    >
      <Table.Column
        title={t("columns.name")}
        key="name"
        render={(_, animal: Animal) => getAnimalName(animal.translations)}
      />
      <Table.Column
        title={t("columns.gender")}
        key="gender"
        render={(_, animal: Animal) => <AnimalGenderTag gender={animal.gender} />}
      />
      <Table.Column
        title={t("columns.birthDate")}
        key="birthDate"
        render={(_, animal: Animal) => formatDate(animal.birth_date)}
      />
      <Table.Column
        title={t("columns.actions")}
        key="actions"
        width={120}
        render={(_, animal: Animal) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(animal)}
              aria-label={t("edit")}
            />
            <Popconfirm
              title={t("deleteConfirm")}
              okText={t("delete")}
              cancelText={t("form.cancel")}
              onConfirm={() => onDelete(animal.id)}
              okButtonProps={{ danger: true, loading: isDeleting }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} aria-label={t("delete")} />
            </Popconfirm>
          </Space>
        )}
      />
    </Table>
  );
};
