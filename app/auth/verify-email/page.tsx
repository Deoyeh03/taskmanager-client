"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { API_URL } from "@/utils/config";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Missing verification token.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/auth/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const json = await res.json();

                if (res.ok) {
                    setStatus("success");
                    toast.success("Email verified successfully!");
                } else {
                    setStatus("error");
                    setMessage(json.message || "Verification failed");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Network error. Please try again.");
            }
        };

        verifyToken();
    }, [token]);

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-6">
                    {status === "loading" && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
                    {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
                    {status === "error" && <AlertCircle className="h-16 w-16 text-destructive" />}
                </div>

                <CardTitle className="text-3xl font-bold mb-2">
                    {status === "loading" && "Verifying Email..."}
                    {status === "success" && "Success!"}
                    {status === "error" && "Verification Failed"}
                </CardTitle>

                <CardDescription className="text-base px-4">
                    {status === "loading" && "Please wait while we confirm your email address."}
                    {status === "success" && "Your email has been successfully verified. You now have full access to TaskFlow."}
                    {status === "error" && (message || "The verification link is invalid or has expired.")}
                </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-center pb-8 pt-4">
                {status === "success" && (
                    <Button className="w-full max-w-xs" asChild>
                        <Link href="/dashboard">Continue to Dashboard</Link>
                    </Button>
                )}
                {status === "error" && (
                    <Button variant="outline" className="w-full max-w-xs" asChild>
                        <Link href="/auth/login">Back to Login</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background/50 px-4" suppressHydrationWarning>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                        <Layers className="h-7 w-7 text-primary-foreground" />
                    </div>
                </div>

                <Suspense fallback={<Card className="p-12 flex items-center justify-center"><Loader2 className="animate-spin" /></Card>}>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
