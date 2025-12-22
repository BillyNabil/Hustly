"use client";

import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X } from "lucide-react";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { easings } from "@/lib/animations";

function FloatingMusicButton() {
    const [showSpotify, setShowSpotify] = useState(false);

    const handleOpen = useCallback(() => {
        setShowSpotify(true);
    }, []);

    const handleClose = useCallback(() => {
        setShowSpotify(false);
    }, []);

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!showSpotify && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: easings.easeOut,
                        }}
                        onClick={handleOpen}
                        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-110 active:scale-95 cursor-pointer group"
                        style={{ transition: "transform 0.15s, box-shadow 0.15s" }}
                        title="Focus Mode - Play Music"
                    >
                        <Music className="w-6 h-6 text-black" />

                        {/* Pulse ring effect */}
                        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: "2s" }} />

                        {/* Tooltip */}
                        <span className="absolute right-full mr-3 px-3 py-1.5 bg-card/95 backdrop-blur-xl border border-primary/20 rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                            style={{ transition: "opacity 0.15s" }}
                        >
                            🎵 Focus Mode
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Spotify Player Modal */}
            <SpotifyPlayer
                isOpen={showSpotify}
                onClose={handleClose}
            />
        </>
    );
}

export default memo(FloatingMusicButton);
