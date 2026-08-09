import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { Routes } from "../router/routes.ts";

const AdminWrapper = () => {
  const user = useAuthStore((state) => state.user);

  if (!user?.is_superuser) {
    return <Navigate to={Routes.Home} replace />;
  }

  return <Outlet />;
};

export default AdminWrapper;
