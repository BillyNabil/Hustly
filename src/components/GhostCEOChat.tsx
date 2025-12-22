"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Skull,
  Heart,
  Sparkles,
  RefreshCw,
  Settings2,
  MessageSquare,
  Zap,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage, GhostCEOPersona } from "@/lib/database.types";
import { transitions, fadeUp, listItem } from "@/lib/animations";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Persona definitions
const personas = {
  strict: {
    name: "Strict Boss",
    icon: Skull,
    color: "red",
    description: "Firm, no-nonsense, straight to the point.",
    greeting: "Yo! What are you doing here? You should be working! What do you want to ask? Hurry up!",
  },
  mentor: {
    name: "Wise Mentor",
    icon: Heart,
    color: "amber",
    description: "Supportive, thoughtful guidance.",
    greeting: "Hello! I'm glad to help with your hustle journey today. What's on your mind?",
  },
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function GhostCEOChat() {
  const [persona, setPersona] = useState<GhostCEOPersona>("mentor");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("hustly_gemini_api_key");
    if (savedKey) setUserApiKey(savedKey);
  }, []);

  const saveApiKey = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem("hustly_gemini_api_key", key);
    setShowApiKeyInput(false);
  };

  const currentPersona = personas[persona];
  const PersonaIcon = currentPersona.icon;

  useEffect(() => {
    // Add greeting message when persona changes
    const greeting: Message = {
      id: "greeting",
      role: "assistant",
      content: currentPersona.greeting,
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, [persona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = userApiKey || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY; // Fallback to public env if available

      if (!apiKey) {
        throw new Error("API Key not set");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: personas[persona].greeting + " " + personas[persona].description // Simplified system prompt or use full persona logic
      });

      // Note: The Client SDK handles history in startChat.
      // We need to convert our message history to the SDK format
      const chatHistory = messages.slice(-10).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(userMessage.content);
      const text = result.response.text();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Chat error:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: (error instanceof Error && error.message === "API Key not set")
          ? "Please set your API Key in the settings (Key icon)."
          : "Oops, there was a connection issue. Please try again!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const greeting: Message = {
      id: "greeting",
      role: "assistant",
      content: currentPersona.greeting,
      timestamp: new Date(),
    };
    setMessages([greeting]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-500">
            Ghost CEO
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1 hidden sm:block">
            Your AI accountability partner
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-lg border border-primary/20 text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowApiKeyInput(!showApiKeyInput);
              setShowPersonaSelector(false);
            }}
            className={cn(
              "p-2 rounded-lg border transition-colors",
              userApiKey ? "border-green-500/30 text-green-400 bg-green-500/10" : "border-primary/20 text-muted-foreground hover:text-white hover:bg-white/5"
            )}
            title="Set API Key"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPersonaSelector(!showPersonaSelector)}
            className={cn(
              "px-2 md:px-4 py-2 rounded-lg border flex items-center gap-1.5 md:gap-2 transition-colors text-sm",
              persona === "strict"
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-primary/30 bg-primary/10 text-primary"
            )}
          >
            <PersonaIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{currentPersona.name}</span>
            <Settings2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Persona Selector Dropdown */}
      <AnimatePresence>
        {showPersonaSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm"
          >
            <p className="text-sm text-muted-foreground mb-3">Choose Ghost CEO Persona:</p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(personas) as GhostCEOPersona[]).map((key) => {
                const p = personas[key];
                const Icon = p.icon;
                const isSelected = persona === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setPersona(key);
                      setShowPersonaSelector(false);
                    }}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      isSelected
                        ? key === "strict"
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-primary/50 bg-primary/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn(
                        "w-5 h-5",
                        key === "strict" ? "text-red-400" : "text-primary"
                      )} />
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Input */}
      <AnimatePresence>
        {showApiKeyInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm"
          >
            <p className="text-sm text-muted-foreground mb-3">Enter your Google Gemini API Key:</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-secondary/50 border border-primary/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <button
                onClick={() => saveApiKey(userApiKey)}
                className="px-4 py-2 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors text-sm"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>. It's stored locally on your device.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Container */}
      <div className="flex-1 bg-card/50 rounded-2xl border border-primary/10 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === "user"
                    ? "bg-primary/20"
                    : persona === "strict"
                      ? "bg-red-500/20"
                      : "bg-primary/20"
                )}>
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <PersonaIcon className={cn(
                      "w-4 h-4",
                      persona === "strict" ? "text-red-400" : "text-primary"
                    )} />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary/20 text-white"
                    : "bg-white/5 text-white/90"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                persona === "strict" ? "bg-red-500/20" : "bg-primary/20"
              )}>
                <PersonaIcon className={cn(
                  "w-4 h-4",
                  persona === "strict" ? "text-red-400" : "text-primary"
                )} />
              </div>
              <div className="bg-white/5 rounded-2xl px-4 py-3 flex items-center gap-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-white/50"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-white/50"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-white/50"
                />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {[
            { text: "Review my progress", icon: Sparkles },
            { text: "I need motivation", icon: Zap },
            { text: "Help me plan", icon: MessageSquare },
          ].map((action) => (
            <button
              key={action.text}
              onClick={() => {
                setInput(action.text);
                inputRef.current?.focus();
              }}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-white hover:border-primary/30 transition-colors flex items-center gap-1"
            >
              <action.icon className="w-3 h-3" />
              {action.text}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-primary/10">
          <div className="flex gap-3 pr-16">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your Ghost CEO..."
              className="flex-1 bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-black font-bold hover:from-primary hover:to-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
