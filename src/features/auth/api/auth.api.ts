import { axiosInstance, BASE_URL } from "../../../lib/axios";
import type { AccessToken, LoginDto, RegisterDto, User } from "../types/auth.ts";

const basePath = "/v1/auth";

export const authApi = {
  login: (data: LoginDto) => {
    const form = new URLSearchParams();
    form.append("username", data.username);
    form.append("password", data.password);
    return axiosInstance
      .post<AccessToken>(`${basePath}/login`, form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => response.data);
  },

  register: (data: RegisterDto) =>
    axiosInstance.post<User>(`${basePath}/register`, data).then((response) => response.data),

  me: () => axiosInstance.get<User>("/v1/users/me").then((response) => response.data),

  logout: () => axiosInstance.post(`${basePath}/logout`),

  googleLogin: () => {
    window.location.href = `${BASE_URL}${basePath}/google/authorize`;
  },
};
