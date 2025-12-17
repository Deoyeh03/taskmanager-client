"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/auth-context";
import { SOCKET_URL } from "@/utils/config";

export const useSocket = () => {
    const { user } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (user && !socketRef.current) {
            socketRef.current = io(SOCKET_URL, {
                withCredentials: true,
                query: { userId: user.id }
            });

            socketRef.current.on("connect", () => {
                console.log("Socket connected");
            });
        }

        return () => {
            if (!user && socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user]);

    return socketRef.current;
};
