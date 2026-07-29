import { Navigate, Outlet, useLocation } from "react-router";
import { Spin } from "antd";
import { useAuthStore } from "../store/auth.store";
import { Routes } from "../router/routes.ts";

interface AuthWrapperProps {
  requiredRole?: string;
}

const AuthWrapper = ({ requiredRole }: AuthWrapperProps) => {
  const { accessToken, user, hasHydrated } = useAuthStore((state) => state);
  const location = useLocation();

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
