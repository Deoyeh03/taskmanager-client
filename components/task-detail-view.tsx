"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Send } from "lucide-react"
import { API_URL } from "@/utils/config"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Clock, PlayCircle, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function TaskDetailView({ task, onUpdate }: any) {
    const { user } = useAuth()
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<"comments" | "activity">("comments")

    const handleStatusUpdate = async (newStatus: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`${API_URL}/tasks/${task._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed to update status")
            toast.success(`Task moved to ${newStatus}`)
            if (onUpdate) onUpdate()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim()) return
        setIsLoading(true)
        try {
            const res = await fetch(`${API_URL}/tasks/${task._id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: comment }),
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed to add comment")
            setComment("")
            toast.success("Comment added")
            if (onUpdate) onUpdate()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{task.title}</h3>
                    <Badge variant="outline" className="glass capitalize">{task.status}</Badge>
                </div>
                <p className="text-muted-foreground">{task.description}</p>
            </div>

            {/* Status Update Buttons */}
            {(user?._id === task.assignedToId?._id || user?.id === task.assignedToId?._id || user?._id === task.creatorId?._id || user?.id === task.creatorId?._id) && (
                <div className="space-y-3 p-4 glass rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" /> Update Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "To Do", icon: Clock, color: "hover:bg-blue-500/20 hover:text-blue-400" },
                            { id: "In Progress", icon: PlayCircle, color: "hover:bg-yellow-500/20 hover:text-yellow-400" },
                            { id: "Review", icon: Eye, color: "hover:bg-purple-500/20 hover:text-purple-400" },
                            { id: "Completed", icon: CheckCircle, color: "hover:bg-green-500/20 hover:text-green-400" }
                        ].map((s) => (
                            <Button
                                key={s.id}
                                variant={task.status === s.id ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => handleStatusUpdate(s.id)}
                                disabled={isLoading || task.status === s.id}
                                className={cn(
                                    "glass text-xs h-8 flex items-center gap-1.5 transition-all duration-300",
                                    task.status === s.id ? "bg-primary/20 border-primary/50 text-primary" : s.color
                                )}
                            >
                                <s.icon className="h-3 w-3" />
                                {s.id}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab("comments")}
                    className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                    Comments ({task.comments?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab("activity")}
                    className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "activity" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                    Activity Log ({task.activity?.length || 0})
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "comments" ? (
                    <motion.div
                        key="comments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {task.comments?.map((c: any, i: number) => (
                                <div key={i} className="flex gap-3 glass p-3 rounded-lg">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={c.userId?.avatar} />
                                        <AvatarFallback>{c.userId?.username?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{c.userId?.username}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm">{c.text}</p>
                                    </div>
                                </div>
                            ))}
                            {(!task.comments || task.comments.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No comments yet. Be the first to start the conversation!
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAddComment} className="flex gap-2">
                            <Input
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="glass"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !comment.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
                    >
                        {task.activity?.map((a: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm p-2 border-l-2 border-primary/20 hover:border-primary transition-colors pl-4">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="flex-1">
                                    <span className="font-medium">{a.userId?.username}</span>{" "}
                                    <span className="text-muted-foreground">{a.details}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
