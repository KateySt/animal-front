import { Button, Card, Divider, Form, Input, message, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { authApi } from "../features/auth/api/auth.api";
import { Routes } from "../router/routes";
import { useRegister } from "../features/auth/hooks/use-auth";
import type { RegisterDto } from "../features/auth/types/auth";
import { registerSchema } from "../features/auth/schemas/register.schema";

const { Title, Text } = Typography;

export const RegisterPage = () => {
  const { t } = useTranslation("common");

  const [form] = Form.useForm();

  const { mutate: register, isPending } = useRegister();

  const onFinish = (values: RegisterDto & { confirmPassword: string }) => {
    register(
      { name: values.name, email: values.email, password: values.password },
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
          {t("auth.register.title")}
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
          {t("auth.register.subtitle")}
        </Text>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          onClick={authApi.googleLogin}
          style={{ marginBottom: 16 }}
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

          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
              {t("auth.register.submitBtn")}
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          {t("auth.register.hasAccount")}
          <Link to={Routes.Login}>{t("auth.register.loginLink")}</Link>
        </Text>
      </Card>
    </div>
  );
};
