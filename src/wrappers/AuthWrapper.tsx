import { Navigate, Outlet, useLocation, type MetaFunction } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { initAuthSession } from "../lib/auth-session";
import { LoadingPage } from "../components/ui/LoadingPage";
import { NO_INDEX_META } from "../seo/site";
import { Routes } from "../routes";

type AuthWrapperProps = {
  requiredRole?: string;
};

export const meta: MetaFunction = () => NO_INDEX_META;

export const clientLoader = async () => {
  await initAuthSession();
  return null;
};

export const HydrateFallback = () => <LoadingPage />;

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
