import { useAuthStore } from "../store/auth.store";

const SESSION_HINT_KEY = "has-session";

useAuthStore.subscribe((state) => {
  if (state.user) {
    localStorage.setItem(SESSION_HINT_KEY, "1");
  } else if (state.isInitialized) {
    localStorage.removeItem(SESSION_HINT_KEY);
  }
});

export const hasSessionHint = () => localStorage.getItem(SESSION_HINT_KEY) !== null;
