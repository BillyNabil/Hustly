
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
    preload: true,
    adjustFontFallback: true, // Reduces layout shift from font loading
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#d4af37",
};

export const metadata: Metadata = {
    title: "Hustly | The Hustler's OS",
    description: "Manage your empire with Hustly. Track habits, manage finances, achieve goals with AI-powered productivity.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Hustly",
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", sizes: "48x48" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    other: {
        "mobile-web-app-capable": "yes",
    },
};

import AppShell from "@/components/AppShell";
import { LanguageProvider } from "@/lib/language-context";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${outfit.variable} font-sans bg-background text-foreground h-screen overflow-hidden flex flex-col`} suppressHydrationWarning>
                <AuthProvider>
                    <ThemeProvider>
                        <LanguageProvider>
                            <AppShell>
                                {children}
                            </AppShell>
                        </LanguageProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

