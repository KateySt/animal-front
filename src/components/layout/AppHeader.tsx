import { useState } from "react";
import { useIsMobile } from "../../hooks/use-media-query.ts";
import { Link, useLocation } from "react-router";
import { Button, Layout, Menu, type MenuProps, Space } from "antd";
import {
  CloseOutlined,
  HeartOutlined,
  HomeOutlined,
  MenuOutlined,
  MessageOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Routes } from "../../router/routes";
import LanguageDropdown from "../ui/LanguageDropdown.tsx";
import ThemeSwitch from "../ui/ThemeSwitch.tsx";
import LogoutButton from "../ui/LogoutButton.tsx";
import UserButton from "../ui/UserButton.tsx";
import styles from "./AppHeader.module.scss";

const { Header } = Layout;

export const AppHeader = () => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const selectedKey =
    Object.values(Routes).find(
      (route) =>
        route !== Routes.Login &&
        route !== Routes.Register &&
        location.pathname.startsWith(route) &&
        route !== "/",
    ) ?? (location.pathname === "/" ? Routes.Home : "");

  const navItems: MenuProps["items"] = [
    {
      key: Routes.Home,
      icon: <HomeOutlined />,
      label: (
        <Link to={Routes.Home} onClick={() => setDrawerOpen(false)}>
          {t("nav.home")}
        </Link>
      ),
    },
    {
      key: Routes.Animals,
      icon: <TeamOutlined />,
      label: (
        <Link to={Routes.Animals} onClick={() => setDrawerOpen(false)}>
          {t("nav.animals")}
        </Link>
      ),
    },
    {
      key: Routes.Chat,
      icon: <MessageOutlined />,
      label: (
        <Link to={Routes.Chat} onClick={() => setDrawerOpen(false)}>
          {t("nav.chat")}
        </Link>
      ),
    },
  ];

  return (
    <>
      <Header className={styles.header}>
        <Link to={Routes.Home} className={styles.logo}>
          <HeartOutlined className={styles.logoIcon} />
          <span className={styles.logoText}>{import.meta.env.APP_NAME}</span>
        </Link>

        {!isMobile && (
          <>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={navItems}
              className={styles.nav}
            />

            <Space size={8} className={styles.controls}>
              <ThemeSwitch />
              <LanguageDropdown />
              <UserButton />
              <LogoutButton onLogout={() => setDrawerOpen(false)} />
            </Space>
          </>
        )}

        {isMobile && (
          <Button
            type="text"
            icon={drawerOpen ? <CloseOutlined /> : <MenuOutlined />}
            className={styles.mobileBtn}
            onClick={() => setDrawerOpen((v) => !v)}
          />
        )}
      </Header>

      {isMobile && drawerOpen && (
        <div className={styles.drawer}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={navItems}
            className={styles.drawerMenu}
          />

          <div className={styles.drawerControls}>
            <UserButton />
            <Space size={6}>
              <ThemeSwitch />
              <LanguageDropdown />
              <LogoutButton onLogout={() => setDrawerOpen(false)} />
            </Space>
          </div>
        </div>
      )}
    </>
  );
};
