"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const router = useRouter();
    const { signIn, user } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await signIn(email, password);

        if (error) {
            setMessage({ type: "error", text: error.message });
            setLoading(false);
        }
        // Auth context will handle redirect on success
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[150px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 z-10 relative"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
                    >
                        <Image src="/favicon-96x96.png" alt="Hustly" width={56} height={56} priority />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to manage your empire</p>
                </motion.div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-secondary/50 border border-primary/10 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                                placeholder="hustler@hustly.app"
                                required
                            />
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-secondary/50 border border-primary/10 rounded-lg pl-11 pr-11 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className={`p-3 rounded-lg text-sm ${message.type === "error"
                                    ? "bg-red-500/10 border border-red-500/20 text-red-500"
                                    : "bg-green-500/10 border border-green-500/20 text-green-500"
                                    }`}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants} className="pt-2 space-y-3">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-black font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing In..." : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>

                        <Link href="/register" className="block">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-secondary/50 hover:bg-secondary text-white font-medium py-3 rounded-lg border border-white/5 transition-all"
                            >
                                Create Account
                            </motion.button>
                        </Link>
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="text-center text-muted-foreground text-sm pt-2"
                    >
                        <Link href="/landing" className="text-primary hover:text-primary transition-colors">
                            ← Back to Home
                        </Link>
                    </motion.p>
                </form>
            </motion.div>
        </div>
    );
}
