import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { Routes } from "../router/routes.ts";

type AuthWrapperProps = {
  requiredRole?: string;
};

const AuthWrapper = ({ requiredRole }: AuthWrapperProps) => {
  const { user } = useAuthStore((state) => state);
  const location = useLocation();

  if (!user) {
    return <Navigate to={Routes.Login} state={{ from: location }} replace />;
  }

  if (requiredRole && !user?.roles?.some((role) => role.name === requiredRole)) {
    return <Navigate to={Routes.Home} replace />;
  }

  return <Outlet />;
};

export default AuthWrapper;
