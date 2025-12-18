"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Check, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { API_URL } from "@/utils/config";
import { toast } from "sonner";

interface AvatarOption {
    id: string;
    url: string;
    category: string;
    name: string;
}

interface AvatarSelectorProps {
    currentAvatar?: string;
    onAvatarChange: (avatarUrl: string) => void;
}

export function AvatarSelector({ currentAvatar, onAvatarChange }: AvatarSelectorProps) {
    const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
    const [avatarLibrary, setAvatarLibrary] = useState<AvatarOption[]>([]);
    const [selectedLibraryAvatar, setSelectedLibraryAvatar] = useState<string | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    // Fetch avatar library on mount
    useState(() => {
        const fetchLibrary = async () => {
            setIsLoadingLibrary(true);
            try {
                const res = await fetch(`${API_URL}/users/avatar/library`, {
                    credentials: "include"
                });
                const json = await res.json();
                if (json.status === "success") {
                    setAvatarLibrary(json.data.avatars);
                }
            } catch (error) {
                console.error("Failed to load avatar library", error);
            } finally {
                setIsLoadingLibrary(false);
            }
        };
        fetchLibrary();
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        setUploadFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!uploadFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("avatar", uploadFile);

        try {
            const res = await fetch(`${API_URL}/users/avatar/upload`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const json = await res.json();
            if (json.status === "success") {
                const avatarUrl = `${API_URL.replace('/api', '')}${json.data.user.avatar}`;
                onAvatarChange(avatarUrl);
                toast.success("Avatar uploaded successfully!");
                setUploadPreview(null);
                setUploadFile(null);
            } else {
                toast.error(json.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload avatar");
        } finally {
            setIsUploading(false);
        }
    };

    const handleLibrarySelect = async (avatarId: string, avatarUrl: string) => {
        setSelectedLibraryAvatar(avatarId);

        try {
            const res = await fetch(`${API_URL}/users/avatar/library`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarId }),
                credentials: "include"
            });

            const json = await res.json();
            if (json.status === "success") {
                onAvatarChange(avatarUrl);
                toast.success("Avatar updated!");
            } else {
                toast.error(json.message || "Failed to update avatar");
            }
        } catch (error) {
            console.error("Library selection error:", error);
            toast.error("Failed to update avatar");
        }
    };

    return (
        <div className="space-y-4">
            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 glass rounded-lg">
                <button
                    onClick={() => setActiveTab("library")}
                    className={cn(
                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                        activeTab === "library"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <ImageIcon className="inline h-4 w-4 mr-2" />
                    Avatar Library
                </button>
                <button
                    onClick={() => setActiveTab("upload")}
                    className={cn(
                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                        activeTab === "upload"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Upload className="inline h-4 w-4 mr-2" />
                    Upload Custom
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === "library" && (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {isLoadingLibrary ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {avatarLibrary.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        onClick={() => handleLibrarySelect(avatar.id, avatar.url)}
                                        className={cn(
                                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                                            selectedLibraryAvatar === avatar.id || currentAvatar === avatar.url
                                                ? "border-primary shadow-lg shadow-primary/20"
                                                : "border-white/10 hover:border-primary/50"
                                        )}
                                    >
                                        <img
                                            src={avatar.url}
                                            alt={avatar.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {(selectedLibraryAvatar === avatar.id || currentAvatar === avatar.url) && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <Check className="h-6 w-6 text-primary" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === "upload" && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {!uploadPreview ? (
                            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-primary/50 transition-colors glass">
                                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-sm font-medium mb-1">Click to upload image</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, WebP (max 2MB)</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative aspect-square w-48 mx-auto rounded-lg overflow-hidden border-2 border-primary">
                                    <img
                                        src={uploadPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => {
                                            setUploadPreview(null);
                                            setUploadFile(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="w-full"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload Avatar"
                                    )}
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
