import { io, type Socket } from "socket.io-client";
import { type FC, useEffect, useState, createContext, useContext, useRef } from "react";
import { WS_BASE_URL } from "../lib/axios.ts";
import { useAuthStore } from "../store/auth.store.ts";

type Props = {
  children: React.ReactNode;
};

export const WSProvider: FC<Props> = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    if (!socketRef.current) {
      socketRef.current = io(WS_BASE_URL, {
        transports: ['websocket'],
        auth: { token: accessToken },
        path: '/ws',
      });
    }

    socketRef.current.on('connect', () => {
      console.log('-----connect-----');
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  return <WSContext.Provider value={socketRef.current}>{children}</WSContext.Provider>;
};

const WSContext = createContext<Socket | null>(null);

export const useWS = () => useContext(WSContext);
