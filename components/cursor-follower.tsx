"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function CursorFollower() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { theme } = useTheme();

    useEffect(() => {
        let animationFrameId: number;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const targetX = e.clientX;
            const targetY = e.clientY;

            const animate = () => {
                // Smooth interpolation
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;

                setMousePosition({ x: currentX, y: currentY });

                if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };

            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Theme-aware gradient colors
    const gradientColors = theme === "dark"
        ? "radial-gradient(circle 600px at var(--x) var(--y), rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1), transparent 50%)"
        : "radial-gradient(circle 600px at var(--x) var(--y), rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.05), transparent 50%)";

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
            style={{
                background: gradientColors,
                // @ts-ignore
                "--x": `${mousePosition.x}px`,
                "--y": `${mousePosition.y}px`,
            }}
        />
    );
}
