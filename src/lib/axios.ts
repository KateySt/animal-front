import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { Routes } from "../router/routes.ts";
import { authApi } from "../features/auth/api/auth.api.ts";

export const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const axiosInstance = axios.create({
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

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  queue.forEach((resolve) => resolve(token));
  queue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const data = await authApi.refresh();

      useAuthStore.getState().setAccessToken(data.access_token);
      useAuthStore.getState().setHasHydrated(true);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
      processQueue(data.access_token);

      original.headers.Authorization = `Bearer ${data.access_token}`;
      return axiosInstance(original);
    } catch (error) {
      queue = [];
      useAuthStore.getState().logout();
      useAuthStore.getState().setHasHydrated(true);
      window.location.href = Routes.Login;
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
