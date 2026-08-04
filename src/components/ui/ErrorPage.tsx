import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Routes } from "../../router/routes";
import styles from "./ErrorPage.module.scss";

type ErrorPageProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export const ErrorPage = ({ title, message, onRetry }: ErrorPageProps) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <Result
        status="error"
        title={title ?? t("errorPage.title")}
        subTitle={message ?? t("errorPage.message")}
        extra={[
          onRetry && (
            <Button key="retry" type="primary" onClick={onRetry}>
              {t("errorPage.retry")}
            </Button>
          ),
          <Button key="home" onClick={() => navigate(Routes.Home)}>
            {t("errorPage.goHome")}
          </Button>,
        ].filter(Boolean)}
      />
    </div>
  );
};
