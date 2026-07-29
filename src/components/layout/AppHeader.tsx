import { useState } from "react";
import { useIsMobile } from "../../hooks/use-media-query.ts";
import { Link, useLocation } from "react-router";
import { Button, Layout, Menu, type MenuProps, Space, Typography } from "antd";
import {
  CloseOutlined,
  CreditCardOutlined,
  HeartOutlined,
  HomeOutlined,
  MenuOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../store/theme.store";
import { Routes } from "../../router/routes";
import { styleConfig } from "../../style.config.ts";
import LanguageDropdown from "../ui/LanguageDropdown.tsx";
import ThemeSwitch from "../ui/ThemeSwitch.tsx";
import LogoutButton from "../ui/LogoutButton.tsx";
import UserButton from "../ui/UserButton.tsx";

const { Header } = Layout;
const { Text } = Typography;

export const AppHeader = () => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;
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
      key: Routes.Payment,
      icon: <CreditCardOutlined />,
      label: (
        <Link to={`${Routes.Payment}/new`} onClick={() => setDrawerOpen(false)}>
          {t("nav.payment")}
        </Link>
      ),
    },
  ];

  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: `1px solid ${colors.border}`,
          backdropFilter: "blur(8px)",
          background: colors.bgHeader,
          height: 56,
          lineHeight: "56px",
        }}
      >
        <Link
          to={Routes.Home}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <HeartOutlined style={{ fontSize: 20, color: styleConfig.colorPrimary }} />
          <Text
            strong
            style={{
              fontSize: styleConfig.fontSizeLG,
              color: colors.textPrimary,
              letterSpacing: 0.5,
            }}
          >
            AnimalCare
          </Text>
        </Link>

        {!isMobile && (
          <>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={navItems}
              style={{
                flex: 1,
                justifyContent: "center",
                background: "transparent",
                border: "none",
                minWidth: 0,
              }}
              className="app-header-nav"
            />

            <Space size={8} style={{ flexShrink: 0 }} className="app-header-controls">
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
            className="app-header-mobile-btn"
            style={{ color: colors.textPrimary, flexShrink: 0 }}
            onClick={() => setDrawerOpen((v) => !v)}
          />
        )}
      </Header>

      {isMobile && drawerOpen && (
        <div
          className="app-header-drawer"
          style={{
            position: "fixed",
            top: 56,
            left: 0,
            right: 0,
            zIndex: 99,
            background: colors.mobileBg,
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={navItems}
            style={{ background: "transparent", border: "none" }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
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
