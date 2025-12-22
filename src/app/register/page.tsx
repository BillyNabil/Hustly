"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const [registered, setRegistered] = useState(false);
    const router = useRouter();
    const { signUp, user } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const validateStep1 = () => {
        if (!fullName.trim()) {
            setMessage({ type: "error", text: "Please enter your full name" });
            return false;
        }
        if (!email.trim() || !email.includes("@")) {
            setMessage({ type: "error", text: "Please enter a valid email" });
            return false;
        }
        setMessage(null);
        return true;
    };

    const validateStep2 = () => {
        if (password.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            return false;
        }
        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return false;
        }
        setMessage(null);
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
        setMessage(null);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);
        setMessage(null);

        const { error } = await signUp(email, password, fullName);

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setRegistered(true);
        }
        setLoading(false);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, ease: "easeOut" as const }
        },
        exit: {
            opacity: 0,
            x: -50,
            transition: { duration: 0.3 }
        }
    };

    // Success screen after registration
    if (registered) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[150px]" />
                    <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[150px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 z-10 relative text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                    >
                        <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-white mb-2"
                    >
                        Welcome to Hustly! 🎉
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground mb-6"
                    >
                        Check your email for the confirmation link to activate your account.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-black font-bold px-6 py-3 rounded-lg shadow-lg shadow-primary/20 transition-all"
                        >
                            Continue to Login
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[150px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 z-10 relative"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
                    >
                        <Image src="/favicon-96x96.png" alt="Hustly" width={48} height={48} priority />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-white">Join Hustly</h1>
                    <p className="text-muted-foreground mt-2">Create your account and start hustling</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: step >= s ? "rgb(245 158 11)" : "rgb(255 255 255 / 0.1)",
                                    scale: step === s ? 1.1 : 1
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ color: step >= s ? "black" : "white" }}
                            >
                                {s}
                            </motion.div>
                            {s < 2 && (
                                <motion.div
                                    animate={{
                                        backgroundColor: step > 1 ? "rgb(245 158 11)" : "rgb(255 255 255 / 0.1)"
                                    }}
                                    className="w-12 h-1 mx-2 rounded-full"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleRegister}>
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-secondary/50 border border-primary/10 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-secondary/50 border border-primary/10 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="hustler@hustly.app"
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`p-3 rounded-lg text-sm ${message.type === "error"
                                                ? "bg-red-500/10 border border-red-500/20 text-red-500"
                                                : "bg-green-500/10 border border-green-500/20 text-green-500"
                                                }`}
                                        >
                                            {message.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-black font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Continue
                                    </button>
                                </div>

                                <p className="text-center text-muted-foreground text-sm pt-2">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-primary hover:text-primary transition-colors">
                                        Sign In
                                    </Link>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-secondary/50 border border-primary/10 rounded-lg pl-11 pr-11 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="••••••••"
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
                                    <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-secondary/50 border border-primary/10 rounded-lg pl-11 pr-11 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`p-3 rounded-lg text-sm ${message.type === "error"
                                                ? "bg-red-500/10 border border-red-500/20 text-red-500"
                                                : "bg-green-500/10 border border-green-500/20 text-green-500"
                                                }`}
                                        >
                                            {message.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/50 hover:bg-secondary text-white rounded-lg border border-white/5 transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-black font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Creating Account..." : "Create Account"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
}
