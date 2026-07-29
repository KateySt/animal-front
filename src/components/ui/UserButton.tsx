import { Avatar, Dropdown, type MenuProps, Space, Typography } from "antd";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { styleConfig } from "../../style.config.ts";
import { useThemeStore } from "../../store/theme.store.ts";
import { Link } from "react-router";
import { Routes } from "../../router/routes.ts";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store.ts";

const { Text } = Typography;

const UserButton = () => {
  const { t } = useTranslation("common");
  const { user } = useAuthStore((state) => state);

  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to={Routes.Profile}>{t("nav.profile")}</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to={Routes.Settings}>{t("nav.settings")}</Link>,
    },
  ];

  return (
    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
      <Space style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
        <Avatar
          size={32}
          icon={<UserOutlined />}
          style={{ background: styleConfig.colorPrimary }}
        />
        <Text
          style={{
            color: colors.textPrimary,
            maxWidth: 100,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.email ?? "-"}
        </Text>
      </Space>
    </Dropdown>
  );
};

export default UserButton;
