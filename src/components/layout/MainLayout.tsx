import { Outlet } from "react-router";
import { Layout } from "antd";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import styles from "./MainLayout.module.scss";

const { Content } = Layout;

export const MainLayout = () => {
  return (
    <Layout className={styles.layout}>
      <AppHeader />
      <Content className={styles.content}>
        <div className={styles.contentInner}>
          <Outlet />
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};
