import axios, { type AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function drainQueue(token: string) {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

function rejectQueue() {
  refreshQueue.forEach((resolve) => resolve(""));
  refreshQueue = [];
}

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: AxiosRequestConfig & { _retry?: boolean } = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) return reject(error);
          original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
          resolve(axiosInstance(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ access_token: string }>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
        null,
        { withCredentials: true },
      );

      const newToken = data.access_token;
      useAuthStore.getState().setAccessToken(newToken);
      drainQueue(newToken);

      original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
      return axiosInstance(original);
    } catch {
      rejectQueue();
      useAuthStore.getState().logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
