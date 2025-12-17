"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { useSocket } from "@/hooks/use-socket";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Flag, CheckCircle2, User, ArrowRight, Activity, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { API_URL } from "@/utils/config";
import { cn } from "@/lib/utils";
import { UserSearchSelect } from "@/components/user-search-select";
import { ProfilePanel } from "@/components/profile-panel";
import { TaskDetailView } from "@/components/task-detail-view";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import Link from "next/link";

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    assignedToId?: { username: string; email: string };
    creatorId?: { username: string };
    tags: string[];
    activity?: { type: string; details: string; userId: { username: string }; createdAt: string }[];
    createdAt: string;
}

const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High", "Urgent"]),
});

type CreateTaskForm = z.infer<typeof createTaskSchema> & { assignedToId?: string };

export default function DashboardPage() {
    const { user } = useAuth();
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Fetch Tasks
    const { data: tasks, isLoading, refetch } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/tasks`, { credentials: "include" });
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const json = await response.json();
            return json.data.tasks as Task[];
        },
    });

    // Statistics Calculation
    const stats = useMemo(() => ({
        total: tasks?.length || 0,
        pending: tasks?.filter(t => t.status !== "Completed").length || 0,
        completed: tasks?.filter(t => t.status === "Completed").length || 0
    }), [tasks]);

    // Urgent Tasks (Priority: Urgent or High AND not Completed)
    const urgentTasks = useMemo(() =>
        tasks?.filter(t => (t.priority === "Urgent" || t.priority === "High") && t.status !== "Completed").slice(0, 3)
        , [tasks]);

    // Flatten activity logs from all tasks for a "Recent Activity" feed
    const recentActivity = useMemo(() => {
        if (!tasks) return [];
        return tasks.flatMap(t =>
            (t.activity || []).map(a => ({ ...a, taskTitle: t.title, taskId: t._id }))
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    }, [tasks]);

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (data: CreateTaskForm) => {
            const res = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to create");
            return res.json();
        },
        onSuccess: () => {
            setIsNewTaskOpen(false);
            toast.success("Task created");
            refetch();
        },
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight gradient-text">
                        Welcome back, {user?.username || "there"}
                    </h2>
                    <p className="text-muted-foreground">Here is what's happening with your projects today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationsDropdown />
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsProfileOpen(true)}
                        className="rounded-full h-9 w-9 glass"
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <User className="h-5 w-5" />
                        )}
                    </Button>
                    <Button onClick={() => setIsNewTaskOpen(true)} className="shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> Quick Task
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dashboard/tasks" className="block group">
                    <Card className="glass-card hover:border-primary/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold group-hover:text-primary transition-colors">{stats.pending}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Out of {stats.total} total tasks</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/tasks" className="block group">
                    <Card className="glass-card hover:border-red-500/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">{urgentTasks?.length || 0}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 text-red-500/80">Require immediate attention</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/tasks" className="block group">
                    <Card className="glass-card hover:border-green-500/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 text-green-500/80">Success rate: {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                {/* Urgent Tasks Preview */}
                <Card className="lg:col-span-4 glass-card border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Urgent Attention</CardTitle>
                        <Link href="/dashboard/tasks">
                            <Button variant="ghost" size="sm" className="text-xs group">
                                View All <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => <div key={i} className="h-16 w-full animate-pulse bg-white/5 rounded-lg" />)
                            ) : urgentTasks && urgentTasks.length > 0 ? (
                                urgentTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => setSelectedTask(task)}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group border border-white/5"
                                    >
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                            task.priority === "Urgent" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                                        )}>
                                            <Flag className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{task.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <Badge variant="outline" className="text-[10px] border-none bg-white/5">{task.status}</Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-xl">
                                    No urgent tasks at the moment. Good job!
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="lg:col-span-3 glass-card border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => <div key={i} className="h-12 w-full animate-pulse bg-white/5 rounded-lg" />)
                            ) : recentActivity.length > 0 ? (
                                recentActivity.map((act, i) => (
                                    <div key={i} className="relative pl-6 pb-6 last:pb-0 border-l border-white/10 ml-2">
                                        <div className="absolute left-[-5px] top-0 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                        <div className="space-y-1">
                                            <p className="text-xs">
                                                <span className="font-semibold text-primary">{act.userId.username}</span>
                                                {" "}{act.details} in
                                                <span className="font-medium"> {act.taskTitle}</span>
                                            </p>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-xl">
                                    No recent activity reported.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <CreateTaskModal
                isOpen={isNewTaskOpen}
                onClose={() => setIsNewTaskOpen(false)}
                onSubmit={createMutation.mutateAsync}
                isLoading={createMutation.isPending}
            />

            <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="My Profile">
                <ProfilePanel />
            </Modal>

            <Modal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                title="Task Details"
                className="max-w-2xl"
            >
                {selectedTask && (
                    <TaskDetailView
                        task={selectedTask}
                        onUpdate={() => {
                            refetch();
                            setSelectedTask(null); // Optional: close on update or keep open? User said it should lead to page or modal.
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}

function CreateTaskModal({ isOpen, onClose, onSubmit, isLoading }: any) {
    const { user } = useAuth();
    const form = useForm<CreateTaskForm>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: { priority: "Medium" }
    });

    const handleSubmit = async (data: CreateTaskForm) => {
        await onSubmit(data);
        form.reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input {...form.register("title")} placeholder="Task title" />
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Input {...form.register("description")} placeholder="Details..." />
                </div>
                <div className="space-y-2">
                    <Label>Assign To</Label>
                    <UserSearchSelect
                        onSelect={(userId: string) => form.setValue("assignedToId", userId)}
                        selectedUserId={form.watch("assignedToId")}
                        excludeUserId={user?._id || user?.id}
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isLoading}>Create Task</Button>
                </div>
            </form>
        </Modal>
    )
}
