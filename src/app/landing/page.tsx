"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    Zap,
    Target,
    TrendingUp,
    Bot,
    Trophy,
    Wallet,
    ArrowRight,
    CheckCircle2,
    Star,
    Crown,
} from "lucide-react";

const features = [
    {
        icon: Target,
        title: "Idea Board",
        description: "Organize your hustle ideas with Kanban-style boards",
        color: "text-blue-400",
        bg: "bg-blue-500/20",
    },
    {
        icon: Wallet,
        title: "Finance Tracker",
        description: "Track income & expenses across all your hustles",
        color: "text-green-400",
        bg: "bg-green-500/20",
    },
    {
        icon: Bot,
        title: "Ghost CEO",
        description: "AI accountability partner that keeps you on track",
        color: "text-purple-400",
        bg: "bg-purple-500/20",
    },
    {
        icon: Trophy,
        title: "Leaderboard",
        description: "Compete with other hustlers and level up",
        color: "text-primary",
        bg: "bg-primary/20",
    },
];

const testimonials = [
    {
        name: "Alex T.",
        role: "Freelance Developer",
        text: "Hustly helped me 3x my income in just 2 months!",
        avatar: "A",
    },
    {
        name: "Sarah K.",
        role: "Side Hustler",
        text: "The Ghost CEO is like having a strict mentor 24/7",
        avatar: "S",
    },
    {
        name: "Mike R.",
        role: "Entrepreneur",
        text: "Finally an app that understands the hustle mindset",
        avatar: "M",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background overflow-y-auto">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <Star className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-medium">The Hustler&apos;s Operating System</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="text-white">Build Your</span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-accent">
                                Empire
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Track ideas, manage finances, and stay accountable with your AI Ghost CEO.
                            Everything you need to turn your side hustle into an empire.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/register">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-xl flex items-center gap-2 justify-center shadow-lg shadow-primary/25 w-full sm:w-auto"
                                >
                                    Start Hustling Free
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link href="/login">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 border border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors w-full sm:w-auto"
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
                    >
                        {[
                            { value: "10K+", label: "Active Hustlers" },
                            { value: "$2M+", label: "Income Tracked" },
                            { value: "50K+", label: "Ideas Shipped" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Everything You Need to <span className="text-primary">Hustle Hard</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            All your productivity tools in one powerful app
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-colors"
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-card/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Trusted by <span className="text-primary">Hustlers</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-background border border-primary/10"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <span className="text-black font-bold">{t.avatar}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20"
                >
                    <Image src="/favicon-96x96.png" alt="Hustly" width={64} height={64} className="mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Build Your Empire?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of hustlers who are turning their ideas into income.
                    </p>
                    <Link href="/register">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-4 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-primary/25"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-primary/10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Image src="/favicon-96x96.png" alt="Hustly" width={32} height={32} />
                        <span className="font-bold text-primary">HUSTLY</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © 2024 Hustly. Built for hustlers, by hustlers.
                    </p>
                </div>
            </footer>
        </div>
    );
}
