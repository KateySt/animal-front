import { axiosInstance, refreshInstance } from "./axios";
import { useAuthStore } from "../store/auth.store";

let sessionPromise: Promise<void> | null = null;

const restoreSession = async () => {
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
};

export const initAuthSession = () => {
  sessionPromise ??= restoreSession();
  return sessionPromise;
};
