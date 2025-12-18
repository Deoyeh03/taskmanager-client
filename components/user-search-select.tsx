"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { API_URL } from "@/utils/config"
import { motion, AnimatePresence } from "framer-motion"
import { User, Search, Check } from "lucide-react"

interface UserItem {
    id: string;
    _id?: string;
    username: string;
    email: string;
}

export function UserSearchSelect({ onSelect, selectedUserId, excludeUserId }: any) {
    const [query, setQuery] = useState("")
    const [users, setUsers] = useState<UserItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            if (query.length < 2) {
                setUsers([])
                return
            }
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch(`${API_URL}/users/search?query=${query}`, {
                    credentials: "include"
                })
                if (!res.ok) {
                    if (res.status === 401) {
                        throw new Error("Unauthorized - Please log in again")
                    }
                    throw new Error("Failed to fetch users")
                }
                const json = await res.json()
                if (json.status === "success") {
                    const filtered = json.data.users.filter((u: UserItem) => (u._id || u.id) !== excludeUserId);
                    setUsers(filtered)
                }
            } catch (err: any) {
                console.error("Search error:", err)
                setError(err.message)
                setUsers([])
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchUsers, 300)
        return () => clearTimeout(timer)
    }, [query])

    const selectedUser = users.find(u => (u._id || u.id) === selectedUserId)

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="pl-10 glass"
                />
            </div>

            <AnimatePresence>
                {isOpen && (users.length > 0 || isLoading) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 glass border border-white/10 rounded-md shadow-2xl overflow-hidden"
                    >
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                        ) : error ? (
                            <div className="p-4 text-center text-sm text-red-500 font-medium">{error}</div>
                        ) : (
                            <div className="max-height-[200px] overflow-y-auto">
                                {users.map((user) => (
                                    <button
                                        key={user._id || user.id}
                                        type="button"
                                        onClick={() => {
                                            const userId = user._id || user.id;
                                            onSelect(userId)
                                            setQuery(user.username)
                                            setIsOpen(false)
                                        }}
                                        className="w-full flex items-center justify-between p-3 text-sm hover:bg-white/10 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.username}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        {(selectedUserId === user._id || selectedUserId === user.id) && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
