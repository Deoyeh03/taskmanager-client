"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { API_URL } from "@/utils/config"
import { toast } from "sonner"
import { User, Camera } from "lucide-react"
import { motion } from "framer-motion"
import { AvatarSelector } from "@/components/avatar-selector"
import { Modal } from "@/components/ui/modal"

export function ProfilePanel() {
    const { user, updateUser } = useAuth()
    const [bio, setBio] = useState(user?.bio || "")
    const [avatar, setAvatar] = useState(user?.avatar || "")
    const [isLoading, setIsLoading] = useState(false)
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bio, avatar }),
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed to update profile")
            const json = await res.json()
            if (updateUser) updateUser(json.data.user)
            toast.success("Profile updated successfully")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAvatarChange = (newAvatarUrl: string) => {
        setAvatar(newAvatarUrl)
        if (updateUser && user) {
            updateUser({ ...user, avatar: newAvatarUrl })
        }
        setIsAvatarModalOpen(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 rounded-xl space-y-6"
        >
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                        {avatar ? (
                            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-10 w-10 text-primary/40" />
                        )}
                    </div>
                    <button
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Camera className="h-3 w-3" />
                    </button>
                </div>
                <div>
                    <h3 className="text-xl font-bold">{user?.username}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="glass resize-none h-24"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Avatar URL</Label>
                    <Input
                        placeholder="https://..."
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="glass"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Save Changes"}
                </Button>
            </form>

            {/* Avatar Selector Modal */}
            <Modal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                title="Choose Your Avatar"
                className="max-w-2xl"
            >
                <AvatarSelector
                    currentAvatar={avatar}
                    onAvatarChange={handleAvatarChange}
                />
            </Modal>
        </motion.div>
    )
}
