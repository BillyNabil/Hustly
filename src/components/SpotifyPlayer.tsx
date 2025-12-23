"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  X,
  Link as LinkIcon,
  ExternalLink,
  Disc,
  ListMusic,
  Sparkles,
  Minimize2,
  Maximize2,
  Orbit,
  Radio,
  Activity
} from "lucide-react";

interface SpotifyPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------
// MOTION GRAPHIC COMPONENTS
// ----------------------------------------------------------------------

// 1. Digital Sound Core (Replacing Vinyl)
const SonicCore = () => {
  return (
    <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 border border-primary/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full box-shadow-[0_0_8px_#10B981]" />
      </motion.div>

      {/* Inner Ring (Counter-rotate) */}
      <motion.div
        className="absolute inset-2 border border-primary/10 rounded-full border-t-transparent border-b-transparent"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Central Pulse */}
      <div className="relative w-12 h-12 bg-black/50 border border-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Activity className="w-5 h-5 text-primary" />
        </motion.div>
      </div>

      {/* Orbiting Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/50 rounded-full"
          initial={{ rotate: i * 120 }}
          animate={{ rotate: i * 120 + 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ height: '100%', width: '2px', top: 0, left: '50%', transformOrigin: 'center center' }}
        >
          <div className="w-1 h-1 bg-primary rounded-full absolute top-0" />
        </motion.div>
      ))}
    </div>
  );
};

// 2. Frequency Spectrum (Enhanced Visualizer)
const FrequencySpectrum = () => {
  return (
    <div className="flex items-center gap-[3px] h-10 w-full opacity-60 mask-image-b-t">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-primary rounded-full"
          animate={{
            height: [
              '10%',
              `${Math.random() * 80 + 20}%`,
              '10%'
            ],
            opacity: [0.3, 0.8, 0.3],
            backgroundColor: ['#10B981', '#34D399', '#10B981']
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  )
}

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function SpotifyPlayer({ isOpen, onClose }: SpotifyPlayerProps) {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Parse Spotify URL to get embed URL
  const parseSpotifyUrl = (url: string): string | null => {
    try {
      let type = "";
      let id = "";

      if (url.includes("spotify.com")) {
        const match = url.match(/spotify\.com\/(playlist|track|album)\/([a-zA-Z0-9]+)/);
        if (match) {
          type = match[1];
          id = match[2];
        }
      } else if (url.startsWith("spotify:")) {
        const parts = url.split(":");
        if (parts.length >= 3) {
          type = parts[1];
          id = parts[2];
        }
      }

      if (type && id) {
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handlePastePlaylist = () => {
    const embed = parseSpotifyUrl(playlistUrl);
    if (embed) {
      setEmbedUrl(embed);
      setShowInput(false);
      localStorage.setItem("hustly_spotify_url", playlistUrl);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("hustly_spotify_url");
    if (saved) {
      setPlaylistUrl(saved);
      const embed = parseSpotifyUrl(saved);
      if (embed) {
        setEmbedUrl(embed);
      } else {
        setShowInput(true);
      }
    } else {
      setShowInput(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="fixed bottom-6 right-6 z-50 pointer-events-none"
      >
        <div
          className={`transition-all duration-500 ease-spring ${isMinimized ? 'w-[280px]' : 'w-[380px]'} bg-[#080808] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto relative group`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Mesh Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />

          {/* Header / Top Section */}
          <div className="relative p-6 pt-5">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Tech Icon Box */}
                <div className="relative w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                  <Radio className="w-5 h-5 text-primary relative z-10" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
                    Sonic Focus
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 font-mono">v2.0</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Frequency: Alpha</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                <button
                  onClick={() => setShowInput(!showInput)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Switch Source"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {!embedUrl || showInput ? (
              <div className="space-y-4">
                <div className="flex justify-center my-6 relative">
                  {/* Searching Animation */}
                  <div className="relative w-24 h-24">
                    <motion.div
                      className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-4 border border-white/10 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                      <Disc className="w-8 h-8 text-white/20" />
                    </motion.div>
                  </div>
                </div>

                <div className="relative group/input">
                  <div className="absolute inset-0 bg-primary/20 blur opacity-0 group-hover/input:opacity-100 transition-opacity rounded-xl" />
                  <input
                    type="text"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="Paste Spotify URL..."
                    className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 font-mono transition-all relative z-10"
                  />
                  <button
                    onClick={handlePastePlaylist}
                    disabled={!playlistUrl}
                    className="absolute right-1 top-1 bottom-1 px-4 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-20 flex items-center gap-2"
                  >
                    CONNECT <LinkIcon className="w-3 h-3" />
                  </button>
                </div>
                {/* Quick Links */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => setPlaylistUrl("https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ")} className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors">Depp Focus</button>
                  <button onClick={() => setPlaylistUrl("https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn")} className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors">Lofi Beats</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <SonicCore />
                <div className="flex-1 min-w-0 flex flex-col justify-center h-24">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Neural Sync
                      </p>
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    </div>
                    <FrequencySpectrum />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Spotify Embed Container - Integrated seamlessly */}
          {embedUrl && !showInput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative bg-black/50 border-t border-white/5"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-1 bg-white/10 rounded-full" />
              <iframe
                src={embedUrl}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="opacity-100 hover:opacity-100 transition-opacity"
                style={{
                  background: "transparent",
                }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
