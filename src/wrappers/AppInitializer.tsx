import { useEffect, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { setAccessToken, setHasHydrated } = useAuthStore((state) => state);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    axios
      .post<{ access_token: string }>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
        null,
        { withCredentials: true },
      )
      .then(({ data }) => setAccessToken(data.access_token))
      .catch(() => {})
      .finally(() => setHasHydrated(true));
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
