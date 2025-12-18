"use client";

import React, { useEffect } from "react";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard, CheckSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/tasks", label: "My Tasks", icon: CheckSquare },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r bg-card flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold tracking-tight text-primary">TaskMaster</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", pathname === item.href && "font-semibold")}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-4">
                    <div className="flex items-center space-x-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto max-h-screen">
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
