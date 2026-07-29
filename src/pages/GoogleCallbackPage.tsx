import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { Routes } from "../router/routes";
import { LoadingPage } from "../components/ui/LoadingPage";
import { useMe } from "../features/auth/hooks/use-auth.ts";

export const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setAccessToken } = useAuthStore();
  const { mutate: getMe } = useMe(() => navigate(Routes.Home, { replace: true }));

  useEffect(() => {
    const token = searchParams.get("access_token");

    if (!token) {
      navigate(Routes.Login, { replace: true });
      return;
    }

    setAccessToken(token);

    getMe();
  }, []);

  return <LoadingPage />;
};
