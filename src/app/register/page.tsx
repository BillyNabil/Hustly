"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Lock, CheckCircle, ArrowLeft, Eye, EyeOff, AtSign, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ModernBackground } from "@/components/ModernBackground";
import AnimatedInput from "@/components/AnimatedInput";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState("");
    const [nickname, setNickname] = useState("");
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
        if (!nickname.trim()) {
            setMessage({ type: "error", text: "Please enter a nickname" });
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

        const { error } = await signUp(email, password, fullName, nickname);

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setRegistered(true);
        }
        setLoading(false);
    };

    const stepVariants: Variants = {
        hidden: (direction: number) => ({
            opacity: 0,
            x: direction > 0 ? 50 : -50,
        }),
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: (direction: number) => ({
            opacity: 0,
            x: direction < 0 ? 50 : -50,
            transition: { duration: 0.3 }
        })
    };

    if (registered) {
        return (
            <div className="w-full min-h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-background">
                {/* Left Side - Visuals */}
                <div className="hidden lg:flex flex-col justify-between relative bg-black p-12 xl:p-16 overflow-hidden border-r border-white/5">
                    <div className="absolute inset-0 z-0">
                        <ModernBackground />
                    </div>
                    {/* Logo Area */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="z-10"
                    >
                        <Link href="/" className="flex items-center gap-4 cursor-pointer group">
                            <div className="w-12 h-12 relative group-hover:scale-110 transition-transform duration-300">
                                <Image src="/favicon.svg" alt="Hustly Logo" fill className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md group-hover:text-primary transition-colors">Hustly</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side - Success */}
                <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20"
                    >
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white mb-2">Welcome aboard! 🎉</h1>
                    <p className="text-muted-foreground mb-8 text-lg max-w-sm">
                        Your account has been created securely. Check your email to activate it.
                    </p>

                    <Link href="/login" className="w-full max-w-sm">
                        <button className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] active:scale-[0.98]">
                            Continue to Login
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

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

                {/* Inspiration Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="z-10 max-w-lg"
                >
                    <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                        Start your journey<br />
                        <span className="text-muted-foreground">to peak performance.</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">Join the top 1% of achievers using Hustly.</p>
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
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                        <p className="text-muted-foreground">
                            {step === 1 ? "Step 1: Personal Details" : "Step 2: Security"}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ width: step === 1 ? "50%" : "100%" }}
                            className="h-full bg-primary"
                        />
                    </div>

                    <form onSubmit={handleRegister}>
                        <AnimatePresence mode="wait" custom={1}>
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    custom={1}
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-5"
                                >
                                    <AnimatedInput
                                        icon={User}
                                        label="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                    />

                                    <AnimatedInput
                                        icon={AtSign}
                                        label="Nickname"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Maverick"
                                    />

                                    <AnimatedInput
                                        icon={Mail}
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    custom={1}
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-5"
                                >
                                    <div className="space-y-1">
                                        <AnimatedInput
                                            icon={Lock}
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            rightElement={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="p-2 -mr-2 text-muted-foreground hover:text-white transition-colors focus:outline-none"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground ml-1">At least 6 characters</p>
                                    </div>

                                    <AnimatedInput
                                        icon={Lock}
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        rightElement={
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="p-2 -mr-2 text-muted-foreground hover:text-white transition-colors focus:outline-none"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                    />

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Creating..." : "Create Account"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className={`p-3 rounded-lg text-sm border flex items-start gap-2 ${message.type === "error"
                                        ? "bg-red-500/5 border-red-500/10 text-red-500"
                                        : "bg-green-500/5 border-green-500/10 text-green-500"
                                        }`}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="text-center text-xs text-muted-foreground/50">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:text-accent font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
