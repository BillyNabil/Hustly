"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotifyPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotifyPlayer({ isOpen, onClose }: SpotifyPlayerProps) {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Parse Spotify URL to get embed URL
  const parseSpotifyUrl = (url: string): string | null => {
    try {
      // Handle various Spotify URL formats
      // https://open.spotify.com/playlist/xxxxx
      // https://open.spotify.com/track/xxxxx
      // https://open.spotify.com/album/xxxxx
      // spotify:playlist:xxxxx
      
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
      // Save to localStorage
      localStorage.setItem("hustly_spotify_url", playlistUrl);
    }
  };

  // Load saved playlist on mount
  useEffect(() => {
    const saved = localStorage.getItem("hustly_spotify_url");
    if (saved) {
      setPlaylistUrl(saved);
      const embed = parseSpotifyUrl(saved);
      if (embed) {
        setEmbedUrl(embed);
        setShowInput(false);
      }
    }
  }, []);

  const handleClearPlaylist = () => {
    setPlaylistUrl("");
    setEmbedUrl(null);
    setShowInput(true);
    localStorage.removeItem("hustly_spotify_url");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-black/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden"
          style={{ width: showInput ? "360px" : "360px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Focus Mode</p>
                <p className="text-[10px] text-primary/70">Hustler's Playlist</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {embedUrl && (
                <button
                  onClick={() => setShowInput(!showInput)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                  title="Change playlist"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Input Section */}
          <AnimatePresence mode="wait">
            {showInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 py-3 border-b border-primary/10"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Paste Spotify playlist, album, or track URL:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="https://open.spotify.com/playlist/..."
                    className="flex-1 bg-white/5 border border-primary/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <button
                    onClick={handlePastePlaylist}
                    disabled={!playlistUrl}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-black text-sm font-bold hover:from-primary hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Play
                  </button>
                </div>
                {embedUrl && (
                  <button
                    onClick={handleClearPlaylist}
                    className="text-xs text-red-400 hover:text-red-300 mt-2 transition-colors"
                  >
                    Clear saved playlist
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spotify Embed */}
          {embedUrl ? (
            <div className="relative">
              <iframe
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-b-2xl"
                style={{ 
                  colorScheme: "dark",
                  background: "transparent"
                }}
              />
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Music className="w-8 h-8 text-primary/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Paste a Spotify link above to start listening
              </p>
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary mt-2 transition-colors"
              >
                Open Spotify <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
