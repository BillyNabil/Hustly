"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Color theme options
export const COLOR_THEMES = {
    amber: {
        name: "Gold Rush",
        primary: "#F59E0B",
        primaryLight: "#FBBF24",
        primaryDark: "#D97706",
        gradient: "from-amber-400 to-amber-600",
        hsl: "45 93% 47%",
    },
    emerald: {
        name: "Money Green",
        primary: "#10B981",
        primaryLight: "#34D399",
        primaryDark: "#059669",
        gradient: "from-emerald-400 to-emerald-600",
        hsl: "160 84% 39%",
    },
    violet: {
        name: "Royal Purple",
        primary: "#8B5CF6",
        primaryLight: "#A78BFA",
        primaryDark: "#7C3AED",
        gradient: "from-violet-400 to-violet-600",
        hsl: "258 90% 66%",
    },
    rose: {
        name: "Rose Gold",
        primary: "#F43F5E",
        primaryLight: "#FB7185",
        primaryDark: "#E11D48",
        gradient: "from-rose-400 to-rose-600",
        hsl: "350 89% 60%",
    },
    cyan: {
        name: "Ocean Blue",
        primary: "#06B6D4",
        primaryLight: "#22D3EE",
        primaryDark: "#0891B2",
        gradient: "from-cyan-400 to-cyan-600",
        hsl: "189 94% 43%",
    },
    orange: {
        name: "Sunset",
        primary: "#F97316",
        primaryLight: "#FB923C",
        primaryDark: "#EA580C",
        gradient: "from-orange-400 to-orange-600",
        hsl: "25 95% 53%",
    },
} as const;

export type ColorThemeId = keyof typeof COLOR_THEMES;

interface ThemeContextType {
    theme: ColorThemeId;
    setTheme: (theme: ColorThemeId) => void;
    themeConfig: typeof COLOR_THEMES[ColorThemeId];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "hustly_color_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ColorThemeId>("amber");

    // Load theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as ColorThemeId;
        if (saved && COLOR_THEMES[saved]) {
            setThemeState(saved);
            applyTheme(saved);
        } else {
            applyTheme("amber");
        }
    }, []);

    const applyTheme = (themeId: ColorThemeId) => {
        const config = COLOR_THEMES[themeId];
        const root = document.documentElement;

        // Set CSS custom properties
        root.style.setProperty("--theme-primary", config.primary);
        root.style.setProperty("--theme-primary-light", config.primaryLight);
        root.style.setProperty("--theme-primary-dark", config.primaryDark);
        root.style.setProperty("--theme-primary-hsl", config.hsl);

        // Update Tailwind-compatible classes
        root.setAttribute("data-theme", themeId);
    };

    const setTheme = (newTheme: ColorThemeId) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        applyTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeConfig: COLOR_THEMES[theme] }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
