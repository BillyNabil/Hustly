"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
    User,
    Bell,
    Shield,
    Palette,
    Volume2,
    Save,
    ArrowLeft,
    Check,
    Loader2,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme, COLOR_THEMES, ColorThemeId } from "@/lib/theme-context";
import { supabase } from "@/lib/supabaseClient";
import { fadeUp, staggerContainer, transitions } from "@/lib/animations";

// Settings keys for localStorage
const SETTINGS_KEYS = {
    notifications: "hustly_notifications",
    soundEffects: "hustly_sound_effects",
};

// Convert COLOR_THEMES object to array for UI
const THEME_OPTIONS = Object.entries(COLOR_THEMES).map(([id, config]) => ({
    id: id as ColorThemeId,
    ...config,
}));

export default function SettingsPage() {
    const { user, profile, signOut, refreshProfile } = useAuth();
    const { theme: currentTheme, setTheme } = useTheme();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Password change state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Delete account state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Settings state (colorTheme is now handled by theme context)
    const [settings, setSettings] = useState({
        displayName: "",
        email: "",
        notifications: true,
        soundEffects: true,
    });

    // Load localStorage settings on mount (once)
    useEffect(() => {
        const notifications = localStorage.getItem(SETTINGS_KEYS.notifications);
        const soundEffects = localStorage.getItem(SETTINGS_KEYS.soundEffects);

        setSettings(prev => ({
            ...prev,
            notifications: notifications !== null ? notifications === "true" : true,
            soundEffects: soundEffects !== null ? soundEffects === "true" : true,
        }));
    }, []);

    // Load profile data only once when profile becomes available
    const hasLoadedProfile = useRef(false);
    useEffect(() => {
        if (hasLoadedProfile.current) return;
        if (!profile && !user) return;

        setSettings(prev => ({
            ...prev,
            displayName: profile?.full_name || user?.email?.split("@")[0] || "",
            email: user?.email || "",
        }));
        hasLoadedProfile.current = true;
    }, [profile, user]);

    // Optimized handlers using useCallback
    const updateSetting = useCallback(<K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    // Save profile to database
    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            // Save profile name to Supabase
            if (user) {
                const { error } = await supabase
                    .from("profiles")
                    .update({
                        full_name: settings.displayName,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", user.id);

                if (error) throw error;
            }

            // Save other settings to localStorage
            localStorage.setItem(SETTINGS_KEYS.notifications, String(settings.notifications));
            localStorage.setItem(SETTINGS_KEYS.soundEffects, String(settings.soundEffects));
            // Note: colorTheme is saved automatically by theme context

            // Refresh profile
            await refreshProfile();

            setSaved(true);
            setMessage({ type: "success", text: "Settings saved successfully!" });
            setTimeout(() => {
                setSaved(false);
                setMessage(null);
            }, 2000);
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    // Change password
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            return;
        }

        setPasswordLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: "success", text: "Password updated successfully!" });
            setShowPasswordModal(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update password" });
        } finally {
            setPasswordLoading(false);
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "DELETE") {
            setMessage({ type: "error", text: "Please type DELETE to confirm" });
            return;
        }

        setDeleteLoading(true);
        setMessage(null);

        try {
            // Delete profile first (cascade should handle related data)
            if (user) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .delete()
                    .eq("id", user.id);

                if (profileError) throw profileError;
            }

            // Sign out
            await signOut();

            // Redirect to landing
            router.push("/landing");
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to delete account" });
            setDeleteLoading(false);
        }
    };

    const SettingSection = ({
        icon: Icon,
        title,
        children
    }: {
        icon: typeof User;
        title: string;
        children: React.ReactNode;
    }) => (
        <motion.div
            variants={fadeUp}
            className="glass-panel rounded-xl border border-primary/10 p-4 md:p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <h2 className="text-base md:text-lg font-semibold text-white">{title}</h2>
            </div>
            {children}
        </motion.div>
    );

    const ToggleSwitch = ({
        checked,
        onChange,
        label
    }: {
        checked: boolean;
        onChange: () => void;
        label: string;
    }) => (
        <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <button
                onClick={onChange}
                className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-primary" : "bg-secondary"
                    }`}
            >
                <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"
                        }`}
                />
            </button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 relative min-h-full overflow-y-auto">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transitions.normal}
                    className="flex items-center gap-4"
                >
                    <Link
                        href="/"
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Settings</h1>
                        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
                    </div>
                </motion.header>

                {/* Message */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${message.type === "success"
                            ? "bg-green-500/10 border border-green-500/20 text-green-400"
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                {/* Settings Sections */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {/* Profile Settings */}
                    <SettingSection icon={User} title="Profile">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={settings.displayName}
                                    onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                                    className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Email</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    disabled
                                    className="w-full bg-secondary/30 border border-primary/10 rounded-lg px-4 py-2.5 text-muted-foreground cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                            </div>
                        </div>
                    </SettingSection>

                    {/* Notification Settings */}
                    <SettingSection icon={Bell} title="Notifications">
                        <div className="divide-y divide-primary/10">
                            <ToggleSwitch
                                checked={settings.notifications}
                                onChange={() => updateSetting("notifications", !settings.notifications)}
                                label="Push Notifications"
                            />
                        </div>
                    </SettingSection>

                    {/* Appearance Settings */}
                    <SettingSection icon={Palette} title="Appearance">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Choose your accent color theme</p>
                            <div className="grid grid-cols-3 gap-3">
                                {THEME_OPTIONS.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setTheme(theme.id)}
                                        className={`relative p-3 rounded-xl border-2 transition-all ${currentTheme === theme.id
                                            ? "border-white/50 bg-white/10"
                                            : "border-white/10 hover:border-white/20 bg-white/5"
                                            }`}
                                    >
                                        <div
                                            className="w-full h-8 rounded-lg mb-2"
                                            style={{
                                                background: `linear-gradient(to right, ${theme.primaryLight}, ${theme.primaryDark})`
                                            }}
                                        />
                                        <span className="text-xs text-white font-medium">{theme.name}</span>
                                        {currentTheme === theme.id && (
                                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                                <Check className="w-3 h-3 text-black" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </SettingSection>

                    {/* Sound Settings */}
                    <SettingSection icon={Volume2} title="Sound">
                        <div className="divide-y divide-primary/10">
                            <ToggleSwitch
                                checked={settings.soundEffects}
                                onChange={() => updateSetting("soundEffects", !settings.soundEffects)}
                                label="Sound Effects"
                            />
                        </div>
                    </SettingSection>

                    {/* Privacy */}
                    <SettingSection icon={Shield} title="Privacy & Security">
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full text-left px-4 py-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm text-muted-foreground hover:text-white"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full text-left px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm text-red-400"
                            >
                                Delete Account
                            </button>
                        </div>
                    </SettingSection>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 space-y-3"
                >
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="w-5 h-5" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-medium py-3 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </motion.div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-primary/10 rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className="flex-1 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={passwordLoading}
                                className="flex-1 py-2.5 rounded-lg bg-primary hover:opacity-90 text-black font-medium transition-colors disabled:opacity-50"
                            >
                                {passwordLoading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-red-500/20 rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            This action cannot be undone. All your data will be permanently deleted.
                        </p>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">
                                Type <span className="text-red-400 font-bold">DELETE</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full bg-secondary/50 border border-red-500/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                placeholder="DELETE"
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText("");
                                }}
                                className="flex-1 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading || deleteConfirmText !== "DELETE"}
                                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-medium transition-colors disabled:opacity-50"
                            >
                                {deleteLoading ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
