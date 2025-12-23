"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: LucideIcon;
    label: string;
    rightElement?: React.ReactNode;
}

export default function AnimatedInput({
    icon: Icon,
    label,
    rightElement,
    className = "",
    value,
    ...props
}: AnimatedInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;

    return (
        <div className="w-full">
            <label
                className={`block text-sm font-medium transition-colors ml-1 mb-2 ${isFocused ? "text-primary" : "text-muted-foreground"
                    }`}
            >
                {label}
            </label>

            <div className="relative">
                <motion.div
                    animate={{
                        color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                >
                    <Icon className="w-5 h-5" />
                </motion.div>

                <input
                    {...props}
                    value={value}
                    placeholder={props.placeholder}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={`w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all ${className}`}
                    style={{
                        boxShadow: isFocused ? "0 0 20px -5px hsl(var(--primary) / 0.1)" : "none"
                    }}
                />

                {rightElement && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
}
