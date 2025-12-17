"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useSocket } from "@/hooks/use-socket"
import { formatDistanceToNow } from "date-fns"

interface Notification {
    id: string;
    text: string;
    time: Date;
    read: boolean;
}

export function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const socket = useSocket()

    useEffect(() => {
        if (!socket) return

        const handleTaskEvent = (task: any) => {
            const newNotif = {
                id: Math.random().toString(36).substr(2, 9),
                text: `Task "${task.title}" was updated`,
                time: new Date(),
                read: false
            }
            setNotifications(prev => [newNotif, ...prev].slice(0, 10))
        }

        socket.on("task:created", (task: any) => {
            const newNotif = {
                id: Math.random().toString(36).substr(2, 9),
                text: `New task: "${task.title}"`,
                time: new Date(),
                read: false
            }
            setNotifications(prev => [newNotif, ...prev].slice(0, 10))
        })

        socket.on("task:updated", handleTaskEvent)

        return () => {
            socket.off("task:created")
            socket.off("task:updated")
        }
    }, [socket])

    const unreadCount = notifications.filter(n => !n.read).length

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
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-background" />
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
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="max-height-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <p className="text-sm">{n.text}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            {formatDistanceToNow(n.time, { addSuffix: true })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <button
                                onClick={() => setNotifications([])}
                                className="w-full p-2 text-xs text-center text-primary hover:bg-white/5 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
