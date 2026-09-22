import { useAuthStore } from "../../../store/auth.store";
import { refreshAccessToken } from "../../../lib/axios.ts";

const attempt = (input: RequestInfo | URL, init: RequestInit | undefined, token: string | null) =>
  fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...init?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

export const chatFetch: typeof fetch = async (input, init) => {
  const response = await attempt(input, init, useAuthStore.getState().accessToken);
  if (response.status !== 401) return response;

  const newToken = await refreshAccessToken();
  return attempt(input, init, newToken);
};
