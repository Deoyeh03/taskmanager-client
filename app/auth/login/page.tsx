"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, isLoading } = useAuth();

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginData) => {
        await login(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background/50 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                        <Layers className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Login</CardTitle>
                        <CardDescription className="text-center">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...form.register("email")}
                                    className="bg-background/50"
                                />
                                {form.formState.errors.email && (
                                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        className="text-xs text-muted-foreground hover:text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...form.register("password")}
                                    className="bg-background/50"
                                />
                                {form.formState.errors.password && (
                                    <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold"
                                isLoading={isLoading}
                            >
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
