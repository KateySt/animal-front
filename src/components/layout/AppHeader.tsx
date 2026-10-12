import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Button, Layout, Menu, type MenuProps, Space } from "antd";
import {
  CloseOutlined,
  FileTextOutlined,
  HeartOutlined,
  HomeOutlined,
  MenuOutlined,
  MessageOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Routes } from "../../routes";
import { LanguageDropdown } from "../ui/LanguageDropdown.tsx";
import { ThemeSwitch } from "../ui/ThemeSwitch.tsx";
import { LogoutButton } from "../ui/LogoutButton.tsx";
import { UserButton } from "../ui/UserButton.tsx";
import { ButtonLink } from "../ui/ButtonLink.tsx";
import {
  AuthStatus,
  isVisibleFor,
  MEMBER_STATUSES,
  useAuthStatus,
  type AuthStatusType,
} from "../../features/auth/hooks/use-auth-status.ts";
import styles from "./AppHeader.module.scss";

const { Header } = Layout;

type NavLink = {
  to: string;
  label: string;
  icon: ReactNode;
  audiences?: AuthStatusType[];
};

const NAV_LINKS: NavLink[] = [
  { to: Routes.Home, label: "nav.home", icon: <HomeOutlined /> },
  { to: Routes.Animals, label: "nav.animals", icon: <TeamOutlined />, audiences: MEMBER_STATUSES },
  {
    to: Routes.Invoices,
    label: "nav.invoices",
    icon: <FileTextOutlined />,
    audiences: MEMBER_STATUSES,
  },
  { to: Routes.Chat, label: "nav.chat", icon: <MessageOutlined />, audiences: MEMBER_STATUSES },
];

type AccountControlsProps = {
  authStatus: AuthStatusType;
  onNavigate: () => void;
};

const AccountControls = ({ authStatus, onNavigate }: AccountControlsProps) => {
  const { t } = useTranslation("common");

  if (authStatus === AuthStatus.Pending) return null;

  if (authStatus === AuthStatus.Guest) {
    return (
      <Space size={8}>
        <ButtonLink to={Routes.Login} type="text" onClick={onNavigate}>
          {t("nav.login")}
        </ButtonLink>
        <ButtonLink to={Routes.Register} type="primary" onClick={onNavigate}>
          {t("nav.register")}
        </ButtonLink>
      </Space>
    );
  }

  return (
    <Space size={8}>
      <UserButton />
      <LogoutButton onLogout={onNavigate} />
    </Space>
  );
};

export const AppHeader = () => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const authStatus = useAuthStatus();
  const closeDrawer = () => setDrawerOpen(false);

  const selectedKey =
    Object.values(Routes).find(
      (route) =>
        route !== Routes.Login &&
        route !== Routes.Register &&
        location.pathname.startsWith(route) &&
        route !== "/",
    ) ?? (location.pathname === "/" ? Routes.Home : "");

  const navItems: MenuProps["items"] = NAV_LINKS.filter((link) =>
    isVisibleFor(link.audiences, authStatus),
  ).map((link) => ({
    key: link.to,
    icon: link.icon,
    label: (
      <Link to={link.to} onClick={closeDrawer}>
        {t(link.label)}
      </Link>
    ),
  }));

  return (
    <>
      <Header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to={Routes.Home} className={styles.logo}>
            <HeartOutlined className={styles.logoIcon} />
            <span className={styles.logoText}>{import.meta.env.VITE_APP_NAME}</span>
          </Link>

          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={navItems}
            className={styles.nav}
          />

          <Space size={8} className={styles.controls}>
            <ThemeSwitch />
            <LanguageDropdown />
            <AccountControls authStatus={authStatus} onNavigate={closeDrawer} />
          </Space>

          <Button
            type="text"
            icon={drawerOpen ? <CloseOutlined /> : <MenuOutlined />}
            className={styles.mobileBtn}
            onClick={() => setDrawerOpen((v) => !v)}
          />
        </div>
      </Header>

      {drawerOpen && (
        <div className={styles.drawer}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={navItems}
            className={styles.drawerMenu}
          />

          <div className={styles.drawerControls}>
            <Space size={6}>
              <ThemeSwitch />
              <LanguageDropdown />
            </Space>
            <AccountControls authStatus={authStatus} onNavigate={closeDrawer} />
          </div>
        </div>
      )}
    </>
  );
};
