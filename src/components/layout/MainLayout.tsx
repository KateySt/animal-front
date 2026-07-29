import { Outlet } from "react-router";
import { Layout } from "antd";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { styleConfig } from "../../style.config";

const { Content } = Layout;

export const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Content style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: styleConfig.maxContentWidth, margin: "0 auto" }}>
          <Outlet />
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};
