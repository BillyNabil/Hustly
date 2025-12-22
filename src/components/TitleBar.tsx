"use client";

import { useEffect, useState, useCallback } from "react";
import { Minus, Square, X, Maximize, Minimize2 } from "lucide-react";

export default function TitleBar() {
    const [appWindow, setAppWindow] = useState<any>(null);
    const [isTauri, setIsTauri] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        // Detect mobile/Android
        const checkMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isMobileDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Import Tauri APIs only on the client side
        import("@tauri-apps/api/window").then((module) => {
            const win = module.getCurrentWindow();
            setAppWindow(win);
            setIsTauri(true);

            // Listen for window state changes
            win.isMaximized().then(setIsMaximized);
            win.isFullscreen().then(setIsFullscreen);
        }).catch(() => {
            console.log("Non-Tauri environment detected");
            setIsTauri(false);
        });

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const minimize = async () => {
        if (!appWindow) return;
        try {
            await appWindow.minimize();
        } catch (e) {
            console.error('Minimize failed:', e);
        }
    };

    const maximize = async () => {
        if (!appWindow) return;
        try {
            const maximized = await appWindow.isMaximized();
            if (maximized) {
                await appWindow.unmaximize();
            } else {
                await appWindow.maximize();
            }
            setIsMaximized(!maximized);
        } catch (e) {
            console.error('Maximize failed:', e);
        }
    };

    const toggleFullscreen = async () => {
        if (!appWindow) return;
        try {
            const fullscreen = await appWindow.isFullscreen();
            await appWindow.setFullscreen(!fullscreen);
            setIsFullscreen(!fullscreen);
        } catch (e) {
            console.error('Fullscreen failed:', e);
        }
    };

    const close = async () => {
        if (!appWindow) return;
        try {
            await appWindow.close();
        } catch (e) {
            console.error('Close failed:', e);
        }
    };

    // Handle window drag
    const startDrag = useCallback(async (e: React.MouseEvent) => {
        // Only drag if clicking on the drag region itself, not on buttons
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[data-no-drag]')) {
            return;
        }
        if (appWindow) {
            try {
                await appWindow.startDragging();
            } catch (e) {
                console.log('Drag not supported');
            }
        }
    }, [appWindow]);

    // Don't render TitleBar in web browser or on mobile/Android
    if (!isTauri || isMobile) {
        return null;
    }

    return (
        <div
            data-tauri-drag-region
            onMouseDown={startDrag}
            className="h-9 bg-transparent z-[100] flex items-center justify-between px-4 select-none shrink-0 cursor-default"
        >
            {/* Empty space for drag region - logo is in sidebar */}
            <div
                className="flex-1 h-full"
                data-tauri-drag-region
            />

            {/* Window Controls - No animations, transparent background */}
            <div
                className="flex items-center gap-1 pointer-events-auto relative z-[101]"
                data-no-drag
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Minimize */}
                <button
                    onClick={(e) => { e.stopPropagation(); minimize(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Minimize"
                    className="p-1.5 hover:bg-white/10 rounded text-muted-foreground hover:text-white transition-colors"
                >
                    <Minus className="w-4 h-4" />
                </button>

                {/* Maximize/Restore */}
                <button
                    onClick={(e) => { e.stopPropagation(); maximize(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title={isMaximized ? "Restore" : "Maximize"}
                    className="p-1.5 hover:bg-white/10 rounded text-muted-foreground hover:text-white transition-colors"
                >
                    <Square className="w-3.5 h-3.5" />
                </button>

                {/* Close */}
                <button
                    onClick={(e) => { e.stopPropagation(); close(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Close"
                    className="p-1.5 hover:bg-red-500/30 rounded text-muted-foreground hover:text-red-400 ml-1 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
