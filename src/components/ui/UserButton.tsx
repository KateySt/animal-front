import { Avatar, Dropdown, type MenuProps, Typography } from "antd";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Routes } from "../../router/routes.ts";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store.ts";
import styles from "./UserButton.module.scss";

const { Text } = Typography;

const UserButton = () => {
  const { t } = useTranslation("common");
  const { user } = useAuthStore((state) => state);

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
      <span className={styles.trigger}>
        <Avatar size={32} icon={<UserOutlined />} className={styles.avatar} />
        <Text className={styles.email}>{user?.email ?? "-"}</Text>
      </span>
    </Dropdown>
  );
};

export default UserButton;
