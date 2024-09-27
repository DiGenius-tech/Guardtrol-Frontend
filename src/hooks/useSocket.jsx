import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
// SocketContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { selectOrganization } from "../redux/selectors/auth";
import { useSelector } from "react-redux";
import { SOCKET_API_BASE_URL } from "../constants/api";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_API_BASE_URL);

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {});

    socketRef.current = socket;
  }, []);

  const emit = (eventName, data) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data);
    }
  };

  return { socket: socketRef.current, isConnected, emit };
};

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useSocket();
  const organization = useSelector(selectOrganization);

  useEffect(() => {
    if (socket) {
      socket.emit("join", `organization-${organization}`);

      socket.socket?.onAny((eventName, ...args) => {});
    }
  }, [socket, organization]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
