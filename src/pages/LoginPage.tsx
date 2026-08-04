import { Button, Card, Divider, Form, Input, message, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { LoginDto } from "../features/auth/types/auth";
import { Routes } from "../router/routes";
import { useGoogleLogin, useLogin } from "../features/auth/hooks/use-auth.ts";
import { loginSchema } from "../features/auth/schemas/register.schema.ts";
import styles from "./LoginPage.module.scss";

const { Title, Text } = Typography;

export const LoginPage = () => {
  const { t } = useTranslation("common");
  const { mutate: login, isPending } = useLogin();
  const googleLogin = useGoogleLogin();

  const onFinish = (values: LoginDto) => {
    login(
      { username: values.username, password: values.password },
      { onError: () => message.error(t("auth.register.error")) },
    );
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {t("auth.login.title")}
        </Title>
        <Text type="secondary" className={styles.subtitle}>
          {t("auth.login.subtitle")}
        </Text>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          onClick={googleLogin}
          className={styles.googleBtn}
        >
          {t("auth.login.googleBtn")}
        </Button>

        <Divider>{t("auth.login.divider")}</Divider>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item label="Email" name="username" rules={loginSchema.username()}>
            <Input size="large" placeholder="exemple@email.com" />
          </Form.Item>

          <Form.Item
            label={t("auth.login.passwordLabel")}
            name="password"
            rules={loginSchema.password()}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item className={styles.submitItem}>
            <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
              {t("auth.login.submitBtn")}
            </Button>
          </Form.Item>
        </Form>

        <Text className={styles.footer}>
          {t("auth.login.noAccount")}
          <Link to={Routes.Register}>{t("auth.login.registerLink")}</Link>
        </Text>
      </Card>
    </div>
  );
};
