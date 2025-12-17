"use client";

import { useQuery } from "@tanstack/react-query";
import { TaskList } from "@/components/task-list";
import { API_URL } from "@/utils/config";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { TaskDetailView } from "@/components/task-detail-view";

export default function TasksPage() {
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const { data: tasks, isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/tasks`, {
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const json = await response.json();
            return json.data.tasks;
        },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight gradient-text">My Tasks</h1>
                <p className="text-muted-foreground">Manage and track all project tasks in one place.</p>
            </div>

            <TaskList
                tasks={tasks}
                isLoading={isLoading}
                onTaskClick={(task) => setSelectedTask(task)}
                showFilters={true}
            />

            <Modal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                title="Task Details"
                className="max-w-2xl"
            >
                {selectedTask && (
                    <TaskDetailView
                        task={selectedTask}
                        onUpdate={() => { }}
                    />
                )}
            </Modal>
        </div>
    );
}
