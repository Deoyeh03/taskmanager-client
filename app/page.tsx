"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Github,
  Twitter,
  Layers,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-6 w-6 text-white" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>
            </div>
            <span className="text-xl font-bold tracking-tight">TaskManager</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">Pricing</Link>
            <Link href="#about" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
          {/* Mobile Background Blur (Hero Image) */}
          <div className="absolute inset-0 z-0 lg:hidden opacity-20 pointer-events-none overflow-hidden">
            <Image
              src="/hero.png"
              alt=""
              fill
              className="object-cover blur-[80px]"
              priority
            />
          </div>
          {/* Background Blobs */}
          <div className="absolute top-0 -left-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute top-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="flex flex-col items-start gap-8"
              >
                <motion.div
                  variants={fadeIn}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-400"
                >
                  <span className="flex h-2 w-2 rounded-full bg-purple-500" />
                  New: Real-time Team Analytics
                </motion.div>

                <motion.h1
                  variants={fadeIn}
                  className="text-5xl font-bold leading-[1.1] tracking-tight lg:text-7xl"
                >
                  Collaborate <br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Without Limits.
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeIn}
                  className="max-w-lg text-lg text-zinc-400"
                >
                  The all-in-one workspace for teams to track, manage, and collaborate on tasks in real-time. Built for speed, scale, and performance.
                </motion.p>

                <motion.div
                  variants={fadeIn}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold transition-transform hover:scale-105"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setIsDemoOpen(true)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Watch Demo
                  </button>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="flex items-center gap-6 pt-4"
                >
                  <div className="flex -space-x-3">
                    {[
                      { color: "bg-blue-500", name: "JD" },
                      { color: "bg-purple-500", name: "AS" },
                      { color: "bg-emerald-500", name: "MK" },
                      { color: "bg-orange-500", name: "TR" }
                    ].map((user, i) => (
                      <div key={i} className={cn(
                        "h-10 w-10 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold",
                        user.color
                      )}>
                        {user.name}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500">
                    Trusted by <span className="text-white font-medium">10,000+</span> teams worldwide
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-2 backdrop-blur-sm shadow-2xl">
                  <Image
                    src="/hero.png"
                    alt="TaskManager Dashboard"
                    width={800}
                    height={800}
                    className="rounded-xl"
                    priority
                  />
                </div>
                {/* Visual accents */}
                <div className="absolute -inset-0.5 z-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl opacity-50" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold lg:text-5xl">Everything you need to ship faster</h2>
              <p className="mx-auto max-w-2xl text-zinc-400">
                Stop juggling between multiple tools. TaskManager combines your tasks, team communication, and project tracking in one place.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Real-time Collaboration",
                  desc: "Work together in sync. Changes appear instantly across all devices without page refreshes.",
                  icon: Users,
                  color: "text-blue-400"
                },
                {
                  title: "Blazing Fast Performance",
                  desc: "Optimized for speed. Manage thousands of tasks with zero lag or performance drops.",
                  icon: Zap,
                  color: "text-amber-400"
                },
                {
                  title: "Deep Analytics",
                  desc: "Gain insights into team productivity, task completion rates, and project health.",
                  icon: BarChart3,
                  color: "text-purple-400"
                },
                {
                  title: "Smart Automations",
                  desc: "Automate repetitive tasks and workflows to focus on what actually matters.",
                  icon: CheckCircle2,
                  color: "text-emerald-400"
                },
                {
                  title: "Secure by Design",
                  desc: "Enterprise-grade security with end-to-end encryption and role-based access control.",
                  icon: Layers,
                  color: "text-rose-400"
                },
                {
                  title: "Team Permissions",
                  desc: "Granular control over who can view, edit, or manage specific tasks and projects.",
                  icon: Users,
                  color: "text-indigo-400"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.05]"
                >
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 px-8 py-20 text-center border border-white/10 backdrop-blur-sm lg:py-32">
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="mb-6 text-4xl font-bold lg:text-6xl">
                  Ready to transform your team workflow?
                </h2>
                <p className="mb-10 text-lg text-zinc-300">
                  Join over 10,000 teams building the future of work. Start your 14-day free trial today.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/auth/register"
                    className="w-full rounded-full bg-white px-10 py-4 font-bold text-black transition-transform hover:scale-105 sm:w-auto"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    href="/auth/login"
                    className="w-full rounded-full border border-white/10 bg-white/5 px-10 py-4 font-bold backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
                  >
                    Log In
                  </Link>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-6 w-6 text-purple-500" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>
              <span className="text-xl font-bold tracking-tight">TaskManager</span>
            </div>

            <div className="flex gap-8 text-sm text-zinc-400">
              <Link href="#" className="transition-colors hover:text-white">Privacy Policy</Link>
              <Link href="#" className="transition-colors hover:text-white">Terms of Service</Link>
              <Link href="#" className="transition-colors hover:text-white">Contact</Link>
            </div>

            <div className="flex gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 transition-colors hover:bg-zinc-800">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 transition-colors hover:bg-zinc-800">
                <Github className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-zinc-600">
            © 2025 TaskManager Inc. All rights reserved.
          </div>
        </div>
      </footer>

      <Modal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        title="TaskManager Demo"
        className="max-w-2xl bg-zinc-950/90 border-white/10"
      >
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5 flex flex-col items-center justify-center relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-50" />

          <div className="relative z-10 text-center p-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
              <Play className="h-8 w-8 text-primary fill-current" />
            </div>
            <h3 className="text-2xl font-bold">Demo Coming Soon!</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">
              We're currently preparing a high-quality product walkthrough.
              In the meantime, you can experience the full power of TaskManager by starting a free trial.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => {
                  setIsDemoOpen(false);
                  window.location.href = "/auth/register";
                }}
                className="rounded-full px-8"
              >
                Sign Up Now
              </Button>
            </div>
          </div>

          {/* Subtle decoration */}
          <div className="absolute bottom-4 right-4 opacity-20">
            <Layers className="h-24 w-24 text-white" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
