import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store.ts";
import { router } from "../router";
import { RouterProvider } from "react-router";
import { Spin } from "antd";
import { axiosInstance, refreshInstance } from "../lib/axios.ts";

const InitializeApp = () => {
  const { isInitialized, setAccessToken, setUser, setInitialized, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshResponse = await refreshInstance.post("/v1/auth/refresh");
        const { access_token } = refreshResponse.data;
        setAccessToken(access_token);

        const meResponse = await axiosInstance.get("/v1/users/me");
        setUser(meResponse.data);
      } catch {
        logout();
      } finally {
        setInitialized(true);
      }
    };

    void initializeAuth();
  }, []);

  if (!isInitialized) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default InitializeApp;
