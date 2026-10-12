import { useEffect } from "react";
import { Outlet, Scripts, ScrollRestoration, Meta, Links } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Spin } from "antd";
import { queryClient } from "./lib/query-client";
import { initAuthSession } from "./lib/auth-session.ts";
import { removeAntdSsrStyle } from "./lib/antd-ssr.ts";
import { useThemeStore } from "./store/theme.store.ts";
import { ThemeWrapper } from "./wrappers/ThemeWrapper.tsx";
import { Locale } from "./lib/locales.ts";
import "./lib/i18n";
import "./lib/clear-user-data";
import "./lib/session-hint";
import "./styles/global.scss";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={Locale.EN} data-theme="dark">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeWrapper>{children}</ThemeWrapper>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export const HydrateFallback = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <Spin size="large" />
    </div>
  );
};

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    removeAntdSsrStyle();
    void useThemeStore.persist.rehydrate();
    void initAuthSession();
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? Locale.EN;
  }, [i18n.resolvedLanguage]);

  return <Outlet />;
};

export default App;
