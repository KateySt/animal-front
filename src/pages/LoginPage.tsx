import { Button, Card, Divider, Form, Input, message, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { authApi } from "../features/auth/api/auth.api";
import type { LoginDto } from "../features/auth/types/auth";
import { Routes } from "../router/routes";
import { useLogin } from "../features/auth/hooks/use-auth.ts";
import { loginSchema } from "../features/auth/schemas/register.schema.ts";

const { Title, Text } = Typography;

export const LoginPage = () => {
  const { t } = useTranslation("common");

  const { mutate: login, isPending } = useLogin();

  const onFinish = (values: LoginDto) => {
    login(
      { username: values.username, password: values.password },
      { onError: () => message.error(t("auth.register.error")) },
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
          {t("auth.login.title")}
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
          {t("auth.login.subtitle")}
        </Text>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          onClick={authApi.googleLogin}
          style={{ marginBottom: 16 }}
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

          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
              {t("auth.login.submitBtn")}
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          {t("auth.login.noAccount")}
          <Link to={Routes.Register}>{t("auth.login.registerLink")}</Link>
        </Text>
      </Card>
    </div>
  );
};
