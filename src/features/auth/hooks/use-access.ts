import { useAuthStore } from "../../../store/auth.store.ts";

export const useHasRole = (roleName: string) =>
  useAuthStore(
    (state) =>
      state.user?.is_superuser === true ||
      (state.user?.roles?.some((role) => role.name === roleName) ?? false),
  );

export const useIsSuperuser = () => useAuthStore((state) => state.user?.is_superuser ?? false);
