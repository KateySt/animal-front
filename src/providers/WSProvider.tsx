import { io, type Socket } from "socket.io-client";
import { type FC, useEffect, useMemo, createContext, useContext } from "react";
import { WS_BASE_URL, refreshAccessToken } from "../lib/axios.ts";
import { useAuthStore } from "../store/auth.store.ts";

type Props = {
  children: React.ReactNode;
};

export const WSProvider: FC<Props> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  const socket = useMemo<Socket | null>(
    () =>
      isAuthenticated
        ? io(WS_BASE_URL, {
            transports: ["websocket"],
            auth: (cb) => cb({ token: useAuthStore.getState().accessToken }),
            path: "/ws",
            autoConnect: false,
          })
        : null,
    [isAuthenticated],
  );

  useEffect(() => {
    if (!socket) return;

    let hasRetriedAuth = false;

    const handleConnect = () => {
      hasRetriedAuth = false;
    };

    const handleConnectError = () => {
      if (socket.active || hasRetriedAuth) return;
      hasRetriedAuth = true;
      refreshAccessToken()
        .then(() => socket.connect())
        .catch(() => undefined);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [socket]);

  return <WSContext.Provider value={socket}>{children}</WSContext.Provider>;
};

const WSContext = createContext<Socket | null>(null);

export const useWS = () => useContext(WSContext);
