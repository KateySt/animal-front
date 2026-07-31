import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { Routes } from "../router/routes.ts";

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

let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

function processQueue(error: any, token: string | null = null) {
  queue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
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
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(original));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshInstance.post("/auth/refresh");
      const data = response.data;

      useAuthStore.getState().setAccessToken(data.access_token);
      processQueue(null, data.access_token);

      original.headers.Authorization = `Bearer ${data.access_token}`;
      return axiosInstance(original);
    } catch (refreshError) {
      processQueue(refreshError, null);

      useAuthStore.getState().logout();
      window.location.href = Routes.Login;
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
