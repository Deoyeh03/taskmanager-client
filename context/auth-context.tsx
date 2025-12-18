"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_URL } from "@/utils/config";

interface User {
    id: string;
    _id?: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Fetch current user on mount (if cookie exists)
    const { data, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { "Content-Type": "application/json" },
                // Credentials include cookies
                credentials: "include",
            });
            if (!res.ok) return null;
            const json = await res.json();
            return json.data.user;
        },
        retry: false,
    });

    useEffect(() => {
        if (data) setUser(data);
    }, [data]);

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                credentials: "include",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Login failed");
            }
            return res.json();
        },
        onSuccess: (data) => {
            setUser(data.data.user);
            toast.success("Welcome back!");
            router.push("/dashboard");
        },
        onError: (err: any) => {
            toast.error(err.message);
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                credentials: "include",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Registration failed");
            }
            return res.json();
        },
        onSuccess: (data) => {
            setUser(data.data.user);
            toast.success("Account created!");
            router.push("/dashboard");
        },
        onError: (err: any) => {
            toast.error(err.message);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        },
        onSuccess: () => {
            setUser(null);
            queryClient.clear();
            router.push("/auth/login");
            toast.success("Logged out");
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login: async (d) => await loginMutation.mutateAsync(d),
                register: async (d) => await registerMutation.mutateAsync(d),
                logout: () => logoutMutation.mutate(),
                updateUser: (updatedUser) => setUser(updatedUser),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
