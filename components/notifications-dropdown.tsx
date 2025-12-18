"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useSocket } from "@/hooks/use-socket"
import { formatDistanceToNow } from "date-fns"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API_URL } from "@/utils/config"
import { toast } from "sonner"

interface Notification {
    _id: string;
    text: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const socket = useSocket()
    const queryClient = useQueryClient()

    // Fetch Notifications
    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/notifications`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch notifications");
            const json = await res.json();
            return json.data;
        }
    });

    // Mark as Read Mutation
    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`${API_URL}/notifications/${id}/read`, {
                method: "PATCH",
                credentials: "include"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });

    // Mark All as Read Mutation
    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            await fetch(`${API_URL}/notifications/read-all`, {
                method: "POST",
                credentials: "include"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("All notifications marked as read");
        }
    });

    useEffect(() => {
        if (!socket) return

        socket.on("notification:new", (notification: Notification) => {
            // Update the cache immediately
            queryClient.setQueryData(["notifications"], (old: Notification[] = []) => [notification, ...old]);

            // Show a toast if the dropdown is closed
            if (!isOpen) {
                toast.info(notification.text, {
                    action: {
                        label: "View",
                        onClick: () => setIsOpen(true)
                    }
                });
            }
        });

        return () => {
            socket.off("notification:new")
        }
    }, [socket, queryClient, isOpen])

    const unreadCount = notifications.filter(n => !n.isRead).length

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative glass rounded-full"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-background animate-pulse" />
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 glass border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <h3 className="font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-[10px] px-2"
                                    onClick={() => markAllReadMutation.mutate()}
                                >
                                    Mark all read
                                </Button>
                            )}
                        </div>
                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    No notifications for you yet.
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        className={`p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors relative group ${!n.isRead ? 'bg-primary/5' : ''}`}
                                        onClick={() => !n.isRead && markReadMutation.mutate(n._id)}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={`text-sm ${!n.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                                {n.text}
                                            </p>
                                            {!n.isRead && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
