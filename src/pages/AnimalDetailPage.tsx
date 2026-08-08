import { useNavigate, useParams } from "react-router";
import { Button, Descriptions, Flex, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LoadingPage } from "../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../components/ui/ErrorPage.tsx";
import { useDateFormat } from "../hooks/use-date-format.ts";
import { useAnimal } from "../features/animals/hooks/use-animals.ts";
import { AnimalGenderTag } from "../features/animals/components/AnimalGenderTag.tsx";
import { getAnimalName } from "../features/animals/utils/translations.ts";
import { HealthLogsWidget } from "../features/health-logs/components/HealthLogsWidget.tsx";
import { Routes } from "../router/routes.ts";

const { Title } = Typography;

export const AnimalDetailPage = () => {
  const { animalId = "" } = useParams();
  const { t, i18n } = useTranslation("animals");
  const { formatDate } = useDateFormat();
  const navigate = useNavigate();

  const { data: animal, isLoading, isError, error } = useAnimal(animalId);

  if (isLoading && !animal) {
    return <LoadingPage />;
  }

  if (isError || !animal) {
    return <ErrorPage message={error?.message} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Flex align="center" gap={12} style={{ marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(Routes.Animals)}
          aria-label={t("back")}
        />
        <Title level={3} style={{ margin: 0 }}>
          {getAnimalName(animal.translations, i18n.language)}
        </Title>
      </Flex>

      <Descriptions
        bordered
        column={1}
        size="small"
        items={[
          {
            key: "gender",
            label: t("columns.gender"),
            children: <AnimalGenderTag gender={animal.gender} />,
          },
          {
            key: "birthDate",
            label: t("columns.birthDate"),
            children: formatDate(animal.birth_date),
          },
        ]}
      />

      <HealthLogsWidget animalId={animal.id} />
    </div>
  );
};
