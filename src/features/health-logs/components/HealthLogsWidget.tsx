import { useState } from "react";
import { Button, Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LoadingPage } from "../../../components/ui/LoadingPage.tsx";
import { ErrorPage } from "../../../components/ui/ErrorPage.tsx";
import { ITEMS_PER_PAGE } from "../../../constants";
import { useDeleteHealthLog, useHealthLogs } from "../hooks/use-health-logs.ts";
import { HealthLogsList } from "./HealthLogsList.tsx";
import { HealthLogFormModal } from "./HealthLogFormModal.tsx";
import type { HealthLog } from "../types/health-logs.types.ts";
import styles from "./HealthLogsWidget.module.scss";

const { Title } = Typography;

type HealthLogsWidgetProps = {
  animalId: string;
};

export const HealthLogsWidget = ({ animalId }: HealthLogsWidgetProps) => {
  const { t } = useTranslation("animals");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHealthLog, setEditingHealthLog] = useState<HealthLog | null>(null);

  const { data, isLoading, isError, error } = useHealthLogs(animalId, {
    page,
    items_per_page: ITEMS_PER_PAGE,
  });
  const { mutate: deleteHealthLog, isPending: isDeleting } = useDeleteHealthLog(animalId);

  const openCreate = () => {
    setEditingHealthLog(null);
    setIsModalOpen(true);
  };

  const openEdit = (healthLog: HealthLog) => {
    setEditingHealthLog(healthLog);
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
          {t("healthLogs.title")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("healthLogs.add")}
        </Button>
      </Flex>

      <HealthLogsList
        healthLogs={data.data}
        total={data.total_count}
        page={data.page}
        itemsPerPage={data.items_per_page}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onPageChange={setPage}
        onEdit={openEdit}
        onDelete={deleteHealthLog}
      />

      <HealthLogFormModal
        open={isModalOpen}
        animalId={animalId}
        healthLog={editingHealthLog}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
