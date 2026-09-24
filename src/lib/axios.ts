import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { Routes } from "../routes";

export const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const refreshInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshInstance
      .post("/v1/auth/refresh")
      .then((response) => {
        const token = response.data.access_token as string;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch((error) => {
        useAuthStore.getState().logout();
        window.location.href = Routes.Login;
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    const token = await refreshAccessToken();
    original.headers.Authorization = `Bearer ${token}`;
    return axiosInstance(original);
  },
);
