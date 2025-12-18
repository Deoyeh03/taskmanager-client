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

const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register, isLoading } = useAuth();

    const form = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterData) => {
        await register(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background/50 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                        <Layers className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-muted-foreground mt-2">Join us today to start managing your tasks</p>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Register</CardTitle>
                        <CardDescription className="text-center">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="johndoe"
                                    {...form.register("username")}
                                    className="bg-background/50"
                                />
                                {form.formState.errors.username && (
                                    <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
                                )}
                            </div>
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
                                <Label htmlFor="password">Password</Label>
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
                                Create Account
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
