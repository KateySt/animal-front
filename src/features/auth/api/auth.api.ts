import { axiosInstance, BASE_URL } from "../../../lib/axios";
import type { AccessToken, LoginDto, RegisterDto, User } from "../types/auth.ts";
import axios from "axios";

export const authApi = {
  login: (data: LoginDto) => {
    const form = new URLSearchParams();
    form.append("username", data.username);
    form.append("password", data.password);
    return axiosInstance
      .post<AccessToken>("/v1/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => response.data);
  },

  register: (data: RegisterDto) =>
    axiosInstance.post<User>("/v1/auth/register", data).then((response) => response.data),

  me: () => axiosInstance.get<User>("/v1/users/me").then((response) => response.data),

  logout: () => axiosInstance.post("/v1/auth/logout"),

  refresh: () =>
    axios
      .post<AccessToken>(`${BASE_URL}/v1/auth/refresh`, null, {
        withCredentials: true,
      })
      .then((response) => response.data),

  googleLogin: () => {
    window.location.href = `${BASE_URL}/v1/auth/google/authorize`;
  },
};
