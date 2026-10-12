import { useSyncExternalStore } from "react";
import { useAuthStore } from "../../../store/auth.store.ts";
import { hasSessionHint } from "../../../lib/session-hint.ts";

export const AuthStatus = {
  Pending: "pending",
  Guest: "guest",
  User: "user",
  Admin: "admin",
} as const;

export type AuthStatusType = (typeof AuthStatus)[keyof typeof AuthStatus];

export const MEMBER_STATUSES: AuthStatusType[] = [AuthStatus.User, AuthStatus.Admin];

export const isVisibleFor = (audiences: AuthStatusType[] | undefined, status: AuthStatusType) =>
  !audiences || audiences.includes(status);

const subscribeToNothing = () => () => {};

export const useAuthStatus = (): AuthStatusType => {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isSessionExpected = useSyncExternalStore(subscribeToNothing, hasSessionHint, () => false);

  if (user) return user.is_superuser ? AuthStatus.Admin : AuthStatus.User;
  return !isInitialized && isSessionExpected ? AuthStatus.Pending : AuthStatus.Guest;
};
