"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({
  children,
  webSocketUrl,
  token,
}: {
  children: React.ReactNode;
  webSocketUrl: string;
  token: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    if (!token || !webSocketUrl) {
      console.warn("Socket will not connect: missing token or URL.");
      return;
    }

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const ws = io(webSocketUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 100,
      reconnectionDelay: 3000,
    });

    socketRef.current = ws;

    ws.on("connect", () => {
      console.log("WebSocket connected");
      setSocket(ws);

      ws.emit("join:notifications");
    });

    ws.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
      setSocket(null);

      if (!token) {
        ws.disconnect();
        return;
      }

      if (reason === "io server disconnect" || reason === "io client disconnect") return;

      const delay = 3000;
      console.warn(`WebSocket closed. Reconnecting in ${delay / 1000}s...`);

      reconnectTimeoutRef.current = setTimeout(() => {
        ws.connect();
      }, delay);
    });

    ws.on("connect_error", (error) => {
      console.warn("WebSocket connection error:", error);
    });

    ws.on("error", (event) => {
      console.warn("WebSocket error:", event);
    });
  }, [webSocketUrl, token]);

  useEffect(() => {
    if (!webSocketUrl || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      Promise.resolve().then(() => setSocket(null));
      return;
    }

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      Promise.resolve().then(() => setSocket(null));
    };
  }, [webSocketUrl, token, connectWebSocket]);

  const emit = (event: string, data?: unknown) => {
    socket?.emit(event, data);
  };

  const on = (event: string, callback: (...args: unknown[]) => void) => {
    socket?.on(event, callback);
  };

  return (
    <SocketContext.Provider value={{ socket, emit, on }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
