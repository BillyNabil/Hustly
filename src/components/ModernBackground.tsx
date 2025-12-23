import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const ModernBackground = ({ className }: { className?: string }) => {
    return (
        <div className={cn("absolute inset-0 z-0 bg-black overflow-hidden flex items-center justify-center", className)}>
            {/* Radial Gradient for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-80" />

            {/* Animated Grid */}
            <div className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                    transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)',
                }}
            />

            <FloatingParticles />
            <GlowingOrbs />
            <Scanline />
        </div>
    );
};

const FloatingParticles = () => {
    // Reduced particle count for performance (20 -> 12)
    return (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-primary rounded-full opacity-20"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.3,
                    }}
                    animate={{
                        y: [null, Math.random() * -100 + "%"],
                        opacity: [null, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: Math.random() * 4 + 1 + "px",
                        height: Math.random() * 4 + 1 + "px",
                        willChange: "transform, opacity", // Performance hint
                    }}
                />
            ))}
        </div>
    );
};

const GlowingOrbs = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ willChange: "transform, opacity" }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[128px]"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                style={{ willChange: "transform, opacity" }}
            />
        </div>
    );
}

const Scanline = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <div className="w-full h-full opacity-[0.02]" style={{ background: "linear-gradient(to bottom, transparent 50%, #000 50%)", backgroundSize: "100% 4px" }} />
            <motion.div
                className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
                animate={{
                    top: ["-10%", "110%"],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ willChange: "top" }}
            />
        </div>
    )
}
