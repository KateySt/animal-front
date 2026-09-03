import { Outlet, Scripts, ScrollRestoration, Meta, Links } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Spin } from "antd";
import { queryClient } from "./lib/query-client";
import { axiosInstance, refreshInstance } from "./lib/axios.ts";
import { useAuthStore } from "./store/auth.store.ts";
import ThemeWrapper from "./wrappers/ThemeWrapper.tsx";
import "./lib/i18n";
import "./styles/global.scss";

export async function clientLoader() {
  const { setAccessToken, setUser, setInitialized, logout } = useAuthStore.getState();

  try {
    const refreshResponse = await refreshInstance.post("/v1/auth/refresh");
    setAccessToken(refreshResponse.data.access_token);

    const meResponse = await axiosInstance.get("/v1/users/me");
    setUser(meResponse.data);
  } catch {
    logout();
  } finally {
    setInitialized(true);
  }

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>animal-front</title>
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
}

export function HydrateFallback() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <Spin size="large" />
    </div>
  );
}

export default function App() {
  return <Outlet />;
}
