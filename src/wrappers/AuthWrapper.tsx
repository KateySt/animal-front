import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { Spin } from "antd";
import { useAuthStore } from "../store/auth.store";
import { authApi } from "../features/auth/api/auth.api";
import { Routes } from "../router/routes.ts";

type AuthWrapperProps = {
  requiredRole?: string;
};

const AuthWrapper = ({ requiredRole }: AuthWrapperProps) => {
  const { hasHydrated, accessToken, user, setUser, setHasHydrated } = useAuthStore(
    (state) => state,
  );
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || hasHydrated) return;
    initialized.current = true;

    authApi.me().then((user) => {
      setUser(user);
      setHasHydrated(true);
    });
  }, []);

  if (!hasHydrated) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to={Routes.Login} state={{ from: location }} replace />;
  }

  if (requiredRole && !user?.roles?.includes(requiredRole as never)) {
    return <Navigate to={Routes.Home} replace />;
  }

  return <Outlet />;
};

export default AuthWrapper;
