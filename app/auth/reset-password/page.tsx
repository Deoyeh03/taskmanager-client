"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { API_URL } from "@/utils/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, CheckCircle2, AlertCircle } from "lucide-react";

const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const form = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token");
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordData) => {
        if (!token) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: data.password
                }),
            });
            const json = await res.json();
            if (res.ok) {
                setIsSuccess(true);
                toast.success("Password reset successfully!");
                setTimeout(() => router.push("/auth/login"), 3000);
            } else {
                toast.error(json.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("Communication error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-xl">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-center text-destructive">Invalid Link</CardTitle>
                    <CardDescription className="text-center">
                        The password reset link is invalid or has expired. Please request a new one.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/auth/forgot-password">Request New Link</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    if (isSuccess) {
        return (
            <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-xl">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-center">Success!</CardTitle>
                    <CardDescription className="text-center text-green-600 dark:text-green-400">
                        Your password has been reset successfully. Redirecting you to login...
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/auth/login">Go to Login Now</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                <CardDescription className="text-center">
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
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
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...form.register("confirmPassword")}
                            className="bg-background/50"
                        />
                        {form.formState.errors.confirmPassword && (
                            <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Update Password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background/50 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                        <Layers className="h-7 w-7 text-primary-foreground" />
                    </div>
                </div>

                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
