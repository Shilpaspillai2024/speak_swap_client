"use client";
import { useEffect } from "react";
import socketStore from "@/store/socketStore";

const SocketConnection = () => {
  useEffect(() => {
    const initSocket = async () => {
      try {
        const store = socketStore.getState();
        if (!store.isConnected) await store.connectSocket();
        console.log("socket initialized successfully");
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };
    initSocket();

    return () => {
      socketStore.getState().cleanup();
    };
  }, []);
  return null;
};

export default SocketConnection;
