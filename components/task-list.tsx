"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User as UserIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface TaskListProps {
    tasks: Task[] | undefined;
    isLoading: boolean;
    onTaskClick: (task: Task) => void;
    showFilters?: boolean;
}

export function TaskList({ tasks, isLoading, onTaskClick, showFilters = true }: TaskListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredTasks = tasks?.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full glass" />
                <Skeleton className="h-24 w-full glass" />
                <Skeleton className="h-24 w-full glass" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {showFilters && (
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="glass pl-10 max-w-full md:max-w-[300px]"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex h-10 w-full md:w-[150px] rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 glass"
                    >
                        <option value="All">All Status</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            )}

            <AnimatePresence mode="popLayout">
                <motion.div
                    layout
                    className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                >
                    {filteredTasks?.map((task) => (
                        <motion.div
                            key={task._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => onTaskClick(task)}
                            className="cursor-pointer"
                        >
                            <TaskCard task={task} />
                        </motion.div>
                    ))}
                    {filteredTasks?.length === 0 && (
                        <div className="col-span-full py-12 text-center glass rounded-xl border-dashed border-2">
                            <p className="text-muted-foreground">No tasks found matching your filters.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function TaskCard({ task }: { task: Task }) {
    const priorityColor = {
        Low: "text-blue-500 bg-blue-500/10",
        Medium: "text-yellow-500 bg-yellow-500/10",
        High: "text-orange-500 bg-orange-500/10",
        Urgent: "text-red-500 bg-red-500/10",
    }[task.priority] || "text-gray-500";

    return (
        <Card className="group hover:border-primary/50 transition-all duration-300 glass-card h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold line-clamp-1">{task.title}</CardTitle>
                    <Badge variant="outline" className={cn("border-0", priorityColor)}>
                        {task.priority}
                    </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center mt-1">
                    Created by {task.creatorId?.username || "Unknown"}
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                    {task.description || "No description provided."}
                </p>
                {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] glass py-0">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-auto">
                    <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    </div>
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                        {task.status}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
