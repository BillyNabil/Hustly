"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ModernBackground } from "@/components/ModernBackground";
import AnimatedInput from "@/components/AnimatedInput";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
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
    };

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-background">
            {/* Left Side - Visuals (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-between relative bg-black p-12 xl:p-16 overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 z-0">
                    <ModernBackground />
                </div>

                {/* Logo Area */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="z-10"
                >
                    <Link href="/" className="flex items-center gap-4 cursor-pointer group">
                        <div className="w-12 h-12 relative group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/favicon.svg"
                                alt="Hustly Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md group-hover:text-primary transition-colors">Hustly</span>
                    </Link>
                </motion.div>

                {/* Quote Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="z-10 max-w-lg"
                >
                    <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                        Build your empire,<br />
                        <span className="text-muted-foreground">one habit at a time.</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[10px] text-white backdrop-blur-sm">
                                    User
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Join 10,000+ hustlers today</p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Back Button */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                {/* Mobile Background Helper */}
                <div className="lg:hidden absolute inset-0 -z-10 opacity-20">
                    <ModernBackground />
                </div>

                <div className="w-full max-w-[380px] space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-5">
                            <AnimatedInput
                                icon={Mail}
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                            />

                            <div className="space-y-2">
                                <AnimatedInput
                                    icon={Lock}
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-2 -mr-2 text-muted-foreground hover:text-white transition-colors focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    }
                                />
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="peer w-4 h-4 appearance-none rounded border border-white/10 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                            />
                                            <Check className="w-3 h-3 text-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-all scale-50 peer-checked:scale-100" strokeWidth={3} />
                                        </div>
                                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">Keep me in</span>
                                    </label>
                                    <Link href="#" className="text-xs text-primary hover:text-accent transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-3 rounded-lg text-sm border flex items-start gap-2 ${message.type === "error"
                                        ? "bg-red-500/5 border-red-500/10 text-red-500"
                                        : "bg-green-500/5 border-green-500/10 text-green-500"
                                        }`}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                                <span className="bg-background px-2 text-muted-foreground/50">Or continue with</span>
                            </div>
                        </div>

                        <Link href="/register">
                            <button
                                type="button"
                                className="w-full h-12 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/5 transition-all flex items-center justify-center"
                            >
                                Create an account
                            </button>
                        </Link>
                    </form>

                    <p className="text-center text-xs text-muted-foreground/50 mt-8">
                        By clicking continue, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
