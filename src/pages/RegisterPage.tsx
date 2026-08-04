import { Button, Card, Divider, Form, Input, message, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Routes } from "../router/routes";
import { useGoogleLogin, useRegister } from "../features/auth/hooks/use-auth";
import type { RegisterDto } from "../features/auth/types/auth";
import { registerSchema } from "../features/auth/schemas/register.schema";
import styles from "./RegisterPage.module.scss";

const { Title, Text } = Typography;

export const RegisterPage = () => {
  const { t } = useTranslation("common");
  const [form] = Form.useForm();
  const { mutate: register, isPending } = useRegister();
  const googleLogin = useGoogleLogin();

  const onFinish = (values: RegisterDto & { confirmPassword: string }) => {
    register(
      { name: values.name, email: values.email, password: values.password },
      { onError: () => message.error(t("auth.register.error")) },
    );
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {t("auth.register.title")}
        </Title>
        <Text type="secondary" className={styles.subtitle}>
          {t("auth.register.subtitle")}
        </Text>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          onClick={googleLogin}
          className={styles.googleBtn}
        >
          {t("auth.register.googleBtn")}
        </Button>

        <Divider>{t("auth.register.divider")}</Divider>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={registerSchema.email()}>
            <Input size="large" placeholder="exemple@email.com" />
          </Form.Item>

          <Form.Item
            label={t("auth.register.passwordLabel")}
            name="password"
            rules={registerSchema.password()}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            label={t("auth.register.confirmLabel")}
            name="confirmPassword"
            dependencies={["password"]}
            rules={registerSchema.confirmPassword(form)}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item className={styles.submitItem}>
            <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
              {t("auth.register.submitBtn")}
            </Button>
          </Form.Item>
        </Form>

        <Text className={styles.footer}>
          {t("auth.register.hasAccount")}
          <Link to={Routes.Login}>{t("auth.register.loginLink")}</Link>
        </Text>
      </Card>
    </div>
  );
};
