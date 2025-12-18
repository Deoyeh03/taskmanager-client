"use client";

import React, { useEffect } from "react";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard, CheckSquare, Menu, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isStandalone, setIsStandalone] = React.useState(false);

    // Detect if app is running in standalone mode (PWA)
    React.useEffect(() => {
        const checkStandalone = () => {
            const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://');
            setIsStandalone(isStandalonePWA);
        };
        checkStandalone();
    }, []);

    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, isLoading, router]);

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

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
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-white" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">TaskManager</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-white" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-primary">TaskManager</h1>
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
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
            <main className="flex-1 overflow-y-auto w-full">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
