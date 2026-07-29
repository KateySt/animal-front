import { axiosInstance } from "../../../lib/axios";
import type { AccessToken, LoginDto, RegisterDto, User } from "../types/auth.ts";

export const authApi = {
  login: (data: LoginDto) => {
    const form = new URLSearchParams();
    form.append("username", data.username);
    form.append("password", data.password);
    return axiosInstance
      .post<AccessToken>("/v1/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((r) => r.data);
  },

  register: (data: RegisterDto) =>
    axiosInstance.post<User>("/v1/auth/register", data).then((r) => r.data),

  me: () => axiosInstance.get<User>("/v1/users/me").then((r) => r.data),

  logout: () => axiosInstance.post("/v1/auth/logout"),

  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google/authorize`;
  },
};
