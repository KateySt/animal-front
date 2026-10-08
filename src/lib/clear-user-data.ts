import { queryClient } from "./query-client";
import { useAuthStore } from "../store/auth.store";
import { useChatStore } from "../store/chat.store";

useAuthStore.subscribe((state, prev) => {
  if (prev.user && prev.user.id !== state.user?.id) {
    queryClient.clear();
    useChatStore.getState().reset();
  }
});
